import { useCallback, useEffect, useRef, useState } from 'react'
import { tagFallAt, tagVibrateMs, durationMs } from '@/consts/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function useTagInteraction() {
  const [shakingTagIndex, setShakingTagIndex] = useState<number | null>(null)
  const [fallenTags, setFallenTags] = useState(() => new Set<number>())
  const tagClicksRef = useRef<number[]>([])
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(
    () => () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
    },
    []
  )

  const handleTagClick = useCallback(
    (index: number) => {
      if (shakingTagIndex !== null || fallenTags.has(index)) return

      const currentClicks = (tagClicksRef.current[index] ?? 0) + 1
      tagClicksRef.current[index] = currentClicks

      if (currentClicks >= tagFallAt) {
        setFallenTags((tags) => new Set(tags).add(index))
        return
      }

      setShakingTagIndex(index)
      if (!prefersReducedMotion) navigator.vibrate?.(tagVibrateMs)

      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
      shakeTimeoutRef.current = setTimeout(() => {
        shakeTimeoutRef.current = null
        setShakingTagIndex(null)
      }, durationMs)
    },
    [fallenTags, prefersReducedMotion, shakingTagIndex]
  )

  return {
    fallenTags,
    handleTagClick,
    shakingTagIndex
  }
}
