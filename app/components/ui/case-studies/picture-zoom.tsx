import { useState, useEffect, useRef } from 'react'
import { Frame, Image } from './picture'
import type { ImageProps } from './picture'
import { isTouchDevice } from '~/utils/touch'


const useMousePosition = (ref: any) => {  
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if(isTouchDevice()) return
    
    const reference = ref.current
    var counter = 0
    var updateRate = 1
    var isTimeToUpdate = function () {
      return counter++ % updateRate === 0
    }

    const setFromEvent = (e: MouseEvent) => {
      if (isTimeToUpdate()) {
        var rect = (e.target as HTMLDivElement).getBoundingClientRect()

        const _x = reference.offsetLeft + Math.floor(reference.offsetWidth / 2)
        const _y = reference.offsetTop + Math.floor(reference.offsetHeight / 2)

        const x = (e.clientX - rect.left - _x) * -1
        const y = (e.clientY - rect.top - _y) * -1

        setPosition({
          x: x,
          y: y,
        })
      }
    }

    reference.addEventListener('mousemove', setFromEvent)
    return () => {
      reference.removeEventListener('mousemove', setFromEvent)
    }
  }, [ref])

  return position
}

export default function PictureZoom(props: ImageProps) {
  const factor = props.factor ?? 2
  
  const ref = useRef<HTMLDivElement>(null)
  const position = useMousePosition(ref)
  const [ignoreZoom, setIgnoreZoom] = useState(false)

  const handleResize = () => {
    setIgnoreZoom(isTouchDevice())
    window.removeEventListener("resize", handleResize)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize, false)
  })


  useEffect(() => {
    if (!isTouchDevice()) {
      const x = position.x - (factor - 2) * ((factor * -position.x / 2) + position.x)
      const y = position.y - (factor - 2) * ((factor * -position.y / 2) + position.y)
      console.log(x, y)
      const pointerX = (position.x - (ref.current?.clientWidth ?? 0) / 2) * -1
      const pointerY = (position.y - (ref.current?.clientHeight ?? 0) / 2) * -1
      ref.current?.parentElement?.style.setProperty('--x', `${x}px`)
      ref.current?.parentElement?.style.setProperty('--y', `${y}px`)
      ref.current?.parentElement?.style.setProperty('--pointer-x', `${pointerX}px`)
      ref.current?.parentElement?.style.setProperty('--pointer-y', `${pointerY}px`)
    } else {
      setIgnoreZoom(true)
    }
  }, [position.x, position.y, factor])

  const zoom = {
    2: 'scale-[2]',
    4: 'scale-[4]',
  }

  const mask = {
    2: '[clip-path:circle(100px_at_var(--pointer-x)_var(--pointer-y))]',
    4: '[clip-path:circle(50px_at_var(--pointer-x)_var(--pointer-y))]',
  }

  const forceBackground = props.forceBackground ? 'dark:bg-black dark:shadow-[0_0_0_100px_rgba(0,0,0,1)]' : 'dark:bg-neutral-900 dark:shadow-[0_0_0_100px_rgba(23,23,23,1)]'

  return (
    <Frame zoomable caption={props.alt}>
      {ignoreZoom ? <Image {...props} /> : <>
      <div className={`relative group group-hover cursor-crosshair z-10`}>
        <Image {...props} className={`opacity-0 group-hover:opacity-100 transition-opacity bg-white z-1 absolute top-0 left-0 right-0 translate-x-[var(--x)] translate-y-[var(--y)] pointer-events-none shadow-[0_0_0_100px_rgba(255,255,255,1)] ${forceBackground} ${mask[factor as keyof typeof mask]} ${zoom[factor as keyof typeof zoom]}`}>
          <div className={`border-4 w-[400px] h-[400px] shadow-2xl absolute top-0 left-0 translate-x-[calc(var(--pointer-x)-50%)] rounded-full translate-y-[calc(var(--pointer-y)-50%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`} />
        </Image>
        <div ref={ref}>
          <Image {...props} />
        </div>
      </div></>}
    </Frame>
  )
}
