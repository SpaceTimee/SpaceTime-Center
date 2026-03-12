import { useRef } from 'react'
import { useMotionValue, useSpring, useTransform, type SpringOptions } from 'framer-motion'

const tiltSpringOptions: SpringOptions = {
  stiffness: 300,
  damping: 30,
  mass: 1
}

const spotlightSpringOptions: SpringOptions = {
  stiffness: 400,
  damping: 40,
  mass: 0.5
}

export const useCardAnimation = <T extends HTMLElement = HTMLElement>() => {
  const ref = useRef<T>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(x, tiltSpringOptions)
  const springY = useSpring(y, tiltSpringOptions)
  const springMouseX = useSpring(mouseX, spotlightSpringOptions)
  const springMouseY = useSpring(mouseY, spotlightSpringOptions)

  const rotateX = useTransform(springY, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-10deg', '10deg'])

  const spotlightBackground = useTransform(
    [springMouseX, springMouseY],
    ([latestX, latestY]) =>
      `radial-gradient(400px circle at ${latestX}px ${latestY}px, var(--color-primary-hover), transparent 40%)`
  )

  const spotlightBorder = useTransform(
    [springMouseX, springMouseY],
    ([latestX, latestY]) =>
      `radial-gradient(600px circle at ${latestX}px ${latestY}px, var(--color-primary), transparent 40%)`
  )

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!ref.current || e.pointerType === 'touch') return

    const rect = ref.current.getBoundingClientRect()

    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top

    mouseX.set(clientX)
    mouseY.set(clientY)

    const xPct = clientX / rect.width - 0.5
    const yPct = clientY / rect.height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return {
    ref,
    rotateX,
    rotateY,
    spotlightBackground,
    spotlightBorder,
    handlePointerMove,
    handlePointerLeave
  }
}
