import Avatar from '~/components/ui/avatar'
import type { ThrownResponse } from '@remix-run/react'

export default function Error(caught: ThrownResponse) {
  return (
    <div className="grid place-items-center h-full">
      <div className="sm:flex items-center space-x-4 space-y-4 sm:space-y-0">
        <div className="flex">
          <Avatar symbol="💀" photo="01" />
        </div>
        <div className="max-w-xs space-y-0">
          <hgroup className="inline-flex whitespace-nowrap space-x-1 font-display uppercase tracking-wider text-xs">
            <h1>C#@rl!e G/3as0n</h1>
            <h2 className="bg-yellow-800 dark:bg-yellow-300 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 dark:from-yellow-500 to-transparent">
              is having some issues
            </h2>
          </hgroup>
          <h1 className="font-mono text-lg">
            Looks like it's a {caught.status} error.
          </h1>
          <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            And the server has this very helpful message:{' '}
            <span className="text-neutral-900 dark:text-neutral-100">
              {caught.statusText}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
