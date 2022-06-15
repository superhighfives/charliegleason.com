import type { MetaFunction } from '@remix-run/cloudflare'
import type { LoaderFunction } from '@remix-run/cloudflare'

import Header from '~/components/ui/header'
import NotFound from '~/components/sections/not-found'
import Selected from '~/components/sections/selected'
import Links from '~/components/sections/links'
import Layout from '~/components/ui/layout'
import Sections from '~/components/ui/sections'
import Footer from '~/components/sections/footer'

import { projects } from '~/data'
import tags from '~/utils/tags'

import { json } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return tags({
    title: '404! Not found! Charlie Gleason is missing!',
    description:
      'Designer, developer, creative coder, musician, and 404 page enthusiast.',
    image: 'https://charliegleason.com/social-error.png',
    emoji: '🙈',
  })
}

export const loader: LoaderFunction = async () => {
  return json(null, { status: 404 })
}

export default function NotFoundRoute() {
  return (
    <>
      <Layout>
        <Header symbol="🙈" photo="01" small />
        <Sections>
          <NotFound />
          <Selected sections={[projects]} />
          <Links />
        </Sections>
        <Footer />
      </Layout>
    </>
  )
}
