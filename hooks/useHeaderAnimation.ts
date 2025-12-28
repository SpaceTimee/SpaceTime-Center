import { type RefObject, useCallback, useEffect, useRef } from 'react'

interface UseHeaderAnimationProps {
  headerRef: RefObject<HTMLElement | null>
  imageRef: RefObject<HTMLImageElement | null>
  waveRef: RefObject<HTMLDivElement | null>
  borderRef: RefObject<HTMLDivElement | null>
}

export const ANIMATION_CONFIG = {
  MAX_PULL: 150,
  BASE_SCALE: 1.1,
  WAVE_HEIGHT_FACTOR: 60,
  PARALLAX_FACTOR: 40,
  LERP_EASE: 0.1,
  DECAY_RATE: 0.999,
  MAX_TILT: 20,
  TILT_OFFSET: 45,
  TILT_FACTOR: 0.625,
  PULL_LIMIT: 250,
  SCROLL_WHEEL_FACTOR: 0.6,
  PULL_DRAG_DIVISOR: 1.5,
  PULL_DRAG_POW: 0.85
} as const

export function useHeaderAnimation({ headerRef, imageRef, waveRef, borderRef }: UseHeaderAnimationProps) {
  const pullDistance = useRef(0)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const resetTimer = useRef<number | null>(null)

  const targetParallaxOffset = useRef({ x: 0, y: 0 })
  const currentParallaxOffset = useRef({ x: 0, y: 0 })
  const parallaxAnimationFrameId = useRef<number | null>(null)

  const touchStartPos = useRef({ x: 0, y: 0 })
  const isWaveActive = useRef(false)

  const dimensions = useRef({ width: 0, height: 0, left: 0, top: 0 })

  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

  const updateParallaxState = useCallback(() => {
    if (!imageRef.current) return

    const ratio = Math.min(pullDistance.current / ANIMATION_CONFIG.MAX_PULL, 1)

    if (borderRef.current) {
      borderRef.current.style.opacity = `${1 - ratio}`
    }

    if (waveRef.current) {
      const height = ratio * ANIMATION_CONFIG.WAVE_HEIGHT_FACTOR
      waveRef.current.style.height = `${height}px`
      waveRef.current.style.opacity = `${ratio}`
    }

    imageRef.current.style.transform = `scale(${ANIMATION_CONFIG.BASE_SCALE}) translate(${currentParallaxOffset.current.x}px, ${currentParallaxOffset.current.y}px)`
  }, [imageRef, borderRef, waveRef])

  const animateParallaxRef = useRef<() => void>(null!)
  const animateDecayRef = useRef<() => void>(null!)

  const animateParallax = useCallback(() => {
    const { x: targetX, y: targetY } = targetParallaxOffset.current
    const { x: currentX, y: currentY } = currentParallaxOffset.current

    const newX = lerp(currentX, targetX, ANIMATION_CONFIG.LERP_EASE)
    const newY = lerp(currentY, targetY, ANIMATION_CONFIG.LERP_EASE)

    currentParallaxOffset.current = { x: newX, y: newY }
    updateParallaxState()

    if (Math.abs(newX - targetX) > 0.01 || Math.abs(newY - targetY) > 0.01) {
      parallaxAnimationFrameId.current = requestAnimationFrame(() => animateParallaxRef.current())
    } else {
      parallaxAnimationFrameId.current = null
    }
  }, [updateParallaxState])

  useEffect(() => {
    animateParallaxRef.current = animateParallax
  }, [animateParallax])

  const startParallaxAnimation = useCallback(() => {
    if (!parallaxAnimationFrameId.current) {
      parallaxAnimationFrameId.current = requestAnimationFrame(animateParallax)
    }
  }, [animateParallax])

  const animateDecay = useCallback(() => {
    if (!isDragging.current && pullDistance.current > 0) {
      pullDistance.current *= ANIMATION_CONFIG.DECAY_RATE
      if (pullDistance.current < 0.5) pullDistance.current = 0

      updateParallaxState()

      if (pullDistance.current > 0) {
        animationFrameId.current = requestAnimationFrame(() => animateDecayRef.current())
      } else {
        animationFrameId.current = null
      }
    } else {
      animationFrameId.current = null
    }
  }, [updateParallaxState])

  useEffect(() => {
    animateDecayRef.current = animateDecay
  }, [animateDecay])

  const handleDeviceOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (
        isDragging.current ||
        e.gamma === null ||
        e.beta === null ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return

      const gamma = Math.min(Math.max(e.gamma, -ANIMATION_CONFIG.MAX_TILT), ANIMATION_CONFIG.MAX_TILT)
      const beta = Math.min(
        Math.max(e.beta - ANIMATION_CONFIG.TILT_OFFSET, -ANIMATION_CONFIG.MAX_TILT),
        ANIMATION_CONFIG.MAX_TILT
      )

      const x = gamma * ANIMATION_CONFIG.TILT_FACTOR
      const y = beta * ANIMATION_CONFIG.TILT_FACTOR

      targetParallaxOffset.current = { x, y }
      startParallaxAnimation()
    },
    [startParallaxAnimation]
  )

  useEffect(() => {
    const updateDimensions = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        dimensions.current = {
          width: rect.width,
          height: rect.height,
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY
        }
      }
    }

    updateDimensions()
    let resizeTimer: number
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(updateDimensions, 150)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('deviceorientation', handleDeviceOrientation, true)

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY === 0 && e.deltaY < 0) {
        pullDistance.current = Math.max(
          0,
          Math.min(
            pullDistance.current - e.deltaY * ANIMATION_CONFIG.SCROLL_WHEEL_FACTOR,
            ANIMATION_CONFIG.PULL_LIMIT
          )
        )

        if (!animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(() => {
            updateParallaxState()
            animationFrameId.current = null
          })
        }

        if (resetTimer.current) clearTimeout(resetTimer.current)
        resetTimer.current = window.setTimeout(() => {
          if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
          animateDecay()
        }, 20)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }

      if (window.scrollY === 0) {
        isWaveActive.current = true
        const currentVal = Math.max(0, pullDistance.current)
        const currentDelta = Math.pow(
          currentVal / ANIMATION_CONFIG.PULL_DRAG_DIVISOR,
          1 / ANIMATION_CONFIG.PULL_DRAG_POW
        )
        startY.current = e.touches[0].clientY - currentDelta

        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
          animationFrameId.current = null
        }
        if (parallaxAnimationFrameId.current) {
          cancelAnimationFrame(parallaxAnimationFrameId.current)
          parallaxAnimationFrameId.current = null
        }
        if (resetTimer.current) {
          clearTimeout(resetTimer.current)
          resetTimer.current = null
        }
      } else {
        isWaveActive.current = false
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) {
        const clientX = e.touches[0].clientX
        const clientY = e.touches[0].clientY

        if (!animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(() => {
            const deltaX = clientX - touchStartPos.current.x
            const deltaY = clientY - touchStartPos.current.y

            const { width: offsetWidth, height: offsetHeight } = dimensions.current
            const limitX = offsetWidth * 0.05
            const limitY = offsetHeight * 0.05
            const resistance = 30

            if (limitX > 0 && limitY > 0) {
              const x = limitX * Math.tanh(deltaX / (limitX * resistance))
              const y = limitY * Math.tanh(deltaY / (limitY * resistance))

              targetParallaxOffset.current = { x, y }
              startParallaxAnimation()
            }

            if (isWaveActive.current && window.scrollY <= 0) {
              const deltaWave = clientY - startY.current
              if (deltaWave > 0) {
                pullDistance.current = Math.min(Math.pow(deltaWave, 0.85) * 1.5, ANIMATION_CONFIG.PULL_LIMIT)
              } else {
                pullDistance.current = 0
              }
            }

            updateParallaxState()
            animationFrameId.current = null
          })
        }
      }
    }

    const handleTouchEnd = () => {
      isDragging.current = false
      isWaveActive.current = false
      targetParallaxOffset.current = { x: 0, y: 0 }
      startParallaxAnimation()
      animateDecay()
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (headerRef.current) {
            if (entry.isIntersecting) {
              headerRef.current.classList.remove('paused-animations')
            } else {
              headerRef.current.classList.add('paused-animations')
            }
          }
        })
      },
      { threshold: 0 }
    )

    if (headerRef.current) observer.observe(headerRef.current)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) window.clearTimeout(resizeTimer)
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
      observer.disconnect()

      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      if (parallaxAnimationFrameId.current) cancelAnimationFrame(parallaxAnimationFrameId.current)
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [headerRef, animateDecay, startParallaxAnimation, handleDeviceOrientation, updateParallaxState])

  return {
    dimensionsRef: dimensions,
    targetParallaxOffsetRef: targetParallaxOffset,
    startParallaxAnimation
  }
}
