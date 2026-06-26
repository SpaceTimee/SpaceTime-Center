import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

const TAG_FALL_DELAY_MS = 600
const TAG_FALL_TRIGGER = 10
const TAG_SHAKE_DURATION_MS = 500
const TAG_SHAKE_LIMIT = 9
const TAG_VIBRATE_MS = 50

export function useTagInteraction() {
  const [shakingTagIndex, setShakingTagIndex] = useState<number | null>(null)
  const [fallingTags, setFallingTags] = useState<Set<number>>(new Set())
  const [collapsingTags, setCollapsingTags] = useState<Set<number>>(new Set())
  const [removedTags, setRemovedTags] = useState<Set<number>>(new Set())
  const tagClicksRef = useRef<Record<number, number>>({})
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const timeoutIds = timeoutIdsRef
    return () => {
      for (const timeoutId of timeoutIds.current) clearTimeout(timeoutId)
      timeoutIds.current.clear()
    }
  }, [])

  const scheduleTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId)
      callback()
    }, delay)

    timeoutIdsRef.current.add(timeoutId)
  }, [])

  const handleTagClick = useCallback(
    (index: number) => {
      if (shakingTagIndex !== null || fallingTags.has(index)) return

      tagClicksRef.current[index] ??= 0
      const currentClicks = ++tagClicksRef.current[index]

      if (currentClicks >= TAG_FALL_TRIGGER) {
        setFallingTags((tags) => new Set(tags).add(index))
        setCollapsingTags((tags) => new Set(tags).add(index))
        scheduleTimeout(() => setRemovedTags((tags) => new Set(tags).add(index)), TAG_FALL_DELAY_MS)
      }

      if (currentClicks <= TAG_SHAKE_LIMIT) {
        setShakingTagIndex(index)
        if (!prefersReducedMotion) {
          navigator.vibrate?.(TAG_VIBRATE_MS)
        }
        scheduleTimeout(() => setShakingTagIndex(null), TAG_SHAKE_DURATION_MS)
      }
    },
    [fallingTags, prefersReducedMotion, scheduleTimeout, shakingTagIndex]
  )

  return {
    collapsingTags,
    fallingTags,
    handleTagClick,
    removedTags,
    shakingTagIndex
  }
}
