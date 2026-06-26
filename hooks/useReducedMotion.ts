import { useSyncExternalStore } from 'react'

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

const subscribe = (cb: () => void) => {
  mediaQuery.addEventListener('change', cb)
  return () => mediaQuery.removeEventListener('change', cb)
}

const getSnapshot = () => mediaQuery.matches

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
