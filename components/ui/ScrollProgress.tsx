import { memo, useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'

const ScrollProgress = memo(() => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    damping: 30,
    restDelta: 0.001,
    stiffness: 100
  })

  useMotionValueEvent(scaleX, 'change', () => {
    setIsVisible(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 200)
  })

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    []
  )

  return (
    <motion.div
      aria-hidden
      className="bg-primary/30 pointer-events-none fixed inset-x-0 bottom-0 z-50 h-px origin-left shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_15%,transparent)]"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
    />
  )
})

export default ScrollProgress
