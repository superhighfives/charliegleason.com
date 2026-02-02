import type { APIRoute } from "astro";

/**
 * Creates a mock WebSocket response for local development.
 * Sends mock Last.fm track data immediately after connection.
 */
function createMockLastFmWebSocket(): Response {
  const { 0: client, 1: server } = new WebSocketPair();

  server.accept();

  // Send mock track data after a short delay
  setTimeout(() => {
    server.send(
      JSON.stringify({
        track: {
          name: "Mock Song Title",
          artist: "Mock Artist",
          isNowPlaying: true,
        },
      })
    );
  }, 100);

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

export const GET: APIRoute = async ({ request, locals }) => {
  const upgradeHeader = request.headers.get("Upgrade");

  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected WebSocket upgrade", {
      status: 426,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const env = locals.runtime.env;

  // In local dev without the external DO worker, return mock data
  if (!env.LASTFM_TRACKER) {
    return createMockLastFmWebSocket();
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
