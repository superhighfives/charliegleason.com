import Events from '~/components/ui/overview/events'
import Introduction from '~/components/ui/overview/introduction'
import Posts from '~/components/ui/overview/posts'
import type { PostsData } from '~/routes/_index'

export default function Overview({posts}: {posts: PostsData[]}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
      <div className="lg:col-span-2 flex flex-col gap-8">
        <Introduction />
        {posts && posts.length ? <Posts posts={posts} /> : null}
      </div>
      <div className="lg:col-span-3">
        <Events />
      </div>
    </div>
  )
}
