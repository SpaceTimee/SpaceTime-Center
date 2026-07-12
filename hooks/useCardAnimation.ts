import { followSpring, spotlightInner, spotlightOuter, tiltDeg } from '@/consts/motion'
import { useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, type PointerEvent } from 'react'
import { useReducedMotion } from './useReducedMotion'

const tiltPos = `${tiltDeg}deg`
const tiltNeg = `${-tiltDeg}deg`

export function useCardAnimation<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
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

  useEffect(() => {
    if (!prefersReducedMotion) return

    tiltX.set(0)
    tiltY.set(0)
  }, [prefersReducedMotion, tiltX, tiltY])

  const handlePointerLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  const handlePointerMove = (event: PointerEvent<T>) => {
    const element = ref.current
    if (prefersReducedMotion || !element || event.pointerType === 'touch') return

    const rect = element.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top
    tiltX.set(localX / rect.width - 0.5)
    tiltY.set(localY / rect.height - 0.5)
    spotlightX.set(localX)
    spotlightY.set(localY)
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
