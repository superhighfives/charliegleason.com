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
    <div className="grid grid-cols-1 sm:space-y-0 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-4 md:gap-x-12">
      {sections.map((section) => (
        <div key={section.title} className="space-y-8">
          <Title>Selected {section.title}</Title>
          <div className="space-y-8">
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
                    <Link href={entry.url} size="large">
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

          {section.notes && (
            <div className="space-y-2 min-w-0 max-w-full">
              {section.notes.map((note) => {
                return (
                  <div
                    key={note.slug}
                    className="flex items-center space-x-4 md:space-x-6 ml-1 md:ml-2"
                  >
                    <svg
                      className="inline-block flex-shrink-0 fill-current text-yellow-400"
                      viewBox="0 0 24 24"
                      height="12"
                      width="12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="8"></circle>
                    </svg>

                    <Link href={note.slug} type="text">
                      {note.title}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
