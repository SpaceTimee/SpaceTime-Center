import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface UseHeaderAnimationProps {
  readonly borderRef: RefObject<HTMLDivElement | null>
  readonly headerRef: RefObject<HTMLElement | null>
  readonly imageRef: RefObject<HTMLImageElement | null>
  readonly meniscusRef: RefObject<SVGGElement | null>
  readonly waveRef: RefObject<HTMLDivElement | null>
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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function useHeaderAnimation({
  borderRef,
  headerRef,
  imageRef,
  meniscusRef,
  waveRef
}: UseHeaderAnimationProps) {
  const prefersReducedMotion = useReducedMotion()
  const pullDistanceRef = useRef(-ANIMATION_CONFIG.MAX_PULL)
  const isDraggingRef = useRef(false)
  const pullStartYRef = useRef(0)
  const animationFrameIdRef = useRef<number | null>(null)
  const pullResetTimerRef = useRef<number | null>(null)

  const targetParallaxOffsetRef = useRef({ x: 0, y: 0 })
  const currentParallaxOffsetRef = useRef({ x: 0, y: 0 })
  const parallaxAnimationFrameIdRef = useRef<number | null>(null)

  const touchStartPosRef = useRef({ x: 0, y: 0 })
  const waveActiveRef = useRef(false)

  const dimensionsRef = useRef({ width: 0, height: 0, left: 0, top: 0 })

  const updateParallaxState = useCallback(() => {
    if (!imageRef.current) return

    const { MAX_PULL, MENISCUS_SPREAD, WAVE_HEIGHT_FACTOR } = ANIMATION_CONFIG
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

      if (borderRef.current) borderRef.current.style.removeProperty('opacity')
      if (waveRef.current) {
        waveRef.current.style.removeProperty('height')
        waveRef.current.style.removeProperty('opacity')
      }
    } else {
      if (meniscusRef.current) {
        meniscusRef.current.children[0].setAttribute('d', '')
        meniscusRef.current.children[1].setAttribute('d', '')
      }

      const ratio = Math.min(pullDistance / MAX_PULL, 1)
      if (borderRef.current) borderRef.current.style.opacity = `${1 - ratio}`
      if (waveRef.current) {
        waveRef.current.style.height = `${ratio * WAVE_HEIGHT_FACTOR}px`
        waveRef.current.style.opacity = `${ratio}`
      }
    }

    const { x, y } = currentParallaxOffsetRef.current
    if (!imageRef.current.style.scale) {
      imageRef.current.style.scale = String(ANIMATION_CONFIG.BASE_SCALE)
    }
    imageRef.current.style.translate = `${x}px ${y}px`
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
      const pullGap = MAX_PULL + pullDistanceRef.current
      pullDistanceRef.current = -MAX_PULL + pullGap * DECAY_RATE
      if (pullGap * DECAY_RATE < 0.5) pullDistanceRef.current = -MAX_PULL
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
    (event: DeviceOrientationEvent) => {
      if (isDraggingRef.current || event.gamma === null || event.beta === null || prefersReducedMotion) return

      const gamma = clamp(event.gamma, -ANIMATION_CONFIG.MAX_TILT, ANIMATION_CONFIG.MAX_TILT)
      const beta = clamp(
        event.beta - ANIMATION_CONFIG.TILT_OFFSET,
        -ANIMATION_CONFIG.MAX_TILT,
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

    let resizeTimer: number | null = null
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(updateDimensions, 150)
    }

    const controller = new AbortController()
    const { signal } = controller

    window.addEventListener('resize', handleResize, { signal })

    const handleWheel = (event: WheelEvent) => {
      if (window.scrollY === 0 && event.deltaY < 0) {
        pullDistanceRef.current = Math.min(
          pullDistanceRef.current - event.deltaY * ANIMATION_CONFIG.SCROLL_WHEEL_FACTOR,
          ANIMATION_CONFIG.PULL_LIMIT
        )

        if (!animationFrameIdRef.current) {
          animationFrameIdRef.current = requestAnimationFrame(() => {
            updateParallaxState()
            animationFrameIdRef.current = null
          })
        }

        if (pullResetTimerRef.current) clearTimeout(pullResetTimerRef.current)
        pullResetTimerRef.current = window.setTimeout(() => {
          if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current)
          animateDecay()
        }, 20)
      }
    }

    const handleTouchStart = (event: TouchEvent) => {
      isDraggingRef.current = true
      touchStartPosRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }

      if (window.scrollY === 0) {
        waveActiveRef.current = true
        const currentPullDistance = Math.max(0, pullDistanceRef.current + ANIMATION_CONFIG.MAX_PULL)
        const currentDelta =
          (currentPullDistance / ANIMATION_CONFIG.PULL_DRAG_DIVISOR) ** (1 / ANIMATION_CONFIG.PULL_DRAG_POW)
        pullStartYRef.current = event.touches[0].clientY - currentDelta

        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current)
          animationFrameIdRef.current = null
        }
        if (parallaxAnimationFrameIdRef.current) {
          cancelAnimationFrame(parallaxAnimationFrameIdRef.current)
          parallaxAnimationFrameIdRef.current = null
        }
        if (pullResetTimerRef.current) {
          clearTimeout(pullResetTimerRef.current)
          pullResetTimerRef.current = null
        }
      } else {
        waveActiveRef.current = false
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (isDraggingRef.current) {
        const clientX = event.touches[0].clientX
        const clientY = event.touches[0].clientY

        if (!animationFrameIdRef.current) {
          animationFrameIdRef.current = requestAnimationFrame(() => {
            const deltaX = clientX - touchStartPosRef.current.x
            const deltaY = clientY - touchStartPosRef.current.y

            const { width, height } = dimensionsRef.current
            const limitX = width * 0.05
            const limitY = height * 0.05
            const resistance = 30

            if (limitX > 0 && limitY > 0) {
              const x = limitX * Math.tanh(deltaX / (limitX * resistance))
              const y = limitY * Math.tanh(deltaY / (limitY * resistance))

              targetParallaxOffsetRef.current = { x, y }
              startParallaxAnimation()
            }

            if (waveActiveRef.current && window.scrollY <= 0) {
              const deltaWave = clientY - pullStartYRef.current
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
      waveActiveRef.current = false
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
      if (pullResetTimerRef.current) clearTimeout(pullResetTimerRef.current)
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
