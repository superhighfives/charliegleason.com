import type { ReactNode } from 'react'

type Props = {
  id: string
  name: string
  company: string
  role: string
  hero?: boolean
  children: ReactNode
}

export default function Quote({
  id,
  name,
  role,
  company,
  hero = false,
  children,
}: Props) {
  return (
    <blockquote
      key={name}
      className={`flex flex-col justify-between ${
        hero ? 'md:col-span-3 lg:col-span-2 sm:col-span-2' : 'col-span-1'
      }`}
    >
      <p
        className={`pb-3 -indent-2 border-l border-neutral-300 dark:border-neutral-700 pl-6 flex-1 ml-4 text-neutral-800 dark:text-neutral-300 ${
          hero ? 'text-xl' : 'text-md'
        }`}
      >
        {children}
      </p>
      <cite className="not-italic flex items-start">
        <img
          className="rounded-full mr-2 -mt-1 w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 bg-white"
          src={`/assets/avatars/avatar-${id}.jpg`}
          alt={`Black and white headshot of ${name}`}
          width="30"
          height="30"
        />
        <div className="space-y-1">
          <div className="text-neutral-800 dark:text-neutral-300 font-display text-md">
            {name}
          </div>
          <div className="text-neutral-700 dark:text-neutral-400 text-sm">
            <div className="font-semibold">{role}</div>
            <div>{company}</div>
          </div>
        </div>
      </cite>
    </blockquote>
  )
}
