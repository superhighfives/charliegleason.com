import type { APIRoute } from "astro"
import { Effect } from "effect"
import { proxyWebSocket } from "../../lib/durable-objects"

/**
 * Creates a mock WebSocket response for local development.
 * Sends mock Last.fm track data immediately after connection.
 */
function createMockLastFmWebSocket(): Response {
  const { 0: client, 1: server } = new WebSocketPair()

  server.accept()

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
    )
  }, 100)

  return new Response(null, {
    status: 101,
    webSocket: client,
  })
}

export const GET: APIRoute = async ({ request, locals }) => {
  const upgradeHeader = request.headers.get("Upgrade")

  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected WebSocket upgrade", {
      status: 426,
      headers: { "Content-Type": "text/plain" },
    })
  }

  const env = locals.runtime.env

  const program = proxyWebSocket(
    request,
    env.LASTFM_TRACKER,
    "LastFmTracker",
    "global"
  ).pipe(
    Effect.catchTag("UnavailableError", () =>
      Effect.succeed(createMockLastFmWebSocket())
    ),
    Effect.catchTag("DurableObjectError", (err) =>
      Effect.gen(function* () {
        yield* Effect.logError(`LastFmTracker error: ${err.message}`)
        return new Response("Last.fm tracker unavailable", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        })
      })
    )
  )

  return Effect.runPromise(program)
}
