import { useCallback, useEffect, useState } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme === 'dark' || (savedTheme === null && prefersDark)
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    const controller = new AbortController()

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener(
      'change',
      (event) => {
        if (localStorage.getItem('theme') !== null) return
        setIsDark(event.matches)
      },
      { signal: controller.signal }
    )

    return () => controller.abort()
  }, [])

  const toggleTheme = useCallback(() => {
    const newMode = !isDark
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    setIsDark(newMode)
  }, [isDark])

  return { isDark, toggleTheme }
}
