import type { APIRoute } from "astro";

/**
 * Creates a mock WebSocket response for local development.
 * Sends mock visitor count data immediately after connection.
 */
function createMockVisitorWebSocket(): Response {
  const { 0: client, 1: server } = new WebSocketPair();

  server.accept();

  // Send mock visitor count after a short delay
  setTimeout(() => {
    server.send(JSON.stringify({ count: 3 }));
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
  if (!env.VISITOR_COUNTER) {
    return createMockVisitorWebSocket();
  }

  try {
    // Get the singleton VisitorCounter Durable Object
    // Using a fixed name ensures all visitors connect to the same instance
    const id = env.VISITOR_COUNTER.idFromName("global");
    const stub = env.VISITOR_COUNTER.get(id);

    // Proxy the WebSocket request to the Durable Object
    return stub.fetch(request);
  } catch (error) {
    console.error("Failed to connect to VisitorCounter DO:", error);
    return new Response("Visitor counter unavailable", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
