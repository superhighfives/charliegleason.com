import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useCallback, useEffect, useRef, useState } from "react";

interface PretextHeroProps {
  text: string;
  className?: string;
}

function getTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getFontFromElement(el: HTMLElement): string {
  const style = getComputedStyle(el);
  return style.font || `${style.fontSize} ${style.fontFamily}`;
}

function getTextTransform(el: HTMLElement): string {
  return getComputedStyle(el).textTransform;
}

function getColors(theme: "light" | "dark") {
  if (theme === "dark") {
    return {
      from: { r: 234, g: 179, b: 8 }, // yellow-500
      to: { r: 253, g: 224, b: 71 }, // yellow-300
    };
  }
  return {
    from: { r: 202, g: 138, b: 4 }, // yellow-600
    to: { r: 133, g: 77, b: 14 }, // yellow-800 (faded to transparent effect)
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface LayoutCache {
  text: string;
  font: string;
  containerWidth: number;
  dpr: number;
  lines: Array<{ text: string; width: number }>;
  height: number;
  lineHeight: number;
  totalChars: number;
}

export default function PretextHero({ text, className }: PretextHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const layoutCacheRef = useRef<LayoutCache | null>(null);
  const [ready, setReady] = useState(false);

  const cancelPendingFrames = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const fallback = fallbackRef.current;
    if (!canvas || !container || !fallback) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const containerWidth = container.offsetWidth;

    // Derive font from the fallback span's computed styles
    const font = getFontFromElement(fallback);
    const transform = getTextTransform(fallback);
    const displayText = transform === "uppercase" ? text.toUpperCase() : text;
    const style = getComputedStyle(fallback);
    const lineHeight = Number.parseFloat(style.lineHeight) || 24;

    // Reuse cached layout if inputs haven't changed
    let cache = layoutCacheRef.current;
    if (
      !cache ||
      cache.text !== displayText ||
      cache.font !== font ||
      cache.containerWidth !== containerWidth ||
      cache.dpr !== dpr
    ) {
      const prepared = prepareWithSegments(displayText, font);
      const result = layoutWithLines(prepared, containerWidth, lineHeight);

      let totalChars = 0;
      for (const line of result.lines) {
        totalChars += line.text.length;
      }

      cache = {
        text: displayText,
        font,
        containerWidth,
        dpr,
        lines: result.lines,
        height: result.height,
        lineHeight,
        totalChars,
      };
      layoutCacheRef.current = cache;

      // Only resize canvas when layout changes
      const canvasHeight = Math.ceil(cache.height);
      canvas.width = Math.ceil(containerWidth * dpr);
      canvas.height = Math.ceil(canvasHeight * dpr);
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
    }

    // Set up context (must be done after any canvas resize)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const canvasHeight = Math.ceil(cache.height);
    ctx.clearRect(0, 0, containerWidth, canvasHeight);

    // Animation timing
    const now = performance.now();
    if (!startTimeRef.current) startTimeRef.current = now;
    const elapsed = now - startTimeRef.current;

    const theme = getTheme();
    const colors = getColors(theme);
    ctx.font = font;
    ctx.textBaseline = "top";

    const reducedMotion = prefersReducedMotion();
    const revealDuration = reducedMotion ? 0 : 800;
    const charStagger = revealDuration / Math.max(cache.totalChars, 1);
    const charAnimDuration = reducedMotion ? 0 : 400;

    let charIndex = 0;

    for (let i = 0; i < cache.lines.length; i++) {
      const line = cache.lines[i];
      const y = i * cache.lineHeight;

      let xOffset = 0;

      for (let j = 0; j < line.text.length; j++) {
        const char = line.text[j];

        // Gradient color based on position in line
        const gradientT = line.text.length > 1 ? j / (line.text.length - 1) : 0;
        const r = Math.round(lerp(colors.from.r, colors.to.r, gradientT));
        const g = Math.round(lerp(colors.from.g, colors.to.g, gradientT));
        const b = Math.round(lerp(colors.from.b, colors.to.b, gradientT));

        // Skip animation math entirely for reduced motion
        if (reducedMotion) {
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillText(char, xOffset, y);
        } else {
          const charDelay = charIndex * charStagger;
          const charElapsed = Math.max(0, elapsed - charDelay);
          const charProgress = Math.min(1, charElapsed / charAnimDuration);
          const easedProgress = easeOutCubic(charProgress);

          // Idle shimmer after reveal
          let shimmerAlpha = 1;
          if (charProgress >= 1) {
            const shimmerSpeed = 0.002;
            const shimmerOffset = charIndex * 0.15;
            shimmerAlpha =
              0.85 + 0.15 * Math.sin(elapsed * shimmerSpeed + shimmerOffset);
          }

          const alpha = easedProgress * shimmerAlpha;
          const yShift = (1 - easedProgress) * 8;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fillText(char, xOffset, y + yShift);
        }

        xOffset += ctx.measureText(char).width;
        charIndex++;
      }
    }

    // Schedule next frame (cancel any pending first)
    cancelPendingFrames();
    const allRevealed = elapsed > revealDuration + charAnimDuration;
    if (reducedMotion) {
      // No animation loop needed
    } else if (allRevealed) {
      // Shimmer at lower framerate
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        animationRef.current = requestAnimationFrame(draw);
      }, 50);
    } else {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [text, cancelPendingFrames]);

  useEffect(() => {
    const start = () => {
      startTimeRef.current = 0;
      setReady(true);
      draw();
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      requestAnimationFrame(start);
    }

    return () => cancelPendingFrames();
  }, [draw, cancelPendingFrames]);

  // Re-draw on resize
  useEffect(() => {
    if (!ready) return;

    const observer = new ResizeObserver(() => {
      cancelPendingFrames();
      startTimeRef.current = performance.now() - 2000; // Skip reveal on resize
      draw();
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ready, draw, cancelPendingFrames]);

  // Re-draw on theme change
  useEffect(() => {
    if (!ready) return;

    const observer = new MutationObserver(() => {
      cancelPendingFrames();
      startTimeRef.current = performance.now() - 2000;
      draw();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [ready, draw, cancelPendingFrames]);

  return (
    <div ref={containerRef} className={className}>
      <span
        ref={fallbackRef}
        className={
          ready
            ? "absolute w-px h-px p-0 -m-px overflow-hidden border-0"
            : undefined
        }
        style={
          ready ? { clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap" } : undefined
        }
      >
        {text}
      </span>
      <canvas ref={canvasRef} className={ready ? "block" : "hidden"} />
    </div>
  );
}
