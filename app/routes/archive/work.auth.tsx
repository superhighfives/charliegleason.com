import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { requireUserId } from '~/session.server'
import { useMatches } from '@remix-run/react'
import Layout from '~/components/ui/layout'
import Header from '~/components/ui/header'
import Footer from '~/components/sections/footer'
import type { MatchesData } from '~/routes/_index'

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
