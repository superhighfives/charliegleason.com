import type { ReactNode } from "react"

export default function Prose({children, className}: {children: ReactNode, className?: string}) {
  return (
    <div className={`prose xl:prose-headings:mt-16 sm:prose-lg dark:prose-invert prose-headings:font-display prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg text-pretty prose-h6:text-base dark:prose-hr:border-neutral-700 ${className}`}>{children}</div>
  )
}
