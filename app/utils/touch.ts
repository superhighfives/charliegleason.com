export function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - TS doesn't know about this property
    navigator.msMaxTouchPoints > 0
  )
}
