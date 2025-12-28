import { type RefObject, useEffect, useState } from 'react'

export function useDynamicHeight(activeIndex: number, slidesRef: RefObject<(HTMLElement | null)[]>) {
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const activeElement = slidesRef.current?.[activeIndex]
    if (!activeElement) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === activeElement) {
          setHeight(entry.contentRect.height)
        }
      }
    })

    observer.observe(activeElement)

    return () => observer.disconnect()
  }, [activeIndex, slidesRef])

  return height
}
