import { useEffect, useRef } from 'react'

interface Section {
  readonly id: string
  readonly title: string
}

export function useScrollSpy(sections: readonly Section[], defaultTitle: string = 'SpaceTime Center') {
  const currentTitleRef = useRef<string>(defaultTitle)

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find((s) => s.id === entry.target.id)
            if (section && section.id !== 'contact') {
              currentTitleRef.current = `${section.title} ❤️ SpaceTime Center`
              if (document.title !== 'Contact ❤️ SpaceTime Center') {
                document.title = currentTitleRef.current
              }
            }
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
          document.title = entry.isIntersecting ? 'Contact ❤️ SpaceTime Center' : currentTitleRef.current
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
  }, [sections])
}
