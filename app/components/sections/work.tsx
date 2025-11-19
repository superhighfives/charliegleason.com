import Tile from '~/components/ui/work/tile'
import Title from '~/components/ui/title'
import { useRef } from 'react'

export default function Work() {
  const viewportRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        id="highlights"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
      >
        <div className="col-span-full">
          <Title>Project Highlights</Title>
        </div>
        <div className="sm:col-span-1">
          <Tile
            id="brightly"
            href="https://wewerebrightly.com"
            title="Brightly"
            description="Music and experiments"
            type="work"
            color="yellow"
            viewportRef={viewportRef}
          />
        </div>
        <div className="sm:col-span-1">
          <Tile
            id="pika"
            href="https://superhighfives.com/pika"
            title="Pika"
            description="An open-source colour macOS app"
            type="work"
            color="pink"
            viewportRef={viewportRef}
          />
        </div>
        <div className="sm:col-span-1">
          <Tile
            id="heroku-pricing"
            href="https://heroku.com/pricing"
            title="Heroku Pricing"
            description="Simple pricing for a complex product"
            type="work"
            color="indigo"
            viewportRef={viewportRef}
          />
        </div>
      </div>
    </>
  )
}
