import { tagFallClicks, tagVibrateMs } from '@/consts/motion'
import { useCallback, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useTagInteraction() {
  const prefersReducedMotion = useReducedMotion()
  const [fallenTagIndices, setFallenTagIndices] = useState(() => new Set<number>())
  const [shakingTagIndex, setShakingTagIndex] = useState<number | null>(null)
  const tagClicksRef = useRef(new Map<number, number>())

  const handleTagClick = useCallback(
    (index: number) => {
      if (shakingTagIndex !== null || fallenTagIndices.has(index)) return

      const clickCount = (tagClicksRef.current.get(index) ?? 0) + 1
      tagClicksRef.current.set(index, clickCount)
      if (clickCount >= tagFallClicks) return void setFallenTagIndices((prev) => prev.union(new Set([index])))

      if (prefersReducedMotion) return

      setShakingTagIndex(index)
      navigator.vibrate?.(tagVibrateMs)
    },
    [fallenTagIndices, prefersReducedMotion, shakingTagIndex]
  )

  const handleTagShakeEnd = useCallback(() => setShakingTagIndex(null), [])

  return { fallenTagIndices, handleTagClick, handleTagShakeEnd, shakingTagIndex }
}
