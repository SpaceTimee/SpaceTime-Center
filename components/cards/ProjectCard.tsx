import { memo, useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
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
import GithubIcon from '@/components/icons/GithubIcon'
import ProjectTooltip from '@/components/ui/ProjectTooltip'
import { useCardAnimation } from '@/hooks/useCardAnimation'
import { externalLinkProps, tagPillProps } from '@/consts'
import { ProjectStatus, type ProjectInfo, type ProjectType } from '@/types'

const PROJECT_STATUS_ICON_MAP = {
  [ProjectStatus.InProgress]: <FolderCog className="size-6" />,
  [ProjectStatus.Completed]: <FolderCheck className="size-6" />,
  [ProjectStatus.Planned]: <FolderClock className="size-6" />
} as const satisfies Record<ProjectStatus, ReactNode>

const PROJECT_TYPE_ICON_MAP = {
  Github: <GithubIcon className="size-5" />,
  HuggingFace: <Brain className="size-5" />,
  Gemini: <Sparkles className="size-5" />,
  External: <ExternalLink className="size-5" />,
  Default: <GithubIcon className="size-5" />
} as const satisfies Record<ProjectType | 'Default', ReactNode>

const summaryCache = new Map<string, string>()

const ProjectCard = memo(({ info }: { info: ProjectInfo }) => {
  const {
    ref,
    handlePointerLeave: cardPointerLeave,
    handlePointerMove: cardPointerMove,
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
  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearIntervalRef = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const cancelFetch = () => {
    fetchIdRef.current++
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
  }

  useEffect(
    () => () => {
      clearIntervalRef()
      cancelFetch()
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

      const match = info.link?.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/)
      if (!info.link || !match) {
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

      const requestId = ++fetchIdRef.current

      const abortController = new AbortController()
      abortControllerRef.current = abortController
      const signal = AbortSignal.any([abortController.signal, AbortSignal.timeout(8000)])

      try {
        let summary: string | null = null
        const readme = await Promise.any(
          ['main', 'master'].map(async (branch) => {
            const response = await fetch(
              `https://raw.githubusercontent.com/${match[1]}/${match[2]}/refs/heads/${branch}/README.md`,
              { signal }
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
            }),
            signal
          })

          if (aiResponse.ok) {
            const { content, error } = (await aiResponse.json()) as { content?: string; error?: string }
            if (!error && content) summary = content
          }
        }

        if (fetchIdRef.current !== requestId) return
        clearIntervalRef()

        if (summary) {
          summaryCache.set(info.link, summary)

          let charIndex = 0
          intervalRef.current = setInterval(() => {
            if (fetchIdRef.current !== requestId) {
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
        if (fetchIdRef.current !== requestId) return
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
    cancelFetch()
    clearIntervalRef()
  }, [cardPointerLeave])

  return (
    <div className="h-full [perspective:1200px]">
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
        className="group relative flex h-full transform-gpu flex-col rounded-xl bg-white p-[1px] shadow-sm transition-[box-shadow,background-color] will-change-transform dark:bg-gray-800"
      >
        <div className="pointer-events-none absolute inset-0 z-[-1] [transform:translateZ(-15px)] rounded-xl opacity-0 shadow-lg transition-opacity duration-500 group-hover:opacity-100" />

        <motion.div
          className="absolute inset-0 z-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-[0.15] dark:group-hover:opacity-[0.3]"
          style={{ background: spotlightBorder }}
        />

        <div className="group-hover:border-primary/30 pointer-events-none absolute inset-0 z-0 rounded-xl border border-gray-100 transition-colors dark:border-gray-700" />

        <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[11px] bg-white p-6 transition-colors dark:bg-gray-800">
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 opacity-0 mix-blend-screen transition-opacity group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05]"
            style={{ background: spotlightBackground }}
          />

          <div className="bg-primary/5 pointer-events-none absolute -top-12 -right-12 size-32 transform-gpu rounded-full blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform group-hover:scale-150" />

          <div className="relative z-20 flex h-full [transform:translateZ(15px)] flex-col space-y-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="bg-primary/10 dark:bg-primary/20 text-primary group-hover:bg-primary rounded-lg p-2 transition-colors group-hover:text-white">
                {PROJECT_STATUS_ICON_MAP[info.status]}
              </div>
              {info.pinned ? (
                <div className="group-hover:text-primary rotate-[-15deg] text-gray-300 transition-colors dark:text-gray-600">
                  <Pin className="size-5" />
                </div>
              ) : (
                isLink && (
                  <div className="group-hover:text-primary text-gray-300 transition-colors dark:text-gray-600">
                    {PROJECT_TYPE_ICON_MAP[info.type ?? 'Default']}
                  </div>
                )
              )}
            </div>

            <h3 className="group-hover:text-primary text-xl font-bold text-gray-800 transition-colors dark:text-gray-100">
              {info.name}
            </h3>

            <p className="mb-4 text-sm leading-relaxed text-gray-600 transition-colors dark:text-gray-400">
              {info.description}
            </p>

            <div className="mt-auto flex items-end justify-between gap-4">
              <div className="flex [transform:translateZ(10px)] flex-wrap gap-2">
                {info.tags.map((tag) => (
                  <span key={`${info.name}-${tag}`} {...tagPillProps.md}>
                    {tag}
                  </span>
                ))}
              </div>

              {isLink && (
                <div className="text-primary/80 group-hover:text-primary relative z-20 mb-1 flex [transform:translateZ(10px)] items-center text-xs font-bold whitespace-nowrap transition-all group-hover:translate-x-1">
                  View Project <ChevronRight className="ml-1 size-3.5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>

      <ProjectTooltip ref={tooltipRef} text={tooltipText} isVisible={tooltipVisible} />
    </div>
  )
})

export default ProjectCard
