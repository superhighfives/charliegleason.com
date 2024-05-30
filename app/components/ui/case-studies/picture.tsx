import { useState, useEffect } from 'react'
import { useTheme } from "~/utils/theme-provider"

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


export default function Picture({
  src,
  alt,
  themed = false,
  mobile = false,
  zoom = true,
}: {
  src: string
  alt: string
  themed: boolean
  mobile: boolean
  zoom: boolean
}) {
  let baseImage = src
  let darkImage = baseImage.split('.').join('-dark.')
  let mobileImage = baseImage.split('.').join('-mobile.')
  let mobileDarkImage = darkImage.split('.').join('-mobile.')
  
  const [themeState] = useTheme()
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    setTheme(themeState as string)
  }, [themeState])

  function Image() { return (
    <figure className="text-center space-y-2 font-mono text-gray-600 text-xs">
      <picture className="[&>*]:rounded mx-auto flex items-center justify-center w-full">
        {mobile && themed && theme == 'dark' ? <source media="(max-width: 799px)" srcSet={mobileDarkImage} /> : null}
        {themed && theme == 'dark'? <source media="(min-width: 800px)" srcSet={darkImage} /> : null}
        {mobile && (theme == 'light' || !themed) ? <source media="(max-width: 799px)" srcSet={mobileImage} /> : null}
        {theme == 'light' ? <source media="(min-width: 800px)" srcSet={baseImage} /> : null}
        
        <img src={baseImage} alt={alt} />
      </picture>
      <figcaption className="max-w-lg mx-auto">{alt}</figcaption>
    </figure>
  )}

  return zoom ? <Zoom>
    <Image />
    </Zoom>
    : <Image />
}
