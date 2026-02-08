import { useState } from "react";
import type { PostsApiResponse, Posts as PostsType } from "../../lib/posts";

interface PostsProps {
  initialPosts?: PostsType;
  initialError?: string;
  endpoint: string;
}

export default function Posts({
  initialPosts,
  initialError,
  endpoint,
}: PostsProps) {
  const [posts, setPosts] = useState<PostsType | undefined>(initialPosts);
  const [error, setError] = useState<string | undefined>(initialError);
  const [isLoading, setIsLoading] = useState(false);

  const retry = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(
        `/api/posts?endpoint=${encodeURIComponent(endpoint)}&limit=6`,
      );
      const data: PostsApiResponse = await response.json();

      if (data.success && data.posts) {
        setPosts(data.posts);
        setError(undefined);
      } else {
        setError(data.error || "Unable to load posts");
      }
    } catch {
      setError("Network error - please try again");
    } finally {
      setIsLoading(false);
    }
  };

  // Error state with retry
  if (error || !posts) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="tracking-widest text-xs font-display uppercase text-yellow-700 dark:text-yellow-500">
            Recent writing{" "}
            <a
              href={endpoint}
              className="font-mono font-bold text-[0.625rem] transition-colors border-b border-neutral-900/25 dark:border-neutral-100/25 hover:text-yellow-600 dark:hover:text-yellow-400 hover:border-current"
            >
              (code.charliegleason.com)
            </a>
          </h2>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 space-y-3">
          <p>{error || "Unable to load posts"}</p>
          <button
            type="button"
            onClick={retry}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Loading..." : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="tracking-widest text-xs font-display uppercase text-yellow-700 dark:text-yellow-500">
          Recent writing{" "}
          <a
            href={endpoint}
            className="font-mono font-bold text-[0.625rem] transition-colors border-b border-neutral-900/25 dark:border-neutral-100/25 hover:text-yellow-600 dark:hover:text-yellow-400 hover:border-current"
          >
            (code.charliegleason.com)
          </a>
        </h2>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="flex flex-col gap-2 text-sm">
            <div className="flex items-start flex-col gap-2 flex-1 max-w-full">
              <a
                href={post.url}
                className="truncate max-w-full transition-colors border-b border-neutral-900/25 dark:border-neutral-100/25 hover:text-yellow-600 dark:hover:text-yellow-400 hover:border-current"
              >
                {post.title}
              </a>
              {post.description && (
                <p className="truncate text-xs text-neutral-600 dark:text-neutral-400 max-w-full">
                  {post.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
