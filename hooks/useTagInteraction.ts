import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const TAG_FALL_TRIGGER = 10
const TAG_SHAKE_DURATION_MS = 500
const TAG_VIBRATE_MS = 50

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

      if (currentClicks >= TAG_FALL_TRIGGER) {
        setFallenTags((tags) => new Set(tags).add(index))
        return
      }

      setShakingTagIndex(index)
      if (!prefersReducedMotion) navigator.vibrate?.(TAG_VIBRATE_MS)

      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
      shakeTimeoutRef.current = setTimeout(() => {
        shakeTimeoutRef.current = null
        setShakingTagIndex(null)
      }, TAG_SHAKE_DURATION_MS)
    },
    [fallenTags, prefersReducedMotion, shakingTagIndex]
  )

  return {
    fallenTags,
    handleTagClick,
    shakingTagIndex
  }
}
