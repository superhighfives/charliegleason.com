# Authentication Implementation Plan

**Status: IMPLEMENTED**

## Overview

This document outlines the implementation of secure public/private routes in Astro, replicating the functionality from the existing Remix-based charliegleason.com site.

### Goals

- Password-protected routes (e.g., `/work/ax-publishing`)
- Public routes without authentication (e.g., `/work/lysterfield-lake`)
- Session-based authentication with "logged in as guest" footer notice
- Open-source main site with private content in a separate location
- Cloudflare Workers/KV for hosting and session storage

---

## Architecture

**Private Monorepo + Public Mirror** approach:

- Main Astro site code lives in `apps/web/` and is mirrored to a public repo
- Protected content lives in `packages/protected/` and is NOT mirrored
- Session data stored in Cloudflare KV
- Astro integration injects protected routes at build time

---

## Directory Structure

```
charliegleason.com/                    (PRIVATE monorepo)
│
├── apps/
│   └── web/                           ← MIRRORED to public repo
│       ���── src/
│       │   ├── pages/
│       │   │   ├── index.astro
│       │   │   ├── login.astro
│       │   │   ├── logout.astro
│       │   │   └── work/
│       │   │       └── lysterfield-lake.astro
│       │   ├── middleware.ts
│       │   ├── lib/
│       │   │   ├── auth.ts
│       │   │   └── kv-session.ts
│       │   ├── components/
│       │   │   └── GuestFooter.astro
│       │   └── integrations/
│       │       └── protected-routes.ts
│       ├── astro.config.mjs
│       ├── wrangler.jsonc
│       └── package.json
│
├── packages/
│   └── protected/                     ← NOT mirrored (private content)
│       ├── pages/
│       │   └── work/
│       │       └── ax-publishing.astro
│       ├── assets/
│       └── config.ts
│
├── .github/workflows/
│   └── mirror.yml
│
├── pnpm-workspace.yaml
└── package.json
```

---

## Implementation Details

### 1. Session Management with Cloudflare KV

**`apps/web/src/lib/kv-session.ts`**

```ts
interface Session {
  userId: string;
  createdAt: number;
  expiresAt: number;
}

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(kv: KVNamespace, userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const session: Session = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  };
  
  await kv.put(`session:${sessionId}`, JSON.stringify(session), {
    expirationTtl: SESSION_DURATION / 1000, // KV uses seconds
  });
  
  return sessionId;
}

export async function getSession(kv: KVNamespace, sessionId: string): Promise<Session | null> {
  const data = await kv.get(`session:${sessionId}`);
  if (!data) return null;
  
  const session: Session = JSON.parse(data);
  if (Date.now() > session.expiresAt) {
    await kv.delete(`session:${sessionId}`);
    return null;
  }
  
  return session;
}

export async function deleteSession(kv: KVNamespace, sessionId: string): Promise<void> {
  await kv.delete(`session:${sessionId}`);
}
```

**`apps/web/src/lib/auth.ts`**

```ts
import { createSession, getSession, deleteSession } from './kv-session';

const COOKIE_NAME = 'charlie_session';

function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

export async function getUserFromRequest(request: Request, env: Env) {
  const cookie = request.headers.get('Cookie');
  const sessionId = parseCookie(cookie, COOKIE_NAME);
  
  if (!sessionId) return null;
  
  const session = await getSession(env.SESSION, sessionId);
  return session ? { id: session.userId } : null;
}

export async function login(env: Env, password: string, redirectTo: string) {
  if (password !== env.AUTH_PASSWORD) {
    return { success: false, error: 'Invalid password' };
  }
  
  const sessionId = await createSession(env.SESSION, 'guest');
  
  return {
    success: true,
    headers: {
      'Set-Cookie': `${COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    },
    redirectTo,
  };
}

