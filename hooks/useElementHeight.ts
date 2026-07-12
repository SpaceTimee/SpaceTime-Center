import { useEffect, useState, type RefObject } from 'react'

export function useElementHeight(ref: RefObject<HTMLElement | null>): number | 'auto'
export function useElementHeight(
  activeIndex: number,
  elementRefs: RefObject<(HTMLElement | null)[]>
): number | 'auto'
export function useElementHeight(
  refOrIndex: RefObject<HTMLElement | null> | number,
  elementRefs?: RefObject<(HTMLElement | null)[]>
) {
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const element = typeof refOrIndex === 'number' ? elementRefs?.current.at(refOrIndex) : refOrIndex.current
    if (!element) return

    const applyHeight = (value: number) => setHeight(value)
    applyHeight(element.offsetHeight)

    const observer = new ResizeObserver((entries) => {
      applyHeight(entries.at(0)?.borderBoxSize.at(0)?.blockSize ?? element.offsetHeight)
    })

    observer.observe(element, { box: 'border-box' })

    return () => observer.disconnect()
  }, [elementRefs, refOrIndex])

  return height
}
