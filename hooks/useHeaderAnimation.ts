import { followSpring, getMeniscusPaths, headerConfig } from '@/consts/motion'
import { useMotionValue, useMotionValueEvent, useSpring } from 'motion/react'
import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface HeaderAnimationOptions {
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
}: HeaderAnimationOptions) {
  const prefersReducedMotion = useReducedMotion()
  const pullDistanceRef = useRef(-headerConfig.maxPull)
  const pullStartRef = useRef(0)
  const pullTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDraggingRef = useRef(false)
  const isWaveActiveRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const animateDecayRef = useRef<(() => void) | null>(null)
  const touchStartClientRef = useRef({ x: 0, y: 0 })
  const touchClientRef = useRef({ x: 0, y: 0 })
  const dimensionsRef = useRef({ width: 0, height: 0, left: 0, top: 0 })

  const cancelPendingFrame = () => {
    if (rafIdRef.current === null) return

    cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = null
  }

  const parallaxX = useMotionValue(0)
  const parallaxY = useMotionValue(0)
  const springX = useSpring(parallaxX, followSpring)
  const springY = useSpring(parallaxY, followSpring)

  const setParallaxTarget = useCallback(
    (x: number, y: number) => {
      if (prefersReducedMotion) return

      parallaxX.set(x)
      parallaxY.set(y)
    },
    [parallaxX, parallaxY, prefersReducedMotion]
  )

  const updateImageTranslate = useCallback(() => {
    const image = imageRef.current
    if (!image) return

    image.style.scale ||= `${headerConfig.baseScale}`
    image.style.translate = `${springX.get()}px ${springY.get()}px`
  }, [imageRef, springX, springY])

  useMotionValueEvent(springX, 'change', updateImageTranslate)
  useMotionValueEvent(springY, 'change', updateImageTranslate)

  const updatePullVisuals = useCallback(() => {
    const { maxPull, waveHeight } = headerConfig
    const pullDistance = pullDistanceRef.current
    const border = borderRef.current
    const meniscus = meniscusRef.current
    const wave = waveRef.current
    const writeMeniscus = (leftPath: string, rightPath: string) => {
      meniscus?.children.item(0)?.setAttribute('d', leftPath)
      meniscus?.children.item(1)?.setAttribute('d', rightPath)
    }

    if (pullDistance <= 0) {
      const meniscusHeight = Math.min(-pullDistance / maxPull, 1) * waveHeight
      const [leftPath, rightPath] =
        meniscusHeight > 0.5 ? getMeniscusPaths(waveHeight - meniscusHeight) : (['', ''] as const)
      writeMeniscus(leftPath, rightPath)
      if (border) border.style.removeProperty('opacity')
      if (wave) {
        wave.style.removeProperty('height')
        wave.style.removeProperty('opacity')
      }
    } else {
      writeMeniscus('', '')
      const ratio = Math.min(pullDistance / maxPull, 1)
      if (border) border.style.opacity = `${1 - ratio}`
      if (wave) {
        wave.style.height = `${ratio * waveHeight}px`
        wave.style.opacity = `${ratio}`
      }
    }
  }, [borderRef, meniscusRef, waveRef])

  const animateDecay = useCallback(() => {
    if (isDraggingRef.current) {
      cancelPendingFrame()
      return
    }

    const { decayRate, maxPull } = headerConfig
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
    rafIdRef.current = needsFrame ? requestAnimationFrame(() => animateDecayRef.current?.()) : null
  }, [updatePullVisuals])

  useEffect(() => void (animateDecayRef.current = animateDecay), [animateDecay])

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (isDraggingRef.current || event.gamma === null || event.beta === null) return

      setParallaxTarget(
        clamp(event.gamma, -headerConfig.maxTilt, headerConfig.maxTilt) * headerConfig.tiltFactor,
        clamp(event.beta - headerConfig.tiltOffset, -headerConfig.maxTilt, headerConfig.maxTilt) *
          headerConfig.tiltFactor
      )
    },
    [setParallaxTarget]
  )

  useEffect(() => {
    const element = headerRef.current
    const updateDimensions = () => {
      if (!element) return

      const rect = element.getBoundingClientRect()
      dimensionsRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left + scrollX,
        top: rect.top + scrollY
      }
    }

    updateDimensions()
    updateImageTranslate()
    updatePullVisuals()

    const controller = new AbortController()
    const { signal } = controller

    const handleWheel = (event: WheelEvent) => {
      if (scrollY > 0 || event.deltaY >= 0) return

      pullDistanceRef.current = Math.min(
        pullDistanceRef.current - event.deltaY * headerConfig.scrollWheelFactor,
        headerConfig.pullLimit
      )

      rafIdRef.current ??= requestAnimationFrame(() => {
        updatePullVisuals()
        rafIdRef.current = null
      })

      if (pullTimeoutRef.current) clearTimeout(pullTimeoutRef.current)
      pullTimeoutRef.current = setTimeout(() => {
        cancelPendingFrame()
        animateDecay()
      }, 20)
    }

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches.item(0)
      if (!touch) return

      isDraggingRef.current = true
      touchStartClientRef.current = { x: touch.clientX, y: touch.clientY }
      isWaveActiveRef.current = scrollY <= 0
      if (!isWaveActiveRef.current) return

      pullStartRef.current =
        touch.clientY -
        (Math.max(0, pullDistanceRef.current + headerConfig.maxPull) / headerConfig.pullDragDivisor) **
          (1 / headerConfig.pullDragPower)
      cancelPendingFrame()
      if (pullTimeoutRef.current) clearTimeout(pullTimeoutRef.current)
      pullTimeoutRef.current = null
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDraggingRef.current) return

      const touch = event.touches.item(0)
      if (!touch) return

      touchClientRef.current = { x: touch.clientX, y: touch.clientY }
      rafIdRef.current ??= requestAnimationFrame(() => {
        const { x: clientX, y: clientY } = touchClientRef.current
        const { width, height } = dimensionsRef.current
        const limitX = width * headerConfig.parallaxLimitRatio
        const limitY = height * headerConfig.parallaxLimitRatio

        if (limitX > 0 && limitY > 0) {
          setParallaxTarget(
            limitX *
              Math.tanh(
                (clientX - touchStartClientRef.current.x) / (limitX * headerConfig.parallaxResistance)
              ),
            limitY *
              Math.tanh(
                (clientY - touchStartClientRef.current.y) / (limitY * headerConfig.parallaxResistance)
              )
          )
        }

        if (isWaveActiveRef.current && scrollY <= 0) {
          pullDistanceRef.current =
            clientY > pullStartRef.current
              ? Math.min(
                  -headerConfig.maxPull +
                    (clientY - pullStartRef.current) ** headerConfig.pullDragPower *
                      headerConfig.pullDragDivisor,
                  headerConfig.pullLimit
                )
              : -headerConfig.maxPull
        }

        updatePullVisuals()
        rafIdRef.current = null
      })
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
      isWaveActiveRef.current = false
      cancelPendingFrame()
      setParallaxTarget(0, 0)
      animateDecay()
    }

    if (prefersReducedMotion) {
      isDraggingRef.current = false
      isWaveActiveRef.current = false
      pullDistanceRef.current = -headerConfig.maxPull
      parallaxX.set(0)
      parallaxY.set(0)
      updatePullVisuals()
    } else {
      addEventListener('deviceorientation', handleDeviceOrientation, { capture: true, signal })
      addEventListener('wheel', handleWheel, { passive: true, signal })
      addEventListener('touchstart', handleTouchStart, { passive: true, signal })
      addEventListener('touchmove', handleTouchMove, { passive: true, signal })
      addEventListener('touchend', handleTouchEnd, { signal })
      addEventListener('touchcancel', handleTouchEnd, { signal })
    }

    const resizeObserver = new ResizeObserver(updateDimensions)
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) element?.classList.toggle('paused', !entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (element) {
      resizeObserver.observe(element)
      intersectionObserver.observe(element)
    }

    return () => {
      controller.abort()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      cancelPendingFrame()
      if (pullTimeoutRef.current) clearTimeout(pullTimeoutRef.current)
    }
  }, [
    animateDecay,
    handleDeviceOrientation,
    headerRef,
    parallaxX,
    parallaxY,
    prefersReducedMotion,
    setParallaxTarget,
    updateImageTranslate,
    updatePullVisuals
  ])

  return { dimensionsRef, prefersReducedMotion, setParallaxTarget }
}
