import type { MetaFunction, LoaderArgs } from '@remix-run/cloudflare'
import type { LoaderData } from '~/root'
import type { DynamicLinksFunction } from 'remix-utils'

import Header from '~/components/ui/header'
import Introduction from '~/components/sections/introduction'
import Selected from '~/components/sections/selected'
import Links from '~/components/sections/links'
import Quotes from '~/components/sections/quotes'
import Events from '~/components/sections/events'
import Layout from '~/components/ui/layout'
import Sections from '~/components/ui/sections'
import Footer from '~/components/sections/footer'
import tags from '~/utils/tags'

import { projects, articles, features } from '~/data'
import { useMatches, useRouteLoaderData } from '@remix-run/react'
import { EMOJI_URL } from '../constants'

let dynamicLinks: DynamicLinksFunction<LoaderData> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { symbol }: { symbol?: string } = useRouteLoaderData('root') ?? {
    symbol: '💀',
  }
  return [
    {
      rel: 'icon',
      type: 'image/svg',
      href: `${EMOJI_URL}${symbol}?animated=false`,
    },
  ]
}

export const handle = { dynamicLinks }

export const meta: MetaFunction = () => {
  return tags({
    title: 'Charlie Gleason',
    image: 'https://charliegleason.com/social-default.png',
  })
}

export default function IndexRoute() {
  const { symbol, photo, user } = useMatches().find(
    (route) => route.id === 'root'
  )?.data ?? { symbol: '💀', photo: '01', user: { id: 'unauthenticated' } }

  return (
    <>
      <Layout wide>
        <Header symbol={symbol} photo={photo} />
        <Sections>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <Introduction />
            </div>
            <div className="lg:col-span-3">
              <Events />
            </div>
          </div>
          <div className="py-64 bg-yellow-100">Case Studies</div>
          <Selected sections={[projects, articles, features]} />
          <Quotes />
          <Links />
        </Sections>
        <Footer user={user} />
      </Layout>
    </>
  )
}
