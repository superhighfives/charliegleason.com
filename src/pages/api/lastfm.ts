import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { Effect } from "effect";
import { proxyWebSocket } from "../../lib/durable-objects";

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
      }),
    );
  }, 100);

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

export const GET: APIRoute = async ({ request }) => {
  // WebSocket clients get a live stream; plain GETs get the current track as
  // JSON (for HTTP pollers such as the SSH terminal). The DO handles both.
  const isWebSocket = request.headers.get("Upgrade") === "websocket";

  const program = proxyWebSocket(
    request,
    env.LASTFM_TRACKER,
    "LastFmTracker",
    "global",
  ).pipe(
    Effect.catchTag("UnavailableError", () =>
      Effect.succeed(
        isWebSocket
          ? createMockLastFmWebSocket()
          : Response.json(
              {
                track: {
                  name: "Mock Song Title",
                  artist: "Mock Artist",
                  isNowPlaying: true,
                },
              },
              { headers: { "Access-Control-Allow-Origin": "*" } },
            ),
      ),
    ),
    Effect.catchTag("DurableObjectError", (err) =>
      Effect.gen(function* () {
        yield* Effect.logError(`LastFmTracker error: ${err.message}`);
        return new Response("Last.fm tracker unavailable", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }),
    ),
  );

  return Effect.runPromise(program);
};
