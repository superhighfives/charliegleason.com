import { useEffect, useRef, useState } from "react";

export type ColorType =
  | "yellow"
  | "indigo"
  | "pink"
  | "amber"
  | "emerald"
  | "red"
  | "rose"
  | "blue"
  | "sky";

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error
    navigator.msMaxTouchPoints > 0
  );
}

// Tracks the mouse across the tile itself, or across the enclosing link when
// the tile is part of a larger clickable card.
function useMousePosition(
  ref: React.RefObject<HTMLDivElement | null>,
  trackEnclosingLink: boolean,
) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const reference = ref.current;
    if (!reference) return;
    const area: HTMLElement =
      (trackEnclosingLink && reference.closest("a")) || reference;

    let counter = 0;
    const updateRate = 5;
    const isTimeToUpdate = () => counter++ % updateRate === 0;

    const setFromEvent = (e: MouseEvent) => {
      if (isTimeToUpdate()) {
        const rect = area.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = (e.clientY - rect.top - rect.height / 2) * -1;

        setPosition({
          x: y / (rect.height / 2),
          y: x / (rect.width / 2),
        });
      }
    };

    const setToZero = () => setPosition({ x: 0, y: 0 });

    area.addEventListener("mousemove", setFromEvent);
    area.addEventListener("mouseleave", setToZero);
    return () => {
      area.removeEventListener("mousemove", setFromEvent);
      area.removeEventListener("mouseleave", setToZero);
    };
  }, [ref, trackEnclosingLink]);

  return position;
}

interface TileProps {
  id: string;
  title: string;
  // Omit when the tile sits inside a larger link; it then renders as a div and
  // still responds to the enclosing `group`'s hover and focus.
  href?: string;
  color: ColorType;
  type: "case-studies" | "work";
  format?: "png" | "webp";
  description?: string;
}

const variantsColors: Record<ColorType, string> = {
  yellow: "from-yellow-500 to-yellow-800 dark:to-yellow-300",
  pink: "from-pink-500 to-pink-800 dark:to-pink-300",
  indigo: "from-indigo-500 to-indigo-800 dark:to-indigo-300",
  amber: "from-amber-500 to-amber-800 dark:to-amber-300",
  emerald: "from-emerald-500 to-emerald-800 dark:to-emerald-300",
  red: "from-red-500 to-red-800 dark:to-red-300",
  rose: "from-rose-500 to-rose-800 dark:to-rose-300",
  blue: "from-blue-500 to-blue-800 dark:to-blue-300",
  sky: "from-sky-500 to-sky-800 dark:to-sky-300",
};

const outlineColors: Record<ColorType, string> = {
  yellow:
    "group-focus:outline-yellow-600 dark:group-focus:outline-yellow-400 group-hover:outline-yellow-600 dark:group-hover:outline-yellow-400",
  pink: "group-focus:outline-pink-600 dark:group-focus:outline-pink-400 group-hover:outline-pink-600 dark:group-hover:outline-pink-400",
  indigo:
    "group-focus:outline-indigo-600 dark:group-focus:outline-indigo-400 group-hover:outline-indigo-600 dark:group-hover:outline-indigo-400",
  amber:
    "group-focus:outline-amber-600 dark:group-focus:outline-amber-400 group-hover:outline-amber-600 dark:group-hover:outline-amber-400",
  emerald:
    "group-focus:outline-emerald-600 dark:group-focus:outline-emerald-400 group-hover:outline-emerald-600 dark:group-hover:outline-emerald-400",
  red: "group-focus:outline-red-600 dark:group-focus:outline-red-400 group-hover:outline-red-600 dark:group-hover:outline-red-400",
  rose: "group-focus:outline-rose-600 dark:group-focus:outline-rose-400 group-hover:outline-rose-600 dark:group-hover:outline-rose-400",
  blue: "group-focus:outline-blue-600 dark:group-focus:outline-blue-400 group-hover:outline-blue-600 dark:group-hover:outline-blue-400",
  sky: "group-focus:outline-sky-600 dark:group-focus:outline-sky-400 group-hover:outline-sky-600 dark:group-hover:outline-sky-400",
};

export default function Tile({
  id,
  title,
  description,
  href,
  color,
  type,
  format = "png",
}: TileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const position = useMousePosition(ref, !href);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    ref.current?.style.setProperty("--x", `${position.x.toFixed(2)}deg`);
    ref.current?.style.setProperty("--y", `${position.y.toFixed(2)}deg`);
    if (!isTouchDevice()) {
      ref.current?.style.setProperty(
        "perspective",
        `${(ref.current?.getBoundingClientRect().width ?? 300) / 7.5}px`,
      );
    }
  }, [position.x, position.y]);

  // Intersection observer for mobile
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && window.innerWidth < 640);
      },
      { threshold: 0.75 },
    );

    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const Root = href ? "a" : "div";

  return (
    <Root
      href={href}
      className={`group block space-y-4 outline-none ${inView ? "inframe" : ""}`}
    >
      <div className="relative">
        <div
          className={`aspect-[1.72/1] outline outline-2 outline-transparent group-focus:outline-none group-focus:shadow-outline outline-offset-2 ${outlineColors[color]} rounded-2xl transition-all duration-300`}
          ref={ref}
        >
          <img
            src={`/assets/${type}/${id}/screenshot.${format}`}
            className="absolute inset-0 z-10 left-4 grayscale pointer-events-none group-[.inframe]:-left-2 group-[.inframe]:grayscale-0 group-focus:-left-2 group-focus:grayscale-0 sm:group-hover:-left-2 sm:group-hover:grayscale-0 transition-all duration-500 ease-out"
            alt=""
          />
          <div className="tile-move shadow-lg rounded-lg overflow-hidden transition-transform duration-500 ease-out pointer-events-none">
            <img
              src={`/assets/${type}/${id}/tile.${format}`}
              className="max-w-full w-full grayscale sm:group-hover:grayscale-0 group-focus:grayscale-0 group-[.inframe]:grayscale-0 transition-all duration-500 ease-out rounded-2xl"
              alt=""
            />
          </div>
        </div>
        <img
          src={`/assets/${type}/${id}/icon.${format}`}
          className="w-[20%] h-auto rounded-lg shadow-xl absolute top-[50%] -left-4 pointer-events-none transform -translate-y-1/2"
          alt=""
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <h2
          className={`text-transparent bg-clip-text bg-gradient-to-bl ${variantsColors[color]} font-display text-xl whitespace-nowrap`}
        >
          {title}
        </h2>
        {description && (
          <h2 className="text-xxs text-neutral-600 dark:text-neutral-400">
            {description}
          </h2>
        )}
      </div>
    </Root>
  );
}
