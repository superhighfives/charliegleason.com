import type { APIRoute } from 'astro';
import emojiData from 'unicode-emoji-json';

// Allowed emoji list (matching the original site)
const emojiList = Object.keys(emojiData).filter(
  (emoji) => !emoji.includes('🏻') && !emoji.includes('🏼') && !emoji.includes('🏽') && !emoji.includes('🏾') && !emoji.includes('🏿')
).slice(0, 500); // Limit to common emoji

function isValidEmoji(emoji: string): boolean {
  // Simple emoji regex check
  const emojiRegex = /\p{Emoji}/u;
  return emojiRegex.test(emoji);
}

function parseEmoji(input: string): string[] {
  if (input === 'random') {
    // Return 1-3 random emoji
    const count = Math.ceil(Math.random() * 3);
    const shuffled = [...emojiList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  // Split graphemes (handles multi-codepoint emoji)
  const graphemes = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(input)]
    .map((s) => s.segment)
    .filter(isValidEmoji)
    .slice(0, 3);
  
  return graphemes;
}

function generateSVG(emojis: string[], animated: boolean = true): string {
  const size = 80;
  const fontSize = emojis.length === 1 ? 48 : emojis.length === 2 ? 36 : 28;
  
  // Position emoji based on count
  const positions = emojis.length === 1 
    ? [{ x: 40, y: 52 }]
    : emojis.length === 2
    ? [{ x: 28, y: 45 }, { x: 52, y: 58 }]
    : [{ x: 20, y: 40 }, { x: 50, y: 35 }, { x: 35, y: 60 }];

  const emojiElements = emojis.map((emoji, i) => {
    const pos = positions[i] || { x: 40, y: 50 };
    const animationDelay = animated ? `animation-delay: ${i * 0.1}s;` : '';
    const opacity = animated ? 'opacity: 0;' : '';
    return `<text x="${pos.x}" y="${pos.y}" font-size="${fontSize}" text-anchor="middle" style="${opacity}${animationDelay}" class="emoji">${emoji}</text>`;
  }).join('');

  const animation = animated ? `
    <style>
      .emoji {
        animation: fadeIn 0.3s ease-out forwards;
      }
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      @media (prefers-reduced-motion: reduce) {
        .emoji { animation: none; opacity: 1; }
      }
    </style>
  ` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${animation}
  <circle cx="40" cy="40" r="40" fill="#FDE047"/>
  ${emojiElements}
</svg>`;
}

export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  const animated = url.searchParams.get('animated') !== 'false';
  
  const emojiParam = params.emoji || 'random';
  const emojis = parseEmoji(emojiParam);
  
  if (emojis.length === 0) {
    // Fallback to random emoji
    const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    const svg = generateSVG([randomEmoji], animated);
    
    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
  
  const svg = generateSVG(emojis, animated);
  
  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
