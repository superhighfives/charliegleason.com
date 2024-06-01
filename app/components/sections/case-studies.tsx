import Tile from '~/components/ui/work/tile'
import Title from '~/components/ui/title'
import Link from '../ui/link'
import { Forward } from '../ui/icon'
import { useRef } from 'react'
import type { RefObject, ReactNode } from 'react'
import type { ColorType } from '~/components/ui/work/tile'

type CaseStudy = {
  id: string
  href: string
  title: string
  color: ColorType
  hero: string
  highlightText: string
  highlightClasses: string
  description: string
}

export type CaseStudiesProps = {
  title: string
  data: CaseStudy[]
}

function CaseStudy({viewportRef, id, href, title, color, hero, description}: {viewportRef: RefObject<HTMLDivElement>, id: string, href: string, title: string, hero: ReactNode, description: string, color: ColorType}) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-16">
      <div className="lg:basis-1/3 lg:flex-shrink-0">
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
        <div className="dark:border-neutral-800 flex flex-col items-start justify-center gap-6 lg:basis-2/3">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl lg:text-4xl font-display text-balance">{hero}</h1>
            <p className="max-w-3xl leading-loose text-neutral-700 dark:text-neutral-300">{description}</p>
          </div>
          <Link icon={Forward} href={href} background={false} padding="large" className="inline-block not-prose px-4">View Case Study</Link>
        </div>
      </div>
  )
}

export default function Work({ caseStudies }: {caseStudies: CaseStudiesProps}) {
  const viewportRef = useRef<HTMLDivElement>(null)

  return (
    <>
    <div
        id="case-studies"
        className="grid gap-6 lg:gap-12 scroll-m-16"
      >
        <div>
          <Title>{caseStudies.title}</Title>
        </div>
        
        <div className="flex flex-col sm:flex-row lg:flex-col gap-16">
        {caseStudies.data.map((caseStudy: CaseStudy) => {
          const [start, end] = caseStudy.hero.split(new RegExp(/{highlightText}/g))
          const highlight = <> {start}<span className={caseStudy.highlightClasses}>{caseStudy.highlightText}</span> {end}</>
          return (
            <CaseStudy
              key={caseStudy.id}
              id={caseStudy.id}
              href={caseStudy.href}
              title={caseStudy.title}
              color={caseStudy.color}
              hero={highlight}
              description={caseStudy.description}
              viewportRef={viewportRef}>
            </CaseStudy>
          )
        })}
        </div>
        
      </div>
    </>
  )
}
