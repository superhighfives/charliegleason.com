import type { APIRoute } from "astro";
import { Effect } from "effect";
import { FetchError, HttpError } from "../../../lib/errors";

// Emoji to key name mapping (matching the PNG filenames in /assets/emoji/)
const emojiToKey: Record<string, string> = {
  "💯": "100",
  "⚓": "anchor",
  "🎨": "art",
  "🎈": "balloon",
  "🍌": "banana",
  "🏖️": "beach_with_umbrella",
  "🍻": "beers",
  "😊": "blush",
  "⛵": "boat",
  "📚": "books",
  "💡": "bulb",
  "🤙": "call_me_hand",
  "📷": "camera",
  "🎠": "carousel_horse",
  "🌸": "cherry_blossom",
  "🍫": "chocolate_bar",
  "🎪": "circus_tent",
  "☕": "coffee",
  "💻": "computer",
  "🎊": "confetti_ball",
  "👑": "crown",
  "💃": "dancer",
  "😵": "dizzy_face",
  "💫": "dizzy",
  "🌏": "earth_asia",
  "🍆": "eggplant",
  "🍂": "fallen_leaf",
  "🎡": "ferris_wheel",
  "🔥": "fire",
  "😳": "flushed",
  "🍟": "fries",
  "💝": "gift_heart",
  "🎸": "guitar",
  "🍔": "hamburger",
  "💩": "hankey",
  "🎧": "headphones",
  "🙉": "hear_no_evil",
  "🚁": "helicopter",
  "🌶️": "hot_pepper",
  "🌶": "hot_pepper",
  "🏡": "house_with_garden",
  "🏠": "house",
  "🏯": "japanese_castle",
  "😂": "joy",
  "💋": "kiss",
  "🍭": "lollipop",
  "🔍": "mag",
  "🪄": "magic_wand",
  "🎤": "microphone",
  "🐒": "monkey",
  "🕌": "mosque",
  "💪": "muscle",
  "🎹": "musical_keyboard",
  "🎵": "musical_note",
  "📔": "notebook_with_decorative_cover",
  "🎶": "notes",
  "🌊": "ocean",
  "🦉": "owl",
  "🎭": "performing_arts",
  "🐖": "pig2",
  "🙌": "raised_hands",
  "🐀": "rat",
  "💞": "revolving_hearts",
  "🚀": "rocket",
  "🎢": "roller_coaster",
  "🏉": "rugby_football",
  "🎒": "school_satchel",
  "🙈": "see_no_evil",
  "🌱": "seedling",
  "💀": "skull",
  "✨": "sparkles",
  "💖": "sparkling_heart",
  "🙊": "speak_no_evil",
  "🦑": "squid",
  "⭐": "star",
  "🌟": "star2",
  "🚂": "steam_locomotive",
  "🍓": "strawberry",
  "🎉": "tada",
  "🗼": "tokyo_tower",
  "🎩": "tophat",
  "⛱️": "umbrella_on_ground",
  "📼": "vhs",
  "🎮": "video_game",
  "🍉": "watermelon",
  "🗺️": "world_map",
};

// List of available emoji keys for random selection
const emojiList = Object.keys(emojiToKey);

