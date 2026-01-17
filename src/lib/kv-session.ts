/**
 * Cloudflare KV-based session management
 */

export interface Session {
  userId: string;
  createdAt: number;
  expiresAt: number;
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds (for KV TTL)

/**
 * Create a new session in KV storage
 */
export async function createSession(
  kv: KVNamespace,
  userId: string
): Promise<string> {
  const sessionId = crypto.randomUUID();
  const now = Date.now();

  const session: Session = {
    userId,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };

  await kv.put(`session:${sessionId}`, JSON.stringify(session), {
    expirationTtl: SESSION_DURATION_SECONDS,
  });

  return sessionId;
}

/**
 * Retrieve a session from KV storage
 * Returns null if session doesn't exist or has expired
 */
export async function getSession(
  kv: KVNamespace,
  sessionId: string
): Promise<Session | null> {
  const data = await kv.get(`session:${sessionId}`);

  if (!data) {
    return null;
  }

  try {
    const session: Session = JSON.parse(data);

    // Double-check expiration (KV TTL should handle this, but belt and suspenders)
    if (Date.now() > session.expiresAt) {
      await deleteSession(kv, sessionId);
      return null;
    }

    return session;
  } catch {
    // Invalid JSON in session, delete it
    await deleteSession(kv, sessionId);
    return null;
  }
}

/**
 * Delete a session from KV storage
 */
export async function deleteSession(
  kv: KVNamespace,
  sessionId: string
): Promise<void> {
  await kv.delete(`session:${sessionId}`);
}
