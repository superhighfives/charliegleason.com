import { DurableObject } from "cloudflare:workers";

/**
 * Durable Object that tracks the number of active visitors via WebSocket connections.
 * Uses WebSocket Hibernation to minimize costs when idle.
 */
export class VisitorCounter extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  /**
   * Handles incoming WebSocket upgrade requests.
   * Creates a WebSocket connection and tracks the visitor.
   */
  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    // Accept the WebSocket with hibernation support
    this.ctx.acceptWebSocket(server);

    // Broadcast updated count to all connected clients
    this.broadcast();

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  /**
   * Called when a WebSocket message is received.
   * We don't need to handle messages, but the method is required.
   */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    // Clients can send "ping" to get current count
    if (message === "ping") {
      ws.send(JSON.stringify({ count: this.getCount() }));
    }
  }

  /**
   * Called when a WebSocket connection is closed.
   * Broadcasts the updated count to remaining clients.
   */
  async webSocketClose(
    ws: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean
  ): Promise<void> {
    ws.close(code, reason);
    // Broadcast updated count after this connection is removed
    this.broadcast();
  }

  /**
   * Called when a WebSocket error occurs.
   */
  async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    console.error("WebSocket error:", error);
    ws.close(1011, "WebSocket error");
  }

  /**
   * Gets the current number of connected visitors.
   */
  private getCount(): number {
    return this.ctx.getWebSockets().length;
  }

  /**
   * Broadcasts the current visitor count to all connected clients.
   */
  private broadcast(): void {
    const count = this.getCount();
    const message = JSON.stringify({ count });

    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(message);
      } catch (e) {
        // Connection might be closed, ignore
      }
    }
  }
}
