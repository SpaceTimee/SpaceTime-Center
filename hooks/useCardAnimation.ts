import { followSpring, spotlightInner, spotlightOuter, tiltDeg } from '@/consts/motion'
import { useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, type PointerEvent } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useCardAnimation<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)

  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)

  const springX = useSpring(tiltX, followSpring)
  const springY = useSpring(tiltY, followSpring)
  const springMouseX = useSpring(spotlightX, followSpring)
  const springMouseY = useSpring(spotlightY, followSpring)

  const rotateX = useTransform(springY, [-0.5, 0.5], [`${tiltDeg}deg`, `-${tiltDeg}deg`])
  const rotateY = useTransform(springX, [-0.5, 0.5], [`-${tiltDeg}deg`, `${tiltDeg}deg`])

  const spotlightBackground = useMotionTemplate`radial-gradient(${spotlightInner}px circle at ${springMouseX}px ${springMouseY}px, var(--color-primary-hover), transparent 40%)`
  const spotlightBorder = useMotionTemplate`radial-gradient(${spotlightOuter}px circle at ${springMouseX}px ${springMouseY}px, var(--color-primary), transparent 40%)`

  const handlePointerMove = (event: PointerEvent<T>) => {
    if (prefersReducedMotion || !ref.current || event.pointerType === 'touch') return

    const rect = ref.current.getBoundingClientRect()

    const clientX = event.clientX - rect.left
    const clientY = event.clientY - rect.top

    spotlightX.set(clientX)
    spotlightY.set(clientY)

    const xPct = clientX / rect.width - 0.5
    const yPct = clientY / rect.height - 0.5

    tiltX.set(xPct)
    tiltY.set(yPct)
  }

  const handlePointerLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
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
