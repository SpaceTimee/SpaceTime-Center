import {
  avatarMotion,
  fadeUpMotion,
  headerConfig,
  initialMeniscusPaths,
  meniscusViewBox,
  reducedMotion,
  tagFallExit,
  tagFallTransition
} from '@/consts/motion'
import { externalLink, getSection, sectionIds } from '@/consts/navigation'
import { assets, profile, social } from '@/consts/profile'
import {
  absoluteFill,
  bgTransition,
  cardOutline,
  cardSpotlightBorder,
  cardSpotlightFill,
  colorTransition,
  opacityTransition,
  scaleTransition,
  scrollMargin,
  tw
} from '@/consts/styles'
import { useCardAnimation } from '@/hooks/useCardAnimation'
import { useElementHeight } from '@/hooks/useElementHeight'
import { useHeaderAnimation } from '@/hooks/useHeaderAnimation'
import { useTagInteraction } from '@/hooks/useTagInteraction'
import { Code2, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type MouseEvent } from 'react'

const homeSection = getSection(sectionIds.home)
const homeTitleId = homeSection.titleId

const headerAvatar = tw`absolute inset-0 object-cover ${opacityTransition} pixelated`
const headerWave = tw`transition-[fill] motion-emphasized motion-reduce:animate-none paused:animate-paused`
const headerWaves = [
  { y: undefined, className: tw`${headerWave} animate-wave-1 fill-white/70 dark:fill-grey-900/70` },
  { y: 3, className: tw`${headerWave} animate-wave-2 fill-white/50 dark:fill-grey-900/50` },
  { y: 5, className: tw`${headerWave} animate-wave-3 fill-white/30 dark:fill-grey-900/30` },
  { y: 7, className: tw`${headerWave} animate-wave-4 fill-white dark:fill-grey-900` }
] as const

const tagsShell = tw`-m-1.5 overflow-hidden transition-[height,opacity] motion-emphasized motion-reduce:transition-none`
const tagButton = tw`m-1.5 inline-flex items-center gap-1.5 rounded-full border border-grey-200 bg-grey-100 px-3 py-1 text-sm font-medium whitespace-nowrap text-grey-600 shadow-sm transition-[color,background-color,border-color] motion-emphasized hover:bg-grey-200 motion-reduce:animate-none dark:border-grey-600 dark:bg-grey-700/50 dark:text-grey-300 dark:hover:bg-grey-600/50`

