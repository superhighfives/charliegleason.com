import { useEffect, useState, useRef } from "react";

interface Track {
  name: string;
  artist: string;
  isNowPlaying: boolean;
}

interface LastFmNowProps {
  className?: string;
}

export default function LastFmNow({ className = "" }: LastFmNowProps) {
  const [track, setTrack] = useState<Track | null>(null);
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
      // Connect directly to the lastfm-tracker worker
      // In production, this is a separate Cloudflare Worker that handles WebSockets
      const wsUrl =
        import.meta.env.PUBLIC_LASTFM_TRACKER_URL ||
        "wss://lastfm-tracker.superhighfives.workers.dev";

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
          if (data.track) {
            setTrack(data.track);
          }
        } catch (e) {
          console.error("Failed to parse Last.fm message:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;

        reconnectAttemptsRef.current += 1;
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        } else {
          setIsUnavailable(true);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Don't render if unavailable or no track yet
  if (isUnavailable || track === null) {
    return null;
  }

  const prefix = track.isNowPlaying ? "Listening to" : "Last played";

  return (
    <div
      className={`text-xs text-neutral-500 dark:text-neutral-400 truncate ${className}`}
      title={isConnected ? "Connected" : "Reconnecting..."}
    >
      {prefix} <span className="italic">{track.name}</span>{" "}
      <span className="italic">by {track.artist}</span>
    </div>
  );
}
