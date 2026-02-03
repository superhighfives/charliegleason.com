/**
 * Astro integration that injects protected routes from the @charliegleason/private package
 * 
 * This integration scans the protected pages directory and uses Astro's injectRoute API
 * to add them to the build. In public mirror builds where the protected package isn't
 * available, it gracefully skips route injection.
 */

import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { readdirSync, statSync, existsSync } from "node:fs";

export interface ProtectedRoutesOptions {
  /**
   * Path to the protected content directory, relative to the project root
   * @default "../private/content"
   */
  protectedDir?: string;
}

interface RouteInfo {
  pattern: string;
  entrypoint: string;
}

/**
 * Recursively find all .astro files in a directory
 */
function findAstroFiles(dir: string, baseDir: string): RouteInfo[] {
  const routes: RouteInfo[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        routes.push(...findAstroFiles(fullPath, baseDir));
      } else if (entry.endsWith(".astro")) {
        // Convert file path to route pattern
        // e.g., work/ax-publishing.astro → /work/ax-publishing
        const relativePath = relative(baseDir, fullPath);
        const pattern =
          "/" +
          relativePath
            .replace(/\.astro$/, "")
            .replace(/\\/g, "/") // Windows path compatibility
            .replace(/index$/, ""); // Handle index routes

        routes.push({
          pattern: pattern.endsWith("/") && pattern !== "/"
            ? pattern.slice(0, -1)
            : pattern,
          entrypoint: fullPath,
        });
      }
    }
  } catch (error) {
    // Directory doesn't exist or isn't readable
    return [];
  }

  return routes;
}

export default function protectedRoutes(
  options: ProtectedRoutesOptions = {}
): AstroIntegration {
  return {
    name: "protected-routes",
    hooks: {
      "astro:config:setup": ({ injectRoute, config, logger }) => {
        // Resolve the protected content directory
        const rootDir = fileURLToPath(config.root);
        const protectedDir = options.protectedDir || "../private/content";
        const contentDir = join(rootDir, protectedDir);

        // Check if the protected package exists
        if (!existsSync(contentDir)) {
          logger.info(
            "No protected content directory found at " + contentDir
          );
          logger.info(
            "This is expected in public mirror builds where @charliegleason/private is not available"
          );
          return;
        }

        // Find all .astro files in the protected content directory
        const routes = findAstroFiles(contentDir, contentDir);

        if (routes.length === 0) {
          logger.info("No protected content found");
          return;
        }

        // Inject each route
        for (const route of routes) {
          logger.info(`Injecting protected route: ${route.pattern}`);
          injectRoute({
            pattern: route.pattern,
            entrypoint: route.entrypoint,
          });
        }

        logger.info(`Injected ${routes.length} protected route(s)`);
      },
    },
  };
}
