import { layout, prepare } from "@chenglou/pretext";
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
    to: { r: 133, g: 77, b: 14 }, // yellow-800
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

// Characters used for the scramble effect — uppercase letters and symbols
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=?/";

function getScrambleChar(seed: number): string {
  return SCRAMBLE_CHARS[Math.abs(seed) % SCRAMBLE_CHARS.length];
}

// Simple seeded random for deterministic glitch timing per character
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface LayoutLine {
  text: string;
  width: number;
}

interface LayoutCache {
  displayText: string;
  font: string;
  letterSpacing: string;
  containerWidth: number;
  dpr: number;
  lines: LayoutLine[];
  height: number;
  lineHeight: number;
  totalChars: number;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): LayoutLine[] {
  const words = text.split(" ");
  const lines: LayoutLine[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push({
        text: currentLine,
        width: ctx.measureText(currentLine).width,
      });
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push({
      text: currentLine,
      width: ctx.measureText(currentLine).width,
    });
  }

  return lines;
}

function applyLetterSpacing(
  ctx: CanvasRenderingContext2D,
  spacing: string,
): void {
  if ("letterSpacing" in ctx) {
    (
      ctx as CanvasRenderingContext2D & { letterSpacing: string }
    ).letterSpacing = spacing;
  }
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
    const letterSpacing = style.letterSpacing || "0px";

    // Use Pretext to pre-compute paragraph height for fast arithmetic checks
    const prepared = prepare(displayText, font);
    const pretextLayout = layout(prepared, containerWidth, lineHeight);

    // Reuse cached layout if inputs haven't changed
    let cache = layoutCacheRef.current;
    if (
      !cache ||
      cache.displayText !== displayText ||
      cache.font !== font ||
      cache.letterSpacing !== letterSpacing ||
      cache.containerWidth !== containerWidth ||
      cache.dpr !== dpr
    ) {
      ctx.font = font;
      applyLetterSpacing(ctx, letterSpacing);

      const lines = wrapText(ctx, displayText, containerWidth);

      let totalChars = 0;
      for (const line of lines) {
        totalChars += line.text.length;
      }

      const hasLetterSpacing =
        letterSpacing !== "0px" && letterSpacing !== "normal";
      const height = hasLetterSpacing
        ? lines.length * lineHeight
        : pretextLayout.height;

      cache = {
        displayText,
        font,
        letterSpacing,
        containerWidth,
        dpr,
        lines,
        height,
        lineHeight,
        totalChars,
      };
      layoutCacheRef.current = cache;

      const canvasHeight = Math.ceil(height);
      canvas.width = Math.ceil(containerWidth * dpr);
      canvas.height = Math.ceil(canvasHeight * dpr);
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const canvasHeight = Math.ceil(cache.height);
    ctx.clearRect(0, 0, containerWidth, canvasHeight);

    const now = performance.now();
    if (!startTimeRef.current) startTimeRef.current = now;
    const elapsed = now - startTimeRef.current;

    const theme = getTheme();
    const colors = getColors(theme);
    ctx.font = font;
    ctx.textBaseline = "top";
    applyLetterSpacing(ctx, letterSpacing);

    const reducedMotion = prefersReducedMotion();

    // --- Scramble reveal timing ---
    // Each character scrambles through random glyphs before settling
    const scrambleDuration = 1200; // total time for all chars to finish
    const charScrambleTime = 600; // how long each char scrambles
    const charStagger = scrambleDuration / Math.max(cache.totalChars, 1);
    const scrambleCycleRate = 40; // ms per scramble tick

    // --- Glitch timing ---
    // Rare glitch: ~every 4-8s, a short burst of RGB split + offset
    const glitchCycleSec = 5;
    const glitchPhase = ((elapsed / 1000) % glitchCycleSec) / glitchCycleSec;
    // Glitch active in a narrow window (5% of cycle)
    const glitchActive =
      !reducedMotion &&
      elapsed > scrambleDuration + charScrambleTime &&
      glitchPhase > 0.92;
    const glitchIntensity = glitchActive
      ? Math.sin(((glitchPhase - 0.92) / 0.08) * Math.PI)
      : 0;

    let charIndex = 0;

    for (let i = 0; i < cache.lines.length; i++) {
      const line = cache.lines[i];
      const y = i * cache.lineHeight;

      let xOffset = 0;

      for (let j = 0; j < line.text.length; j++) {
        const char = line.text[j];
        const isSpace = char === " " || char === "\u00a0";

        // Gradient color
        const gradientT = line.text.length > 1 ? j / (line.text.length - 1) : 0;
        const r = Math.round(lerp(colors.from.r, colors.to.r, gradientT));
        const g = Math.round(lerp(colors.from.g, colors.to.g, gradientT));
        const b = Math.round(lerp(colors.from.b, colors.to.b, gradientT));

        if (reducedMotion || isSpace) {
          // No animation for reduced motion or spaces
          if (!isSpace) {
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillText(char, xOffset, y);
          }
        } else {
          const charDelay = charIndex * charStagger;
          const charElapsed = Math.max(0, elapsed - charDelay);
          const charProgress = Math.min(1, charElapsed / charScrambleTime);

          // Determine which character to show
          let displayChar: string;
          if (charProgress >= 1) {
            // Settled — show real character
            displayChar = char;
          } else if (charProgress < 0.1) {
            // Not started yet — show nothing or a faint glyph
            displayChar = "";
          } else {
            // Scrambling — cycle through random characters
            const scrambleTick = Math.floor(charElapsed / scrambleCycleRate);
            // Bias toward correct char as progress increases
            const lockChance = easeOutCubic(charProgress);
            if (seededRandom(charIndex * 1000 + scrambleTick) < lockChance) {
              displayChar = char;
            } else {
              displayChar = getScrambleChar(charIndex * 31 + scrambleTick);
            }
          }

          // Fade in during early scramble phase
          const fadeProgress = Math.min(1, charProgress / 0.3);
          const alpha = easeOutCubic(fadeProgress);

          if (displayChar) {
            // --- Glitch effect: RGB channel split ---
            if (glitchActive && seededRandom(charIndex * 7 + 99) > 0.3) {
              const glitchOffset = glitchIntensity * 2;
              // Red channel (shifted left)
              ctx.fillStyle = `rgba(${Math.min(255, r + 100)}, ${Math.max(0, g - 80)}, ${Math.max(0, b - 80)}, ${alpha * 0.6})`;
              ctx.fillText(displayChar, xOffset - glitchOffset, y);
              // Blue channel (shifted right)
              ctx.fillStyle = `rgba(${Math.max(0, r - 80)}, ${Math.max(0, g - 40)}, ${Math.min(255, b + 100)}, ${alpha * 0.6})`;
              ctx.fillText(displayChar, xOffset + glitchOffset, y);
            }

            // Main character
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            // Slight y-jitter during scramble
            const jitter =
              charProgress < 1
                ? (seededRandom(
                    charIndex * 13 + Math.floor(elapsed / scrambleCycleRate),
                  ) -
                    0.5) *
                  2 *
                  (1 - charProgress)
                : 0;

            ctx.fillText(displayChar, xOffset, y + jitter);
          }
        }

        xOffset += ctx.measureText(char).width;
        charIndex++;
      }
    }

    // Animation loop
    cancelPendingFrames();
    const allSettled = elapsed > scrambleDuration + charScrambleTime;
    if (reducedMotion) {
      // No animation loop
    } else if (allSettled) {
      // Idle: low framerate, just for glitch checks
      timeoutRef.current = setTimeout(
        () => {
          timeoutRef.current = null;
          animationRef.current = requestAnimationFrame(draw);
        },
        glitchActive ? 16 : 100,
      );
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
      layoutCacheRef.current = null;
      startTimeRef.current = performance.now() - 5000;
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
      startTimeRef.current = performance.now() - 5000;
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
