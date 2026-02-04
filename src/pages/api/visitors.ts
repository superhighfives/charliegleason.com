import type { APIRoute } from "astro"
import { Effect } from "effect"
import { proxyWebSocket } from "../../lib/durable-objects"

/**
 * Creates a mock WebSocket response for local development.
 * Sends mock visitor count data immediately after connection.
 */
function createMockVisitorWebSocket(): Response {
  const { 0: client, 1: server } = new WebSocketPair()

  server.accept()

  // Send mock visitor count after a short delay
  setTimeout(() => {
    server.send(JSON.stringify({ count: 3 }))
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
    env.VISITOR_COUNTER,
    "VisitorCounter",
    "global"
  ).pipe(
    Effect.catchTag("UnavailableError", () =>
      Effect.succeed(createMockVisitorWebSocket())
    ),
    Effect.catchTag("DurableObjectError", (err) =>
      Effect.gen(function* () {
        yield* Effect.logError(`VisitorCounter error: ${err.message}`)
        return new Response("Visitor counter unavailable", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        })
      })
    )
  )

  return Effect.runPromise(program)
}
