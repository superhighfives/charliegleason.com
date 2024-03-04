import { image } from 'remix-utils/responses'
import type { LoaderFunctionArgs } from 'partymix'
import { json } from 'partymix'

import emojiList from '~/utils/emoji-list'
import sampleSize from 'lodash/sampleSize'

import EmojiRegex from 'emoji-regex'
import GraphemeSplitter from 'grapheme-splitter'
import * as nodeEmoji from 'node-emoji'
import { Buffer } from 'node:buffer'

type EmojiResponse = {
  error?: string
  success?: string[]
}

type ResourceResponse = {
  response: EmojiResponse
}

function fetchEmoji(emoji: string) {
  const splitter = new GraphemeSplitter()
  const emojiRegex = EmojiRegex()

  const validInput = emoji === 'random' || emoji.match(emojiRegex)
  if (!validInput) {
    return { error: 'Invalid input' }
  }

  const input: string[] =
    emoji === 'random'
      ? sampleSize(emojiList, Math.ceil(Math.random() * 3))
      : splitter.splitGraphemes(emoji)

  const output = input
    .filter((emoji) => emoji.match(emojiRegex))
    .filter((emoji) => emojiList.includes(emoji))

  return { success: output }
}

function handleResponse(response: EmojiResponse) {
  if (response.error) {
    return {
      response: { error: response.error },
    }
  }

  if (response.success) {
    if (response.success.length <= 0) {
      return {
        response: {
          error: 'Not enough emoji',
        },
      }
    }

    if (response.success.length > 3) {
      return {
        response: {
          error: 'Too many emoji',
        },
      }
    }

    return {
      response: {
        success: response.success,
      },
    }
  }
}

type GenerateStyles = {
  numImages: number
  isAnimated?: boolean
}

function generateStyles({ numImages, isAnimated = true }: GenerateStyles) {
  return `
    <style>
      ${
        isAnimated
          ? `
      image {
        animation: fade-in-and-out 0.2s steps(1, end) forwards;
      }

      @media (prefers-reduced-motion) {
        image {
          animation: none;
        }

        [class^=primary] {
          opacity: 1;
        }
      }

      @keyframes fade-in-and-out {
        0% { opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; }
      }

      @keyframes fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      ${[...Array(numImages)]
        .map(
          (_, i) => `
        .other-${i} {
          animation-delay: ${i * 0.15}s;
        }
      `
        )
        .join('')}

      [class^=primary] {
        animation: fade-in 0.2s steps(1, end) forwards;
        animation-delay: ${(numImages - 1) * 0.15}s;
      }
      `
          : ``
      }

      ${
        !isAnimated
          ? `
        [class^=primary] {
          opacity: 1;
        }
        `
          : ``
      }
    </style>
  `
}

