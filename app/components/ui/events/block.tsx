import type { ReactNode } from 'react'
import { useRef, useState, useEffect, Children } from 'react'
import Title from '~/components/ui/title'

type Props = {
  id: string
  title?: string
  wide?: boolean
  children: ReactNode
  className?: string
}

export default function Block({ id, title, children, wide, className = "" }: Props) {
  const [hideItems, setHideItems] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(ref.current){
      if(Children.count(children) >= 12) {
        setHideItems(true)
      }
    }
   }, [children])

  return (
    <div
      ref={ref}
      id={id}
      className={`grid ${wide ? 'sm:col-span-2 sm:grid-cols-2 sm:row-span-2' : 'grid-cols-1'} gap-4 text-xs text-neutral-800 dark:text-neutral-300 auto-rows-min ${hideItems ? 'max-sm:[&>li:nth-child(n+10)]:hidden' : ''} ${className}`}
    >
      {title ? (
        <Title className={`col-span-full`}>
          {title}
        </Title>
      ) : null}
      {children}
      {hideItems ? (
          <button className="col-span-full sm:hidden text-left border-t border-current text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-300 p-2" onClick={() => setHideItems(false)}>Show more</button>
      ) : null}
    </div>
  )
}
