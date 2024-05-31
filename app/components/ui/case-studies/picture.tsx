import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useTheme } from "~/utils/theme-provider"

export type ImageProps = {
  src: string
  alt: string
  themed: boolean
  mobile: boolean
  className: string
  children?: ReactNode
}

export function Image({
  src,
  alt,
  themed = false,
  mobile = false,
  className = '',
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
      <picture className={`[&>*]:rounded mx-auto flex items-center justify-center w-full ${className}`}>
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

export function Frame({caption, children}: {caption: string, children: ReactNode}) {
  return(
    <figure className={`relative text-center space-y-8 font-mono text-neutral-600 dark:text-neutral-400 text-xs not-prose my-8`}>
      {children}
      <Caption text={caption} />
    </figure>
  )
}

export function Caption({text}: {text: string}) {
  return (
    <figcaption className="max-w-lg mx-auto leading-relaxed text-balance">{text}</figcaption>
  )
}

export default function Picture(props: ImageProps) {
  return (
    <Frame caption={props.alt}>
      <Image {...props} />
    </Frame>
  )
}
