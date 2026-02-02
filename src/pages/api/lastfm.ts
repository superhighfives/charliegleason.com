import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  const upgradeHeader = request.headers.get("Upgrade");

  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected WebSocket upgrade", {
      status: 426,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const env = locals.runtime.env;

  // Check if LASTFM_TRACKER binding is available
  // In local dev without the external DO worker, this won't be available
  if (!env.LASTFM_TRACKER) {
    return new Response("Last.fm tracker not available in local development", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    // Get the singleton LastFmTracker Durable Object
    // Using a fixed name ensures all clients connect to the same instance
    const id = env.LASTFM_TRACKER.idFromName("global");
    const stub = env.LASTFM_TRACKER.get(id);

    // Proxy the WebSocket request to the Durable Object
    return stub.fetch(request);
  } catch (error) {
    console.error("Failed to connect to LastFmTracker DO:", error);
    return new Response("Last.fm tracker unavailable", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
