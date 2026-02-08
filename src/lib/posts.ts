import { Effect, Schema } from "effect";
import { FetchError, HttpError, ValidationError } from "./errors";

// ─────────────────────────────────────────────────────────────
// Schema Definitions
// ─────────────────────────────────────────────────────────────

/**
 * Schema for a single blog post from code.charliegleason.com
 */
export const Post = Schema.Struct({
  slug: Schema.String,
  url: Schema.String,
  title: Schema.String,
  description: Schema.String,
  date: Schema.String,
  tags: Schema.optional(Schema.Array(Schema.String)),
});

export type Post = typeof Post.Type;

/**
 * Schema for the posts array
 */
export const Posts = Schema.Array(Post);

export type Posts = typeof Posts.Type;

// ─────────────────────────────────────────────────────────────
// Effect-based Fetcher
// ─────────────────────────────────────────────────────────────

/**
 * Fetch posts from the code endpoint with full type safety and error handling
 */
export const fetchPosts = (
  endpoint: string,
  limit: number = 6,
): Effect.Effect<Posts, FetchError | HttpError | ValidationError> =>
  Effect.gen(function* () {
    const url = `${endpoint}/posts.json`;

    yield* Effect.logDebug(`Fetching posts from ${url}`);

    const response = yield* Effect.tryPromise({
      try: () => fetch(url),
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

    const data = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: (error) =>
        new FetchError({ url, message: "Failed to parse JSON", cause: error }),
    });

    const posts = yield* Schema.decodeUnknown(Posts)(data).pipe(
      Effect.mapError(
        (parseError) =>
          new ValidationError({
            message: "Invalid posts data structure",
            issues: [parseError.issue],
          }),
      ),
    );

    yield* Effect.logDebug(`Fetched ${posts.length} posts`);
    return posts.slice(0, limit);
  }).pipe(Effect.withLogSpan("fetchPosts"));

// ─────────────────────────────────────────────────────────────
// API Response Type
// ─────────────────────────────────────────────────────────────

export interface PostsApiResponse {
  readonly success: boolean;
  readonly posts?: Posts;
  readonly error?: string;
}
