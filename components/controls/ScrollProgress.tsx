import { followSpring, opacityToggle, progressHideMs } from '@/consts/motion'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export default function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useRef(false)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scaleX = useSpring(useScroll().scrollYProgress, followSpring)

  useEffect(() => () => clearTimeout(hideTimeoutRef.current ?? undefined), [])

  useMotionValueEvent(scaleX, 'change', () => {
    if (!isVisibleRef.current) {
      isVisibleRef.current = true
      setIsVisible(true)
    }

    clearTimeout(hideTimeoutRef.current ?? undefined)
    hideTimeoutRef.current = setTimeout(() => {
      isVisibleRef.current = false
      setIsVisible(false)
    }, progressHideMs)
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
