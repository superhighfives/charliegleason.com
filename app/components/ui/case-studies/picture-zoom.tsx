import { useState, useEffect, useRef } from 'react'
import { Frame, Image } from './picture'
import type { ImageProps } from './picture'
import { isTouchDevice } from '~/utils/touch'
import Icon, { Zoom } from '../icon'

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
  const ref = useRef<HTMLDivElement>(null)
  const position = useMousePosition(ref)

  useEffect(() => {
    if (!isTouchDevice()) {
      const x = position.x.toFixed(2)
      const y = position.y.toFixed(2)
      const pointerX = (position.x - (ref.current?.clientWidth ?? 0) / 2) * -1
      const pointerY = (position.y - (ref.current?.clientHeight ?? 0) / 2) * -1
      ref.current?.parentElement?.style.setProperty('--x', `${x}px`)
      ref.current?.parentElement?.style.setProperty('--y', `${y}px`)
      ref.current?.parentElement?.style.setProperty('--pointer-x', `${pointerX}px`)
      ref.current?.parentElement?.style.setProperty('--pointer-y', `${pointerY}px`)
    }
  }, [position.x, position.y])

  return (
    <Frame caption={props.alt}>
      <Icon className="w-6 h-6 fill-current pointer-events-none absolute top-4 right-4 text-neutral-400 dark:text-neutral-600">
        <Zoom />
      </Icon>
      <div className={`relative group group-hover cursor-crosshair`}>
        <Image {...props} className="opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900 bg-white [clip-path:circle(100px_at_var(--pointer-x)_var(--pointer-y))] z-1 absolute top-0 left-0 right-0 scale-[200%] translate-x-[var(--x)] translate-y-[var(--y)] pointer-events-none shadow-[0_0_0_100px_rgba(255,255,255,1)] dark:shadow-[0_0_0_100px_rgba(23,23,23,1)]">
          <div className="border-4 w-[400px] h-[400px] shadow-2xl absolute top-0 left-0 translate-x-[calc(var(--pointer-x)-50%)] rounded-full translate-y-[calc(var(--pointer-y)-50%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </Image>
        <div ref={ref}>
          <Image {...props} />
        </div>
      </div>
    </Frame>
  )
}
