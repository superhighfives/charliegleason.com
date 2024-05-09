import type { MetaFunction } from '@remix-run/cloudflare'

import Header from '~/components/ui/header'
import Overview from '~/components/sections/overview'
import Work from '~/components/sections/work'
import Selected from '~/components/sections/selected-redux'
import Links from '~/components/sections/links'
import Quotes from '~/components/sections/quotes'
import Layout from '~/components/ui/layout'
import Sections from '~/components/ui/sections'
import Footer from '~/components/sections/footer'

import { projects, articles, features } from '~/data'
import { useMatches } from '@remix-run/react'
import { EMOJI_URL } from '../constants'

export type MatchesData = {
  symbol?: string;
  photo?: string;
  user?: {
    id: string
  }
};

export const meta: MetaFunction = ({ matches }) => {
  const parentsData = matches[0].data as MatchesData
  const parentsMeta = matches[0].meta

  return [
    ...parentsMeta,
    {
      tagName: 'link',
      rel: 'icon',
      type: 'image/svg',
      href: `${EMOJI_URL}${parentsData.symbol || '💀'}?animated=false`,
    },
  ]
}

export default function IndexRoute() {
  const { symbol, photo, user }: MatchesData = useMatches().find(
    (route) => route.id === 'root'
  )?.data ?? { symbol: '💀', photo: '01', user: { id: 'unauthenticated' } }

  return (
    <>
      <Layout variant="wide">
        <Header symbol={symbol!} photo={photo!} />
        <Sections>
          <Overview />
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
