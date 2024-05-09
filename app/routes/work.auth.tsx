import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { requireUserId } from '~/session.server'
import { EMOJI_URL } from '~/constants'
import tags from '~/utils/tags'
import { useMatches } from '@remix-run/react'
import Layout from '~/components/ui/layout'
import Header from '~/components/ui/header'
import Footer from '~/components/sections/footer'
import type { MatchesData } from './_index'

export const meta: MetaFunction = ({ matches }) => {
  const parentsData = matches[0].data as MatchesData

  const metatags = tags({
    title: 'Charlie Gleason is a work in progress.',
    image: 'https://charliegleason.com/social-default.png',
  })

  return [
    ...metatags,
    {
      tagName: 'link',
      rel: 'icon',
      type: 'image/svg',
      href: `${EMOJI_URL}${parentsData.symbol || '💀'}?animated=false`,
    },
  ]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  return await requireUserId(request, context)
}

export default function Page() {
  const { symbol, photo, user }: MatchesData = useMatches().find(
    (route) => route.id === 'root'
  )?.data ?? { symbol: '💀', photo: '01', user: { id: 'unauthenticated' } }

  return (
    <Layout variant='wide'>
      <Header symbol={symbol!} photo={photo!} back />
      <Footer user={user} />
    </Layout>
  )
}
