import { Effect, Schema } from "effect";
import { NYLON_API_URL, NYLON_WORKING_ON_LIST_ID } from "./constants";
import {
  FetchError,
  HttpError,
  UnavailableError,
  ValidationError,
} from "./errors";

// ─────────────────────────────────────────────────────────────
// Schema Definitions
// ─────────────────────────────────────────────────────────────

/**
 * A link on a Nylon Impossible todo. The API returns more fields; only the
 * ones the homepage needs are decoded.
 */
const NylonLink = Schema.Struct({
  url: Schema.String,
});

/**
 * A todo from the Nylon Impossible v1 API (https://nylonimpossible.com/docs/api).
 * Ids, due dates and subtasks are deliberately not decoded: the page only
 * shows titles, notes and links, so nothing else leaves the server.
 */
const NylonTodo = Schema.Struct({
  title: Schema.String,
  notes: Schema.optional(Schema.NullOr(Schema.String)),
  done: Schema.Boolean,
  links: Schema.optional(Schema.Array(NylonLink)),
});

/**
 * Schema for the `/v1/lists/:id/todos` response envelope
 */
const NylonTodosResponse = Schema.Struct({
  data: Schema.Array(NylonTodo),
});

/**
 * A todo shaped for display
 */
export interface WorkingOnItem {
  readonly title: string;
  readonly notes?: string;
  readonly url?: string;
  /** The link's hostname and path, without `www.` or a trailing slash */
  readonly host?: string;
  /** The project's app icon, if it has one */
  readonly icon?: string;
}

export type WorkingOn = ReadonlyArray<WorkingOnItem>;

// ─────────────────────────────────────────────────────────────
// Cache
// ─────────────────────────────────────────────────────────────

/**
 * How long a result (or a failure) stands before Nylon is asked again. The
 * API allows 60 requests a minute per token; this keeps the homepage to about
 * one every five minutes per Cloudflare location, even while Nylon is failing.
 */
const CHECK_EVERY_MS = 5 * 60 * 1000;

/**
 * How long a list is kept as a fallback for when Nylon errors or rate-limits.
 * Past this the section hides rather than showing something very old.
 */
const KEEP_FOR_MS = 24 * 60 * 60 * 1000;

/**
 * Synthetic cache key. It names the list but never the token, and is never
 * fetched; it only addresses the Workers Cache API.
 */
const cacheKey = (listId: string) =>
  new Request(`https://nylon-cache.charliegleason.com/working-on/${listId}`);

interface CachedWorkingOn {
  /** When Nylon was last asked, whether or not it answered */
  readonly checkedAt: number;
  /** When `items` came from Nylon; absent if it never answered */
  readonly fetchedAt?: number;
  readonly items?: WorkingOn;
}

/**
 * The Cache API isn't there everywhere (e.g. some local runtimes); without it
 * every request goes to Nylon, which is fine at this traffic.
 */
const getCache = (): Cache | undefined => {
  try {
    return (globalThis.caches as { default?: Cache } | undefined)?.default;
  } catch {
    return undefined;
  }
};

const readCache = (listId: string) =>
  Effect.tryPromise(async () => {
    const response = await getCache()?.match(cacheKey(listId));
    if (!response) return undefined;
    const cached = (await response.json()) as CachedWorkingOn;
    // Drop a fallback list that has outlived KEEP_FOR_MS
    const expired =
      cached.fetchedAt === undefined ||
      Date.now() - cached.fetchedAt > KEEP_FOR_MS;
    return expired ? { checkedAt: cached.checkedAt } : cached;
  }).pipe(Effect.orElseSucceed(() => undefined));

const writeCache = (listId: string, entry: CachedWorkingOn) =>
  Effect.tryPromise(async () => {
    // Keep the entry until its list expires, or one check interval if empty
    const ttlMs =
      entry.fetchedAt === undefined
        ? CHECK_EVERY_MS
        : Math.max(
            KEEP_FOR_MS - (Date.now() - entry.fetchedAt),
            CHECK_EVERY_MS,
          );
    await getCache()?.put(
      cacheKey(listId),
      Response.json(entry, {
        headers: { "Cache-Control": `max-age=${Math.ceil(ttlMs / 1000)}` },
      }),
    );
  }).pipe(Effect.orElseSucceed(() => undefined));

/**
 * A page's HTML up to its `</head>`, so a large page isn't read in full
 */
const readHead = async (response: Response) => {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let html = "";
  while (html.length < 256_000 && !/<\/head>/i.test(html)) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  await reader.cancel();
  return html;
};

/**
 * The `href` of the page's `<link rel="apple-touch-icon">`, if it has one
 */
