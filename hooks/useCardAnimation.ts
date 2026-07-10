import { useRef, type PointerEvent } from 'react'
import { useMotionTemplate, useMotionValue, useSpring, useTransform, type SpringOptions } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const tiltSpringOptions: SpringOptions = {
  damping: 30,
  stiffness: 300
}

const spotlightSpringOptions: SpringOptions = {
  damping: 40,
  mass: 0.5,
  stiffness: 400
}

export function useCardAnimation<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)

  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)

  const springX = useSpring(tiltX, tiltSpringOptions)
  const springY = useSpring(tiltY, tiltSpringOptions)
  const springMouseX = useSpring(spotlightX, spotlightSpringOptions)
  const springMouseY = useSpring(spotlightY, spotlightSpringOptions)

  const rotateX = useTransform(springY, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-10deg', '10deg'])

  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${springMouseX}px ${springMouseY}px, var(--color-primary-hover), transparent 40%)`
  const spotlightBorder = useMotionTemplate`radial-gradient(600px circle at ${springMouseX}px ${springMouseY}px, var(--color-primary), transparent 40%)`

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