export default function HeaderSection() {
  const borderRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const meniscusRef = useRef<SVGGElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)
  const tagsListRef = useRef<HTMLUListElement>(null)
  const isRafPendingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const mouseClientRef = useRef({ x: 0, y: 0 })

  const { dimensionsRef, prefersReducedMotion, setParallaxTarget } = useHeaderAnimation({
    borderRef,
    headerRef,
    imageRef,
    meniscusRef,
    waveRef
  })

  const { ref, handlePointerLeave, handlePointerMove, spotlightBackground, spotlightBorder } =
    useCardAnimation<HTMLAnchorElement>()

  const { fallenTagIndices, handleTagClick, handleTagShakeEnd, shakingTagIndex } = useTagInteraction()
  const tagsListHeight = useElementHeight(tagsListRef)

  useEffect(() => () => cancelAnimationFrame(rafIdRef.current ?? 0), [])

  useEffect(() => {
    if (!prefersReducedMotion) return

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    isRafPendingRef.current = false
  }, [prefersReducedMotion])

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    mouseClientRef.current = { x: event.clientX, y: event.clientY }
    if (isRafPendingRef.current) return

    isRafPendingRef.current = true
    rafIdRef.current = requestAnimationFrame(() => {
      const { x, y } = mouseClientRef.current
      setParallaxTarget(
        (x - (dimensionsRef.current.left - scrollX) - dimensionsRef.current.width / 2) /
          headerConfig.parallaxFactor,
        (y - (dimensionsRef.current.top - scrollY) - dimensionsRef.current.height / 2) /
          headerConfig.parallaxFactor
      )

      isRafPendingRef.current = false
    })
  }

  return (
    <header
      ref={headerRef}
      id={homeSection.id}
      aria-labelledby={homeTitleId}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseLeave={prefersReducedMotion ? undefined : () => setParallaxTarget(0, 0)}
      className={tw`relative overflow-hidden px-6 pt-28 pb-16 lg:pt-48 lg:pb-32 ${scrollMargin}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imageRef}
          src={assets.banner}
          alt=""
          onError={(event) => (event.currentTarget.hidden = true)}
          className="size-full object-cover will-change-transform"
          decoding="async"
          fetchPriority="high"
        />
        <div className={tw`${absoluteFill} ${bgTransition} dark:bg-grey-900/90`} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
          <motion.div className="relative size-28 lg:size-40" {...avatarMotion}>
            <div
              className={tw`${absoluteFill} rounded-full shadow-avatar transition-[scale,box-shadow] motion-emphasized will-change-transform peer-hover:scale-105 peer-hover:shadow-avatar-hover`}
            />
            <a
              href={social.github}
              {...externalLink}
              aria-label="Github Profile"
              className={tw`peer relative block size-full rounded-full ${scaleTransition} hover:scale-105`}
            >
              <div className="size-full rounded-full bg-gradient-to-br from-primary to-orange-300 p-0.75">
                <div
                  className={tw`relative size-full overflow-hidden rounded-full bg-grey-100 ${bgTransition} dark:bg-grey-800`}
                >
                  <img
                    src={assets.avatar}
                    alt=""
                    onError={(event) => (event.currentTarget.hidden = true)}
                    className={`${headerAvatar} dark:opacity-0`}
                    decoding="async"
                    fetchPriority="high"
                  />
                  <img
                    src={assets.avatarDark}
                    alt=""
                    onError={(event) => (event.currentTarget.hidden = true)}
                    className={`${headerAvatar} opacity-0 dark:opacity-100`}
                    decoding="async"
                    loading="lazy"
                  />
                </div>
              </div>
            </a>

            <motion.a
              ref={ref}
              href={social.huggingFace}
              {...externalLink}
              aria-label="HuggingFace Profile"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerLeave}
              className="group absolute -right-1 -bottom-1 z-20 flex size-9 overflow-hidden rounded-full bg-white p-px shadow-md transition-[background-color,scale] motion-emphasized will-change-transform hover:scale-105 dark:bg-grey-700"
            >
              <motion.div className={cardSpotlightBorder} style={{ backgroundImage: spotlightBorder }} />
              <div className={tw`${absoluteFill} rounded-full ${cardOutline} dark:border-grey-600`} />

              <div
                className={tw`relative z-10 flex size-full items-center justify-center overflow-hidden rounded-full bg-white ${bgTransition} dark:bg-grey-700`}
              >
                <motion.div className={cardSpotlightFill} style={{ backgroundImage: spotlightBackground }} />
                <Sparkles aria-hidden className="relative z-10 size-5 text-primary" />
              </div>
            </motion.a>
          </motion.div>

          <motion.div className="flex min-w-0 flex-1 flex-col gap-4" {...fadeUpMotion}>
            <h1
              id={homeTitleId}
              className="font-display text-4xl font-bold tracking-tight drop-shadow-title transition-[filter] motion-emphasized lg:text-6xl dark:drop-shadow-none"
            >
              <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:via-purple-300 dark:to-indigo-300">
                {profile.name}
              </span>
              <span className={tw`text-indigo-600 ${colorTransition} dark:text-indigo-300`}>.</span>
            </h1>
            <p className="mb-2 text-lg font-medium text-white drop-shadow-subtitle transition-[color,filter] motion-emphasized lg:text-2xl dark:text-grey-400 dark:drop-shadow-none">
              {profile.description}
            </p>

            <div
              className={fallenTagIndices.size === profile.tags.length ? `${tagsShell} opacity-0` : tagsShell}
              style={tagsListHeight === 'auto' ? undefined : { height: tagsListHeight }}
            >
              <ul ref={tagsListRef} className="flex flex-wrap">
                <AnimatePresence mode="popLayout">
                  {profile.tags.map(
                    (tag, index) =>
                      !fallenTagIndices.has(index) && (
                        <motion.li
                          key={`${tag}-${index}`}
                          layout={!prefersReducedMotion}
                          exit={tagFallExit}
                          transition={prefersReducedMotion ? reducedMotion : tagFallTransition}
                        >
                          <button
                            type="button"
                            onClick={() => handleTagClick(index)}
                            onAnimationEnd={handleTagShakeEnd}
                            className={shakingTagIndex === index ? `${tagButton} animate-shake` : tagButton}
                          >
                            <Code2 aria-hidden className="size-3.5 shrink-0 text-primary" />
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

      <div className="pointer-events-none absolute -top-10 -right-10 size-64 rounded-full bg-primary/5 blur-3xl" />

      <svg
        aria-hidden
        className={tw`pointer-events-none absolute inset-x-0 bottom-0 z-20 w-full text-white ${colorTransition} dark:text-grey-900`}
        fill="currentColor"
        height={headerConfig.waveHeight}
        viewBox={meniscusViewBox}
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <g ref={meniscusRef}>
          <path d={initialMeniscusPaths[0]} />
          <path d={initialMeniscusPaths[1]} />
        </g>
      </svg>

      <div
        ref={borderRef}
        className={tw`absolute inset-x-0 bottom-0 h-px bg-grey-200 ${bgTransition} dark:bg-grey-800`}
      />

      <div
        ref={waveRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-0 overflow-hidden opacity-0 will-change-height-opacity"
      >
        <svg aria-hidden className="size-full" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          {headerWaves.map(({ y, className }) => (
            <use key={className} href="#gentle-wave" x={48} y={y} className={className} />
          ))}
        </svg>
      </div>
    </header>
  )
}
