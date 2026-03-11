/// <reference types="astro/client" />
/// <reference path="../worker-configuration.d.ts" />

/**
 * Augment Cloudflare.Env with secrets not in wrangler.jsonc
 * (secrets are set via `wrangler secret put`, not in config)
 */
declare namespace Cloudflare {
  interface Env {
    AUTH_PASSWORD: string;
  }
}

/**
 * User object stored in session
 */
interface User {
  id: string;
}

declare namespace App {
  interface Locals {
    /** Cloudflare execution context */
    cfContext: import("@astrojs/cloudflare").ExecutionContext;
    /** Current authenticated user, or null if not logged in */
    user: User | null;
    /** Resolved theme for rendering (light or dark) */
    theme: "light" | "dark";
    /** User's theme preference (light, dark, or auto) */
    themePreference: "light" | "dark" | "auto";
  }
}
