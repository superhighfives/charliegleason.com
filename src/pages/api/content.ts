import type { APIRoute } from "astro";
import { articles, features, profile, projects } from "../../data";

/**
 * Portfolio content API — the source of truth for static portfolio data
 * (bio, projects, articles, awards, talks, etc.) consumed by other surfaces
 * such as the SSH terminal app (ssh.charliegleason.com).
 *
 * Live data (now-playing, visitor count) is intentionally not included here —
 * clients subscribe to /api/lastfm and /api/visitors over WebSocket for that.
 */
// Server-to-server clients (e.g. the SSH app) don't need CORS, but allow
// browser use too — including preflight for non-simple cross-origin requests.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
};

export const GET: APIRoute = () => {
  const body = {
    profile,
    projects: projects.data,
    articles: articles.data,
    features: features.data,
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      // Cache at the edge; content changes only on deploy.
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      ...CORS_HEADERS,
    },
  });
};

export const OPTIONS: APIRoute = () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });
