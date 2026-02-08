export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - TS doesn't know about this property
    navigator.msMaxTouchPoints > 0
  );
}
