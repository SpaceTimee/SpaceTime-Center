import { followSpring, opacityToggle, progressHideMs } from '@/consts/motion'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export default function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scaleX = useSpring(useScroll().scrollYProgress, followSpring)

  useEffect(() => () => clearTimeout(hideTimeoutRef.current ?? undefined), [])

  useMotionValueEvent(scaleX, 'change', () => {
    setIsVisible(true)
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => setIsVisible(false), progressHideMs)
  })

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-px origin-left bg-primary/30 shadow-progress"
      style={{ scaleX }}
      initial={opacityToggle.initial}
      animate={isVisible ? opacityToggle.visible : opacityToggle.hidden}
      transition={opacityToggle.transition}
    />
  )
}
