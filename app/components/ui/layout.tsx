import type { ReactNode } from 'react'
import cx from 'classnames'

type Props = {
  children: ReactNode
  variant?: 'wide' | 'full'
}

export default function Layout({ children, variant }: Props) {
  const classes = cx({
    'max-w-2xl': !variant,
    'max-w-screen-2xl': variant == 'wide',
    'max-w-screen-3xl sm:pt-0 lg:-my-8': variant == 'full',
  })

  return (
    <div
      className={`lg:px-10 py-4 sm:py-10 ml-auto mr-auto space-y-12 ${classes}`}
    >
      {children}
    </div>
  )
}
