import { Schema } from "effect";

/**
 * Schema for a single blog post from code.charliegleason.com
 */
export const Post = Schema.Struct({
  slug: Schema.String,
  url: Schema.String,
  title: Schema.String,
  description: Schema.String,
  date: Schema.String,
  tags: Schema.optional(Schema.Array(Schema.String)),
});

export type Post = typeof Post.Type;

/**
 * Schema for the posts array
 */
export const Posts = Schema.Array(Post);

export type Posts = typeof Posts.Type;

/**
 * Decode and validate posts data
 */
export const decodePosts = Schema.decodeUnknownSync(Posts);

/**
 * Fetch posts from the code endpoint with full type safety
 */
export async function fetchPosts(
  endpoint: string,
  limit: number = 6
): Promise<Posts> {
  try {
    const response = await fetch(`${endpoint}/posts.json`);
    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status}`);
      return [];
    }
    const data = await response.json();
    const posts = decodePosts(data);
    return posts.slice(0, limit);
  } catch (e) {
    console.error("Error fetching posts:", e);
    return [];
  }
}
