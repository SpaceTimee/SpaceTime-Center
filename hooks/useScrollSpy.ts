import { sectionIds } from '@/consts/navigation'
import { name } from '@/consts/site'
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
  { contactId = sectionIds.contact, titleSuffix = name }: ScrollSpyOptions = {}
) {
  const lastSectionTitleRef = useRef(titleSuffix)
  const isContactActiveRef = useRef(false)

  useEffect(() => {
    const buildTitle = (title: string) => `${title} ❤️ ${titleSuffix}`
    const sectionTitleById = new Map(sections.map((section) => [section.id, buildTitle(section.title)]))
    const contactTitle = sectionTitleById.get(contactId) ?? buildTitle('Contact')
    const initialTitle = sectionTitleById.get(sections[0]?.id ?? '') ?? titleSuffix
    lastSectionTitleRef.current = initialTitle
    document.title = initialTitle

    const targets = sections.flatMap(({ id }) => {
      if (id === contactId) return []
      const element = document.getElementById(id)
      return element ? [element] : []
    })

    let sectionObserver: IntersectionObserver | undefined

    const observeSections = () => {
      sectionObserver?.disconnect()
      sectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const nextTitle = sectionTitleById.get(entry.target.id)
            if (!nextTitle) continue
            lastSectionTitleRef.current = nextTitle
            if (!isContactActiveRef.current) document.title = nextTitle
          }
        },
        { rootMargin: `-64px 0px ${64 + 32 - window.innerHeight}px 0px` }
      )
      for (const target of targets) sectionObserver.observe(target)
    }

    observeSections()
    const controller = new AbortController()
    window.addEventListener('resize', observeSections, { passive: true, signal: controller.signal })

    const bottomObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return
      isContactActiveRef.current = entry.isIntersecting
      document.title = entry.isIntersecting ? contactTitle : lastSectionTitleRef.current
    })
    const sentinel = document.getElementById('bottom-sentinel')
    if (sentinel) bottomObserver.observe(sentinel)

    const id = location.hash.slice(1)
    if (sectionTitleById.has(id)) {
      void document.fonts.ready.then(() => document.getElementById(id)?.scrollIntoView())
    }

    return () => {
      sectionObserver?.disconnect()
      bottomObserver.disconnect()
      controller.abort()
    }
  }, [contactId, sections, titleSuffix])
}
