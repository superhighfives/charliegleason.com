// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import protectedRoutes from "./src/integrations/protected-routes";
import protectedAssets from "./src/integrations/protected-assets";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: "cloudflare",
  }),
  integrations: [
    tailwind(),
    mdx(),
    react(),
    protectedRoutes({
      // Path to protected content relative to project root
      protectedDir: "../private/content",
    }),
    protectedAssets({
      // Path to protected assets relative to project root
      protectedAssetsDir: "../private/assets",
      // Asset subdirectories to copy to dist
      assetPaths: ["case-studies"],
    }),
  ],
});
