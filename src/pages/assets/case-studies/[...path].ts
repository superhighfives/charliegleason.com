/**
 * Dynamic asset route for case study assets.
 * 
 * Serves assets from:
 * - public/assets/case-studies/ (public assets, served by Astro normally)
 * - packages/protected/assets/case-studies/ (protected assets, served dynamically)
 * 
 * This allows protected assets to stay in the protected package without being
 * copied to the public directory (which would be mirrored to the public repo).
 */

import type { APIRoute } from "astro";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export const GET: APIRoute = async ({ params }) => {
  const path = params.path;
  
  if (!path) {
    return new Response("Not found", { status: 404 });
  }

  // Security: prevent directory traversal
  if (path.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  // Try protected assets first (packages/protected/assets/case-studies/)
  const protectedPath = join(
    process.cwd(),
    "../../packages/protected/assets/case-studies",
    path
  );

  if (existsSync(protectedPath)) {
    try {
      const content = readFileSync(protectedPath);
      const ext = "." + path.split(".").pop()?.toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      return new Response(content, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (e) {
      // Fall through to 404
    }
  }

  // If not found in protected, let the static file handling take over
  // (this route only catches requests that don't match static files)
  return new Response("Not found", { status: 404 });
};
