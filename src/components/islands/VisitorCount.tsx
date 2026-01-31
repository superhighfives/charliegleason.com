import { useEffect, useState, useRef } from "react";

interface VisitorCountProps {
  className?: string;
}

export default function VisitorCount({ className = "" }: VisitorCountProps) {
  const [count, setCount] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;

  useEffect(() => {
    function connect() {
      // Build WebSocket URL based on current location
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/visitors`;

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

  // Don't render anything if unavailable (local dev) or no count yet
  if (isUnavailable || count === null) {
    return null;
  }

  const label = count === 1 ? "person here" : "people here";

  return (
    <div
      className={`absolute top-4 left-4 text-xs text-neutral-500 dark:text-neutral-400 ${className}`}
      title={isConnected ? "Connected" : "Reconnecting..."}
    >
      <span className="tabular-nums">{count}</span> {label}
    </div>
  );
}
