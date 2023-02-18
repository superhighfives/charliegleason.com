import type { LoaderArgs } from '@remix-run/cloudflare'
import { requireUserId } from '~/session.server'
import type { DynamicLinksFunction } from 'remix-utils'
import { EMOJI_URL } from '~/constants'
import type { MetaFunction } from '@remix-run/cloudflare'
import tags from '~/utils/tags'
import { useMatches } from '@remix-run/react'
import Layout from '~/components/ui/layout'
import Header from '~/components/ui/header'
import Footer from '~/components/sections/footer'

let dynamicLinks: DynamicLinksFunction = ({ parentsData }) => {
  return [
    {
      rel: 'icon',
      type: 'image/svg',
      href: `${EMOJI_URL}${parentsData[0].symbol || '💀'}?animated=false`,
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

export async function loader({ request, context }: LoaderArgs) {
  return await requireUserId(request, context)
}

export default function ExamplePage() {
  const { symbol, photo, user } = useMatches().find(
    (route) => route.id === 'root'
  )?.data ?? { symbol: '💀', photo: '01', user: { id: 'unauthenticated' } }

  return (
    <Layout wide>
      <Header symbol={symbol} photo={photo} />
      <Footer user={user} />
    </Layout>
  )
}
