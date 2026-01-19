# @charliegleason/web

The public Astro site for [charliegleason.com](https://charliegleason.com).

This is a mirror of the main site without protected content. For the full site including protected routes, see the private monorepo.

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your AUTH_PASSWORD

# Start dev server
pnpm dev
```

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview build locally with Wrangler |
| `pnpm deploy` | Build and deploy to Cloudflare Workers |

## Environment Variables

Create a `.dev.vars` file (see `.dev.vars.example`):

```
AUTH_PASSWORD=your-secret-password
```

For production, set `AUTH_PASSWORD` as a secret in Cloudflare Workers.

## Architecture

This site uses:
- [Astro](https://astro.build/) with server-side rendering
- [Cloudflare Workers](https://workers.cloudflare.com/) for hosting
- [Cloudflare KV](https://developers.cloudflare.com/kv/) for session storage
- Password-based authentication for protected routes

### Protected Routes

The `protected-routes` integration will automatically inject routes from `packages/protected/pages/` if that package exists. In this public mirror, no protected routes are available.

To add protected content, use the private monorepo which includes the `@charliegleason/protected` package.

## Tech Stack

- Astro 5.x
- Cloudflare Workers
- TypeScript
- pnpm

