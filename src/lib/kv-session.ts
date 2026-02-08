import { Effect } from "effect";
import { KVError, SessionParseError } from "./errors";

/**
 * Session data stored in KV
 */
export interface Session {
  readonly userId: string;
  readonly createdAt: number;
  readonly expiresAt: number;
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds (for KV TTL)

/**
 * Create a new session in KV storage
 */
export const createSession = (
  kv: KVNamespace,
  userId: string,
): Effect.Effect<string, KVError> =>
  Effect.gen(function* () {
    const sessionId = crypto.randomUUID();
    const now = Date.now();

    const session: Session = {
      userId,
      createdAt: now,
      expiresAt: now + SESSION_DURATION_MS,
    };

    yield* Effect.tryPromise({
      try: () =>
        kv.put(`session:${sessionId}`, JSON.stringify(session), {
          expirationTtl: SESSION_DURATION_SECONDS,
        }),
      catch: (error) =>
        new KVError({
          operation: "put",
          key: `session:${sessionId}`,
          message: "Failed to create session",
          cause: error,
        }),
    });

    yield* Effect.logDebug(`Created session: ${sessionId}`);
    return sessionId;
  });

/**
 * Retrieve a session from KV storage
 * Returns null if session doesn't exist or has expired
 */
export const getSession = (
  kv: KVNamespace,
  sessionId: string,
): Effect.Effect<Session | null, KVError | SessionParseError> =>
  Effect.gen(function* () {
    const data = yield* Effect.tryPromise({
      try: () => kv.get(`session:${sessionId}`),
      catch: (error) =>
        new KVError({
          operation: "get",
          key: `session:${sessionId}`,
          message: "Failed to retrieve session",
          cause: error,
        }),
    });

    if (!data) {
      return null;
    }

    const session = yield* Effect.try({
      try: () => JSON.parse(data) as Session,
      catch: (error) => new SessionParseError({ sessionId, cause: error }),
    });

    // Double-check expiration (KV TTL should handle this, but belt and suspenders)
    if (Date.now() > session.expiresAt) {
      yield* deleteSession(kv, sessionId);
      return null;
    }

    return session;
  });

/**
 * Delete a session from KV storage
 */
export const deleteSession = (
  kv: KVNamespace,
  sessionId: string,
): Effect.Effect<void, KVError> =>
  Effect.tryPromise({
    try: () => kv.delete(`session:${sessionId}`),
    catch: (error) =>
      new KVError({
        operation: "delete",
        key: `session:${sessionId}`,
        message: "Failed to delete session",
        cause: error,
      }),
  });
