import { type ReactNode, useEffect, useRef, useState } from "react";

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error
    navigator.msMaxTouchPoints > 0
  );
}

function useMousePosition(ref: React.RefObject<HTMLDivElement | null>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouchDevice()) return;

    const reference = ref.current;
    if (!reference) return;

    let counter = 0;
    const updateRate = 1;
    const isTimeToUpdate = () => counter++ % updateRate === 0;

    const setFromEvent = (e: MouseEvent) => {
      if (isTimeToUpdate()) {
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        const _x = reference.offsetLeft + Math.floor(reference.offsetWidth / 2);
        const _y = reference.offsetTop + Math.floor(reference.offsetHeight / 2);
        const x = (e.clientX - rect.left - _x) * -1;
        const y = (e.clientY - rect.top - _y) * -1;
        setPosition({ x, y });
      }
    };

    reference.addEventListener("mousemove", setFromEvent);
    return () => {
      reference.removeEventListener("mousemove", setFromEvent);
    };
  }, [ref]);

  return position;
}

interface ImageProps {
  src: string;
  alt: string;
  themed?: boolean;
  mobile?: boolean;
  className?: string;
  children?: ReactNode;
}

function Image({
  src,
  alt,
  themed = false,
  mobile = false,
  className = "",
  children = null,
}: ImageProps) {
  const baseImage = src;
  const darkImage = baseImage.replace(/\.(\w+)$/, "-dark.$1");
  const mobileImage = baseImage.replace(/\.(\w+)$/, "-mobile.$1");
  const mobileDarkImage = darkImage.replace(/\.(\w+)$/, "-mobile.$1");

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <picture
        className={`overflow-hidden rounded-lg inline-flex align-top ${className}`}
      >
        {mobile && themed && theme === "dark" && (
          <source media="(max-width: 799px)" srcSet={mobileDarkImage} />
        )}
        {themed && theme === "dark" && <source srcSet={darkImage} />}
        {mobile && (theme === "light" || !themed) && (
          <source media="(max-width: 799px)" srcSet={mobileImage} />
        )}
        {theme === "light" && <source srcSet={baseImage} />}
        <img src={baseImage} alt={alt} />
      </picture>
      {children}
    </>
  );
}

interface FrameProps {
  caption: string;
  zoomable?: boolean;
  forceBackground?: boolean;
  children: ReactNode;
}

function Frame({
  caption,
  zoomable = false,
  forceBackground = false,
  children,
}: FrameProps) {
  return (
    <figure className="relative text-center font-mono text-neutral-600 dark:text-neutral-400 text-xs not-prose">
      {children}
      <div
        className={`flex flex-col mx-auto justify-center items-center gap-4 px-8 ${
          forceBackground ? "mt-4 mb-8 sm:mt-8 sm:mb-16" : "mt-8"
        }`}
      >
        <figcaption className="max-w-lg leading-relaxed text-balance flex-shrink px-8">
          {caption}
        </figcaption>
        {zoomable && (
          <div className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-500 border border-yellow-500 dark:border-yellow-700 rounded-full px-2 py-1">
            <svg
              className="w-4 h-4 fill-current pointer-events-none"
              viewBox="0 0 58 58"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.66732 26.584C9.66732 17.2412 17.2412 9.66732 26.584 9.66732C35.9268 9.66732 43.5007 17.2412 43.5007 26.584C43.5007 31.1444 41.6961 35.2833 38.7621 38.3257C38.6816 38.388 38.604 38.4562 38.5301 38.5301C38.4562 38.604 38.388 38.6816 38.3257 38.7621C35.2833 41.6961 31.1444 43.5007 26.584 43.5007C17.2412 43.5007 9.66732 35.9268 9.66732 26.584ZM40.1601 43.5777C36.4392 46.5542 31.7194 48.334 26.584 48.334C14.5718 48.334 4.83398 38.5962 4.83398 26.584C4.83398 14.5718 14.5718 4.83398 26.584 4.83398C38.5962 4.83398 48.334 14.5718 48.334 26.584C48.334 31.7194 46.5542 36.4392 43.5777 40.1601L52.4603 49.0426C53.404 49.9864 53.404 51.5165 52.4603 52.4603C51.5165 53.404 49.9864 53.404 49.0426 52.4603L40.1601 43.5777ZM26.5827 16.916C27.9174 16.916 28.9993 17.998 28.9993 19.3327V24.166H33.8327C35.1674 24.166 36.2493 25.248 36.2493 26.5827C36.2493 27.9174 35.1674 28.9993 33.8327 28.9993H28.9993V33.8327C28.9993 35.1674 27.9174 36.2493 26.5827 36.2493C25.248 36.2493 24.166 35.1674 24.166 33.8327V28.9993H19.3327C17.998 28.9993 16.916 27.9174 16.916 26.5827C16.916 25.248 17.998 24.166 19.3327 24.166H24.166V19.3327C24.166 17.998 25.248 16.916 26.5827 16.916Z"
              />
            </svg>
            Zoomable<span className="hidden sm:block"> image</span>
          </div>
        )}
      </div>
    </figure>
  );
}

