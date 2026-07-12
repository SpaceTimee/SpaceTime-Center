import { useSyncExternalStore } from 'react'

const minNavQuery = matchMedia('(width >= 827px)')

const subscribe = (callback: () => void) => {
  const controller = new AbortController()
  minNavQuery.addEventListener('change', callback, { signal: controller.signal })
  return () => controller.abort()
}

const getSnapshot = () => minNavQuery.matches
const getServerSnapshot = () => false

export function useMinNav() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
