import { useMatches, useLocation, Outlet } from '@remix-run/react'
import Layout from '~/components/ui/layout'
import Header from '~/components/ui/header'
import Footer from '~/components/sections/footer'
import type { MatchesData } from './_index'

export default function Page() {
  const { symbol, photo, user }: MatchesData = useMatches().find(
    (route) => route.id === 'root'
  )?.data ?? { symbol: '💀', photo: '01', user: { id: 'unauthenticated' } }

  const location = useLocation()
  const matches: MatchesData = useMatches().find(
    (route) => route.pathname === location.pathname
  )!
  const content = matches.handle

  return (
    <>
      <Layout variant="wide">
        <Header symbol={symbol!} photo={photo!} back />
      </Layout>
      <Layout variant="full">
        <main className="sm:border border-neutral-200 dark:border-neutral-700 pb-36 rounded">
          <img
            src={`/assets/case-studies/${content.id}/banner.jpg`}
            width="1800"
            height="540"
            className="w-full mx-auto rounded hidden sm:block"
            alt=""
          ></img>
          <div className="grid grid-cols-prose-sm sm:grid-cols-prose pt-0 xl:pt-16 pb-8 xl:gap-x-16 gap-y-16 rounded-md sm:-mt-12 bg-white dark:bg-neutral-900 relative">
            <div className="grid grid-cols-subgrid col-main gap-y-8 sm:-mt-10 xl:mt-0">
              <div className="col-span-full xl:col-span-1">
                <img
                  src={`/assets/case-studies/${content.id}/icon.png`}
                  className="rounded-lg shadow-xl w-[84px] aspect-square"
                  alt=""
                />
              </div>
              <div className="grid grid-cols-subgrid xl:gap-x-16 gap-y-16 col-span-full xl:col-span-10 relative">
                <hgroup className="col-span-full font-display text-3xl xl:text-5xl">
                  <h1>{content.title}</h1>
                  <h2 className="text-neutral-500 dark:text-neutral-400">
                    {content.description}
                  </h2>
                </hgroup>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-prose-sm sm:grid-cols-prose xl:gap-x-16 gap-y-4 [&>*]:col-main [&>*]:xl:col-content [&>.full]:sm:col-full [&>.main]:sm:col-main [&>.wide]:sm:col-wide [&>.sidebar]:sm:col-sidebar [&>.lg-sidebar]:xl:col-sidebar [&>.content]:sm:col-content prose prose-lg dark:prose-invert max-w-none [&>hr]:my-16 [&>*]:my-0 prose-headings:font-display">
            <Outlet />
          </div>
        </main>
        <Footer user={user} />
      </Layout>
    </>
  )
}
