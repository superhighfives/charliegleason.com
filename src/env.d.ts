/// <reference path="../.astro/types.d.ts" />

/**
 * Cloudflare environment bindings
 */
interface Env {
  /** Cloudflare KV namespace for session storage */
  SESSION: KVNamespace;
  /** Password for guest authentication */
  AUTH_PASSWORD: string;
  /** Cloudflare Assets binding */
  ASSETS: Fetcher;
}

/**
 * User object stored in session
 */
interface User {
  id: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    /** Current authenticated user, or null if not logged in */
    user: User | null;
  }
}
