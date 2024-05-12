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
        <main className="border-l border-r border-b border-neutral-300 dark:border-neutral-700 pb-36 rounded">
          <img
            src={`/assets/case-studies/${content.id}/banner.jpg`}
            width="1800"
            height="540"
            className="w-full mx-auto rounded"
            alt=""
          ></img>
          <div className="grid grid-cols-prose-sm lg:grid-cols-prose py-12 gap-8 rounded-md -mt-12 bg-white dark:bg-neutral-900 relative">
            <div className="grid grid-cols-subgrid col-main gap-y-8">
              <div className="col-span-full lg:col-span-1">
                <img
                  src={`/assets/case-studies/${content.id}/icon.png`}
                  className="rounded-lg shadow-xl w-[84px] aspect-square"
                  alt=""
                />
              </div>
              <div className="grid grid-cols-subgrid gap-8 col-span-full lg:col-span-11 relative">
                <hgroup className="col-span-full font-display text-5xl">
                  <h1>{content.title}</h1>
                  <h2 className="text-neutral-500">{content.description}</h2>
                </hgroup>
                <div className="col-span-full order-1 lg:order-none lg:col-span-8 space-y-8">
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                  <p className="text-2xl leading-relaxed">{content.hero}</p>
                </div>
                {content.metadata ? (
                  <div className="col-span-full lg:col-span-3 space-y-4 text-xs">
                    <h3 className="font-display uppercase tracking-wider">
                      Project Metadata
                    </h3>
                    <dl className="grid justify-start grid-cols-2 gap-2">
                      {content.metadata.map(
                        (metadata: { name: string; content: string }) => {
                          return (
                            <>
                              <dt className="font-mono">{metadata.name}</dt>
                              <dd>{metadata.content}</dd>
                            </>
                          )
                        }
                      )}
                      <dt className="font-mono">Company</dt>
                      <dd>Side project</dd>
                    </dl>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-prose-sm lg:grid-cols-prose gap-8 gap-y-8 [&>*]:col-main [&>*]:lg:col-content [&>.full]:col-full [&>.main]:col-main [&>.wide]:col-wide [&>.sidebar]:col-sidebar [&>.content]:col-content prose prose-lg dark:prose-invert max-w-none [&>*]:my-0 prose-headings:font-display">
            <Outlet />
          </div>
        </main>
        <Footer user={user} />
      </Layout>
    </>
  )
}
