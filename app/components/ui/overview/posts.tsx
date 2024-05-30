import type { PostsData } from '~/routes/_index'
import Link from '~/components/ui/link'
import Title from '~/components/ui/title'

export default function Posts({posts}: {posts: PostsData[]}) {
  return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
        <Title>Recent writing <Link type='text' className="font-mono font-bold text-[0.625rem]" href="https://code.charliegleason.com/about">(code.charliegleason.com)</Link></Title>
        
        </div>
        <div className="space-y-4">
        {posts.map((post) => {
          return (
            <div
              key={post.frontmatter.title}
              className="flex gap-2 text-sm"
            >
              <svg
                className="inline-block flex-shrink-0 fill-current text-yellow-500 dark:text-yellow-400 -ml-3 mt-2"
                viewBox="0 0 24 24"
                height="8"
                width="8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="8"></circle>
              </svg>

              <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <Link href={post.url} className="-ml-1 flex-shrink-0">
                  {post.frontmatter.title}
                </Link>
                
                {post.frontmatter.description ? <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">{post.frontmatter.description}</p> : null}
              </div>
            </div>
          )
        })}
        </div>
      </div>
  )
}
