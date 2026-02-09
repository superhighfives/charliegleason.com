import { createRequire } from "node:module";
import type { Canvas } from "canvas";
import type { Glyph } from "fontkit";

const require = createRequire(import.meta.url);
const fontkit = require("fontkit");

import { createCanvas, Image } from "canvas";
import nodeEmoji from "node-emoji";
import sharp from "sharp";
import requiredEmoji from "./emoji-list.js";

const font = fontkit.openSync(
  "/System/Library/Fonts/Apple Color Emoji.ttc",
  "AppleColorEmoji",
  // biome-ignore lint/suspicious/noExplicitAny: fontkit loaded via createRequire has no proper types
) as any;

interface ExtendedGlyph extends Glyph {
  getImageForSize: (size: number) => { data: Buffer };
  data: Buffer;
}

if (font) {
  const canvasSize = 160;
  const imagePadding = 0;

  // biome-ignore lint/suspicious/noExplicitAny: node-emoji v1 types are loosely typed
  const allEmoji: any = Object.fromEntries(
    Object.entries(nodeEmoji.emoji).filter(([_key, emoji]) =>
      requiredEmoji.includes(emoji as string),
    ),
  );

  Object.keys(allEmoji).forEach((id: string) => {
    const emoji: string = allEmoji[id];

    console.log(`Generating ${id}: ${emoji}`);

    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext("2d");

    console.log(font.layout);
    const run = font.layout(emoji);
    const glyph = (run.glyphs[0] as ExtendedGlyph).getImageForSize(
      canvasSize,
    ) as { data: Buffer };

    if (glyph?.data) {
      new Promise<Canvas>((resolve) => {
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
            imageData.data[i + 1] =
              imageData.data[i + 1] * contrast + intercept;
            imageData.data[i + 2] =
              imageData.data[i + 2] * contrast + intercept;
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
      }).then(async (canvas: Canvas) => {
        console.log(`✅ Generated ${id}: ${emoji}`);
        const buffer = canvas.toBuffer();
        const image = await sharp(buffer).png({ quality: 75 });
        await image.toFile(`public/assets/emoji/${id}.png`);
      });
    } else {
      console.log(`Skipping ${id}: ${emoji}`);
    }
  });
} else {
  console.error("Font not found");
}
