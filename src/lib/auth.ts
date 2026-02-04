/**
 * Authentication utilities for Astro with Cloudflare KV sessions
 */

import { Effect } from "effect"
import { createSession, getSession, deleteSession } from "./kv-session"
import type { KVError, SessionParseError } from "./errors"

const COOKIE_NAME = "charlie_session"
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export interface User {
  readonly id: string
}

export interface Env {
  readonly SESSION: KVNamespace
  readonly AUTH_PASSWORD: string
}

/**
 * Parse a cookie value from a cookie header string
 */
function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`))
  return match ? match[1] : null
}

/**
 * Get the current user from the request's session cookie
 */
export const getUserFromRequest = (
  request: Request,
  env: Env
): Effect.Effect<User | null, KVError | SessionParseError> =>
  Effect.gen(function* () {
    const cookie = request.headers.get("Cookie")
    const sessionId = parseCookie(cookie, COOKIE_NAME)

    if (!sessionId) {
      return null
    }

    const session = yield* getSession(env.SESSION, sessionId)
    return session ? { id: session.userId } : null
  })

/**
 * Login result types
 */
export interface LoginSuccess {
  readonly _tag: "LoginSuccess"
  readonly headers: Record<string, string>
  readonly redirectTo: string
}

export interface LoginFailure {
  readonly _tag: "LoginFailure"
  readonly error: string
}

export type LoginResult = LoginSuccess | LoginFailure

/**
 * Validate password and create a session
 */
export const login = (
  env: Env,
  password: string,
  redirectTo: string
): Effect.Effect<LoginResult, KVError> =>
  Effect.gen(function* () {
    if (password !== env.AUTH_PASSWORD) {
      yield* Effect.logWarning("Login failed: invalid password")
      return { _tag: "LoginFailure" as const, error: "Invalid password" }
    }

    const sessionId = yield* createSession(env.SESSION, "guest")

    yield* Effect.logDebug("Login successful")
    return {
      _tag: "LoginSuccess" as const,
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
      },
      redirectTo,
    }
  })

/**
 * Clear the session and return headers to delete the cookie
 */
export const logout = (
  request: Request,
  env: Env
): Effect.Effect<{ headers: Record<string, string> }, KVError> =>
  Effect.gen(function* () {
    const cookie = request.headers.get("Cookie")
    const sessionId = parseCookie(cookie, COOKIE_NAME)

    if (sessionId) {
      yield* deleteSession(env.SESSION, sessionId)
      yield* Effect.logDebug("Session deleted")
    }

    return {
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
      },
    }
  })

/**
 * Validate a redirect URL to prevent open redirects
 */
export function safeRedirect(
  to: string | null | undefined,
  defaultRedirect: string = "/"
): string {
  if (!to || typeof to !== "string") {
    return defaultRedirect
  }

  // Must start with / and not //
  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect
  }

  return to
}
