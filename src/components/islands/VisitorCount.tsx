import { useEffect, useState, useRef } from "react";

interface VisitorCountProps {
  className?: string;
}

export default function VisitorCount({ className = "" }: VisitorCountProps) {
  const [count, setCount] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function connect() {
      // Build WebSocket URL based on current location
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/visitors`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
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

        // Attempt to reconnect after a delay
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
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

  // Don't render anything until we have a count
  if (count === null) {
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
