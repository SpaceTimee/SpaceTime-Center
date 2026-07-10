import { memo, useEffect, useRef, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Code2, Sparkles } from 'lucide-react'
import { useCardAnimation } from '@/hooks/useCardAnimation'
import { useElementHeight } from '@/hooks/useDynamicHeight'
import { ANIMATION_CONFIG, useHeaderAnimation } from '@/hooks/useHeaderAnimation'
import { useTagInteraction } from '@/hooks/useTagInteraction'
import { externalLinkProps, sectionIds, springTransition } from '@/consts'
import { profile } from '@/data'

const { MENISCUS_SPREAD: meniscusSpread, WAVE_HEIGHT_FACTOR: waveHeightFactor } = ANIMATION_CONFIG

const waveLayerClass =
  'motion-reduce:animate-none paused-animations:[animation-play-state:paused] transition-[fill]'

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

  const { fallenTags, handleTagClick, shakingTagIndex } = useTagInteraction()
  const tagsListRef = useRef<HTMLUListElement>(null)
  const tagsListHeight = useElementHeight(tagsListRef)

  useEffect(
    () => () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    },
    []
  )

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
      ref={headerRef}
      id={sectionIds.home}
      aria-labelledby={`${sectionIds.home}-title`}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseLeave={prefersReducedMotion ? undefined : handleMouseLeave}
      className="relative scroll-mt-24 overflow-hidden px-6 pt-28 pb-16 lg:pt-48 lg:pb-32"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/banner.webp"
          alt=""
          onError={(event) => {
            event.currentTarget.hidden = true
          }}
          className="size-full object-cover will-change-[translate]"
          decoding="async"
          fetchPriority="high"
        />
        <div className="pointer-events-none absolute inset-0 transition-[background-color] dark:bg-gray-900/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
          <motion.div
            className="relative size-28 lg:size-40"
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_10px_40px_-10px_color-mix(in_srgb,var(--color-primary)_10%,transparent)] transition-[scale,box-shadow] will-change-[scale] peer-hover:scale-105 peer-hover:shadow-[0_20px_40px_-10px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]" />
            <a
              href="https://github.com/SpaceTimee"
              {...externalLinkProps}
              aria-label="Github Profile"
              className="peer relative block size-full rounded-full transition-[scale] will-change-[scale] hover:scale-105"
            >
              <div className="from-primary size-full rounded-full bg-gradient-to-br to-orange-300 p-[3px]">
                <div className="relative size-full overflow-hidden rounded-full bg-gray-100 transition-[background-color] dark:bg-gray-800">
                  <img
                    src="/avatar.png"
                    alt=""
                    onError={(event) => {
                      event.currentTarget.hidden = true
                    }}
                    className="absolute inset-0 object-cover transition-opacity [image-rendering:pixelated] dark:opacity-0"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <img
                    src="/avatar-dark.png"
                    alt=""
                    onError={(event) => {
                      event.currentTarget.hidden = true
                    }}
                    className="absolute inset-0 object-cover opacity-0 transition-opacity [image-rendering:pixelated] dark:opacity-100"
                    decoding="async"
                    loading="lazy"
                  />
                </div>
              </div>
            </a>

            <motion.a
              ref={hfRef}
              href="https://huggingface.co/SpaceTimee"
              {...externalLinkProps}
              aria-label="HuggingFace Profile"
              onPointerMove={handleHfPointerMove}
              onPointerLeave={handleHfPointerLeave}
              className="group absolute -right-1 -bottom-1 z-20 flex size-9 overflow-hidden rounded-full bg-white p-px shadow-md transition-[scale,background-color] will-change-[scale] hover:scale-110 dark:bg-gray-700"
            >
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-15 dark:group-hover:opacity-30"
                style={{ backgroundImage: hfSpotlightBorder }}
              />

              <div className="group-hover:border-primary/30 pointer-events-none absolute inset-0 rounded-full border border-gray-100 transition-[border-color] dark:border-gray-600" />

              <div className="relative z-10 flex size-full items-center justify-center overflow-hidden rounded-full bg-white transition-[background-color] dark:bg-gray-700">
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity group-hover:opacity-[0.03] dark:group-hover:opacity-5"
                  style={{ backgroundImage: hfSpotlightBackground }}
                />
                <Sparkles aria-hidden className="text-primary relative z-10 size-5" />
              </div>
            </motion.a>
          </motion.div>

          <motion.div
            className="flex min-w-0 flex-1 flex-col gap-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
          >
            <h1
              id={`${sectionIds.home}-title`}
              className="font-display text-4xl font-bold tracking-tight drop-shadow-[0_0_6px_white] transition-[filter] lg:text-6xl dark:drop-shadow-none"
            >
              <span className="from-primary bg-gradient-to-r via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:via-purple-300 dark:to-indigo-300">
                {profile.name}
              </span>
              <span className="text-indigo-600 transition-[color] dark:text-indigo-300">.</span>
            </h1>
            <p className="mb-2 text-lg font-medium text-white drop-shadow-[0_1px_3px_rgb(0_0_0_/_0.8)] transition-[color,filter] lg:text-2xl dark:text-gray-400 dark:drop-shadow-none">
              {profile.description}
            </p>

            <div
              className={`ease-emphasized -m-1.5 overflow-hidden transition-[height,opacity] duration-500 motion-reduce:transition-none ${
                fallenTags.size === profile.tags.length ? 'opacity-0' : ''
              }`}
              style={tagsListHeight === 'auto' ? undefined : { height: tagsListHeight }}
            >
              <ul ref={tagsListRef} className="flex flex-wrap">
                <AnimatePresence mode="popLayout">
                  {profile.tags.map((tag, index) =>
                    fallenTags.has(index) ? null : (
                      <motion.li
                        key={`${tag}-${index}`}
                        layout={!prefersReducedMotion}
                        exit={{ y: 200, rotate: 45, opacity: 0 }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                duration: 0.5,
                                ease: 'easeIn',
                                layout: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
                              }
                        }
                      >
                        <button
                          type="button"
                          onClick={() => handleTagClick(index)}
                          className={`m-1.5 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium whitespace-nowrap text-gray-600 shadow-sm transition-[color,background-color,border-color] hover:bg-gray-200 motion-reduce:animate-none dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600/50 ${shakingTagIndex === index ? 'animate-shake' : ''}`}
                        >
                          <Code2 aria-hidden className="text-primary size-3.5 shrink-0" />
                          {tag}
                        </button>
                      </motion.li>
                    )
                  )}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 size-64 rounded-full blur-3xl" />

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 w-full text-white transition-[color] dark:text-gray-900"
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
        className="absolute inset-x-0 bottom-0 h-px bg-gray-200 transition-[background-color] dark:bg-gray-800"
      />

      <div
        ref={waveRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-0 overflow-hidden opacity-0 will-change-[height,opacity]"
      >
        <svg aria-hidden className="size-full" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <use
            href="#gentle-wave"
            x={48}
            className={`${waveLayerClass} animate-wave-1 fill-white/70 dark:fill-gray-900/70`}
          />
          <use
            href="#gentle-wave"
            x={48}
            y={3}
            className={`${waveLayerClass} animate-wave-2 fill-white/50 dark:fill-gray-900/50`}
          />
          <use
            href="#gentle-wave"
            x={48}
            y={5}
            className={`${waveLayerClass} animate-wave-3 fill-white/30 dark:fill-gray-900/30`}
          />
          <use
            href="#gentle-wave"
            x={48}
            y={7}
            className={`${waveLayerClass} animate-wave-4 fill-white dark:fill-gray-900`}
          />
        </svg>
      </div>
    </header>
  )
})

export default HeaderSection
