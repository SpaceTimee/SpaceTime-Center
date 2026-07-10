import { useEffect, useState, type RefObject } from 'react'

function observeElementHeight(element: HTMLElement, onHeight: (height: number) => void) {
  const observer = new ResizeObserver(([entry]) => {
    onHeight(entry.borderBoxSize[0]?.blockSize ?? element.offsetHeight)
  })
  observer.observe(element)
  return () => observer.disconnect()
}

export function useElementHeight(ref: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const element = ref.current
    if (!element) return
    return observeElementHeight(element, setHeight)
  }, [ref])

  return height
}

export function useDynamicHeight(activeIndex: number, tabRefs: RefObject<(HTMLElement | null)[]>) {
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const element = tabRefs.current?.[activeIndex]
    if (!element) return
    return observeElementHeight(element, setHeight)
  }, [activeIndex, tabRefs])

  return height
}
