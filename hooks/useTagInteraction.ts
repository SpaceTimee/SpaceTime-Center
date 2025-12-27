import { useState, useCallback } from 'react'

export function useTagInteraction() {
  const [shakingTagIndex, setShakingTagIndex] = useState<number | null>(null)
  const [tagClicks, setTagClicks] = useState<Record<number, number>>({})
  const [fallingTags, setFallingTags] = useState<Set<number>>(new Set())
  const [collapsingTags, setCollapsingTags] = useState<Set<number>>(new Set())
  const [removedTags, setRemovedTags] = useState<Set<number>>(new Set())

  const handleTagClick = useCallback(
    (index: number) => {
      if (shakingTagIndex !== null || fallingTags.has(index)) return

      setTagClicks((prev) => {
        const currentClicks = (prev[index] || 0) + 1

        if (currentClicks >= 10) {
          setFallingTags((tags) => new Set(tags).add(index))
          setCollapsingTags((tags) => new Set(tags).add(index))
          setTimeout(() => setRemovedTags((tags) => new Set(tags).add(index)), 600)
        }

        return { ...prev, [index]: currentClicks }
      })

      if ((tagClicks[index] || 0) < 9) {
        setShakingTagIndex(index)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50)
        }
        setTimeout(() => setShakingTagIndex(null), 500)
      }
    },
    [shakingTagIndex, fallingTags, tagClicks]
  )

  return {
    shakingTagIndex,
    fallingTags,
    collapsingTags,
    removedTags,
    handleTagClick
  }
}
