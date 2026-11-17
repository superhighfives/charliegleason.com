import type { CSSProperties } from "react";
import { LINK_BASE_CLASSES, LINK_GROUP_STATE_CLASSES } from "./link-styles";

/**
 * Shared styles for the homepage feeds (active projects, writing, records).
 */

/**
 * A feed item that links somewhere. Like the case study cards, the item has
 * no outline of its own: its title shows the hover and focus states.
 */
export const FEED_LINK_CLASS = "group flex gap-3 outline-none";

/**
 * A feed item's title, styled like the site's links. Keep it inside a block
 * (not as a flex item) so its underline follows each line when it wraps.
 */
export const FEED_TITLE_CLASS = `${LINK_BASE_CLASSES} ${LINK_GROUP_STATE_CLASSES} -ml-1 rounded-sm text-pretty`;

/** A feed item's last line (a date or a link), yellow on hover or focus */
export const FEED_META_CLASS =
  "font-mono text-[0.625rem] text-neutral-500 transition-colors group-hover:text-yellow-600 dark:group-hover:text-yellow-400 group-focus-visible:text-yellow-600 dark:group-focus-visible:text-yellow-400";

/** A feed item's thumbnail, which tilts by its `--tilt` on hover or focus */
export const FEED_IMAGE_CLASS =
  "w-12 h-12 object-cover shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:rotate-[var(--tilt)] group-focus-visible:rotate-[var(--tilt)]";

/**
 * A tilt between -3° and 3° that looks random but is always the same for a
 * given key, so the server and the browser agree on it. It's at least 1°
 * either way, so every tilt shows.
 */
export const tilt = (key: string) => {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const size = 1 + (Math.abs(hash) % 201) / 100;
  const degrees = hash & 1 ? size : -size;
  const style: CSSProperties & Record<"--tilt", string> = {
    "--tilt": `${degrees.toFixed(2)}deg`,
  };
  return style;
};
