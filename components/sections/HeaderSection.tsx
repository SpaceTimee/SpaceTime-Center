import { memo, useEffect, useRef, type MouseEvent } from 'react'
import { Code2, Sparkles } from 'lucide-react'
import { useHeaderAnimation, ANIMATION_CONFIG } from '../../hooks/useHeaderAnimation'
import { useTagInteraction } from '../../hooks/useTagInteraction'
import { profile } from '../../data'
import { externalLinkProps, sectionIds } from '../../consts'

const HeaderSection = memo(() => {
  const headerRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const mouseMoveTickingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  const { dimensionsRef, targetParallaxOffsetRef, startParallaxAnimation, prefersReducedMotion } =
    useHeaderAnimation({
      headerRef,
      imageRef,
      waveRef,
      borderRef
    })

  const { shakingTagIndex, fallingTags, collapsingTags, removedTags, handleTagClick } = useTagInteraction()

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!headerRef.current || mouseMoveTickingRef.current || prefersReducedMotion) return

    mouseMoveTickingRef.current = true
    rafIdRef.current = requestAnimationFrame(() => {
      targetParallaxOffsetRef.current = {
        x:
          (e.clientX - (dimensionsRef.current.left - window.scrollX) - dimensionsRef.current.width / 2) /
          ANIMATION_CONFIG.PARALLAX_FACTOR,
        y:
          (e.clientY - (dimensionsRef.current.top - window.scrollY) - dimensionsRef.current.height / 2) /
          ANIMATION_CONFIG.PARALLAX_FACTOR
      }
      startParallaxAnimation()

      mouseMoveTickingRef.current = false
    })
  }

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

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
      className="relative w-full pt-32 pb-12 lg:pt-40 lg:pb-20 px-6 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/banner.webp"
          alt="Banner"
          className="w-full h-full object-cover object-center will-change-transform"
          style={{ transform: 'scale(1.1)' }}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <div className="absolute inset-0 transition-colors duration-500 ease-in-out z-10 pointer-events-none bg-transparent dark:bg-gray-900/90" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="relative w-28 h-28 lg:w-40 lg:h-40">
            <div className="absolute inset-0 rounded-full bg-transparent shadow-[0_10px_40px_-10px_rgba(255,90,0,0.1)] peer-hover:shadow-[0_20px_40px_-10px_rgba(255,90,0,0.2)] peer-hover:scale-105 transition-all duration-300 z-0 pointer-events-none will-change-transform" />
            <a
              href="https://github.com/SpaceTimee"
              {...externalLinkProps}
              className="peer relative z-10 block w-full h-full rounded-full transform transition-all duration-300 hover:scale-105 will-change-transform"
              style={{ clipPath: 'circle(50%)', WebkitClipPath: 'circle(50%)' }}
              aria-label="Github Profile"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-orange-300 p-[3px] dark:bg-gray-800">
                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  <img
                    src="/avatar.png"
                    alt="Space Time Avatar"
                    className="w-full h-full object-cover block dark:hidden mix-blend-multiply"
                    style={{ imageRendering: 'pixelated' }}
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <img
                    src="/avatar-dark.png"
                    alt="Space Time Avatar Dark"
                    className="w-full h-full object-cover hidden dark:block"
                    style={{ imageRendering: 'pixelated' }}
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              </div>
            </a>

            <a
              href="https://huggingface.co/SpaceTimee"
              {...externalLinkProps}
              className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-200 z-20"
              aria-label="Hugging Face Profile"
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </a>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-2 drop-shadow-[0_0px_6px_rgba(255,255,255,1)] dark:drop-shadow-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-indigo-700 dark:from-primary dark:via-purple-300 dark:to-indigo-300">
                  {profile.name}
                </span>
                <span className="text-indigo-700 dark:text-indigo-300">.</span>
              </h1>
              <p className="text-lg lg:text-xl text-white dark:text-gray-400 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] dark:drop-shadow-none">
                {profile.description}
              </p>
            </div>

            <div
              className={`flex flex-wrap -m-1.5 transition-all duration-700 ease-in-out overflow-hidden ${
                fallingTags.size === profile.tags.length
                  ? '!mt-0 !max-h-0 opacity-0'
                  : 'mt-0 max-h-[500px] opacity-100'
              }`}
            >
              {profile.tags.map((detail, index) => {
                if (removedTags.has(index)) return null
                const isFalling = fallingTags.has(index)
                return (
                  <button
                    key={`${detail}-${index}`}
                    type="button"
                    onClick={() => handleTagClick(index)}
                    className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-600 shadow-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-all duration-300 m-1.5
                      ${shakingTagIndex === index ? 'animate-shake' : ''}
                      ${isFalling ? 'animate-fall' : ''}
                      ${
                        collapsingTags.has(index)
                          ? '!max-w-0 !max-h-0 !p-0 !m-0 !border-0 opacity-0 overflow-hidden'
                          : 'max-w-40 max-h-10'
                      }`}
                    disabled={isFalling}
                  >
                    <Code2 className="w-3.5 h-3.5 mr-1.5 text-primary flex-shrink-0" />
                    <span className="whitespace-nowrap">{detail}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div ref={borderRef} className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-800" />

      <div
        ref={waveRef}
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden z-30 pointer-events-none"
        style={{ height: 0, opacity: 0, willChange: 'height, opacity' }}
      >
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" className="fill-white/70 dark:fill-gray-900/70" />
            <use xlinkHref="#gentle-wave" x="48" y="3" className="fill-white/50 dark:fill-gray-900/50" />
            <use xlinkHref="#gentle-wave" x="48" y="5" className="fill-white/30 dark:fill-gray-900/30" />
            <use xlinkHref="#gentle-wave" x="48" y="7" className="fill-white dark:fill-gray-900" />
          </g>
        </svg>
      </div>
    </header>
  )
})

export default HeaderSection
