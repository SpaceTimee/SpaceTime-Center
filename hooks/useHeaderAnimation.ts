import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

interface UseHeaderAnimationProps {
  borderRef: RefObject<HTMLDivElement | null>
  headerRef: RefObject<HTMLElement | null>
  imageRef: RefObject<HTMLImageElement | null>
  meniscusRef: RefObject<SVGGElement | null>
  waveRef: RefObject<HTMLDivElement | null>
}

export const ANIMATION_CONFIG = {
  BASE_SCALE: 1.1,
  DECAY_RATE: 0.999,
  LERP_EASE: 0.1,
  MAX_PULL: 150,
  MAX_TILT: 20,
  MENISCUS_SPREAD: 80,
  PARALLAX_FACTOR: 40,
  PULL_DRAG_DIVISOR: 1.5,
  PULL_DRAG_POW: 0.85,
  PULL_LIMIT: 250,
  SCROLL_WHEEL_FACTOR: 0.6,
  TILT_FACTOR: 0.625,
  TILT_OFFSET: 45,
  WAVE_HEIGHT_FACTOR: 60
} as const

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

export function useHeaderAnimation({
  borderRef,
  headerRef,
  imageRef,
  meniscusRef,
  waveRef
}: UseHeaderAnimationProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const pullDistanceRef = useRef(-ANIMATION_CONFIG.MAX_PULL)
  const isDraggingRef = useRef(false)
  const startYRef = useRef(0)
  const animationFrameIdRef = useRef<number>(null)
  const resetTimerRef = useRef<number>(null)

  const targetParallaxOffsetRef = useRef({ x: 0, y: 0 })
  const currentParallaxOffsetRef = useRef({ x: 0, y: 0 })
  const parallaxAnimationFrameIdRef = useRef<number>(null)

  const touchStartPosRef = useRef({ x: 0, y: 0 })
  const isWaveActiveRef = useRef(false)

  const dimensionsRef = useRef({ width: 0, height: 0, left: 0, top: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const controller = new AbortController()
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    media.addEventListener('change', (event) => setPrefersReducedMotion(event.matches), {
      signal: controller.signal
    })

    return () => controller.abort()
  }, [])

  const updateParallaxState = useCallback(() => {
    if (!imageRef.current) return

    const { BASE_SCALE, MAX_PULL, MENISCUS_SPREAD, WAVE_HEIGHT_FACTOR } = ANIMATION_CONFIG
    const pullDistance = pullDistanceRef.current

    if (pullDistance <= 0) {
      const meniscusHeight = Math.min(-pullDistance / MAX_PULL, 1) * WAVE_HEIGHT_FACTOR

      if (meniscusRef.current) {
        if (meniscusHeight > 0.5) {
          const topY = WAVE_HEIGHT_FACTOR - meniscusHeight
          const controlY = topY + meniscusHeight * 0.95
          const controlX = MENISCUS_SPREAD * 0.08
          meniscusRef.current.children[0].setAttribute(
            'd',
            `M 0,${topY} C 0,${controlY} ${controlX},${WAVE_HEIGHT_FACTOR} ${MENISCUS_SPREAD},${WAVE_HEIGHT_FACTOR} L 0,${WAVE_HEIGHT_FACTOR} Z`
          )
          meniscusRef.current.children[1].setAttribute(
            'd',
            `M 1000,${topY} C 1000,${controlY} ${1000 - controlX},${WAVE_HEIGHT_FACTOR} ${1000 - MENISCUS_SPREAD},${WAVE_HEIGHT_FACTOR} L 1000,${WAVE_HEIGHT_FACTOR} Z`
          )
        } else {
          meniscusRef.current.children[0].setAttribute('d', '')
          meniscusRef.current.children[1].setAttribute('d', '')
        }
      }

      if (borderRef.current) borderRef.current.style.opacity = '1'
      if (waveRef.current) {
        waveRef.current.style.height = '0px'
        waveRef.current.style.opacity = '0'
      }
    } else {
      if (meniscusRef.current) {
        meniscusRef.current.children[0].setAttribute('d', '')
        meniscusRef.current.children[1].setAttribute('d', '')
      }

      const ratio = Math.min(pullDistance / MAX_PULL, 1)
      if (borderRef.current) borderRef.current.style.opacity = `${1 - ratio}`
      if (waveRef.current) {
        const height = ratio * WAVE_HEIGHT_FACTOR
        waveRef.current.style.height = `${height}px`
        waveRef.current.style.opacity = `${ratio}`
      }
    }

    imageRef.current.style.transform = `scale(${BASE_SCALE}) translate(${currentParallaxOffsetRef.current.x}px, ${currentParallaxOffsetRef.current.y}px)`
  }, [borderRef, imageRef, meniscusRef, waveRef])

  const animateParallaxRef = useRef<(() => void) | null>(null)
  const animateDecayRef = useRef<(() => void) | null>(null)

  const animateParallax = useCallback(() => {
    const { x: targetX, y: targetY } = targetParallaxOffsetRef.current
    const { x: currentX, y: currentY } = currentParallaxOffsetRef.current

    const newX = lerp(currentX, targetX, ANIMATION_CONFIG.LERP_EASE)
    const newY = lerp(currentY, targetY, ANIMATION_CONFIG.LERP_EASE)

    currentParallaxOffsetRef.current = { x: newX, y: newY }
    updateParallaxState()

    if (Math.abs(newX - targetX) > 0.01 || Math.abs(newY - targetY) > 0.01) {
      parallaxAnimationFrameIdRef.current = requestAnimationFrame(() => animateParallaxRef.current?.())
    } else {
      parallaxAnimationFrameIdRef.current = null
    }
  }, [updateParallaxState])

  useEffect(() => {
    animateParallaxRef.current = animateParallax
  }, [animateParallax])

  const startParallaxAnimation = useCallback(() => {
    if (prefersReducedMotion) return
    if (!parallaxAnimationFrameIdRef.current) {
      parallaxAnimationFrameIdRef.current = requestAnimationFrame(animateParallax)
    }
  }, [animateParallax, prefersReducedMotion])

  const animateDecay = useCallback(() => {
    if (isDraggingRef.current) {
      animationFrameIdRef.current = null
      return
    }

    const { DECAY_RATE, MAX_PULL } = ANIMATION_CONFIG
    let needsFrame = false

    if (pullDistanceRef.current > 0) {
      pullDistanceRef.current *= DECAY_RATE
      if (pullDistanceRef.current < 0.5) pullDistanceRef.current = 0
      needsFrame = true
    } else if (pullDistanceRef.current > -MAX_PULL) {
      const gap = MAX_PULL + pullDistanceRef.current
      pullDistanceRef.current = -MAX_PULL + gap * DECAY_RATE
      if (gap * DECAY_RATE < 0.5) pullDistanceRef.current = -MAX_PULL
      needsFrame = pullDistanceRef.current > -MAX_PULL
    }

    updateParallaxState()

    if (needsFrame) {
      animationFrameIdRef.current = requestAnimationFrame(() => animateDecayRef.current?.())
    } else {
      animationFrameIdRef.current = null
    }
  }, [updateParallaxState])

  useEffect(() => {
    animateDecayRef.current = animateDecay
  }, [animateDecay])

  const handleDeviceOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (isDraggingRef.current || e.gamma === null || e.beta === null || prefersReducedMotion) return

      const gamma = Math.min(Math.max(e.gamma, -ANIMATION_CONFIG.MAX_TILT), ANIMATION_CONFIG.MAX_TILT)
      const beta = Math.min(
        Math.max(e.beta - ANIMATION_CONFIG.TILT_OFFSET, -ANIMATION_CONFIG.MAX_TILT),
        ANIMATION_CONFIG.MAX_TILT
      )

      const x = gamma * ANIMATION_CONFIG.TILT_FACTOR
      const y = beta * ANIMATION_CONFIG.TILT_FACTOR

      targetParallaxOffsetRef.current = { x, y }
      startParallaxAnimation()
    },
    [prefersReducedMotion, startParallaxAnimation]
  )

  useEffect(() => {
    const updateDimensions = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        dimensionsRef.current = {
          width: rect.width,
          height: rect.height,
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY
        }
      }
    }

    updateDimensions()
    updateParallaxState()
    let resizeTimer: number
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(updateDimensions, 150)
    }

    const controller = new AbortController()
    const { signal } = controller

    window.addEventListener('resize', handleResize, { signal })

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY === 0 && e.deltaY < 0) {
        pullDistanceRef.current = Math.min(
          pullDistanceRef.current - e.deltaY * ANIMATION_CONFIG.SCROLL_WHEEL_FACTOR,
          ANIMATION_CONFIG.PULL_LIMIT
        )

        if (!animationFrameIdRef.current) {
          animationFrameIdRef.current = requestAnimationFrame(() => {
            updateParallaxState()
            animationFrameIdRef.current = null
          })
        }

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = window.setTimeout(() => {
          if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current)
          animateDecay()
        }, 20)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true
      touchStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }

      if (window.scrollY === 0) {
        isWaveActiveRef.current = true
        const currentVal = Math.max(0, pullDistanceRef.current + ANIMATION_CONFIG.MAX_PULL)
        const currentDelta =
          (currentVal / ANIMATION_CONFIG.PULL_DRAG_DIVISOR) ** (1 / ANIMATION_CONFIG.PULL_DRAG_POW)
        startYRef.current = e.touches[0].clientY - currentDelta

        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current)
          animationFrameIdRef.current = null
        }
        if (parallaxAnimationFrameIdRef.current) {
          cancelAnimationFrame(parallaxAnimationFrameIdRef.current)
          parallaxAnimationFrameIdRef.current = null
        }
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current)
          resetTimerRef.current = null
        }
      } else {
        isWaveActiveRef.current = false
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current) {
        const clientX = e.touches[0].clientX
        const clientY = e.touches[0].clientY

        if (!animationFrameIdRef.current) {
          animationFrameIdRef.current = requestAnimationFrame(() => {
            const deltaX = clientX - touchStartPosRef.current.x
            const deltaY = clientY - touchStartPosRef.current.y

            const { width: offsetWidth, height: offsetHeight } = dimensionsRef.current
            const limitX = offsetWidth * 0.05
            const limitY = offsetHeight * 0.05
            const resistance = 30

            if (limitX > 0 && limitY > 0) {
              const x = limitX * Math.tanh(deltaX / (limitX * resistance))
              const y = limitY * Math.tanh(deltaY / (limitY * resistance))

              targetParallaxOffsetRef.current = { x, y }
              startParallaxAnimation()
            }

            if (isWaveActiveRef.current && window.scrollY <= 0) {
              const deltaWave = clientY - startYRef.current
              if (deltaWave > 0) {
                const totalPull =
                  deltaWave ** ANIMATION_CONFIG.PULL_DRAG_POW * ANIMATION_CONFIG.PULL_DRAG_DIVISOR
                pullDistanceRef.current = Math.min(
                  -ANIMATION_CONFIG.MAX_PULL + totalPull,
                  ANIMATION_CONFIG.PULL_LIMIT
                )
              } else {
                pullDistanceRef.current = -ANIMATION_CONFIG.MAX_PULL
              }
            }

            updateParallaxState()
            animationFrameIdRef.current = null
          })
        }
      }
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
      isWaveActiveRef.current = false
      targetParallaxOffsetRef.current = { x: 0, y: 0 }
      startParallaxAnimation()
      animateDecay()
    }

    if (!prefersReducedMotion) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { capture: true, signal })
      window.addEventListener('wheel', handleWheel, { passive: true, signal })
      window.addEventListener('touchstart', handleTouchStart, { passive: true, signal })
      window.addEventListener('touchmove', handleTouchMove, { passive: true, signal })
      window.addEventListener('touchend', handleTouchEnd, { signal })
      window.addEventListener('touchcancel', handleTouchEnd, { signal })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          headerRef.current?.classList.toggle('paused-animations', !entry.isIntersecting)
        }
      },
      { threshold: 0 }
    )

    if (headerRef.current) observer.observe(headerRef.current)

    return () => {
      controller.abort()
      observer.disconnect()

      if (resizeTimer) window.clearTimeout(resizeTimer)
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current)
      if (parallaxAnimationFrameIdRef.current) cancelAnimationFrame(parallaxAnimationFrameIdRef.current)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [
    animateDecay,
    handleDeviceOrientation,
    headerRef,
    prefersReducedMotion,
    startParallaxAnimation,
    updateParallaxState
  ])

  return {
    dimensionsRef,
    prefersReducedMotion,
    startParallaxAnimation,
    targetParallaxOffsetRef
  }
}
