/**
 * Authentication utilities for Astro with Cloudflare KV sessions
 */

import { createSession, getSession, deleteSession } from "./kv-session";

const COOKIE_NAME = "charlie_session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface User {
  id: string;
}

export interface Env {
  SESSION: KVNamespace;
  AUTH_PASSWORD: string;
}

/**
 * Parse a cookie value from a cookie header string
 */
function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Get the current user from the request's session cookie
 */
export async function getUserFromRequest(
  request: Request,
  env: Env
): Promise<User | null> {
  const cookie = request.headers.get("Cookie");
  const sessionId = parseCookie(cookie, COOKIE_NAME);

  if (!sessionId) {
    return null;
  }

  const session = await getSession(env.SESSION, sessionId);
  return session ? { id: session.userId } : null;
}

/**
 * Validate password and create a session
 */
export async function login(
  env: Env,
  password: string,
  redirectTo: string
): Promise<
  | { success: true; headers: Record<string, string>; redirectTo: string }
  | { success: false; error: string }
> {
  if (password !== env.AUTH_PASSWORD) {
    return { success: false, error: "Invalid password" };
  }

  const sessionId = await createSession(env.SESSION, "guest");

  return {
    success: true,
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
    },
    redirectTo,
  };
}

/**
 * Clear the session and return headers to delete the cookie
 */
export async function logout(
  request: Request,
  env: Env
): Promise<{ headers: Record<string, string> }> {
  const cookie = request.headers.get("Cookie");
  const sessionId = parseCookie(cookie, COOKIE_NAME);

  if (sessionId) {
    await deleteSession(env.SESSION, sessionId);
  }

  return {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  };
}

/**
 * Validate a redirect URL to prevent open redirects
 */
export function safeRedirect(
  to: string | null | undefined,
  defaultRedirect: string = "/"
): string {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  // Must start with / and not //
  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}
