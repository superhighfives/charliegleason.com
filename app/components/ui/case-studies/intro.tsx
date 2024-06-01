import type { ReactNode } from 'react'
import Prose from './prose'

export default function Intro({children}: {children: ReactNode}) {
  return <Prose className="max-w-none">{children}</Prose>
}
