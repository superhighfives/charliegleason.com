import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useTheme } from "~/utils/theme-provider"
import Icon, { Zoom } from '../icon'

export type ImageProps = {
  src: string
  alt: string
  themed: boolean
  mobile: boolean
  className: string
  factor?: number
  forceBackground?: boolean
  zoomable?: boolean
  shadow?: boolean
  children?: ReactNode
}

export function Image({
  src,
  alt,
  themed = false,
  mobile = false,
  className = '',
  shadow = false,
  children = null
  
}: ImageProps) {
  let baseImage = src
  let darkImage = baseImage.split('.').join('-dark.')
  let mobileImage = baseImage.split('.').join('-mobile.')
  let mobileDarkImage = darkImage.split('.').join('-mobile.')
  
  const [themeState] = useTheme()
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    setTheme(themeState as string)
  }, [themeState])

  return (
    <>
      <picture className={`overflow-hidden rounded-lg ${shadow ? 'shadow-xl' : ''} inline-flex align-top ${className}`}>
        {mobile && themed && theme == 'dark' ? <source media="(max-width: 799px)" srcSet={mobileDarkImage} /> : null}
        {themed && theme == 'dark'? <source media="(min-width: 800px)" srcSet={darkImage} /> : null}
        {mobile && (theme == 'light' || !themed) ? <source media="(max-width: 799px)" srcSet={mobileImage} /> : null}
        {theme == 'light' ? <source media="(min-width: 800px)" srcSet={baseImage} /> : null}
        <img src={baseImage} alt={alt} />
      </picture>
      {children}
    </>
  )
}

export function Frame({caption, zoomable = false, children, forceBackground = false}: {caption: string, zoomable?: boolean, children: ReactNode, forceBackground?: boolean}) {
  return(
    <figure className={`relative text-center font-mono text-neutral-600 dark:text-neutral-400 text-xs not-prose`}>
      {children}
      <Caption zoomable={zoomable} text={caption} forceBackground={forceBackground} />
    </figure>
  )
}

export function Caption({text, zoomable = false, forceBackground = false}: {text: string, zoomable: boolean, forceBackground: boolean}) {
  return (
    <div className={`flex justify-center items-center gap-4 ${forceBackground ? 'mt-8 mb-16' : 'mt-8'}`}>
      <figcaption className="max-w-lg leading-relaxed text-balance text-left sm:text-center">
        {text}
      </figcaption>
      {zoomable ?
        <div className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-500 border border-yellow-500 dark:border-yellow-700 rounded-full px-2 py-1">
          <Icon className="w-4 h-4 fill-current pointer-events-none">
            <Zoom />
          </Icon>
          Zoomable<span className="hidden sm:block"> image</span>
        </div>
      : null}
    </div>
  )
}

export default function Picture(props: ImageProps) {
  return (
    <Frame forceBackground={props.forceBackground} caption={props.alt}>
      <Image {...props} />
    </Frame>
  )
}
