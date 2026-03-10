/// <reference path="../.astro/types.d.ts" />
/// <reference path="../worker-configuration.d.ts" />

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
