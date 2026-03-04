import type { Posts as PostsType } from "../../lib/posts";

interface PostsProps {
  posts?: PostsType;
  error?: string;
  endpoint: string;
}

export default function Posts({ error, posts, endpoint }: PostsProps) {
  // Hide section if posts fail to load
  if (error || !posts) {
    return null;
  }

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
          <a
            key={post.slug}
            href={`${post.url}/1`}
            className="group flex gap-3 text-sm transition-colors hover:text-yellow-600 dark:hover:text-yellow-400"
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                className="w-12 h-12 rounded-md object-cover shrink-0 shadow-md"
                loading="lazy"
              />
            )}
            <div className="flex items-start flex-col gap-1 flex-1 max-w-full min-w-0">
              <span className="max-w-full underline underline-offset-4 text-pretty decoration-neutral-900/25 dark:decoration-neutral-100/25 group-hover:decoration-current transition-colors">
                {post.title}
              </span>
              {post.description && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-full">
                  {post.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
