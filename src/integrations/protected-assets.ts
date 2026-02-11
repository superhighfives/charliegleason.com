/**
 * Astro integration that bundles protected assets at build time
 *
 * This integration copies assets from the @charliegleason/private package
 * into the dist folder during build, so they're served by Cloudflare's
 * asset handling rather than requiring filesystem access at runtime.
 *
 * During development, it adds middleware to serve assets from the private
 * directory directly.
 *
 * In public mirror builds where the protected package isn't available,
 * it gracefully skips the copy.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

export interface ProtectedAssetsOptions {
  /**
   * Path to the protected assets directory, relative to the project root
   * @default "../private/assets"
   */
  protectedAssetsDir?: string;

  /**
   * Subdirectories to copy (e.g., ["case-studies"])
   * @default ["case-studies"]
   */
  assetPaths?: string[];
}

/**
 * Recursively copy a directory
 */
function copyDir(
  src: string,
  dest: string,
  logger: { info: (msg: string) => void },
): number {
  let count = 0;

  if (!existsSync(src)) {
    return count;
  }

  // Create destination directory if it doesn't exist
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      count += copyDir(srcPath, destPath, logger);
    } else {
      copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export default function protectedAssets(
  options: ProtectedAssetsOptions = {},
): AstroIntegration {
  const protectedAssetsDir = options.protectedAssetsDir || "../private/assets";
  const assetPaths = options.assetPaths || ["case-studies"];

  return {
    name: "protected-assets",
    hooks: {
      // Dev server middleware to serve private assets
      "astro:server:setup": ({ server, logger }) => {
        // server.config.root can be a file:// URL or a path string
        const rootDir = server.config.root.startsWith("file://")
          ? fileURLToPath(server.config.root)
          : server.config.root;
        const privateAssetsRoot = join(rootDir, protectedAssetsDir);

        if (!existsSync(privateAssetsRoot)) {
          logger.info(
            "No protected assets directory found, skipping dev middleware",
          );
          return;
        }

        server.middlewares.use((req, res, next) => {
          const url = req.url || "";

          // Check if request is for an asset in our configured paths
          for (const assetPath of assetPaths) {
            const prefix = `/assets/${assetPath}/`;
            if (url.startsWith(prefix)) {
              const relativePath = url.slice(prefix.length).split("?")[0];
              const filePath = join(privateAssetsRoot, assetPath, relativePath);

              // Security: prevent directory traversal
              if (relativePath.includes("..")) {
                return next();
              }

              if (existsSync(filePath) && statSync(filePath).isFile()) {
                const ext = `.${filePath.split(".").pop()?.toLowerCase()}`;
                const contentType =
                  MIME_TYPES[ext] || "application/octet-stream";
                const content = readFileSync(filePath);

                res.setHeader("Content-Type", contentType);
                res.setHeader("Cache-Control", "no-cache");
                res.end(content);
                return;
              }
            }
          }

          next();
        });

        logger.info("Protected assets middleware enabled for dev server");
      },

      // Build hook to copy assets to dist
      "astro:build:done": ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);
        const projectRoot = join(distDir, "..");
        const privateAssetsRoot = join(projectRoot, protectedAssetsDir);

        // Check if the protected assets directory exists
        if (!existsSync(privateAssetsRoot)) {
          logger.info(
            `No protected assets directory found at ${privateAssetsRoot}`,
          );
          logger.info(
            "This is expected in public mirror builds where @charliegleason/private is not available",
          );
          return;
        }

        let totalCopied = 0;

        for (const assetPath of assetPaths) {
          const srcDir = join(privateAssetsRoot, assetPath);
          const destDir = join(distDir, "assets", assetPath);

          if (!existsSync(srcDir)) {
            logger.info(`No assets found at ${srcDir}, skipping`);
            continue;
          }

          logger.info(`Copying protected assets from ${assetPath}...`);
          const copied = copyDir(srcDir, destDir, logger);
          totalCopied += copied;
          logger.info(`Copied ${copied} files from ${assetPath}`);
        }

        if (totalCopied > 0) {
          logger.info(
            `Total: Bundled ${totalCopied} protected asset(s) into dist`,
          );
        } else {
          logger.info("No protected assets to bundle");
        }
      },
    },
  };
}