async function generateImage({
  params,
  request,
  context,
}: LoaderFunctionArgs): Promise<any> {
  const url = new URL(request.url)
  const animated = url.searchParams.get('animated') !== 'false'
  const detailed = url.searchParams.get('detailed') !== 'false'

  const emoji = params.emoji

  const output = fetchEmoji(emoji!)

  const result: ResourceResponse = handleResponse(output)!
  const responseType = result.response.error ? 404 : 200

  if (responseType === 404) {
    return json(result.response)
  }

  const splitter = new GraphemeSplitter()
  const primary = splitter
    .splitGraphemes(result.response.success!.join(''))
    .map((emoji) => nodeEmoji.find(emoji))

  const supporting = sampleSize(emojiList, 10).map((emoji) =>
    nodeEmoji.find(emoji)
  )

  const now = new Date()
  const date = {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  }
  const size = 100

  function drawArm(progress: number, width: number) {
    const armRadians = 2 * Math.PI * progress - (2 * Math.PI) / 4
    const armLength = size / 2

    const targetX = size / 2 + Math.cos(armRadians) * (armLength - width)
    const targetY = size / 2 + Math.sin(armRadians) * (armLength - width)

    const lineX = size / 2 + Math.cos(armRadians) * (armLength - width * 2)
    const lineY = size / 2 + Math.sin(armRadians) * (armLength - width * 2)

    const center = size / 2

    return `
      <mask id="circle-${width}">
        <circle cx="${targetX}" cy="${targetY}" r="${width}"  fill="white" />
      </mask>
      <line x1="${center}" y1="${center}" x2="${lineX}" y2="${lineY}" stroke-linecap="round" stroke-width="1.5" stroke="rgba(0, 0, 0, 0.15)" />
      <circle cx="${targetX}" cy="${targetY}" r="${width}" stroke-width="3" stroke="#fff" fill="rgba(0,0,0,0.5)" mask="url(#circle-${width})" />
    `
  }

  async function fetchImageToBase64(key: string) {
    try {
      const response = await context.lobby.assets.fetch(
        `/assets/emoji/${key}.png`
      )
      if (!response) {
        throw new Error(`No emoji for ${key}`)
      }
      const arrayBuffer = Buffer.from(await response.arrayBuffer())
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      return base64
    } catch (e) {
      console.error(e)
    }
  }

  const svg = `
      ${generateStyles({
        numImages: supporting.length,
        isAnimated: animated,
      })}

      ${
        detailed
          ? `
          ${drawArm(date.hour / 12, 6)}
          ${drawArm(date.minute / 60, 4)}
          ${drawArm(date.second / 60, 3)}
      `
          : ``
      }
      
      ${
        animated
          ? `
      <g id="other">
        ${await Promise.all(
          supporting.map(async (emoji, i) => {
            return `
              <image
                opacity="0"
                class="other-${i}"
                x="${detailed ? '10' : '0'}"
                y="${detailed ? '10' : '0'}"
                width="${detailed ? '80' : '100'}"
                height="${detailed ? '80' : '100'}"
                href="data:image/png;charset=utf-8;base64,${await fetchImageToBase64(
                  emoji!.key
                )}"
              />
            `
          })
        ).then((all) => all.join(''))}
      </g>
      `
          : ``
      }
      
      ${await Promise.all(
        primary.map(async (emoji, i) => {
          return `
            <image
              opacity="0"
              class="primary-${i}"
              x="${detailed ? '5' : '0'}"
              y="${detailed ? '5' : '0'}"
              width="${detailed ? '90' : '100'}"
              height="${detailed ? '90' : '100'}"
              href="data:image/png;charset=utf-8;base64,${await fetchImageToBase64(
                emoji!.key
              )}"
              mask="url(#slice-${i})"
              />
              `
        })
      ).then((all) => all.join(''))}
      
      ${
        primary.length === 1
          ? `
          <mask id="slice-0"><rect width="100" height="100" fill="#fff" /></mask>
      `
          : ``
      }
      
      ${
        primary.length === 2
          ? `
            <mask id="slice-0"><path d="M0 100h100V0L0 100Z" fill="#fff" /></mask>
            <mask id="slice-1"><path d="M100 0H0v100L100 0Z" fill="#fff" /></mask>
      `
          : ``
      }
      
      ${
        primary.length === 3
          ? `
            <mask id="slice-0"><path d="M50 0v50L0 79V0h50Z" fill="#fff" /></mask>
            <mask id="slice-1"><path d="M50 0v50l50 29V0H50Z" fill="#fff" /></mask>
            <mask id="slice-2"><path d="M100 79v21H0V79l50-29 50 29Z" fill="#fff" /></mask>
      `
          : ``
      }
    </svg>
  `

  return svg
}

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const detailed = url.searchParams.get('detailed') !== 'false'

  const pre = `
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50%" cy="50%" r="${detailed ? '50%' : '45%'}" fill="#fbe047" />`

  let { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  writer.write(encoder.encode(pre))
  writer.write(new Uint8Array(4096).fill(32))
  ;(async () => {
    const image = await generateImage({
      context,
      params,
      request,
    })
    writer.write(encoder.encode(image))
    writer.close()
  })()
  return image(readable, {
    type: 'image/svg+xml',
  })
}
