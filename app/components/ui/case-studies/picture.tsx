import { useState, useEffect, useRef } from 'react'
import { useTheme } from "~/utils/theme-provider"

const useMousePosition = (ref: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const reference = ref.current
    var counter = 0
    var updateRate = 5
    var isTimeToUpdate = function () {
      return counter++ % updateRate === 0
    }

    const setFromEvent = (e: MouseEvent) => {
      if (isTimeToUpdate()) {
        var rect = (e.target as HTMLDivElement).getBoundingClientRect()

        const _x = reference.offsetLeft + Math.floor(reference.offsetWidth / 2)
        const _y = reference.offsetTop + Math.floor(reference.offsetHeight / 2)

        const x = e.clientX - rect.left - _x
        const y = (e.clientY - rect.top - _y) * -1

        setPosition({
          x: x,
          y: y,
        })
      }
    }

    const setToZero = () => {
      setPosition({ x: 0, y: 0 })
    }
    reference.addEventListener('mousemove', setFromEvent)
    reference.addEventListener('mouseleave', setToZero)
    return () => {
      reference.removeEventListener('mousemove', setFromEvent)
      reference.removeEventListener('mouseleave', setToZero)
    }
  }, [ref])

  return position
}

export default function Picture({
  src,
  alt,
  themed = false,
  mobile = false,
  zoom = false
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

  const ref = useRef<HTMLDivElement>(null)
  const position = useMousePosition(ref)

  function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - TS doesn't know about this property
      navigator.msMaxTouchPoints > 0
    )
  }

  useEffect(() => {
    console.log(position.x, position.y)
    ref.current?.style.setProperty('--x', `${position.x.toFixed(2)}px`)
    ref.current?.style.setProperty('--y', `${position.y.toFixed(2)}px`)
    !isTouchDevice() &&
      ref.current?.style.setProperty(
        'perspective',
        `${ref.current?.getBoundingClientRect().width / 7.5}px`
      )
  }, [position.x, position.y])

  function Image({zoom = false}) {
    return (
      <picture className={`[&>*]:rounded mx-auto flex items-center justify-center w-full not-prose ${zoom ? 'absolute top-0 left-0 right-0 scale-150 translate-x-[var(--x)] translate-y-[var(--y)] pointer-events-none' : ''}`}>
        {mobile && themed && theme == 'dark' ? <source media="(max-width: 799px)" srcSet={mobileDarkImage} /> : null}
        {themed && theme == 'dark'? <source media="(min-width: 800px)" srcSet={darkImage} /> : null}
        {mobile && (theme == 'light' || !themed) ? <source media="(max-width: 799px)" srcSet={mobileImage} /> : null}
        {theme == 'light' ? <source media="(min-width: 800px)" srcSet={baseImage} /> : null}
        <img src={baseImage} alt={alt} />
      </picture>
    )
  }

  return (
    <figure className="relative text-center space-y-2 font-mono text-gray-600 text-xs overflow-hidden">
      <div>
        {zoom ? <Image zoom /> : null}
        <div ref={ref}>
          <Image />
        </div>
      </div>
      <figcaption className="max-w-lg mx-auto">{alt}</figcaption>
    </figure>
  )
}
