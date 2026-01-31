import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { handle } from "@astrojs/cloudflare/handler";

// Re-export the Durable Object class
export { VisitorCounter } from "./lib/visitor-counter";

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
      ): Promise<Response> {
        return handle(manifest, app, request, env, ctx);
      },
    } satisfies ExportedHandler<Env>,
  };
}
