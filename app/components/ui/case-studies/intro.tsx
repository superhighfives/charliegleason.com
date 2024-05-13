import type { ReactNode } from 'react'

export default function Intro({children}: {children: ReactNode}) {
  return <div className="[&>*]:my-0 grid gap-y-8">{children}</div>
}
