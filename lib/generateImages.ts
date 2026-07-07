import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import type { Canvas } from "canvas";
import type { Glyph } from "fontkit";

const require = createRequire(import.meta.url);
// biome-ignore lint/suspicious/noExplicitAny: fontkit has no ESM export
const fontkit: any = require("fontkit");

import { createCanvas, Image } from "canvas";
// @ts-expect-error node-emoji v1 has no type declarations
import nodeEmoji from "node-emoji";
import sharp from "sharp";

interface ExtendedGlyph extends Glyph {
  getImageForSize: (size: number) => { data: Buffer };
  data: Buffer;
}

const VARIATION_SELECTOR = /️/g;

// Render the full node-emoji set so /api/emoji works for any emoji, not just the
// handful used on the site. Build the emoji -> key map (consumed at runtime by
// src/pages/api/emoji/[...emoji].ts) from node-emoji's key -> char table,
// recording both the raw glyph and a variation-selector-stripped form so runtime
// lookups hit whether or not the input carries U+FE0F. When several keys share a
// glyph (aliases) the first key wins for the map; every key still gets a PNG.
const nodeEmojiTable = nodeEmoji.emoji as Record<string, string>;
const emojiToKey: Record<string, string> = {};
const toRender: { id: string; emoji: string }[] = [];
for (const [key, char] of Object.entries(nodeEmojiTable)) {
  if (!(char in emojiToKey)) emojiToKey[char] = key;
  const stripped = char.replace(VARIATION_SELECTOR, "");
  if (stripped && stripped !== char && !(stripped in emojiToKey)) {
    emojiToKey[stripped] = key;
  }
  toRender.push({ id: key, emoji: char });
}

writeFileSync(
  "src/data/emoji-map.json",
  `${JSON.stringify(emojiToKey, null, 2)}\n`,
);
console.log(
  `Wrote ${Object.keys(emojiToKey).length} emoji mappings for ${toRender.length} glyphs`,
);

const font = fontkit.openSync(
  "/System/Library/Fonts/Apple Color Emoji.ttc",
  "AppleColorEmoji",
);

if (!font) {
  console.error("Font not found");
} else {
  const canvasSize = 160;
  const imagePadding = 0;

  function renderEmoji(id: string, emoji: string): Promise<void> {
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext("2d");

    const run = font.layout(emoji);
    const glyph = (run.glyphs[0] as ExtendedGlyph).getImageForSize(
      canvasSize,
    ) as { data: Buffer };

    if (!glyph?.data) {
      console.log(`Skipping ${id}: ${emoji}`);
      return Promise.resolve();
    }

    return new Promise<Canvas>((resolve) => {
      const emojiImg = new Image();

      emojiImg.onload = () => {
        const tempCanvas = createCanvas(canvasSize, canvasSize);
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(emojiImg, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, canvasSize, canvasSize);

        // Monochrome
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i] =
            imageData.data[i + 1] =
            imageData.data[i + 2] =
              parseInt(
                (0.2125 * imageData.data[i] +
                  0.7154 * imageData.data[i + 1] +
                  0.0721 * imageData.data[i + 2]) as unknown as string,
                10,
              );
        }

        // Contrast
        const contrast = 50 / 100 + 1; // convert to decimal & shift range: [0..2]
        const intercept = 128 * (1 - contrast);
        for (let i = 0; i < imageData.data.length; i += 4) {
          //r,g,b,a
          imageData.data[i] = imageData.data[i] * contrast + intercept;
          imageData.data[i + 1] = imageData.data[i + 1] * contrast + intercept;
          imageData.data[i + 2] = imageData.data[i + 2] * contrast + intercept;
        }

        tempCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(
          tempCanvas,
          imagePadding / 2,
          imagePadding / 2,
          canvasSize - imagePadding,
          canvasSize - imagePadding,
        );
        return resolve(canvas);
      };

      emojiImg.src = glyph.data;
    }).then(async (rendered: Canvas) => {
      console.log(`✅ Generated ${id}: ${emoji}`);
      const buffer = rendered.toBuffer();
      const image = sharp(buffer).png({ quality: 75 });
      await image.toFile(`public/assets/emoji/${id}.png`);
    });
  }

  for (const { id, emoji } of toRender) {
    try {
      await renderEmoji(id, emoji);
    } catch (error) {
      console.warn(`⚠️  Failed to render ${id} (${emoji}):`, error);
    }
  }
}
