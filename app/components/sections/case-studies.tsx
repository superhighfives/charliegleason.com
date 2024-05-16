import Tile from '~/components/ui/work/tile'
import Title from '~/components/ui/title'
import Link from '../ui/link'
import { Forward } from '../ui/icon'
import { useRef } from 'react'

export default function Work() {
  const viewportRef = useRef<HTMLDivElement>(null)

  return (
    <>
    <div
        id="case-studies"
        className="grid grid-cols-3 gap-12 scroll-m-16"
      >
        <div className="col-span-full">
          <Title>Case Studies</Title>
        </div>
        <div className="col-span-full lg:col-span-1">
          <Tile
            id="lysterfield-lake"
            href="/work/lysterfield-lake"
            title="Lysterfield Lake"
            description="AI music video"
            type="case-studies"
            color="rose"
            viewportRef={viewportRef}
          />
        </div>
        <div className="col-span-3 lg:col-span-2 prose dark:prose-invert max-w-none prose-lg prose-headings:font-display xl:border-l dark:border-neutral-800 xl:pl-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">An <span className="text-yellow-600 dark:text-yellow-500">interactive, AI-augmented</span> 3D music video.</h1>
          <p className="max-w-3xl">Powered by <a href="https://replicate.com/">Replicate</a> and <a href="https://github.com/replicate/cog">Cog</a>, Lysterfield Lake is an AI-augmented music video about a place outside Melbourne, Australia. It's about the endless summers of your youth, and the tiny changes in you that you don't even notice adding up.</p>
          <Link icon={Forward} href="/work/lysterfield-lake" background={false} padding="large" className="inline-block not-prose">View Case Study</Link>
        </div>
      </div>
    </>
  )
}
