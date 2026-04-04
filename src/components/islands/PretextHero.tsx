import { useEffect, useRef, useState, useCallback } from "react";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

interface PretextHeroProps {
  text: string;
  className?: string;
}

function getTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getFont(fontSize: number): string {
  return `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
}

function getColors(theme: "light" | "dark") {
  if (theme === "dark") {
    return {
      from: { r: 234, g: 179, b: 8 },   // yellow-500
      to: { r: 253, g: 224, b: 71 },     // yellow-300
    };
  }
  return {
    from: { r: 202, g: 138, b: 4 },      // yellow-600
    to: { r: 133, g: 77, b: 14 },        // yellow-800 (faded to transparent effect)
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

export default function PretextHero({ text, className }: PretextHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [ready, setReady] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const containerWidth = container.offsetWidth;

    // Responsive font size to match the original text-pretty h2
    const fontSize = 16;
    const lineHeight = Math.round(fontSize * 1.5);
    const font = getFont(fontSize);

    // Use Pretext to measure and lay out the text
    const prepared = prepareWithSegments(text, font);
    const { lines, height } = layoutWithLines(prepared, containerWidth, lineHeight);

    // Size canvas
    const canvasHeight = Math.ceil(height);
    canvas.width = Math.ceil(containerWidth * dpr);
    canvas.height = Math.ceil(canvasHeight * dpr);
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, containerWidth, canvasHeight);

    // Animation timing
    const now = performance.now();
    if (!startTimeRef.current) startTimeRef.current = now;
    const elapsed = now - startTimeRef.current;

    const theme = getTheme();
    const colors = getColors(theme);
    ctx.font = font;
    ctx.textBaseline = "top";

    // Compute total characters for stagger
    let totalChars = 0;
    for (const line of lines) {
      totalChars += line.text.length;
    }

    const reducedMotion = prefersReducedMotion();
    const revealDuration = reducedMotion ? 0 : 800;
    const charStagger = revealDuration / Math.max(totalChars, 1);
    const charAnimDuration = reducedMotion ? 0 : 400;

    let charIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const y = i * lineHeight;

      // Measure character positions using Pretext's line data
      let xOffset = 0;

      for (let j = 0; j < line.text.length; j++) {
        const char = line.text[j];
        const charDelay = charIndex * charStagger;
        const charElapsed = Math.max(0, elapsed - charDelay);
        const charProgress = Math.min(1, charElapsed / charAnimDuration);
        const easedProgress = easeOutCubic(charProgress);

        // Gradient color based on position in line
        const gradientT = line.text.length > 1 ? j / (line.text.length - 1) : 0;
        const r = Math.round(lerp(colors.from.r, colors.to.r, gradientT));
        const g = Math.round(lerp(colors.from.g, colors.to.g, gradientT));
        const b = Math.round(lerp(colors.from.b, colors.to.b, gradientT));

        // Idle shimmer after reveal
        let shimmerAlpha = 1;
        if (charProgress >= 1) {
          const shimmerSpeed = 0.002;
          const shimmerOffset = charIndex * 0.15;
          shimmerAlpha = 0.85 + 0.15 * Math.sin(elapsed * shimmerSpeed + shimmerOffset);
        }

        const alpha = easedProgress * shimmerAlpha;
        const yShift = (1 - easedProgress) * 8;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillText(char, xOffset, y + yShift);

        xOffset += ctx.measureText(char).width;
        charIndex++;
      }
    }

    // Keep animating for reveal, then slow down for shimmer
    const allRevealed = elapsed > revealDuration + charAnimDuration;
    if (reducedMotion) {
      // No animation loop needed
    } else if (allRevealed) {
      // Shimmer at lower framerate
      animationRef.current = requestAnimationFrame(() => {
        setTimeout(() => draw(), 50);
      });
    } else {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [text]);

  useEffect(() => {
    // Wait a frame for fonts to load and container to be sized
    const start = () => {
      startTimeRef.current = 0;
      setReady(true);
      draw();
    };

    // Use document.fonts.ready to wait for font loading
    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      requestAnimationFrame(start);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  // Re-draw on resize
  useEffect(() => {
    if (!ready) return;

    const observer = new ResizeObserver(() => {
      startTimeRef.current = performance.now() - 2000; // Skip reveal on resize
      draw();
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ready, draw]);

  // Re-draw on theme change
  useEffect(() => {
    if (!ready) return;

    const observer = new MutationObserver(() => {
      startTimeRef.current = performance.now() - 2000;
      draw();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [ready, draw]);

  // Hide the CSS fallback text when canvas is ready
  useEffect(() => {
    if (!ready) return;
    const fallback = containerRef.current
      ?.closest("hgroup")
      ?.querySelector(".pretext-fallback") as HTMLElement | null;
    if (fallback) fallback.style.display = "none";
  }, [ready]);

  return (
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={text}
        className="block"
      />
    </div>
  );
}
