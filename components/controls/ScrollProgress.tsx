import { followSpring, opacityToggle, progressHideMs } from '@/consts/motion'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

const ScrollProgress = memo(function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, followSpring)

  useMotionValueEvent(scaleX, 'change', () => {
    setIsVisible(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => setIsVisible(false), progressHideMs)
  })

  useEffect(() => () => void (timeoutRef.current && clearTimeout(timeoutRef.current)), [])

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
})

export default ScrollProgress
