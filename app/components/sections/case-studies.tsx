import Tile from '~/components/ui/work/tile'
import Title from '~/components/ui/title'
import Link from '../ui/link'
import { Forward } from '../ui/icon'
import { useRef } from 'react'
import type { RefObject, ReactNode } from 'react'
import type { ColorType } from '~/components/ui/work/tile'

function CaseStudy({viewportRef, id, href, title, color, hero, description}: {viewportRef: RefObject<HTMLDivElement>, id: string, href: string, title: string, hero: ReactNode, description: string, color: ColorType}) {
  return (
    <div className="grid grid-cols-3 gap-6 lg:gap-12">
      <div className="col-span-full lg:col-span-1">
          <Tile
            id={id}
            href={href}
            title={title}
            color={color}
            format="webp"
            type="case-studies"
            viewportRef={viewportRef}
          />
        </div>
        <div className="col-span-3 lg:col-span-2 xl:border-l dark:border-neutral-800 xl:pl-10 flex flex-col items-start justify-center gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-balance">{hero}</h1>
            <p className="max-w-3xl leading-loose text-neutral-700 dark:text-neutral-300">{description}</p>
          </div>
          <Link icon={Forward} href={href} background={false} padding="large" className="inline-block not-prose px-4">View Case Study</Link>
        </div>
      </div>
  )
}

export default function Work() {
  const viewportRef = useRef<HTMLDivElement>(null)

  return (
    <>
    <div
        id="case-studies"
        className="grid gap-6 lg:gap-12 scroll-m-16"
      >
        <div>
          <Title>Case Studies</Title>
        </div>

        <CaseStudy
          id="ax-publishing"
          href="/work/ax-publishing"
          title="AppExchange Publishing"
          color="sky"
          hero={<>An <span className="text-sky-600 dark:text-sky-400">XYZ</span> ABC.</>}
          description="TBA"
          viewportRef={viewportRef}>
        </CaseStudy>

        <hr className="dark:border-neutral-800" />
        
        <CaseStudy
          id="lysterfield-lake"
          href="/work/lysterfield-lake"
          title="Lysterfield Lake"
          color="rose"
          hero={<>An <span className="text-rose-600 dark:text-rose-400">interactive, AI-augmented</span> 3D music video.</>}
          description="Powered by open-source tools, Lysterfield Lake is an AI-augmented music video about a place outside Melbourne, Australia. It's about the endless summers of your youth, and the tiny changes in you that you don't even notice adding up."
          viewportRef={viewportRef}>
        </CaseStudy>
      </div>
    </>
  )
}
