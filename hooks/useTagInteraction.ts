import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

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
  const tagClicksRef = useRef<Map<number, number>>(new Map())
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const trackedTimeouts = timeoutIdsRef.current
    return () => {
      for (const timeoutId of trackedTimeouts) clearTimeout(timeoutId)
      trackedTimeouts.clear()
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

      const currentClicks = (tagClicksRef.current.get(index) ?? 0) + 1
      tagClicksRef.current.set(index, currentClicks)

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
