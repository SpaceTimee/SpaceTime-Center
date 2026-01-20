import { type RefObject, useEffect, useState } from 'react'

export function useDynamicHeight(activeIndex: number, tabRefs: RefObject<(HTMLElement | null)[]>) {
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const activeElement = tabRefs.current?.[activeIndex]
    if (!activeElement) return

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height || 'auto')
    })

    observer.observe(activeElement)

    return () => observer.disconnect()
  }, [activeIndex, tabRefs])

  return height
}
