import { useEffect, useState, type RefObject } from 'react'

export function useDynamicHeight(activeIndex: number, tabRefs: RefObject<(HTMLElement | null)[]>) {
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const activePanel = tabRefs.current?.[activeIndex]
    if (!activePanel) return

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height ?? 'auto')
    })

    observer.observe(activePanel)

    return () => observer.disconnect()
  }, [activeIndex, tabRefs])

  return height
}
