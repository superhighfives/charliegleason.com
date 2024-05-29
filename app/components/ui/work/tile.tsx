import type { RefObject } from 'react'
import { useRef, useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import css from './tile.module.css'

export type ColorType = 'yellow' | 'indigo' | 'pink' | 'amber' | 'emerald' | 'red' | 'rose' | 'blue' | 'sky'

export const useMousePosition = (ref: any) => {
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
          x: y / (reference.offsetHeight / 2),
          y: x / (reference.offsetWidth / 2),
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

export default function Tile({
  id,
  title,
  description,
  href,
  color,
  viewportRef,
  type,
  format = "png",
}: {
  id: string
  title: string
  href: string
  color: ColorType
  viewportRef: RefObject<HTMLDivElement>
  type: 'case-studies' | 'work'
  format: 'png' | 'webp'
  description?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const position = useMousePosition(ref)

  const variantsColors = {
    yellow: 'from-yellow-500 to-yellow-800 dark:to-yellow-300',
    pink: 'from-pink-500 to-pink-800 dark:to-pink-300',
    indigo: 'from-indigo-500 to-indigo-800 dark:to-indigo-300',
    amber: 'from-amber-500 to-amber-800 dark:to-amber-300',
    emerald: 'from-emerald-500 to-emerald-800 dark:to-emerald-300',
    red: 'from-red-500 to-red-800 dark:to-red-300',
    rose: 'from-rose-500 to-rose-800 dark:to-rose-300',
    blue: 'from-blue-500 to-blue-800 dark:to-blue-300',
    sky: 'from-sky-500 to-sky-800 dark:to-sky-300',
  }

  const outlineColors = {
    yellow:  'group-focus:outline-yellow-600 dark:group-focus:outline-yellow-400 group-hover:outline-yellow-600 dark:group-hover:outline-yellow-400',
    pink:    'group-focus:outline-pink-600 dark:group-focus:outline-pink-400 group-hover:outline-pink-600 dark:group-hover:outline-pink-400',
    indigo:  'group-focus:outline-indigo-600 dark:group-focus:outline-indigo-400 group-hover:outline-indigo-600 dark:group-hover:outline-indigo-400',
    amber:   'group-focus:outline-amber-600 dark:group-focus:outline-amber-400 group-hover:outline-amber-600 dark:group-hover:outline-amber-400',
    emerald: 'group-focus:outline-emerald-600 dark:group-focus:outline-emerald-400 group-hover:outline-emerald-600 dark:group-hover:outline-emerald-400',
    red:     'group-focus:outline-red-600 dark:group-focus:outline-red-400 group-hover:outline-red-600 dark:group-hover:outline-red-400',
    rose:    'group-focus:outline-rose-600 dark:group-focus:outline-rose-400 group-hover:outline-rose-600 dark:group-hover:outline-rose-400',
    blue:    'group-focus:outline-blue-600 dark:group-focus:outline-blue-400 group-hover:outline-blue-600 dark:group-hover:outline-blue-400',
    sky:     'group-focus:outline-sky-600 dark:group-focus:outline-sky-400 group-hover:outline-sky-600 dark:group-hover:outline-sky-400',
  }

  function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - TS doesn't know about this property
      navigator.msMaxTouchPoints > 0
    )
  }

  useEffect(() => {
    ref.current?.style.setProperty('--x', `${position.x.toFixed(2)}deg`)
    ref.current?.style.setProperty('--y', `${position.y.toFixed(2)}deg`)
    !isTouchDevice() &&
      ref.current?.style.setProperty(
        'perspective',
        `${ref.current?.getBoundingClientRect().width / 7.5}px`
      )
  }, [position.x, position.y])

  const [viewRef, inView] = useInView({
    threshold: 0.75,
    root: viewportRef.current,
  })

  return (
    <a
      href={href}
      ref={viewRef}
      className={`group group:focus group:hover block space-y-4 outline-none ${
        inView && window.innerWidth < 640 ? 'inframe' : ''
      }`}
    >
      <div className="relative">
        <div
          className={`aspect-[1.72/1]
          outline outline-2 outline-transparent
        group-focus:outline-none group-focus:shadow-outline
        outline-offset-2 ${outlineColors[color]}
        rounded-lg transition-all duration-300`}
          ref={ref}
        >
          <img
            src={`/assets/${type}/${id}/screenshot.${format}`}
            className={`absolute inset-0 z-10 left-4 grayscale pointer-events-none
            group-[.inframe]:-left-2 group-[.inframe]:grayscale-0
            group-focus:-left-2 group-focus:grayscale-0
            sm:group-hover:-left-2 sm:group-hover:grayscale-0
            transition-all duration-500 ease-out`}
            alt=""
          />
          <div
            className={`${css.move} shadow-lg rounded-lg overflow-hidden transition-transform duration-500 ease-out pointer-events-none`}
          >
            <img
              src={`/assets/${type}/${id}/tile.${format}`}
              className={`max-w-full w-full grayscale
              sm:group-hover:grayscale-0
              group-focus:grayscale-0
              group-[.inframe]:grayscale-0
              transition-all duration-500 ease-out rounded-2xl`}
              alt=""
            />
          </div>
        </div>
        <img
          src={`/assets/${type}/${id}/icon.${format}`}
          className="w-[20%] h-auto rounded-lg shadow-xl absolute top-[50%] -left-4 pointer-events-none transform -translate-y-1/2"
          alt=""
        />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <h2
          className={`text-transparent bg-clip-text bg-gradient-to-bl ${variantsColors[color]} font-display text-xl whitespace-nowrap`}
        >
          {title}
        </h2>
        {description ? 
        <h2 className="text-xxs text-neutral-600 dark:text-neutral-400">
          {description}
        </h2> : null}
      </div>
    </a>
  )
}
