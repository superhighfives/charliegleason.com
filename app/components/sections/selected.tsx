import Link from '~/components/ui/link'
import Title from '~/components/ui/title'
import { EMOJI_URL } from '~/constants'

type Props = {
  sections: Entries[]
}

type Entries = {
  title: string
  data: Entry[]
  notes?: Note[]
}

type Entry = {
  icon: string
  property?: string
  title: string
  subtitle?: string
  url: string
}

type Note = {
  date: string
  slug: string
  title: string
  source: string
}

export default function Selected({ sections }: Props) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.title} className="space-y-8">
          <Title>Selected {section.title}</Title>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-4 md:gap-x-12">
            {section.data.map((entry) => {
              return (
                <div key={entry.title} className="flex items-start">
                  <img
                    className="relative mr-2 md:mr-4 rounded-full w-[24px] h-[24px] md:w-[30px] md:h-[30px]"
                    src={`${EMOJI_URL}${entry.icon}?detailed=false&animated=false`}
                    alt={`${entry.icon} emoji in a yellow circle`}
                    width="30"
                    height="30"
                  />
                  <div>
                    {entry.property && (
                      <div className="text-xs uppercase tracking-widest font-medium text-neutral-700 dark:text-neutral-400">
                        {entry.property}
                      </div>
                    )}
                    <Link href={entry.url} className="-ml-1" size="large">
                      {entry.title}
                    </Link>
                    {entry.subtitle && (
                      <div className="text-sm text-neutral-700 dark:text-neutral-400">
                        {entry.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}
