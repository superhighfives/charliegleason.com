import Tile from '~/components/ui/work/tile'
import Title from '~/components/ui/title'
import { useRef } from 'react'

export default function Work() {
  const viewportRef = useRef<HTMLDivElement>(null)

  return (
    <>
    <div
        id="case-studies"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
      >
        <div className="col-span-full">
          <Title>Case Studies</Title>
        </div>
        <div className="sm:col-span-1">
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
      </div>
    </>
  )
}
