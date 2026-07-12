import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

const colorSchemeQuery = matchMedia('(prefers-color-scheme: dark)')

const subscribe = (callback: () => void) => {
  const controller = new AbortController()
  colorSchemeQuery.addEventListener('change', callback, { signal: controller.signal })
  return () => controller.abort()
}

const getSnapshot = () => colorSchemeQuery.matches
const getServerSnapshot = () => false

export function useTheme() {
  const systemIsDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [storedIsDark, setStoredIsDark] = useState((): boolean | null => {
    try {
      const storedTheme = localStorage.getItem('theme')
      if (storedTheme === 'dark') return true
      if (storedTheme === 'light') return false
    } catch {
      // Ignore storage failures
    }

    return null
  })

  const isDark = storedIsDark ?? systemIsDark

  useEffect(() => void document.documentElement.classList.toggle('dark', isDark), [isDark])

  const toggleTheme = useCallback(
    () =>
      setStoredIsDark((prev) => {
        const nextIsDark = !(prev ?? colorSchemeQuery.matches)
        try {
          localStorage.setItem('theme', nextIsDark ? 'dark' : 'light')
        } catch {
          // Ignore storage failures
        }

        return nextIsDark
      }),
    []
  )

  return { isDark, toggleTheme }
}
