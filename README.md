<img src="https://charliegleason.com/api/emoji/😊" alt="Blushing face emoji" width="64" height="64" />

# Charlie Gleason (dot com)

This repo houses the [charliegleason.com](https://charliegleason.com/) app, built to work On The Edge, with Cloudflare Workers. It was made using [Astro](https://astro.build/).

> **Note:** This is a public mirror of `apps/web/` from a private monorepo. It's automatically synced on every push to main. The full monorepo also includes [visitor-counter](https://github.com/superhighfives/visitor-counter) and [lastfm-tracker](https://github.com/superhighfives/lastfm-tracker) Durable Objects that power some of the site's real-time features.

- Learn more about [Astro via their Docs](https://docs.astro.build/)
- Learn more about [Cloudflare Workers](https://workers.cloudflare.com/)

## Development

To get up and running, fork the repo and install the dependencies:

```sh
$ gh repo fork superhighfives/charliegleason.com
$ cd charliegleason.com
$ pnpm install
```

Copy and fill in the required environment variables:

```sh
$ cp .dev.vars.example .dev.vars
```

Also, if you make any changes to the emoji images, or add new ones to the [emoji-list.ts](https://github.com/superhighfives/charliegleason.com/blob/main/lib/emoji-list.ts) file, you'll need to re-generate images:

```sh
$ pnpm generate:images
```

You may also need to install the [dependencies for canvas](https://github.com/Automattic/node-canvas#installation) with homebrew:

```sh
$ brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

This set up uses Wrangler for local development, to emulate the Cloudflare runtime. To get started, run `pnpm dev`:

```sh
# start the astro dev server
$ pnpm dev
```

Open up [http://localhost:4321](http://localhost:4321), then celebrate.

## Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview build locally with Wrangler |
| `pnpm deploy` | Build and deploy to Cloudflare Workers |
| `pnpm generate:images` | Regenerate emoji images |

## Deployment

This app deploys to Cloudflare Workers.

If you don't already have an account, you can [create a Cloudflare account here](https://dash.cloudflare.com/sign-up). After verifying your email address with Cloudflare, go to your shiny new dashboard and follow the [Cloudflare Workers deployment guide](https://developers.cloudflare.com/workers/).

You'll also need to set up some environment variables in Cloudflare (handled locally with the `.dev.vars` file). You can learn more about that in the [Cloudflare docs](https://developers.cloudflare.com/workers/configuration/secrets/).

For production, set `AUTH_PASSWORD` as a secret in Cloudflare Workers:

```sh
$ pnpm wrangler secret put AUTH_PASSWORD
```

## Interesting Bits

Probably the most unique thing about the project is the automagic emoji generator, which is housed in the [api/emoji/[...emoji].ts](https://github.com/superhighfives/charliegleason.com/blob/main/src/pages/api/emoji/%5B...emoji%5D.ts) file.

It generates an animated SVG, with base64 encoded raster images, on the fly. It has a couple of options available as part of the API, too. You can add the following url params:

| Title | Value | Default | Description |
|-------|-------|---------|-------------|
| `animated` | boolean | true | Describes whether the SVG animates through a collection of images before landing on the final one |
| `detailed` | boolean | true | Describes whether the SVG includes the time it was generated (as a 12 hour clock) around the outside edge |

You can also pass up to three emoji to the API url to see the generation in real time (the emoji need to be in the [emoji-list.ts](https://github.com/superhighfives/charliegleason.com/blob/main/lib/emoji-list.ts) file, or used on the site).

Examples:
- https://charliegleason.com/api/emoji/💃🐒
- https://charliegleason.com/api/emoji/💃🐒?animated=false
- https://charliegleason.com/api/emoji/💃🐒?animated=false&detailed=false

## Tech Stack

- [Astro](https://astro.build/) - Static site generator with SSR
- [Effect](https://effect.website/) - Typed functional effects for error handling
- [React](https://react.dev/) - UI components (islands)
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge runtime
- [Cloudflare KV](https://developers.cloudflare.com/kv/) - Session storage
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) - Stateful edge compute
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [pnpm](https://pnpm.io/) - Package manager

## Thanks

- [Matt Stobbs](https://twitter.com/matt_stobbs) and his [Complete Guide to Dark Mode with Remix](https://www.mattstobbs.com/remix-dark-mode/) (the original site was built with Remix)
- [Glen Maddern](https://twitter.com/glenmaddern) for the Remix and Cloudflare help
