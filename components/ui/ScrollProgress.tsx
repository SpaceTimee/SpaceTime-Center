import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import { useState, useRef } from 'react'

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useMotionValueEvent(scaleX, 'change', () => {
    setIsVisible(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 200)
  })

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-[1px] bg-primary/30 origin-left z-50 pointer-events-none shadow-[0_0_8px_rgba(255,90,0,0.15)]"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.3 } }}
    />
  )
}
