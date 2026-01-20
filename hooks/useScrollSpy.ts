import { useEffect, useRef } from 'react'

interface Section {
  readonly id: string
  readonly title: string
}

interface ScrollSpyOptions {
  readonly titleSuffix?: string
  readonly contactId?: string
}

export function useScrollSpy(
  sections: readonly Section[],
  { titleSuffix = 'SpaceTime Center', contactId = 'contact' }: ScrollSpyOptions = {}
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
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const nextTitle = sectionTitleById.get(entry.target.id)
          if (!nextTitle || entry.target.id === contactId) return

          currentTitleRef.current = nextTitle
          if (!isContactActiveRef.current) {
            setTitle(nextTitle)
          }
        })
      },
      { rootMargin: '-70px 0px -80% 0px', threshold: 0 }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) sectionObserver.observe(el)
    })

    const bottomObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isContactActiveRef.current = entry.isIntersecting
          setTitle(entry.isIntersecting ? contactTitle : currentTitleRef.current)
        })
      },
      { rootMargin: '0px', threshold: 0 }
    )

    const sentinel = document.getElementById('bottom-sentinel')
    if (sentinel) bottomObserver.observe(sentinel)

    return () => {
      sectionObserver.disconnect()
      bottomObserver.disconnect()
    }
  }, [sections, titleSuffix, contactId])
}
