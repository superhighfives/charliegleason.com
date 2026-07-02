import { useCallback, useEffect, useRef, useState } from "react";
import LastFmNow from "./LastFmNow";
import VisitorCount from "./VisitorCount";

// Both islands connect over their own WebSocket and resolve at different
// times. Rather than let each one fade in independently (which makes the
// panel jump as the second one arrives), we keep the whole panel hidden
// until both have "settled" — either they have something to show, or they've
// determined they have nothing to show — and then fade them in together.
//
// A fallback timer reveals the panel regardless, so a hung socket can never
// leave it hidden forever.
const CHILDREN = 2;
const MAX_WAIT_MS = 4000;

export default function StatusPanel() {
  const [ready, setReady] = useState(false);
  const settledCountRef = useRef(0);
  const revealedRef = useRef(false);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setReady(true);
  }, []);

  const handleSettled = useCallback(() => {
    settledCountRef.current += 1;
    if (settledCountRef.current >= CHILDREN) reveal();
  }, [reveal]);

  useEffect(() => {
    const timeout = setTimeout(reveal, MAX_WAIT_MS);
    return () => clearTimeout(timeout);
  }, [reveal]);

  return (
    <div
      className={`
        status-panel flex flex-col items-start gap-1 pointer-events-auto
        transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}
      `}
    >
      <VisitorCount onSettled={handleSettled} />
      <LastFmNow onSettled={handleSettled} />
    </div>
  );
}
