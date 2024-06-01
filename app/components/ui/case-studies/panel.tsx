import type { ReactNode } from "react"

export default function Panel({children}: {children: ReactNode}) {
  return (
    <div className="full border-y dark:border-neutral-800 bg-white dark:bg-black max-sm:border-x max-sm:rounded-lg">{children}</div>
  )
}
