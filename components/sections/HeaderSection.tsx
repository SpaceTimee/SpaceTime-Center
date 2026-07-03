import { memo, useEffect, useRef, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import { Code2, Sparkles } from 'lucide-react'
import { useCardAnimation } from '@/hooks/useCardAnimation'
import { ANIMATION_CONFIG, useHeaderAnimation } from '@/hooks/useHeaderAnimation'
import { useTagInteraction } from '@/hooks/useTagInteraction'
import { externalLinkProps, sectionIds, springTransition } from '@/consts'
import { profile } from '@/data'

const { MENISCUS_SPREAD: meniscusSpread, WAVE_HEIGHT_FACTOR: waveHeightFactor } = ANIMATION_CONFIG

const HeaderSection = memo(() => {
  const borderRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const meniscusRef = useRef<SVGGElement>(null)
  const mouseMoveTickingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const waveRef = useRef<HTMLDivElement>(null)

  const {
    ref: hfRef,
    handlePointerLeave: handleHfPointerLeave,
    handlePointerMove: handleHfPointerMove,
    spotlightBackground: hfSpotlightBackground,
    spotlightBorder: hfSpotlightBorder
  } = useCardAnimation<HTMLAnchorElement>()

  const { dimensionsRef, prefersReducedMotion, startParallaxAnimation, targetParallaxOffsetRef } =
    useHeaderAnimation({
      borderRef,
      headerRef,
      imageRef,
      meniscusRef,
      waveRef
    })

  const { collapsingTags, fallingTags, handleTagClick, removedTags, shakingTagIndex } = useTagInteraction()

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!headerRef.current || mouseMoveTickingRef.current || prefersReducedMotion) return

    mouseMoveTickingRef.current = true
    rafIdRef.current = requestAnimationFrame(() => {
      targetParallaxOffsetRef.current = {
        x:
          (event.clientX - (dimensionsRef.current.left - window.scrollX) - dimensionsRef.current.width / 2) /
          ANIMATION_CONFIG.PARALLAX_FACTOR,
        y:
          (event.clientY - (dimensionsRef.current.top - window.scrollY) - dimensionsRef.current.height / 2) /
          ANIMATION_CONFIG.PARALLAX_FACTOR
      }
      startParallaxAnimation()

      mouseMoveTickingRef.current = false
    })
  }

  const handleMouseLeave = () => {
    targetParallaxOffsetRef.current = { x: 0, y: 0 }
    startParallaxAnimation()
  }

  return (
    <header
      id={sectionIds.home}
      ref={headerRef}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseLeave={prefersReducedMotion ? undefined : handleMouseLeave}
      className="relative w-full overflow-hidden px-6 pt-28 pb-16 transition-colors lg:pt-48 lg:pb-32"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/banner.webp"
          alt=""
          className="size-full scale-110 object-cover object-center will-change-transform"
          decoding="async"
          fetchPriority="high"
          onError={(event) => (event.currentTarget.style.display = 'none')}
        />
        <div className="pointer-events-none absolute inset-0 z-10 transition-colors dark:bg-gray-900/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="relative size-28 lg:size-40"
          >
            <div className="pointer-events-none absolute inset-0 z-0 rounded-full shadow-[0_10px_40px_-10px_rgba(255,90,0,0.1)] transition-all will-change-transform peer-hover:scale-105 peer-hover:shadow-[0_20px_40px_-10px_rgba(255,90,0,0.2)]" />
            <a
              href="https://github.com/SpaceTimee"
              {...externalLinkProps}
              className="peer relative z-10 block size-full rounded-full transition-all will-change-transform hover:scale-105"
              aria-label="Github Profile"
            >
              <div className="from-primary size-full rounded-full bg-gradient-to-br to-orange-300 p-[3px] transition-colors dark:bg-gray-800">
                <div className="relative size-full overflow-hidden rounded-full bg-gray-100 transition-colors dark:bg-gray-800">
                  <img
                    src="/avatar.png"
                    alt="Avatar"
                    className="absolute inset-0 object-cover transition-opacity [image-rendering:pixelated] dark:opacity-0"
                    decoding="async"
                    fetchPriority="high"
                    onError={(event) => (event.currentTarget.style.display = 'none')}
                  />
                  <img
                    src="/avatar-dark.png"
                    alt="Avatar"
                    className="absolute inset-0 object-cover opacity-0 transition-opacity [image-rendering:pixelated] dark:opacity-100"
                    decoding="async"
                    fetchPriority="high"
                    onError={(event) => (event.currentTarget.style.display = 'none')}
                  />
                </div>
              </div>
            </a>

            <div className="absolute -right-2 -bottom-2 z-20">
              <motion.a
                href="https://huggingface.co/SpaceTimee"
                {...externalLinkProps}
                ref={hfRef}
                onPointerMove={handleHfPointerMove}
                onPointerLeave={handleHfPointerLeave}
                className="group relative flex size-9 transform-gpu items-center justify-center overflow-hidden rounded-full bg-white p-[1px] shadow-md transition-all will-change-transform hover:scale-110 dark:bg-gray-700"
                aria-label="HuggingFace Profile"
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-[0.15] dark:group-hover:opacity-[0.3]"
                  style={{ background: hfSpotlightBorder }}
                />

                <div className="group-hover:border-primary/30 pointer-events-none absolute inset-0 z-0 rounded-full border border-gray-100 transition-colors dark:border-gray-700" />

                <div className="relative z-10 flex size-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-gray-700">
                  <motion.div
                    className="pointer-events-none absolute inset-0 z-0 opacity-0 mix-blend-screen transition-opacity group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05]"
                    style={{ background: hfSpotlightBackground }}
                  />
                  <div className="relative z-20">
                    <Sparkles className="text-primary size-5" />
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="flex flex-1 flex-col space-y-4"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight drop-shadow-[0_0px_6px_rgba(255,255,255,1)] lg:text-6xl dark:drop-shadow-none">
              <span className="from-primary dark:from-primary bg-gradient-to-r via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:via-purple-300 dark:to-indigo-300">
                {profile.name}
              </span>
              <span className="text-indigo-600 transition-colors dark:text-indigo-300">.</span>
            </h1>
            <p className="mb-6 text-lg font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-colors lg:text-2xl dark:text-gray-400 dark:drop-shadow-none">
              {profile.description}
            </p>

            <motion.div
              className="-m-1.5 flex flex-wrap overflow-hidden"
              animate={
                fallingTags.size === profile.tags.length
                  ? { height: 0, opacity: 0 }
                  : { height: 'auto', opacity: 1 }
              }
              transition={
                fallingTags.size === profile.tags.length
                  ? { duration: 0.5, ease: 'easeInOut' }
                  : { duration: 0 }
              }
            >
              {profile.tags.map((tag, index) => {
                if (removedTags.has(index)) return null
                const isFalling = fallingTags.has(index)
                return (
                  <button
                    key={`${tag}-${index}`}
                    type="button"
                    onClick={() => handleTagClick(index)}
                    className={`m-1.5 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600/50 ${shakingTagIndex === index ? 'animate-shake' : ''} ${isFalling ? 'animate-fall' : ''} ${
                      collapsingTags.has(index)
                        ? '!m-0 !max-h-0 !max-w-0 overflow-hidden !border-0 !p-0 opacity-0'
                        : 'max-h-10 max-w-40'
                    }`}
                    disabled={isFalling}
                  >
                    <Code2 className="text-primary mr-1.5 size-3.5 shrink-0" />
                    <span className="whitespace-nowrap">{tag}</span>
                  </button>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 z-0 -mt-10 -mr-10 size-64 rounded-full blur-3xl" />

      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-20 w-full text-white transition-colors dark:text-gray-900"
        aria-hidden="true"
        fill="currentColor"
        height={waveHeightFactor}
        viewBox={`0 0 1000 ${waveHeightFactor}`}
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <g ref={meniscusRef}>
          <path
            d={`M 0,0 C 0,${waveHeightFactor * 0.95} ${meniscusSpread * 0.08},${waveHeightFactor} ${meniscusSpread},${waveHeightFactor} L 0,${waveHeightFactor} Z`}
          />
          <path
            d={`M 1000,0 C 1000,${waveHeightFactor * 0.95} ${1000 - meniscusSpread * 0.08},${waveHeightFactor} ${1000 - meniscusSpread},${waveHeightFactor} L 1000,${waveHeightFactor} Z`}
          />
        </g>
      </svg>

      <div
        ref={borderRef}
        className="absolute right-0 bottom-0 left-0 h-px bg-gray-200 transition-colors dark:bg-gray-800"
      />

      <div
        ref={waveRef}
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-30 h-0 w-full overflow-hidden opacity-0 will-change-[height,opacity]"
      >
        <svg
          className="size-full"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use
              href="#gentle-wave"
              x="48"
              y="0"
              className="fill-white/70 transition-colors dark:fill-gray-900/70"
            />
            <use
              href="#gentle-wave"
              x="48"
              y="3"
              className="fill-white/50 transition-colors dark:fill-gray-900/50"
            />
            <use
              href="#gentle-wave"
              x="48"
              y="5"
              className="fill-white/30 transition-colors dark:fill-gray-900/30"
            />
            <use
              href="#gentle-wave"
              x="48"
              y="7"
              className="fill-white transition-colors dark:fill-gray-900"
            />
          </g>
        </svg>
      </div>
    </header>
  )
})

export default HeaderSection
