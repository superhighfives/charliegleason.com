import type { ReactNode, FunctionComponent } from 'react'
import { createElement } from 'react'
import Icon from '~/components/ui/icon'

type Props = {
  type?: 'default' | 'text'
  size?: 'default' | 'large'
  padding?: 'default' | 'large'
  className?: string
  background?: boolean
  icon?: FunctionComponent
  href?: string
  children: ReactNode
}

export default function Link({
  type = 'default',
  size = 'default',
  padding = 'default',
  className,
  background = true,
  icon,
  href,
  children,
}: Props) {
  switch (type) {
    case 'text':
      return (
        <a
          href={href}
          className={`
            transition-colors outline-2 outline-offset-2 rounded-sm border-b border-neutral-900/25 dark:border-neutral-100/25 mx-0.5
            hover:text-yellow-600 dark:hover:text-yellow-400 hover:border-current dark:hover:border-current
            focus:text-yellow-600 dark:focus:text-yellow-400 focus:border-current dark:focus:border-current
            active:text-yellow-600 dark:active:text-yellow-400 active:border-current dark:active:border-current
            focus-visible:outline focus-visible:outline-yellow-600 focus-visible:dark:outline-yellow-400
            truncate
            ${className}
          `}
          title={children?.toString()}
        >
          {children}
        </a>
      )
    case 'default':
    default:
      return (
        <a
          href={href}
          className={`${size === 'large' ? 'sm:text-md md:text-lg' : ''} 
            font-display bg-gradient-to-r bg-[length:100%_0.1em] bg-bottom bg-no-repeat rounded-sm box-decoration-clone px-1 -mx-1 outline-2 outline-offset-2 outline-yellow-500 grayscale
            
            bg-neutral-100 from-yellow-500 to-yellow-600 [text-shadow:0_0.125em_0_theme('colors.neutral.100')]
            dark:bg-neutral-900 dark:from-yellow-600 dark:to-yellow-500 dark:[text-shadow:0_0.125em_0_theme('colors.neutral.900')]
            
            hover:grayscale-0 hover:bg-[length:100%_2px] hover:text-yellow-900 hover:bg-yellow-300 hover:[text-shadow:0_0.125em_0_theme('colors.yellow.300')] 
            focus:grayscale-0 focus:bg-[length:100%_2px] focus:text-yellow-900 focus:bg-yellow-300 focus:[text-shadow:0_0.125em_0_theme('colors.yellow.300')] 
            
            dark:hover:text-yellow-400 dark:hover:bg-yellow-900 dark:hover:[text-shadow:0_0.125em_0_theme('colors.yellow.900')]
            dark:focus:text-yellow-400 dark:focus:bg-yellow-900 dark:focus:[text-shadow:0_0.125em_0_theme('colors.yellow.900')]
            
            active:outline active:outline-yellow-300 dark:active:outline-yellow-800 active:grayscale-0
            focus-visible:outline

            ${!background ? 'bg-none bg-white rounded-md' : ''}

            ${padding === 'large' ? 'px-2 py-1 -mx-1 -my-0.5' : ''}

            ${className}
          `}
        >
          {icon && (
            <Icon className="w-4 mx-auto inline mr-2 fill-current">
              {createElement(icon)}
            </Icon>
          )}
          {children}
        </a>
      )
  }
}
