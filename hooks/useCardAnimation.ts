import { followSpring, spotlightInner, spotlightOuter, tiltDeg } from '@/consts/motion'
import { useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, type PointerEvent } from 'react'
import { useReducedMotion } from './useReducedMotion'

const tiltPos = `${tiltDeg}deg`
const tiltNeg = `${-tiltDeg}deg`

export function useCardAnimation<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const rafIdRef = useRef<number | null>(null)
  const pointerClientRef = useRef({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)
  const springX = useSpring(tiltX, followSpring)
  const springY = useSpring(tiltY, followSpring)
  const springSpotlightX = useSpring(spotlightX, followSpring)
  const springSpotlightY = useSpring(spotlightY, followSpring)
  const rotateX = useTransform(springY, [-0.5, 0.5], [tiltPos, tiltNeg])
  const rotateY = useTransform(springX, [-0.5, 0.5], [tiltNeg, tiltPos])
  const spotlightBackground = useMotionTemplate`radial-gradient(${spotlightInner}px circle at ${springSpotlightX}px ${springSpotlightY}px, var(--color-primary), transparent 40%)`
  const spotlightBorder = useMotionTemplate`radial-gradient(${spotlightOuter}px circle at ${springSpotlightX}px ${springSpotlightY}px, var(--color-primary), transparent 40%)`

  const cancelPendingFrame = () => {
    if (rafIdRef.current === null) return

    cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = null
  }

  const handlePointerLeave = () => {
    cancelPendingFrame()
    tiltX.set(0)
    tiltY.set(0)
  }

  useEffect(() => () => cancelPendingFrame(), [])

  useEffect(() => {
    if (!prefersReducedMotion) return

    cancelPendingFrame()
    tiltX.set(0)
    tiltY.set(0)
  }, [prefersReducedMotion, tiltX, tiltY])

  const handlePointerMove = (event: PointerEvent<T>) => {
    if (prefersReducedMotion || event.pointerType === 'touch') return

    pointerClientRef.current = { x: event.clientX, y: event.clientY }
    if (rafIdRef.current !== null) return

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null

      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const { x, y } = pointerClientRef.current
      const localX = x - rect.left
      const localY = y - rect.top
      tiltX.set(localX / rect.width - 0.5)
      tiltY.set(localY / rect.height - 0.5)
      spotlightX.set(localX)
      spotlightY.set(localY)
    })
  }

  return {
    ref,
    handlePointerLeave,
    handlePointerMove,
    rotateX,
    rotateY,
    spotlightBackground,
    spotlightBorder
  }
}
