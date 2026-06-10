import { useEffect, useRef } from 'react'

interface Section {
  readonly id: string
  readonly title: string
}

interface ScrollSpyOptions {
  readonly contactId?: string
  readonly titleSuffix?: string
}

export function useScrollSpy(
  sections: readonly Section[],
  { contactId = 'contact', titleSuffix = 'SpaceTime Center' }: ScrollSpyOptions = {}
) {
  const currentTitleRef = useRef<string>(titleSuffix)
  const isContactActiveRef = useRef(false)

  useEffect(() => {
    const buildTitle = (title: string) => `${title} ❤️ ${titleSuffix}`
    const sectionTitleById = new Map(sections.map((section) => [section.id, buildTitle(section.title)]))
    const contactTitle = sectionTitleById.get(contactId) ?? buildTitle('Contact')
    const initialTitle = sectionTitleById.get(sections[0]?.id ?? '') ?? titleSuffix
    currentTitleRef.current = initialTitle

    const setTitle = (title: string) => {
      if (document.title !== title) {
        document.title = title
      }
    }
    setTitle(initialTitle)

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const nextTitle = sectionTitleById.get(entry.target.id)
          if (!nextTitle || entry.target.id === contactId) continue

          currentTitleRef.current = nextTitle
          if (!isContactActiveRef.current) {
            setTitle(nextTitle)
          }
        }
      },
      { rootMargin: '-70px 0px -80% 0px', threshold: 0 }
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) sectionObserver.observe(el)
    }

    const bottomObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isContactActiveRef.current = entry.isIntersecting
          setTitle(entry.isIntersecting ? contactTitle : currentTitleRef.current)
        }
      },
      { rootMargin: '0px', threshold: 0 }
    )

    const sentinel = document.getElementById('bottom-sentinel')
    if (sentinel) bottomObserver.observe(sentinel)

    return () => {
      sectionObserver.disconnect()
      bottomObserver.disconnect()
    }
  }, [contactId, sections, titleSuffix])
}
