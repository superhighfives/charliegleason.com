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
  /** External blog posts endpoint */
  CODE_ENDPOINT?: string;
  /** Durable Object namespace for visitor counter (external worker) */
  VISITOR_COUNTER: DurableObjectNamespace;
  /** Durable Object namespace for Last.fm tracker (external worker) */
  LASTFM_TRACKER: DurableObjectNamespace;
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
    /** Resolved theme for rendering (light or dark) */
    theme: "light" | "dark";
    /** User's theme preference (light, dark, or auto) */
    themePreference: "light" | "dark" | "auto";
  }
}
