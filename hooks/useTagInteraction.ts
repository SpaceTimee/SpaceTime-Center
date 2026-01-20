import { useCallback, useEffect, useRef, useState } from 'react'

const TAG_FALL_TRIGGER = 10
const TAG_SHAKE_LIMIT = 9
const TAG_SHAKE_DURATION_MS = 500
const TAG_FALL_DELAY_MS = 600
const TAG_VIBRATE_MS = 50

export function useTagInteraction() {
  const [shakingTagIndex, setShakingTagIndex] = useState<number | null>(null)
  const [fallingTags, setFallingTags] = useState<Set<number>>(new Set())
  const [collapsingTags, setCollapsingTags] = useState<Set<number>>(new Set())
  const [removedTags, setRemovedTags] = useState<Set<number>>(new Set())
  const tagClicksRef = useRef<Record<number, number>>({})
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const prefersReducedMotionRef = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const scheduleTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId)
      callback()
    }, delay)

    timeoutIdsRef.current.add(timeoutId)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = event.matches
    }

    prefersReducedMotionRef.current = media.matches
    media.addEventListener?.('change', handleChange)

    return () => {
      media.removeEventListener?.('change', handleChange)
    }
  }, [])

  useEffect(() => {
    const timeoutIds = timeoutIdsRef
    return () => {
      timeoutIds.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutIds.current.clear()
    }
  }, [])

  const handleTagClick = useCallback(
    (index: number) => {
      if (shakingTagIndex !== null || fallingTags.has(index)) return

      const currentClicks = (tagClicksRef.current[index] ?? 0) + 1
      tagClicksRef.current[index] = currentClicks

      if (currentClicks >= TAG_FALL_TRIGGER) {
        setFallingTags((tags) => new Set(tags).add(index))
        setCollapsingTags((tags) => new Set(tags).add(index))
        scheduleTimeout(() => setRemovedTags((tags) => new Set(tags).add(index)), TAG_FALL_DELAY_MS)
      }

      if (currentClicks <= TAG_SHAKE_LIMIT) {
        setShakingTagIndex(index)
        if (!prefersReducedMotionRef.current && typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(TAG_VIBRATE_MS)
        }
        scheduleTimeout(() => setShakingTagIndex(null), TAG_SHAKE_DURATION_MS)
      }
    },
    [shakingTagIndex, fallingTags, scheduleTimeout]
  )

  return {
    shakingTagIndex,
    fallingTags,
    collapsingTags,
    removedTags,
    handleTagClick
  }
}
