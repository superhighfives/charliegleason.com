import { Data } from "effect"

// ─────────────────────────────────────────────────────────────
// Network & HTTP Errors
// ─────────────────────────────────────────────────────────────

export class FetchError extends Data.TaggedError("FetchError")<{
  readonly url: string
  readonly message: string
  readonly cause?: unknown
}> {}

export class HttpError extends Data.TaggedError("HttpError")<{
  readonly statusCode: number
  readonly url: string
  readonly body?: string
}> {}

export class JsonParseError extends Data.TaggedError("JsonParseError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

// ─────────────────────────────────────────────────────────────
// Validation Errors
// ─────────────────────────────────────────────────────────────

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
  readonly issues?: ReadonlyArray<unknown>
}> {}

// ─────────────────────────────────────────────────────────────
// Infrastructure Errors (Cloudflare)
// ─────────────────────────────────────────────────────────────

export class DurableObjectError extends Data.TaggedError("DurableObjectError")<{
  readonly objectName: string
  readonly message: string
  readonly cause?: unknown
}> {}

export class KVError extends Data.TaggedError("KVError")<{
  readonly operation: "get" | "put" | "delete"
  readonly key: string
  readonly message: string
  readonly cause?: unknown
}> {}

export class UnavailableError extends Data.TaggedError("UnavailableError")<{
  readonly resource: string
}> {}

// ─────────────────────────────────────────────────────────────
// Authentication Errors
// ─────────────────────────────────────────────────────────────

export class AuthenticationError extends Data.TaggedError("AuthenticationError")<{
  readonly reason: "invalid_password" | "session_expired" | "session_not_found"
}> {}

export class SessionParseError extends Data.TaggedError("SessionParseError")<{
  readonly sessionId: string
  readonly cause?: unknown
}> {}
