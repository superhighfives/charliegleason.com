import type { APIRoute } from "astro"
import { Effect } from "effect"
import { fetchPosts, type PostsApiResponse } from "../../lib/posts"

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const endpoint =
    url.searchParams.get("endpoint") || "https://code.charliegleason.com"
  const limit = parseInt(url.searchParams.get("limit") || "6", 10)

  const program = fetchPosts(endpoint, limit).pipe(
    Effect.map(
      (posts): PostsApiResponse => ({
        success: true,
        posts,
      })
    ),
    Effect.catchAll((error) =>
      Effect.gen(function* () {
        yield* Effect.logError(
          `Posts API error: ${error._tag} - ${error.message}`
        )
        return {
          success: false,
          error:
            error._tag === "HttpError"
              ? `Server returned ${error.statusCode}`
              : "Unable to load posts",
        } satisfies PostsApiResponse
      })
    )
  )

  const result = await Effect.runPromise(program)
  const status = result.success ? 200 : 502

  return new Response(JSON.stringify(result), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