export async function logout(request: Request, env: Env) {
  const cookie = request.headers.get('Cookie');
  const sessionId = parseCookie(cookie, COOKIE_NAME);
  
  if (sessionId) {
    await deleteSession(env.SESSION, sessionId);
  }
  
  return {
    headers: {
      'Set-Cookie': `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  };
}
```

---

### 2. Astro Integration for Protected Routes

**`apps/web/src/integrations/protected-routes.ts`**

```ts
import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, statSync } from 'fs';

interface ProtectedRoutesOptions {
  protectedDir?: string;
}

export default function protectedRoutes(options: ProtectedRoutesOptions = {}): AstroIntegration {
  const protectedDir = options.protectedDir || '../../packages/protected/pages';
  
  return {
    name: 'protected-routes',
    hooks: {
      'astro:config:setup': ({ injectRoute, config }) => {
        const baseDir = dirname(fileURLToPath(config.root));
        const pagesDir = join(baseDir, protectedDir);
        
        try {
          const routes = findAstroFiles(pagesDir, pagesDir);
          
          for (const route of routes) {
            injectRoute({
              pattern: route.pattern,
              entrypoint: route.entrypoint,
            });
          }
          
          console.log(`[protected-routes] Injected ${routes.length} protected routes`);
        } catch (error) {
          console.log('[protected-routes] No protected pages found (expected in public builds)');
        }
      },
    },
  };
}

function findAstroFiles(dir: string, baseDir: string): Array<{ pattern: string; entrypoint: string }> {
  const routes: Array<{ pattern: string; entrypoint: string }> = [];
  
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      routes.push(...findAstroFiles(fullPath, baseDir));
    } else if (entry.endsWith('.astro')) {
      const relativePath = fullPath.replace(baseDir, '').replace(/\.astro$/, '');
      const pattern = relativePath.replace(/\\/g, '/');
      
      routes.push({
        pattern,
        entrypoint: fullPath,
      });
    }
  }
  
  return routes;
}
```

---

### 3. Middleware

**`apps/web/src/middleware.ts`**

```ts
import { defineMiddleware } from 'astro:middleware';
import { getUserFromRequest } from './lib/auth';

let protectedRoutes: string[] = [];
try {
  const config = await import('../../packages/protected/config');
  protectedRoutes = config.protectedRoutes;
} catch {
  protectedRoutes = [];
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, redirect, locals } = context;
  const url = new URL(request.url);
  
  const user = await getUserFromRequest(request, locals.runtime.env);
  locals.user = user;
  
  const isProtected = protectedRoutes.some(route => 
    url.pathname === route || url.pathname.startsWith(route + '/')
  );
  
  if (isProtected && !user) {
    const loginUrl = `/login?redirectTo=${encodeURIComponent(url.pathname)}`;
    return redirect(loginUrl);
  }
  
  return next();
});
```

---

### 4. Login Page

**`apps/web/src/pages/login.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import { login } from '../lib/auth';

const user = Astro.locals.user;
if (user) {
  return Astro.redirect('/');
}

let error = '';
const url = new URL(Astro.request.url);
const redirectTo = url.searchParams.get('redirectTo') || '/';

if (Astro.request.method === 'POST') {
  const formData = await Astro.request.formData();
  const password = formData.get('password') as string;
  const redirect = formData.get('redirectTo') as string || '/';
  
  const result = await login(Astro.locals.runtime.env, password, redirect);
  
  if (result.success) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: result.redirectTo,
        ...result.headers,
      },
    });
  } else {
    error = result.error;
  }
}
---

<Layout title="Login">
  <main>
    <h1>This is a protected area</h1>
    <p>To abide by IP policies, this content is <strong>password protected</strong>.</p>
    
    <form method="POST">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label for="password">Password</label>
      <input type="password" name="password" id="password" required />
      <button type="submit">Login</button>
      {error && <p class="error">{error}</p>}
    </form>
  </main>
</Layout>
```

---

### 5. Logout Page

**`apps/web/src/pages/logout.astro`**

```astro
---
import { logout } from '../lib/auth';

const result = await logout(Astro.request, Astro.locals.runtime.env);

return new Response(null, {
  status: 302,
  headers: {
    Location: '/',
    ...result.headers,
  },
});
---
```

---

### 6. Guest Footer Component

**`apps/web/src/components/GuestFooter.astro`**

```astro
---
const user = Astro.locals.user;
---

{user?.id === 'guest' && (
  <p class="guest-notice">
    You are currently logged in as a guest. 
    <a href="/logout">Logout</a>
  </p>
)}
```

---

### 7. TypeScript Types

**`apps/web/src/env.d.ts`**

```ts
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  SESSION: KVNamespace;
  AUTH_PASSWORD: string;
}

declare namespace App {
  interface Locals extends Runtime {
    user: { id: string } | null;
  }
}
```

---

### 8. Protected Routes Config

**`packages/protected/config.ts`**

```ts
export const protectedRoutes = [
  '/work/ax-publishing',
];

export default protectedRoutes;
```

---

### 9. GitHub Actions Mirror Workflow

**`.github/workflows/mirror.yml`**

```yaml
name: Mirror to Public Repo

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'

jobs:
  mirror:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Push to public repo
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git remote add public https://x-access-token:${{ secrets.PUBLIC_REPO_TOKEN }}@github.com/superhighfives/astro.charliegleason.com.git
          git subtree push --prefix=apps/web public main
```

---

### 10. Astro Config

**`apps/web/astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import protectedRoutes from './src/integrations/protected-routes';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'cloudflare',
  }),
  integrations: [
    protectedRoutes({
      protectedDir: '../../packages/protected/pages',
    }),
  ],
});
```

---

## Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         REQUEST                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MIDDLEWARE                                 │
│  1. Parse session cookie                                         │
│  2. Fetch session from KV                                        │
│  3. Set Astro.locals.user                                        │
│  4. Check if route is protected                                  │
│  5. If protected && !user → redirect /login?redirectTo=...       │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────┐           ┌─────────────────────┐
│    PUBLIC PAGE      │           │   PROTECTED PAGE    │
│                     │           │   (injected from    │
│  Can access user    │           │    packages/        │
│  via Astro.locals   │           │    protected/)      │
└─────────────────────┘           └─────────────────────┘
```

---

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `AUTH_PASSWORD` | Cloudflare secret | Password for guest login |
| `PUBLIC_REPO_TOKEN` | GitHub secret | PAT for mirror workflow |

---

## Implementation Tasks

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Set up monorepo structure | High | Done |
| 2 | Create KV session management | High | Done |
| 3 | Build protected routes integration | High | Done |
| 4 | Implement auth middleware | High | Done |
| 5 | Create login page | High | Done |
| 6 | Create logout page | High | Done |
| 7 | Create GuestFooter component | Medium | Done |
| 8 | Set up packages/protected | High | Done |
| 9 | Add TypeScript types | Medium | Done |
| 10 | Create GitHub Actions mirror | Medium | Done |
| 11 | Configure Cloudflare secrets | Medium | Done |
| 12 | Test full auth flow | High | Done |

---

## Comparison with Existing Remix Site

| Aspect | Remix (current) | Astro (planned) |
|--------|-----------------|-----------------|
| Session storage | Signed cookie | Cloudflare KV |
| Session data | In cookie | In KV (cookie has ID only) |
| Route protection | `requireUserId()` in loader | Middleware + config array |
| Protected content | Synced via `sync-directory` | Injected via Astro integration |
| Repo structure | npm dependency | Monorepo with git subtree mirror |

---

## References

- Existing Remix implementation: `charliegleason.com/app/session.server.ts`
- Existing protected content: `auth.charliegleason.com/routes/`
- Astro middleware docs: https://docs.astro.build/en/guides/middleware/
- Astro integrations API: https://docs.astro.build/en/reference/integrations-reference/
- Cloudflare KV docs: https://developers.cloudflare.com/kv/
