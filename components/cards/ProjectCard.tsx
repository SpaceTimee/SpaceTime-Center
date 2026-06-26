import { memo, useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  ChevronRight,
  ExternalLink,
  FolderCheck,
  FolderClock,
  FolderCog,
  Pin,
  Sparkles
} from 'lucide-react'
import GithubIcon from '../icons/GithubIcon'
import { ProjectTooltip } from '../ui/ProjectTooltip'
import { useCardAnimation } from '../../hooks/useCardAnimation'
import { externalLinkProps, tagPillProps } from '../../consts'
import { ProjectStatus, type ProjectInfo, type ProjectType } from '../../types'

const PROJECT_STATUS_ICON_MAP = {
  [ProjectStatus.InProgress]: <FolderCog className="w-6 h-6" />,
  [ProjectStatus.Completed]: <FolderCheck className="w-6 h-6" />,
  [ProjectStatus.Planned]: <FolderClock className="w-6 h-6" />
} as const satisfies Record<ProjectStatus, ReactNode>

const PROJECT_TYPE_ICON_MAP = {
  Github: <GithubIcon className="w-5 h-5" />,
  HuggingFace: <Brain className="w-5 h-5" />,
  Gemini: <Sparkles className="w-5 h-5" />,
  External: <ExternalLink className="w-5 h-5" />,
  Default: <GithubIcon className="w-5 h-5" />
} as const satisfies Record<ProjectType | 'Default', ReactNode>

const summaryCache = new Map<string, string>()

