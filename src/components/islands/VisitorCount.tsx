import { useEffect, useState, useRef } from "react";

interface VisitorCountProps {
  className?: string;
}

function GlowingDot() {
  return (
    <span className="relative inline-flex h-2 w-2 mr-1.5 flex-shrink-0">
      {/* Glow effect */}
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
      {/* Solid dot */}
      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500 shadow-[0_0_8px_2px_rgba(234,179,8,0.6)]" />
    </span>
  );
}

export default function VisitorCount({ className = "" }: VisitorCountProps) {
  const [count, setCount] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;

  useEffect(() => {
    function connect() {
      // Connect directly to the visitor-counter worker
      // In production, this is a separate Cloudflare Worker that handles WebSockets
      const wsUrl =
        import.meta.env.PUBLIC_VISITOR_COUNTER_URL ||
        "wss://visitor-counter.superhighfives.workers.dev";

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsUnavailable(false);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data.count === "number") {
            setCount(data.count);
          }
        } catch (e) {
          console.error("Failed to parse visitor count message:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect after a delay, but give up after max attempts
        reconnectAttemptsRef.current += 1;
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        } else {
          // Mark as unavailable (likely local dev without DO)
          setIsUnavailable(true);
        }
      };

      ws.onerror = () => {
        // Don't log errors - this is expected in local dev
        ws.close();
      };
    }

    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Don't render if unavailable, no count, or only 1 visitor (yourself)
  // Note: Return empty fragment instead of null to work around Astro bug #12283
  // where returning null from a component with hooks causes "Invalid hook call" errors
  if (isUnavailable || count === null || count < 2) {
    return <></>;
  }

  return (
    <div
      className={`
        flex items-center text-xs text-yellow-600 dark:text-yellow-400
        px-3 py-1 rounded-full
        bg-white dark:bg-neutral-900
        border border-yellow-400 dark:border-yellow-700
        gap-1
        ${className}
      `}
      title={isConnected ? "Connected" : "Reconnecting..."}
    >
      <GlowingDot />
      <span className="tabular-nums">{count}</span>
      <span>people here</span>
    </div>
  );
}
