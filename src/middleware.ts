/**
 * Astro middleware for authentication
 * 
 * This middleware:
 * 1. Checks for a valid session on every request
 * 2. Makes the user available via Astro.locals.user
 * 3. Redirects unauthenticated users away from protected routes
 */

import { defineMiddleware } from "astro:middleware";
import { getUserFromRequest } from "./lib/auth";

// Try to import protected routes config
// This will fail gracefully in public mirror builds
let protectedRoutes: string[] = [];

async function loadProtectedRoutes() {
  try {
    // Dynamic import from the protected package
    const config = await import("@charliegleason/protected/config");
    protectedRoutes = config.protectedRoutes || config.default?.protectedRoutes || [];
  } catch {
    // Protected package not available (expected in public builds)
    protectedRoutes = [];
  }
}

// Load protected routes on module initialization
loadProtectedRoutes();

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, redirect, locals } = context;
  const url = new URL(request.url);

  // Get user from session cookie
  const env = locals.runtime?.env;
  
  if (env) {
    const user = await getUserFromRequest(request, env);
    // Make user available to all pages via Astro.locals
    locals.user = user;
  } else {
    locals.user = null;
  }

  // Check if this route requires authentication
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      url.pathname === route || url.pathname.startsWith(route + "/")
  );

  if (isProtectedRoute && !locals.user) {
    // Redirect unauthenticated users to login
    const loginUrl = `/login?redirectTo=${encodeURIComponent(url.pathname)}`;
    return redirect(loginUrl);
  }

  return next();
});
