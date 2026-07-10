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
import { externalLinkProps } from '@/consts'
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
      clipPath: 'inset(-3px round var(--radius-xl))'
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
      tooltip.style.clipPath = `inset(${top} ${right} ${bottom} ${left} round var(--radius-xl))`
    }
    cancelFetch()
    clearIntervalRef()
  }, [cardPointerLeave])

  return (
    <div className="h-full perspective-distant">
      <Wrapper
        // @ts-expect-error - Wrapper is motion.a | motion.div; HTMLElement ref is compatible at runtime
        ref={ref}
        {...(isLink ? { href: info.link, ...externalLinkProps } : undefined)}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="group relative block h-full rounded-xl bg-white p-px shadow-sm transition-[background-color] will-change-transform transform-3d dark:bg-gray-800"
        style={{
          rotateX,
          rotateY
        }}
        whileHover={{ y: -4 }}
      >
        <div className="pointer-events-none absolute inset-0 -z-1 -translate-z-[15px] rounded-xl opacity-0 shadow-lg transition-opacity duration-500 group-hover:opacity-100" />

        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-15 dark:group-hover:opacity-30"
          style={{ backgroundImage: spotlightBorder }}
        />

        <div className="group-hover:border-primary/30 pointer-events-none absolute inset-0 rounded-xl border border-gray-100 transition-[border-color] dark:border-gray-700" />

        <div className="relative h-full overflow-hidden rounded-[calc(var(--radius-xl)-1px)] bg-white p-6 transition-[background-color] dark:bg-gray-800">
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity group-hover:opacity-[0.03] dark:group-hover:opacity-5"
            style={{ backgroundImage: spotlightBackground }}
          />

          <div className="bg-primary/5 ease-emphasized pointer-events-none absolute -top-12 -right-12 size-32 transform-gpu rounded-full blur-2xl transition-[scale] duration-500 group-hover:scale-150" />

          <div className="relative flex h-full translate-z-[15px] flex-col gap-2">
            <div className="mb-4 flex items-center justify-between">
              <div
                aria-hidden
                className="bg-primary/10 dark:bg-primary/20 text-primary group-hover:bg-primary rounded-lg p-2 transition-[color,background-color] group-hover:text-white"
              >
                {PROJECT_STATUS_ICON_MAP[info.status]}
              </div>
              {info.pinned ? (
                <div
                  aria-hidden
                  className="group-hover:text-primary -rotate-[15deg] text-gray-300 transition-[color] dark:text-gray-600"
                >
                  <Pin className="size-5" />
                </div>
              ) : (
                isLink && (
                  <div
                    aria-hidden
                    className="group-hover:text-primary text-gray-300 transition-[color] dark:text-gray-600"
                  >
                    {PROJECT_TYPE_ICON_MAP[info.type ?? 'Default']}
                  </div>
                )
              )}
            </div>

            <h3 className="group-hover:text-primary text-xl font-bold text-gray-800 transition-[color] dark:text-gray-100">
              {info.name}
            </h3>

            <p className="mb-2 text-sm leading-relaxed text-gray-600 transition-[color] dark:text-gray-400">
              {info.description}
            </p>

            <div className="mt-auto flex items-end justify-between gap-4">
              <ul className="flex translate-z-[10px] flex-wrap gap-2">
                {info.tags.map((tag) => (
                  <li
                    key={`${info.name}-${tag}`}
                    className="group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-500 transition-[color,background-color,border-color] dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {isLink && (
                <span className="text-primary/80 group-hover:text-primary mb-1 flex translate-z-[10px] items-center gap-1 text-xs font-bold whitespace-nowrap transition-[color,translate] group-hover:translate-x-1">
                  View Project <ChevronRight aria-hidden className="size-3.5" />
                </span>
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
