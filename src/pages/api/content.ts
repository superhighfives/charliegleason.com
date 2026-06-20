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
      // Server-to-server clients don't need CORS, but allow browser use too.
      "Access-Control-Allow-Origin": "*",
    },
  });
};
