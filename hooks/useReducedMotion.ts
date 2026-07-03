import { useSyncExternalStore } from 'react'

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

const subscribe = (callback: () => void) => {
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

const getSnapshot = () => mediaQuery.matches

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
