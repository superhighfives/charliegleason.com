import { Effect, Schema } from "effect";
import { FetchError, HttpError, ValidationError } from "./errors";

// ─────────────────────────────────────────────────────────────
// Schema Definitions
// ─────────────────────────────────────────────────────────────

/**
 * Schema for a single record from records.charliegleason.com. The public API
 * returns many more fields; only the ones the homepage needs are decoded.
 */
export const RecordItem = Schema.Struct({
  id: Schema.Number,
  artist: Schema.String,
  title: Schema.String,
  year: Schema.NullishOr(Schema.Number),
  coverImageKey: Schema.NullishOr(Schema.String),
  professionalImageKey: Schema.NullishOr(Schema.String),
});

export type RecordItem = typeof RecordItem.Type;

/**
 * Schema for the `/api/records` response envelope
 */
export const RecordsResponse = Schema.Struct({
  records: Schema.Array(RecordItem),
});

/**
 * A record shaped for display, with absolute URLs resolved
 */
export interface LatestRecord {
  readonly id: number;
  readonly artist: string;
  readonly title: string;
  readonly year?: number;
  readonly url: string;
  readonly imageUrl?: string;
}

export type LatestRecords = ReadonlyArray<LatestRecord>;

// ─────────────────────────────────────────────────────────────
// Effect-based Fetcher
// ─────────────────────────────────────────────────────────────

/**
 * Fetch the most recently added records (the API is ordered newest first)
 */
export const fetchRecords = (
  endpoint: string,
  limit: number = 4,
): Effect.Effect<LatestRecords, FetchError | HttpError | ValidationError> =>
  Effect.gen(function* () {
    const url = `${endpoint}/api/records`;

    yield* Effect.logDebug(`Fetching records from ${url}`);

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

    const { records } = yield* Schema.decodeUnknown(RecordsResponse)(data).pipe(
      Effect.mapError(
        (parseError) =>
          new ValidationError({
            message: "Invalid records data structure",
            issues: [parseError.issue],
          }),
      ),
    );

    yield* Effect.logDebug(`Fetched ${records.length} records`);
    return records.slice(0, limit).map((record): LatestRecord => {
      // Prefer the approved studio shot, falling back to the captured cover
      const imageKey = record.professionalImageKey ?? record.coverImageKey;
      return {
        id: record.id,
        artist: record.artist,
        title: record.title,
        year: record.year ?? undefined,
        // `/records/<id>` redirects to the canonical slugged URL
        url: `${endpoint}/records/${record.id}`,
        imageUrl: imageKey ? `${endpoint}/api/photos/${imageKey}` : undefined,
      };
    });
  }).pipe(Effect.withLogSpan("fetchRecords"));
