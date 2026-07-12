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
  const lastTitleRef = useRef(titleSuffix)
  const isContactActiveRef = useRef(false)

  useEffect(() => {
    const buildTitle = (title: string) => `${title} ❤️ ${titleSuffix}`
    const titleById = new Map(sections.map((section) => [section.id, buildTitle(section.title)]))
    const firstTitle = sections[0]?.title
    const initialTitle = firstTitle ? buildTitle(firstTitle) : titleSuffix
    lastTitleRef.current = initialTitle
    document.title = initialTitle

    let sectionObserver: IntersectionObserver | null = null
    const observeSections = () => {
      sectionObserver?.disconnect()
      sectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const nextTitle = titleById.get(entry.target.id)
            if (!nextTitle) continue
            lastTitleRef.current = nextTitle
            if (!isContactActiveRef.current) document.title = nextTitle
          }
        },
        { rootMargin: `-64px 0px ${64 + 32 - innerHeight}px 0px` }
      )

      for (const { id } of sections) {
        if (id === contactId) continue
        const element = document.getElementById(id)
        if (element) sectionObserver.observe(element)
      }
    }

    observeSections()
    const controller = new AbortController()
    addEventListener('resize', observeSections, { passive: true, signal: controller.signal })

    const contactObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return

      isContactActiveRef.current = entry.isIntersecting
      document.title = entry.isIntersecting
        ? (titleById.get(contactId) ?? lastTitleRef.current)
        : lastTitleRef.current
    })

    const sentinel = document.getElementById('bottom-sentinel')
    if (sentinel) contactObserver.observe(sentinel)

    let isMounted = true
    const sectionId = location.hash.slice(1)
    if (titleById.has(sectionId)) {
      void document.fonts.ready.finally(() => {
        if (!isMounted) return

        document.getElementById(sectionId)?.scrollIntoView()
      })
    }

    return () => {
      isMounted = false
      sectionObserver?.disconnect()
      contactObserver.disconnect()
      controller.abort()
    }
  }, [contactId, sections, titleSuffix])
}
