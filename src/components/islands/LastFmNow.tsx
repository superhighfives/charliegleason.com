import { useEffect, useRef, useState } from "react";

interface Track {
  name: string;
  artist: string;
  isNowPlaying: boolean;
}

interface LastFmNowProps {
  className?: string;
}

interface EqualizerBarsProps {
  isAnimating: boolean;
}

function EqualizerBars({ isAnimating }: EqualizerBarsProps) {
  return (
    <span
      className={`inline-flex items-end gap-[1px] h-3 w-3 mr-1.5 flex-shrink-0 ${isAnimating ? "" : "opacity-50"}`}
    >
      <span
        className={`w-[3px] bg-neutral-500 dark:bg-neutral-400 rounded-sm ${isAnimating ? "animate-equalizer-1" : "h-1"}`}
        style={{ animationPlayState: isAnimating ? "running" : "paused" }}
      />
      <span
        className={`w-[3px] bg-neutral-500 dark:bg-neutral-400 rounded-sm ${isAnimating ? "animate-equalizer-2" : "h-2"}`}
        style={{ animationPlayState: isAnimating ? "running" : "paused" }}
      />
      <span
        className={`w-[3px] bg-neutral-500 dark:bg-neutral-400 rounded-sm ${isAnimating ? "animate-equalizer-3" : "h-1.5"}`}
        style={{ animationPlayState: isAnimating ? "running" : "paused" }}
      />
    </span>
  );
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
  // Note: Return empty fragment instead of null to work around Astro bug #12283
  // where returning null from a component with hooks causes "Invalid hook call" errors
  if (isUnavailable || track === null) {
    // biome-ignore lint/complexity/noUselessFragments: Required for Astro hydration workaround
    return <></>;
  }

  const prefix = track.isNowPlaying ? "Listening to" : "Last played";

  return (
    <div
      className={`
        flex items-center text-xs text-neutral-500 dark:text-neutral-400
        px-3 py-1 rounded-full
        bg-white dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-700
        max-w-[calc(100vw-4rem-84px)] gap-0.5
        animate-fade-in
        ${className}
      `}
      title={isConnected ? "Connected" : "Reconnecting..."}
    >
      <EqualizerBars isAnimating={track.isNowPlaying} />
      <span className="truncate">
        {prefix} <span className="font-semibold">{track.name}</span>{" "}
        <span>by</span> <span className="font-semibold">{track.artist}</span>
      </span>
    </div>
  );
}