const ProjectCard = memo(({ info }: { info: ProjectInfo }) => {
  const {
    handlePointerLeave: cardPointerLeave,
    handlePointerMove: cardPointerMove,
    ref,
    rotateX,
    rotateY,
    spotlightBackground,
    spotlightBorder
  } = useCardAnimation<HTMLElement>()

  const isLink = !!info.link
  const Wrapper = isLink ? motion.a : motion.div

  const [tooltipText, setTooltipText] = useState('')
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const fetchIdRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearIntervalRef = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(
    () => () => {
      clearIntervalRef()
      fetchIdRef.current++
    },
    []
  )

  const handleTooltipPosition = useCallback((clientX: number, clientY: number) => {
    const tooltip = tooltipRef.current
    if (!tooltip) return

    const flipX = clientX + 280 > window.innerWidth
    const flipY = clientY + 100 > window.innerHeight

    Object.assign(tooltip.style, {
      bottom: flipY ? `${window.innerHeight - clientY + 12}px` : 'auto',
      left: flipX ? 'auto' : `${clientX + 12}px`,
      right: flipX ? `${window.innerWidth - clientX + 12}px` : 'auto',
      top: flipY ? 'auto' : `${clientY + 12}px`,
      clipPath: 'inset(-3px round 12px)'
    })
  }, [])

  const handlePointerEnter = useCallback(
    async (event: PointerEvent<HTMLElement>) => {
      handleTooltipPosition(event.clientX, event.clientY)

      const fallback = `${info.name} 是 ${info.description}`

      if (!info.link?.startsWith('https://github.com/')) {
        setTooltipText(fallback)
        setTooltipVisible(true)
        return
      }

      const cached = summaryCache.get(info.link)
      if (cached) {
        setTooltipText(cached)
        setTooltipVisible(true)
        return
      }

      let dots = 0
      setTooltipText('.')
      setTooltipVisible(true)
      intervalRef.current = setInterval(() => {
        dots = (dots + 1) % 3
        setTooltipText('.'.repeat(dots + 1))
      }, 400)

      const id = ++fetchIdRef.current

      try {
        let summary: string | null = null
        const match = info.link.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/)
        if (match) {
          const readme = await Promise.any(
            ['main', 'master'].map(async (branch) => {
              const response = await fetch(
                `https://raw.githubusercontent.com/${match[1]}/${match[2]}/refs/heads/${branch}/README.md`
              )
              if (!response.ok) throw new Error()
              return response.text()
            })
          ).catch(() => null)

          if (readme) {
            const aiResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/gateway/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: [
                  {
                    role: 'user',
                    content: `请根据以下 README 内容，用一句中文简短介绍这个项目：\n\n${readme}`
                  }
                ]
              })
            })

            if (aiResponse.ok) {
              const { content, error } = (await aiResponse.json()) as { content?: string; error?: string }
              if (!error && content) summary = content
            }
          }
        }

        if (fetchIdRef.current !== id) return
        clearIntervalRef()

        if (summary) {
          summaryCache.set(info.link, summary)

          let charIndex = 0
          intervalRef.current = setInterval(() => {
            if (fetchIdRef.current !== id) {
              clearIntervalRef()
              return
            }
            charIndex++
            setTooltipText(summary.slice(0, charIndex))
            if (charIndex >= summary.length) clearIntervalRef()
          }, 30)
        } else {
          setTooltipText(fallback)
        }
      } catch {
        if (fetchIdRef.current !== id) return
        clearIntervalRef()
        setTooltipText(fallback)
      }
    },
    [info, handleTooltipPosition]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      cardPointerMove(event)
      handleTooltipPosition(event.clientX, event.clientY)
    },
    [cardPointerMove, handleTooltipPosition]
  )

  const handlePointerLeave = useCallback(() => {
    cardPointerLeave()
    setTooltipVisible(false)
    const tooltip = tooltipRef.current
    if (tooltip) {
      const flipX = tooltip.style.left === 'auto'
      const flipY = tooltip.style.top === 'auto'
      const [top, bottom] = flipY ? ['100%', '-3px'] : ['-3px', '100%']
      const [right, left] = flipX ? ['-3px', '100%'] : ['100%', '-3px']
      tooltip.style.clipPath = `inset(${top} ${right} ${bottom} ${left} round 12px)`
    }
    fetchIdRef.current++
    clearIntervalRef()
  }, [cardPointerLeave])

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <Wrapper
        // @ts-expect-error - Wrapper is motion.a | motion.div; HTMLElement ref is compatible at runtime
        ref={ref}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        {...(isLink ? { href: info.link, ...externalLinkProps } : undefined)}
        whileHover={{ y: -4 }}
        className={`group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl p-[1px] shadow-sm transition-shadow duration-300 transform-gpu will-change-transform h-full ${
          isLink ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <div
          className="absolute inset-0 z-[-1] rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ transform: 'translateZ(-15px)' }}
        />

        <motion.div
          className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-[0.15] dark:group-hover:opacity-[0.3] transition-opacity duration-300"
          style={{ background: spotlightBorder }}
        />

        <div className="absolute inset-0 z-0 rounded-xl border border-gray-100 dark:border-gray-700 group-hover:border-primary/30 dark:group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full bg-white dark:bg-gray-800 rounded-[11px] p-6 overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none mix-blend-screen"
            style={{ background: spotlightBackground }}
          />

          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 dark:bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none will-change-transform transform-gpu" />

          <div className="relative z-20 flex flex-col h-full" style={{ transform: 'translateZ(15px)' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {PROJECT_STATUS_ICON_MAP[info.status]}
              </div>
              {info.pinned ? (
                <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transform rotate-[-15deg] transition-colors duration-300">
                  <Pin className="w-5 h-5" />
                </div>
              ) : (
                isLink && (
                  <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                    {PROJECT_TYPE_ICON_MAP[info.type ?? 'Default']}
                  </div>
                )
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
              {info.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
              {info.description}
            </p>

            <div className="mt-auto flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2" style={{ transform: 'translateZ(10px)' }}>
                {info.tags.map((tag) => (
                  <span key={`${info.name}-${tag}`} {...tagPillProps.md}>
                    {tag}
                  </span>
                ))}
              </div>

              {isLink && (
                <div
                  className="flex items-center text-xs font-bold text-primary/80 group-hover:text-primary transition-all duration-300 whitespace-nowrap relative z-20 group-hover:translate-x-1"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  View Project <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>

      <ProjectTooltip ref={tooltipRef} text={tooltipText} visible={tooltipVisible} />
    </div>
  )
})

export default ProjectCard
