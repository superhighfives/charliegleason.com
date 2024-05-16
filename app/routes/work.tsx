import { useMatches, useLocation, Outlet } from '@remix-run/react'
import Layout from '~/components/ui/layout'
import Header from '~/components/ui/header'
import Footer from '~/components/sections/footer'
import Link from '~/components/ui/link'
import { Back } from '~/components/ui/icon'
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
        <Header symbol={symbol!} photo={photo!} />
      </Layout>
      <Layout variant="full">
        <main className="sm:border border-neutral-200 dark:border-neutral-700 pb-8 xl:pb-20 rounded">
          <img
            src={`/assets/case-studies/${content.id}/banner.jpg`}
            width="1800"
            height="540"
            className="w-full mx-auto rounded hidden sm:block"
            alt=""
          ></img>
          <div className="grid grid-cols-prose-sm sm:grid-cols-prose pt-0 xl:pt-32 pb-8 xl:gap-x-8 gap-y-8 rounded-md bg-white dark:bg-neutral-900 relative">
              <div className="col-span-full sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-2 sm:-mt-12 xl:mt-0 xl:-mr-4">
                <img
                  src={`/assets/case-studies/${content.id}/icon.png`}
                  className="rounded-lg shadow-xl w-[84px] aspect-square"
                  alt=""
                />
              </div>
              <hgroup className="col-span-full sm:col-start-2 sm:col-span-10 xl:col-span-11 font-display text-4xl xl:text-5xl">
                <h1>{content.title}</h1>
                <h2 className="text-neutral-500 dark:text-neutral-400">
                  {content.description}
                </h2>
              </hgroup>
          </div>
          <div className="grid grid-cols-prose-sm sm:grid-cols-prose xl:gap-x-8 gap-y-4 [&>*]:col-main [&>*]:xl:col-content [&>.full]:sm:col-full [&>.main]:sm:col-main [&>.wide]:sm:col-wide [&>.sidebar]:xl:col-sidebar [&>.lg-sidebar]:xl:col-sidebar [&>.content]:xl:col-content prose sm:prose-lg dark:prose-invert max-w-none [&_hr]:my-8 [&>*]:my-0 prose-headings:font-display prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base [&>.sidebar]:bg-neutral-100 [&>.sidebar]:pb-2 [&>.sidebar]:dark:bg-neutral-800 [&>.sidebar]:px-8 [&>.sidebar]:rounded-lg">
            <Outlet />

            <div className="full !mt-4">
              <Link icon={Back} background={false} href="/#case-studies" padding="large" className="inline-block not-prose">
                Back to projects
              </Link>
            </div>
          </div>
        </main>
        <Footer user={user} />
      </Layout>
    </>
  )
}
