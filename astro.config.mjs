// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import protectedRoutes from "./src/integrations/protected-routes";

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
    protectedRoutes({
      // Path to protected pages relative to project root
      protectedDir: "../../packages/protected/pages",
    }),
  ],
});
