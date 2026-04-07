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
      from: { r: 234, g: 179, b: 8 },
      to: { r: 253, g: 224, b: 71 },
    };
  }
  return {
    from: { r: 202, g: 138, b: 4 },
    to: { r: 133, g: 77, b: 14 },
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

// Scramble glyph pool — dense, technical characters
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%@&+=?!/<>[]{}*~^";

function scrambleChar(seed: number): string {
  return GLYPHS[Math.abs(seed) % GLYPHS.length];
}

// Deterministic pseudo-random from a seed
function rand(seed: number): number {
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
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
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
    if (!canvas || !container) return;

    // Read computed styles from the h2 element (sibling of our parent)
    const styleSource =
      container.parentElement?.parentElement?.querySelector("h2") || container;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const containerWidth = container.offsetWidth;
    if (containerWidth === 0) return;

    const font = getFontFromElement(styleSource as HTMLElement);
    const transform = getTextTransform(styleSource as HTMLElement);
    const displayText = transform === "uppercase" ? text.toUpperCase() : text;
    const style = getComputedStyle(styleSource);
    const lineHeight = Number.parseFloat(style.lineHeight) || 24;
    const letterSpacing = style.letterSpacing || "0px";

    const prepared = prepare(displayText, font);
    const pretextLayout = layout(prepared, containerWidth, lineHeight);

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

    // ─── SCRAMBLE TIMING ───
    // All chars start scrambling immediately, then lock left-to-right
    const totalLockTime = 1400; // time for all chars to lock in
    const perCharLock = 500; // each char's scramble-to-lock duration
    const lockStagger = totalLockTime / Math.max(cache.totalChars, 1);
    const cycleRate = 35; // ms between glyph changes (fast flicker)
    const tick = Math.floor(elapsed / cycleRate);

    // ─── GLITCH TIMING ───
    const glitchCycle = 6000; // ms between glitch bursts
    const glitchWindow = 300; // ms glitch lasts
    const settled = elapsed > totalLockTime + perCharLock;
    const timeSinceSettle = elapsed - (totalLockTime + perCharLock);
    const inGlitchWindow =
      !reducedMotion &&
      settled &&
      timeSinceSettle > 0 &&
      timeSinceSettle % glitchCycle < glitchWindow;
    const glitchT = inGlitchWindow
      ? (timeSinceSettle % glitchCycle) / glitchWindow
      : 0;
    // Intensity peaks in the middle of the window
    const glitchI = Math.sin(glitchT * Math.PI);

    // Occasional full-line horizontal jolt during glitch
    const lineJoltX =
      inGlitchWindow && glitchI > 0.5
        ? (rand(tick * 3) - 0.5) * 6 * glitchI
        : 0;

    let charIndex = 0;

    for (let i = 0; i < cache.lines.length; i++) {
      const line = cache.lines[i];
      const y = i * cache.lineHeight;
      let xOffset = 0;

      for (let j = 0; j < line.text.length; j++) {
        const char = line.text[j];
        const isSpace = char === " " || char === "\u00a0";
        const charW = ctx.measureText(char).width;

        // Gradient color
        const gt = line.text.length > 1 ? j / (line.text.length - 1) : 0;
        const r = Math.round(lerp(colors.from.r, colors.to.r, gt));
        const g = Math.round(lerp(colors.from.g, colors.to.g, gt));
        const b = Math.round(lerp(colors.from.b, colors.to.b, gt));

        if (reducedMotion || isSpace) {
          if (!isSpace) {
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillText(char, xOffset, y);
          }
          xOffset += charW;
          charIndex++;
          continue;
        }

        // ─── SCRAMBLE STATE ───
        const lockDelay = charIndex * lockStagger;
        const lockElapsed = Math.max(0, elapsed - lockDelay);
        // 0 → 1: how far through the lock-in process
        const lockProgress = Math.min(1, lockElapsed / perCharLock);
        const locked = lockProgress >= 1;

        // Pick display character
        let displayChar: string;
        if (locked) {
          displayChar = char;
        } else {
          // Scramble: rapid cycling, increasingly likely to flash correct char
          const lockChance = lockProgress ** 2; // accelerating bias
          if (rand(charIndex * 997 + tick) < lockChance) {
            displayChar = char;
          } else {
            displayChar = scrambleChar(charIndex * 31 + tick);
          }
        }

        // Alpha: characters are immediately visible
        const alpha = Math.min(1, lockElapsed / 80); // fast fade-in (~80ms)

        // ─── DRAW CHARACTER ───
        const dx = xOffset + lineJoltX;

        // Y-jitter while scrambling (decreases as lock approaches)
        const jitter = locked
          ? 0
          : (rand(charIndex * 13 + tick) - 0.5) * 3 * (1 - lockProgress);

        // Lock-in flash: brief brightness boost when char locks
        const lockFlash =
          lockProgress > 0.9 && lockProgress < 1
            ? 1 + 2 * (1 - (1 - lockProgress) / 0.1) // bright flash
            : 1;

        // ─── GLITCH: RGB SPLIT ───
        if (inGlitchWindow && rand(charIndex * 7 + tick) > 0.4) {
          const splitX = glitchI * 3;
          // Red ghost (left)
          ctx.fillStyle = `rgba(255, ${Math.max(0, g - 100)}, ${Math.max(0, b - 100)}, ${0.5 * glitchI})`;
          ctx.fillText(displayChar, dx - splitX, y + jitter);
          // Cyan ghost (right)
          ctx.fillStyle = `rgba(${Math.max(0, r - 100)}, 255, 255, ${0.4 * glitchI})`;
          ctx.fillText(displayChar, dx + splitX, y + jitter);
        }

        // Main character
        const fr = Math.min(255, Math.round(r * lockFlash));
        const fg = Math.min(255, Math.round(g * lockFlash));
        const fb = Math.min(255, Math.round(b * lockFlash));
        ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, ${alpha})`;
        ctx.fillText(displayChar, dx, y + jitter);

        xOffset += charW;
        charIndex++;
      }
    }

    // ─── SCAN LINE during glitch ───
    if (inGlitchWindow && glitchI > 0.3) {
      const scanY = (rand(tick * 2 + 7) * canvasHeight) | 0;
      const scanH = (1 + rand(tick * 3) * 2) | 0;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.08 * glitchI})`;
      ctx.fillRect(0, scanY, containerWidth, scanH);
    }

    // ─── ANIMATION LOOP ───
    cancelPendingFrames();
    if (reducedMotion) {
      // Static render, no loop
    } else if (!settled) {
      // Scramble phase: full framerate
      animationRef.current = requestAnimationFrame(draw);
    } else {
      hasAnimatedRef.current = true;
      if (inGlitchWindow) {
        // Glitch burst: full framerate
        animationRef.current = requestAnimationFrame(draw);
      } else {
        // Idle: check periodically for next glitch window
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          animationRef.current = requestAnimationFrame(draw);
        }, 100);
      }
    }
  }, [text, cancelPendingFrames]);

  useEffect(() => {
    const start = () => {
      startTimeRef.current = 0;
      setReady(true);
      // Use rAF to ensure the container has been laid out at full width
      requestAnimationFrame(() => draw());
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      requestAnimationFrame(start);
    }

    return () => cancelPendingFrames();
  }, [draw, cancelPendingFrames]);

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!ready) return;

    const observer = new ResizeObserver(() => {
      cancelPendingFrames();
      layoutCacheRef.current = null;
      // Only skip animation on subsequent resizes, not the initial layout
      if (hasAnimatedRef.current) {
        startTimeRef.current = performance.now() - 10000;
      }
      draw();
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ready, draw, cancelPendingFrames]);

  useEffect(() => {
    if (!ready) return;

    const observer = new MutationObserver(() => {
      cancelPendingFrames();
      layoutCacheRef.current = null;
      startTimeRef.current = performance.now() - 10000;
      draw();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [ready, draw, cancelPendingFrames]);

  return (
    <div ref={containerRef} className={`${className || ""} w-full h-full`}>
      <canvas ref={canvasRef} className={ready ? "block" : "hidden"} />
    </div>
  );
}