const declaredIcon = (html: string) => {
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel=["']?apple-touch-icon\b/i.test(tag)) continue;
    const href = tag.match(/\bhref=["']?([^"'\s>]+)/i)?.[1];
    if (href) return href.replaceAll("&amp;", "&");
  }
  return undefined;
};

/**
 * `url` (resolved against `base`) if it's an http or https URL. Links and
 * icons come from other sites, so anything else, like `javascript:`, is
 * dropped rather than put in an `href` or `src`.
 */
const webUrl = (url: string, base?: string) => {
  try {
    const { href, protocol } = new URL(url, base);
    return protocol === "https:" || protocol === "http:" ? href : undefined;
  } catch {
    return undefined;
  }
};

/**
 * The project's app icon: the Apple touch icon its page declares, or else its
 * site's `/apple-touch-icon.png` if that's an image. Gives up after 3 seconds
 * in all, so a slow site can't hold up the homepage for long. Never fails.
 */
const findIcon = (url: string) =>
  Effect.tryPromise(async () => {
    const page = await fetch(url, { signal: AbortSignal.timeout(2000) });
    const href = page.ok ? declaredIcon(await readHead(page)) : undefined;
    return href ? webUrl(href, page.url || url) : undefined;
  }).pipe(
    // One more try, in case the first request was slow
    Effect.retry({ times: 1 }),
    Effect.orElseSucceed(() => undefined),
    Effect.flatMap((icon) => (icon ? Effect.succeed(icon) : siteIcon(url))),
    Effect.timeout("3 seconds"),
    Effect.orElseSucceed(() => undefined),
  );

/** The site's `/apple-touch-icon.png`, if that's an image */
const siteIcon = (url: string) =>
  Effect.tryPromise(async () => {
    const icon = new URL("/apple-touch-icon.png", url).href;
    const response = await fetch(icon, {
      method: "HEAD",
      signal: AbortSignal.timeout(2000),
    });
    const isImage = response.headers.get("Content-Type")?.startsWith("image/");
    return response.ok && isImage ? icon : undefined;
  }).pipe(Effect.orElseSucceed(() => undefined));

const hostOf = (url: string) => {
  try {
    const { hostname, pathname } = new URL(url);
    return `${hostname.replace(/^www\./, "")}${pathname.replace(/\/$/, "")}`;
  } catch {
    return undefined;
  }
};

// ─────────────────────────────────────────────────────────────
// Effect-based Fetcher
// ─────────────────────────────────────────────────────────────

/**
 * Fetch the open todos on a Nylon Impossible list, in the app's order
 */
export const fetchNylonTodos = (
  token: string | undefined,
  listId: string = NYLON_WORKING_ON_LIST_ID,
  limit: number = 5,
): Effect.Effect<
  WorkingOn,
  FetchError | HttpError | UnavailableError | ValidationError
> =>
  Effect.gen(function* () {
    if (!token) {
      return yield* Effect.fail(
        new UnavailableError({ resource: "NYLON_TOKEN" }),
      );
    }

    const url = `${NYLON_API_URL}/v1/lists/${listId}/todos?limit=${limit}`;

    yield* Effect.logDebug(`Fetching todos from ${url}`);

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
      catch: (error) =>
        new FetchError({
          url,
          message: "Network request failed",
          cause: error,
        }),
    });

    if (!response.ok) {
      yield* Effect.logError(`HTTP ${response.status} from ${url}`);
      return yield* Effect.fail(
        new HttpError({ statusCode: response.status, url }),
      );
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: (error) =>
        new FetchError({ url, message: "Failed to parse JSON", cause: error }),
    });

    const { data } = yield* Schema.decodeUnknown(NylonTodosResponse)(json).pipe(
      Effect.mapError(
        (parseError) =>
          new ValidationError({
            message: "Invalid Nylon todos data structure",
            issues: [parseError.issue],
          }),
      ),
    );

    return yield* Effect.forEach(
      data.filter((todo) => !todo.done).slice(0, limit),
      (todo) =>
        Effect.gen(function* () {
          const link = todo.links?.[0]?.url;
          const url = link ? webUrl(link) : undefined;
          return {
            title: todo.title,
            notes: todo.notes?.trim() || undefined,
            url,
            host: url ? hostOf(url) : undefined,
            icon: url ? yield* findIcon(url) : undefined,
          } satisfies WorkingOnItem;
        }),
      { concurrency: "unbounded" },
    );
  }).pipe(Effect.withLogSpan("fetchNylonTodos"));

/**
 * What I'm working on, from the Nylon list, cached for five minutes.
 *
 * Never fails: if Nylon errors or rate-limits, the last list (up to a day old)
 * is served and Nylon isn't asked again for five minutes; with nothing cached,
 * it returns undefined and the section hides.
 */
export const fetchWorkingOn = (
  token: string | undefined,
  options: {
    listId?: string;
    limit?: number;
    waitUntil?: (promise: Promise<unknown>) => void;
  } = {},
): Effect.Effect<WorkingOn | undefined> =>
  Effect.gen(function* () {
    const { listId = NYLON_WORKING_ON_LIST_ID, limit = 5, waitUntil } = options;

    const cached = yield* readCache(listId);
    if (cached && Date.now() - cached.checkedAt < CHECK_EVERY_MS) {
      return cached.items;
    }

    // Writes the cache after the response when the runtime allows it
    const remember = (entry: CachedWorkingOn) => {
      const write = writeCache(listId, entry);
      if (!waitUntil) return write;
      waitUntil(Effect.runPromise(write));
      return Effect.void;
    };

    return yield* fetchNylonTodos(token, listId, limit).pipe(
      // An icon lookup that timed out shouldn't lose an icon we already had
      Effect.map((items) =>
        items.map((item) => ({
          ...item,
          icon:
            item.icon ??
            cached?.items?.find((known) => known.url === item.url)?.icon,
        })),
      ),
      Effect.tap((items) => {
        const now = Date.now();
        return remember({ checkedAt: now, fetchedAt: now, items });
      }),
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          yield* Effect.logError(`Nylon todos fetch failed: ${error._tag}`);
          // Back off for one interval, keeping whatever list we had
          yield* remember({
            checkedAt: Date.now(),
            fetchedAt: cached?.fetchedAt,
            items: cached?.items,
          });
          return cached?.items;
        }),
      ),
    );
  }).pipe(Effect.withLogSpan("fetchWorkingOn"));