interface PictureZoomProps {
  src: string;
  alt: string;
  themed?: boolean;
  mobile?: boolean;
  factor?: 2 | 4;
  forceBackground?: boolean;
}

export default function PictureZoom({
  src,
  alt,
  themed = false,
  mobile = false,
  factor = 2,
  forceBackground = false,
}: PictureZoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  const position = useMousePosition(ref);
  const [ignoreZoom, setIgnoreZoom] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIgnoreZoom(isTouchDevice());
    };
    handleResize();
    window.addEventListener("resize", handleResize, false);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isTouchDevice() && ref.current?.parentElement) {
      const x =
        position.x - (factor - 2) * ((factor * -position.x) / 2 + position.x);
      const y =
        position.y - (factor - 2) * ((factor * -position.y) / 2 + position.y);
      const pointerX = (position.x - (ref.current?.clientWidth ?? 0) / 2) * -1;
      const pointerY = (position.y - (ref.current?.clientHeight ?? 0) / 2) * -1;
      ref.current.parentElement.style.setProperty("--x", `${x}px`);
      ref.current.parentElement.style.setProperty("--y", `${y}px`);
      ref.current.parentElement.style.setProperty(
        "--pointer-x",
        `${pointerX}px`,
      );
      ref.current.parentElement.style.setProperty(
        "--pointer-y",
        `${pointerY}px`,
      );
    } else {
      setIgnoreZoom(true);
    }
  }, [position.x, position.y, factor]);

  const zoom: Record<2 | 4, string> = {
    2: "scale-[2]",
    4: "scale-[4]",
  };

  const mask: Record<2 | 4, string> = {
    2: "[clip-path:circle(100px_at_var(--pointer-x)_var(--pointer-y))]",
    4: "[clip-path:circle(50px_at_var(--pointer-x)_var(--pointer-y))]",
  };

  const bgClass = forceBackground
    ? "dark:bg-black dark:shadow-[0_0_0_100px_rgba(0,0,0,1)]"
    : "dark:bg-neutral-900 dark:shadow-[0_0_0_100px_rgba(23,23,23,1)]";

  if (ignoreZoom) {
    return (
      <Frame zoomable={false} forceBackground={forceBackground} caption={alt}>
        <Image src={src} alt={alt} themed={themed} mobile={mobile} />
      </Frame>
    );
  }

  return (
    <Frame zoomable={true} forceBackground={forceBackground} caption={alt}>
      <div className="relative group cursor-crosshair z-10">
        <Image
          src={src}
          alt={alt}
          themed={themed}
          mobile={mobile}
          className={`opacity-0 group-hover:opacity-100 transition-opacity bg-white z-1 absolute top-0 left-0 right-0 translate-x-[var(--x)] translate-y-[var(--y)] pointer-events-none shadow-[0_0_0_100px_rgba(255,255,255,1)] ${bgClass} ${mask[factor]} ${zoom[factor]}`}
        >
          <div
            className={`border-4 border-neutral-300 dark:border-neutral-700 w-[400px] h-[400px] shadow-2xl absolute top-0 left-0 translate-x-[calc(var(--pointer-x)-50%)] rounded-full translate-y-[calc(var(--pointer-y)-50%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`}
          />
        </Image>
        <div ref={ref}>
          <Image src={src} alt={alt} themed={themed} mobile={mobile} />
        </div>
      </div>
    </Frame>
  );
}
