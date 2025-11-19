import type { loader, PostData } from '~/routes/_index'
import Link from '~/components/ui/link'
import Title from '~/components/ui/title'
import { useLoaderData } from '@remix-run/react';
import { Forward } from '../icon';

export default function Posts({posts}: {posts: PostData[]}) {
  const { endpoint } = useLoaderData<typeof loader>();
  return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
        <Title>Recent writing <Link type='text' className="font-mono font-bold text-[0.625rem]" href={`${endpoint}`}>(code.charliegleason.com)</Link></Title>
        
        </div>
        <div className="space-y-4">
        {posts.map((post) => {
          return (
            <div
              key={post.title}
              className="flex flex-col gap-2 text-sm"
            >
              <div className="flex items-start flex-col gap-2 flex-1 max-w-full">
                <Link href={post.url}>
                  {post.title}
                </Link>
                
                {post.description ? <p className="truncate text-xs text-neutral-600 dark:text-neutral-400 max-w-full">{post.description}</p> : null}
              </div>
            </div>
          )
        })}
        </div>
      </div>
  )
}