function sampleSize<T>(array: T[], n: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function parseEmoji(input: string): string[] {
  if (input === "random") {
    const count = Math.ceil(Math.random() * 3);
    return sampleSize(emojiList, count);
  }

  // Split graphemes (handles multi-codepoint emoji)
  const graphemes = [
    ...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(input),
  ]
    .map((s) => s.segment)
    .filter((emoji) => emojiToKey[emoji])
    .slice(0, 3);

  return graphemes;
}

function getEmojiKey(emoji: string): string | undefined {
  return emojiToKey[emoji];
}

function fetchImageToBase64(
  key: string,
  baseUrl: string,
): Effect.Effect<string, FetchError | HttpError> {
  const url = `${baseUrl}/assets/emoji/${key}.png`;
  return Effect.tryPromise({
    try: () => fetch(url),
    catch: (error) =>
      new FetchError({ url, message: `Failed to fetch ${url}`, cause: error }),
  }).pipe(
    Effect.flatMap(
      (response): Effect.Effect<ArrayBuffer, FetchError | HttpError> => {
        if (!response.ok) {
          return Effect.fail(
            new HttpError({ statusCode: response.status, url }),
          );
        }
        return Effect.tryPromise({
          try: () => response.arrayBuffer(),
          catch: (error) =>
            new FetchError({
              url,
              message: `Failed to read response body for ${url}`,
              cause: error,
            }),
        });
      },
    ),
    Effect.map((arrayBuffer) => {
      return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }),
  );
}

function fetchImageToBase64Safe(
  key: string,
  baseUrl: string,
): Effect.Effect<string | null, never> {
  return fetchImageToBase64(key, baseUrl).pipe(
    Effect.catchAll(() => {
      return Effect.logDebug(`Failed to fetch emoji image: ${key}`).pipe(
        Effect.as(null),
      );
    }),
  );
}

function generateReducedMotionStyles(isAnimated: boolean): string {
  if (!isAnimated) {
    return `
      <style>
        [class^=primary] {
          opacity: 1;
        }
      </style>
    `;
  }

  return `
    <style>
      @media (prefers-reduced-motion) {
        image animate {
          display: none;
        }
        [class^=primary] {
          opacity: 1;
        }
      }
    </style>
  `;
}

function generateSupportingAnimation(index: number): string {
  const delay = index * 0.15;
  return `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="0.2s" begin="${delay}s" fill="freeze" calcMode="discrete" />`;
}

function generatePrimaryAnimation(numSupportingImages: number): string {
  const delay = numSupportingImages * 0.15;
  return `<set attributeName="opacity" to="1" begin="${delay}s" fill="freeze" />`;
}

export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  const animated = url.searchParams.get("animated") !== "false";
  const detailed = url.searchParams.get("detailed") !== "false";

  const emojiParam = params.emoji || "random";
  const emojis = parseEmoji(emojiParam);

  // Fallback to random if no valid emoji found
  const finalEmojis =
    emojis.length > 0
      ? emojis
      : sampleSize(emojiList, Math.ceil(Math.random() * 3));

  // Get keys for primary emoji
  const primaryKeys = finalEmojis.map(getEmojiKey).filter(Boolean) as string[];

  // Get random supporting emoji for animation
  const supportingKeys = sampleSize(
    Object.values(emojiToKey).filter((k) => !primaryKeys.includes(k)),
    10,
  );

  const baseUrl = `${url.protocol}//${url.host}`;
  const size = 100;

  // Clock hands for detailed mode
  const now = new Date();
  const date = {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };

  function drawArm(progress: number, width: number): string {
    const armRadians = 2 * Math.PI * progress - (2 * Math.PI) / 4;
    const armLength = size / 2;

    const targetX = size / 2 + Math.cos(armRadians) * (armLength - width);
    const targetY = size / 2 + Math.sin(armRadians) * (armLength - width);

    const lineX = size / 2 + Math.cos(armRadians) * (armLength - width * 2);
    const lineY = size / 2 + Math.sin(armRadians) * (armLength - width * 2);

    const center = size / 2;

    return `
      <mask id="circle-${width}">
        <circle cx="${targetX}" cy="${targetY}" r="${width}" fill="white" />
      </mask>
      <line x1="${center}" y1="${center}" x2="${lineX}" y2="${lineY}" stroke-linecap="round" stroke-width="1.5" stroke="rgba(0, 0, 0, 0.15)" />
      <circle cx="${targetX}" cy="${targetY}" r="${width}" stroke-width="3" stroke="#fff" fill="rgba(0,0,0,0.5)" mask="url(#circle-${width})" />
    `;
  }

  // Fetch all images using Effect
  const fetchAllImages = Effect.all(
    primaryKeys.map((key) => fetchImageToBase64Safe(key, baseUrl)),
    { concurrency: "unbounded" },
  );

  const fetchSupportingImages = animated
    ? Effect.all(
        supportingKeys.map((key) => fetchImageToBase64Safe(key, baseUrl)),
        { concurrency: "unbounded" },
      )
    : Effect.succeed([] as (string | null)[]);

  const [primaryImages, supportingImages] = await Effect.runPromise(
    Effect.all([fetchAllImages, fetchSupportingImages]),
  );

  // Build mask definitions for slicing primary emoji
  let maskDefs = "";
  if (primaryKeys.length === 1) {
    maskDefs = `<mask id="slice-0"><rect width="100" height="100" fill="#fff" /></mask>`;
  } else if (primaryKeys.length === 2) {
    maskDefs = `
      <mask id="slice-0"><path d="M0 100h100V0L0 100Z" fill="#fff" /></mask>
      <mask id="slice-1"><path d="M100 0H0v100L100 0Z" fill="#fff" /></mask>
    `;
  } else if (primaryKeys.length === 3) {
    maskDefs = `
      <mask id="slice-0"><path d="M50 0v50L0 79V0h50Z" fill="#fff" /></mask>
      <mask id="slice-1"><path d="M50 0v50l50 29V0H50Z" fill="#fff" /></mask>
      <mask id="slice-2"><path d="M100 79v21H0V79l50-29 50 29Z" fill="#fff" /></mask>
    `;
  }

  // Generate SVG
  const svgParts: string[] = [
    `<svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">`,
    ...(maskDefs ? [`<defs>${maskDefs}</defs>`] : []),
    `<circle cx="50%" cy="50%" r="${detailed ? "50%" : "45%"}" fill="#fbe047" />`,
    generateReducedMotionStyles(animated),
  ];

  // Clock hands (detailed mode)
  if (detailed) {
    svgParts.push(drawArm(date.hour / 12, 6));
    svgParts.push(drawArm(date.minute / 60, 4));
    svgParts.push(drawArm(date.second / 60, 3));
  }

  // Supporting emoji animation
  if (animated && supportingImages.length > 0) {
    svgParts.push('<g id="other">');
    supportingImages.forEach((base64, i) => {
      if (base64) {
        svgParts.push(`
          <image
            opacity="0"
            x="${detailed ? "10" : "0"}"
            y="${detailed ? "10" : "0"}"
            width="${detailed ? "80" : "100"}"
            height="${detailed ? "80" : "100"}"
            href="data:image/png;charset=utf-8;base64,${base64}"
          >${generateSupportingAnimation(i)}</image>
        `);
      }
    });
    svgParts.push("</g>");
  }

  // Primary emoji
  primaryImages.forEach((base64, i) => {
    if (base64) {
      const animTag = animated
        ? generatePrimaryAnimation(supportingImages.length)
        : "";
      svgParts.push(`
        <image
          opacity="${animated ? "0" : "1"}"
          class="primary-${i}"
          x="${detailed ? "5" : "0"}"
          y="${detailed ? "5" : "0"}"
          width="${detailed ? "90" : "100"}"
          height="${detailed ? "90" : "100"}"
          href="data:image/png;charset=utf-8;base64,${base64}"
          mask="url(#slice-${i})"
        >${animTag}</image>
      `);
    }
  });

  svgParts.push("</svg>");

  const svg = svgParts.join("\n");

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-cache", // Don't cache since it has time-based elements
    },
  });
};
