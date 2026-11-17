import {
  FEED_IMAGE_CLASS,
  FEED_LINK_CLASS,
  FEED_META_CLASS,
  FEED_TITLE_CLASS,
  tilt,
} from "../../lib/feed";
import type { Posts as PostsType } from "../../lib/posts";
import SourceLink from "../ui/SourceLink";

/** A post's date as "Sep 2026", in UTC so the server and browser agree */
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="tracking-widest text-xs font-display uppercase text-yellow-700 dark:text-yellow-500">
          Recent writing{" "}
          <SourceLink href={endpoint} label="code.charliegleason.com" />
        </h2>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`${post.url}/1`}
            className={`${FEED_LINK_CLASS} text-sm`}
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                className={`${FEED_IMAGE_CLASS} rounded-md shadow-md`}
                style={tilt(post.title)}
                loading="lazy"
              />
            )}
            <div className="flex items-start flex-col gap-1 flex-1 max-w-full min-w-0">
              <span className="block">
                <span className={FEED_TITLE_CLASS}>{post.title}</span>
              </span>
              {post.description && (
                <p className="text-xs text-pretty text-neutral-600 dark:text-neutral-400 max-w-full line-clamp-2">
                  {post.description}
                </p>
              )}
              <time dateTime={post.date} className={FEED_META_CLASS}>
                {formatDate(post.date)}
              </time>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
