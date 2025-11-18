import Header from '~/components/ui/header'
import Overview from '~/components/sections/overview'
import Work from '~/components/sections/work'
import CaseStudies from '~/components/sections/case-studies'
import Selected from '~/components/sections/selected'
import Links from '~/components/sections/links'
import Quotes from '~/components/sections/quotes'
import Layout from '~/components/ui/layout'
import Sections from '~/components/ui/sections'
import Footer from '~/components/sections/footer'

import type { LoaderFunctionArgs } from '@remix-run/cloudflare'

import { projects, articles, features } from '~/data'
import caseStudies from '~/data/caseStudies'
import type { CaseStudiesProps } from '~/components/sections/case-studies'
import { useMatches, useLoaderData } from '@remix-run/react'

export type MatchesData = {
  symbol?: string;
  photo?: string;
  user?: {
    id: string
  },
  handle?: any
  meta?: any
};

export type PostData = {
  slug: string
  url: string
  date: string
  title: string
  description: string
}

export async function loader({ context }: LoaderFunctionArgs) {
  const posts = await fetch(`${context.CODE_ENDPOINT}/posts.json`)
  .then(res => res.json())
  .catch(e => {
    console.log('Error', e)
    return []
  })

  return { endpoint: context.CODE_ENDPOINT, posts: (posts as PostData[]).slice(0, 10) }
}

export default function IndexRoute() {
  const { symbol, photo, user }: MatchesData = useMatches().find(
    (route) => route.id === 'root'
  )?.data ?? { symbol: '💀', photo: '01', user: { id: 'unauthenticated' } }

  const { posts } = useLoaderData<typeof loader>()

  return (
    <>
      <Layout variant="wide">
        <Header symbol={symbol!} photo={photo!} />
        <Sections>
          <Overview posts={posts} />
          <CaseStudies caseStudies={caseStudies as CaseStudiesProps} />
          <Work />
          <Selected sections={[projects, articles, features]} />
          <Quotes />
          <Links />
        </Sections>
        <Footer user={user} />
      </Layout>
    </>
  )
}
