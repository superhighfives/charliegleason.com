/*
 * If you're looking to learn more about how themeing is set up,
 * you should absolute read Matt Stobb's Complete Guide to Dark Mode
 * with Remix (https://mattstobbs.com/remix-dark-mode)
 */

import { Theme, useTheme } from '~/utils/theme-provider'
import Icon, { DarkMode } from '~/components/ui/icon'

function Button({to}: {to: Theme}) {
  const [theme, setTheme] = useTheme()
  console.log(setTheme)

  return (
    <button
        className="appearance-none transition-colors group p-1 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 focus-visible:bg-yellow-500/20 rounded-full outline-yellow-500 outline-offset-2 focus-visible:outline focus-visible:outline-2"
        aria-label={`Toggle mode`}
        onClick={() => setTheme(to)}
      >
        <span className="absolute duration-100 transition-opacity group-focus-visible:opacity-100 group-hover:opacity-100 opacity-0 top-0 translate-y-10 font-display text-xs whitespace-nowrap right-0 pointer-events-none">
          Toggle {to.charAt(0).toUpperCase() + to.slice(1)}
        </span>

        <Icon className="w-6 h-6 fill-current">
          <DarkMode enabled={to !== Theme.DARK} />
        </Icon>
      </button>
  )
}

export default function Toggle() {
  return (
    <div className="absolute top-4 right-0 flex gap-2">
      <Button to={Theme.LIGHT} />
      <Button to={Theme.DARK} />
    </div>
  )
}
