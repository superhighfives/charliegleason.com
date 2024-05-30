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

import { projects, articles, features } from '~/data'
import { useMatches } from '@remix-run/react'

export type MatchesData = {
  symbol?: string;
  photo?: string;
  user?: {
    id: string
  },
  handle?: any
  meta?: any
};

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
          <CaseStudies />
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
