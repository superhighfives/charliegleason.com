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

  // Get the singleton VisitorCounter Durable Object
  // Using a fixed name ensures all visitors connect to the same instance
  const id = env.VISITOR_COUNTER.idFromName("global");
  const stub = env.VISITOR_COUNTER.get(id);

  // Proxy the WebSocket request to the Durable Object
  return stub.fetch(request);
};
