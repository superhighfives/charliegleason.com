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
      <img
        src={`/assets/case-studies/${content.id}/banner.webp`}
        width="1800"
        height="540"
        className="w-full mx-auto rounded hidden sm:block max-w-screen-3xl"
        alt=""
      ></img>
      <Layout variant="full">
        <main className="sm:border border-neutral-200 dark:border-neutral-700 pb-8 max-sm:pt-16 xl:pb-20 rounded">
          <div className="grid grid-cols-prose-sm sm:grid-cols-prose pt-0 xl:pt-16 sm:pb-16 xl:gap-x-8 gap-y-8 rounded-md bg-white dark:bg-neutral-900 relative">
            <div className="col-span-full sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-2 sm:-mt-12 xl:mt-0 xl:-mr-4">
              <img
                src={`/assets/case-studies/${content.id}/icon.webp`}
                className="rounded-lg shadow-xl w-[84px] aspect-square"
                alt=""
              />
            </div>
            <div className="col-span-full sm:col-start-2 sm:col-span-10 xl:col-span-11 sm:space-y-6">
              <Link
                icon={Back}
                href="/#case-studies"
                padding="large"
                background={false}
                className="text-sm max-sm:hidden"
              >
                Back to projects
              </Link>
              <hgroup className="font-display text-4xl xl:text-5xl">
                <h1>{content.title}</h1>
                <h2 className="text-neutral-500 dark:text-neutral-400">
                  {content.description}
                </h2>
              </hgroup>
            </div>
          </div>
          <div className="grid grid-cols-prose-sm sm:grid-cols-prose xl:gap-x-8 gap-y-8 xl:gap-y-16 [&>*]:col-main [&>*]:xl:col-content [&>.full]:sm:col-full [&>.main]:sm:col-main [&>.wide]:sm:col-wide [&>.sidebar]:py-8 [&>.sidebar]:xl:col-sidebar [&>.lg-sidebar]:xl:col-sidebar [&>.lg-sidebar]:xl:ml-4 [&>.content]:xl:col-content [&>.lg-content]:xl:col-lg-content  max-w-none [&>.sidebar]:bg-neutral-100 [&>.sidebar]:pb-2 [&>.sidebar]:dark:bg-neutral-800 [&>.sidebar]:px-8 [&>.sidebar]:rounded-lg overflow-hidden pb-2">
            <Outlet />

            <div className="pt-4">
              <Link
                icon={Back}
                background={false}
                href="/#case-studies"
                padding="large"
                className="inline-block not-prose"
              >
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
