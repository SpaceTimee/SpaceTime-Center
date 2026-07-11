import { followSpring, header } from '@/consts/motion'
import { useMotionValue, useMotionValueEvent, useSpring } from 'motion/react'
import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface UseHeaderAnimationProps {
  readonly borderRef: RefObject<HTMLDivElement | null>
  readonly headerRef: RefObject<HTMLElement | null>
  readonly imageRef: RefObject<HTMLImageElement | null>
  readonly meniscusRef: RefObject<SVGGElement | null>
  readonly waveRef: RefObject<HTMLDivElement | null>
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function useHeaderAnimation({
  borderRef,
  headerRef,
  imageRef,
  meniscusRef,
  waveRef
}: UseHeaderAnimationProps) {
  const prefersReducedMotion = useReducedMotion()
  const pullDistanceRef = useRef(-header.maxPull)
  const isDraggingRef = useRef(false)
  const pullStartYRef = useRef(0)
  const animationFrameIdRef = useRef<number | null>(null)
  const pullResetTimerRef = useRef<number | null>(null)

  const touchStartPosRef = useRef({ x: 0, y: 0 })
  const waveActiveRef = useRef(false)

  const dimensionsRef = useRef({ width: 0, height: 0, left: 0, top: 0 })

  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const springX = useSpring(targetX, followSpring)
  const springY = useSpring(targetY, followSpring)

  const setParallaxTarget = useCallback(
    (x: number, y: number) => {
      if (prefersReducedMotion) return
      targetX.set(x)
      targetY.set(y)
    },
    [prefersReducedMotion, targetX, targetY]
  )

  const applyImageTranslate = useCallback(() => {
    if (!imageRef.current) return
    if (!imageRef.current.style.scale) {
      imageRef.current.style.scale = String(header.baseScale)
    }
    imageRef.current.style.translate = `${springX.get()}px ${springY.get()}px`
  }, [imageRef, springX, springY])

  useMotionValueEvent(springX, 'change', applyImageTranslate)
  useMotionValueEvent(springY, 'change', applyImageTranslate)

  const updatePullVisuals = useCallback(() => {
    if (!imageRef.current) return

    const { maxPull, meniscusSpread, waveHeight } = header
    const pullDistance = pullDistanceRef.current

    if (pullDistance <= 0) {
      const meniscusHeight = Math.min(-pullDistance / maxPull, 1) * waveHeight

      if (meniscusRef.current) {
        if (meniscusHeight > 0.5) {
          const topY = waveHeight - meniscusHeight
          const controlY = topY + meniscusHeight * 0.95
          const controlX = meniscusSpread * 0.08
          meniscusRef.current.children[0].setAttribute(
            'd',
            `M 0,${topY} C 0,${controlY} ${controlX},${waveHeight} ${meniscusSpread},${waveHeight} L 0,${waveHeight} Z`
          )
          meniscusRef.current.children[1].setAttribute(
            'd',
            `M 1000,${topY} C 1000,${controlY} ${1000 - controlX},${waveHeight} ${1000 - meniscusSpread},${waveHeight} L 1000,${waveHeight} Z`
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

      const ratio = Math.min(pullDistance / maxPull, 1)
      if (borderRef.current) borderRef.current.style.opacity = `${1 - ratio}`
      if (waveRef.current) {
        waveRef.current.style.height = `${ratio * waveHeight}px`
        waveRef.current.style.opacity = `${ratio}`
      }
    }
  }, [borderRef, imageRef, meniscusRef, waveRef])

  const animateDecayRef = useRef<(() => void) | null>(null)

  const animateDecay = useCallback(() => {
    if (isDraggingRef.current) {
      animationFrameIdRef.current = null
      return
    }

    const { decayRate, maxPull } = header
    let needsFrame = false

    if (pullDistanceRef.current > 0) {
      pullDistanceRef.current *= decayRate
      if (pullDistanceRef.current < 0.5) pullDistanceRef.current = 0
      needsFrame = true
    } else if (pullDistanceRef.current > -maxPull) {
      const pullGap = maxPull + pullDistanceRef.current
      pullDistanceRef.current = -maxPull + pullGap * decayRate
      if (pullGap * decayRate < 0.5) pullDistanceRef.current = -maxPull
      needsFrame = pullDistanceRef.current > -maxPull
    }

    updatePullVisuals()

    if (needsFrame) {
      animationFrameIdRef.current = requestAnimationFrame(() => animateDecayRef.current?.())
    } else {
      animationFrameIdRef.current = null
    }
  }, [updatePullVisuals])

  useEffect(() => void (animateDecayRef.current = animateDecay), [animateDecay])

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (isDraggingRef.current || event.gamma === null || event.beta === null || prefersReducedMotion) return

      const gamma = clamp(event.gamma, -header.maxTilt, header.maxTilt)
      const beta = clamp(event.beta - header.tiltOffset, -header.maxTilt, header.maxTilt)

      setParallaxTarget(gamma * header.tiltFactor, beta * header.tiltFactor)
    },
    [prefersReducedMotion, setParallaxTarget]
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
    applyImageTranslate()
    updatePullVisuals()

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
          pullDistanceRef.current - event.deltaY * header.scrollWheelFactor,
          header.pullLimit
        )

        animationFrameIdRef.current ??= requestAnimationFrame(() => {
          updatePullVisuals()
          animationFrameIdRef.current = null
        })

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
        const currentPullDistance = Math.max(0, pullDistanceRef.current + header.maxPull)
        const currentDelta = (currentPullDistance / header.pullDragDivisor) ** (1 / header.pullDragPow)
        pullStartYRef.current = event.touches[0].clientY - currentDelta

        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current)
          animationFrameIdRef.current = null
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
      if (!isDraggingRef.current) return

      const clientX = event.touches[0].clientX
      const clientY = event.touches[0].clientY

      animationFrameIdRef.current ??= requestAnimationFrame(() => {
        const deltaX = clientX - touchStartPosRef.current.x
        const deltaY = clientY - touchStartPosRef.current.y

        const { width, height } = dimensionsRef.current
        const limitX = width * header.parallaxLimitRatio
        const limitY = height * header.parallaxLimitRatio
        const { parallaxResistance: resistance } = header

        if (limitX > 0 && limitY > 0) {
          setParallaxTarget(
            limitX * Math.tanh(deltaX / (limitX * resistance)),
            limitY * Math.tanh(deltaY / (limitY * resistance))
          )
        }

        if (waveActiveRef.current && window.scrollY <= 0) {
          const deltaWave = clientY - pullStartYRef.current
          if (deltaWave > 0) {
            const totalPull = deltaWave ** header.pullDragPow * header.pullDragDivisor
            pullDistanceRef.current = Math.min(-header.maxPull + totalPull, header.pullLimit)
          } else {
            pullDistanceRef.current = -header.maxPull
          }
        }

        updatePullVisuals()
        animationFrameIdRef.current = null
      })
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
      waveActiveRef.current = false
      setParallaxTarget(0, 0)
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
          headerRef.current?.classList.toggle('paused', !entry.isIntersecting)
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
      if (pullResetTimerRef.current) clearTimeout(pullResetTimerRef.current)
    }
  }, [
    animateDecay,
    applyImageTranslate,
    handleDeviceOrientation,
    headerRef,
    prefersReducedMotion,
    setParallaxTarget,
    updatePullVisuals
  ])

  return {
    dimensionsRef,
    prefersReducedMotion,
    setParallaxTarget
  }
}
