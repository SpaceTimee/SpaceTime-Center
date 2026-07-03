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
      className="bg-primary/30 pointer-events-none fixed right-0 bottom-0 left-0 z-50 h-[1px] origin-left shadow-[0_0_8px_rgba(255,90,0,0.15)]"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.3 } }}
    />
  )
})

export default ScrollProgress
