import CardChrome from '@/components/controls/CardChrome'
import ProjectTooltip from '@/components/controls/ProjectTooltip'
import GithubIcon from '@/components/icons/GithubIcon'
import { cardHover } from '@/consts/motion'
import { externalLink } from '@/consts/navigation'
import { cardShell, cardStage, cardTag, colorBgTransition, colorTransition, tw } from '@/consts/styles'
import { ProjectStatus, type ProjectInfo, type ProjectType } from '@/consts/types'
import { useCardAnimation } from '@/hooks/useCardAnimation'
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
import { motion } from 'motion/react'
import { memo, useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

interface ChatResponse {
  readonly content?: string
  readonly error?: string
}

const tooltipSummaryCache = new Map<string, string>()

const cardMetaIcon = tw`text-grey-300 ${colorTransition} group-hover:text-primary dark:text-grey-600`

const projectStatusIcons = {
  [ProjectStatus.InProgress]: <FolderCog className="size-6" />,
  [ProjectStatus.Completed]: <FolderCheck className="size-6" />,
  [ProjectStatus.Planned]: <FolderClock className="size-6" />
} as const satisfies Record<ProjectStatus, ReactNode>

const projectTypeIcons = {
  Github: <GithubIcon className="size-5" />,
  HuggingFace: <Brain className="size-5" />,
  Gemini: <Sparkles className="size-5" />,
  External: <ExternalLink className="size-5" />
} as const satisfies Record<ProjectType, ReactNode>

export default memo(function ProjectCard({ info }: { readonly info: ProjectInfo }) {
  const {
    ref,
    handlePointerLeave: handleCardPointerLeave,
    handlePointerMove: handleCardPointerMove,
    rotateX,
    rotateY,
    spotlightBackground,
    spotlightBorder
  } = useCardAnimation()

  const [tooltipText, setTooltipText] = useState('')
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipPointerRef = useRef({ x: 0, y: 0, flipX: false, flipY: false, active: false })
  const tooltipFlipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipRequestRef = useRef(0)
  const tooltipAbortRef = useRef<AbortController | null>(null)
  const tooltipIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTooltipInterval = () => {
    clearInterval(tooltipIntervalRef.current ?? undefined)
    tooltipIntervalRef.current = null
  }

  const clearTooltipFlipTransition = () => {
    clearTimeout(tooltipFlipTimeoutRef.current ?? undefined)
    tooltipFlipTimeoutRef.current = null
    tooltipRef.current?.style.removeProperty('transition-property')
  }

  const cancelTooltipFetch = () => {
    tooltipRequestRef.current++
    tooltipAbortRef.current?.abort()
    tooltipAbortRef.current = null
  }

  const showTooltip = (text: string) => {
    setTooltipText(text)
    setIsTooltipVisible(true)
  }

  const updateTooltipPosition = useCallback((clientX: number, clientY: number) => {
    const tooltip = tooltipRef.current
    if (!tooltip) return

    const offsetGap = 12
    const { offsetWidth, offsetHeight } = tooltip
    const flipX = clientX + 280 > innerWidth
    const flipY = clientY + offsetGap + offsetHeight > innerHeight
    const left = clientX + (flipX ? -offsetGap - offsetWidth : offsetGap)
    const top = clientY + (flipY ? -offsetGap - offsetHeight : offsetGap)

    const last = tooltipPointerRef.current
    const flipChanged = last.active && (flipX !== last.flipX || flipY !== last.flipY)
    tooltipPointerRef.current = { x: clientX, y: clientY, flipX, flipY, active: true }

    if (flipChanged) {
      tooltip.style.transitionProperty = 'left, top'
      clearTimeout(tooltipFlipTimeoutRef.current ?? undefined)
      tooltipFlipTimeoutRef.current = setTimeout(clearTooltipFlipTransition, 500)
    }

    Object.assign(tooltip.style, {
      left: `${left}px`,
      top: `${top}px`,
      clipPath: 'inset(-3px round var(--radius-xl))'
    } satisfies Partial<CSSStyleDeclaration>)
  }, [])

  useEffect(
    () => () => {
      clearTooltipInterval()
      clearTooltipFlipTransition()
      cancelTooltipFetch()
    },
    []
  )

  useEffect(() => {
    if (!isTooltipVisible) return
    const { x, y } = tooltipPointerRef.current
    updateTooltipPosition(x, y)
  }, [tooltipText, isTooltipVisible, updateTooltipPosition])

  const handlePointerEnter = useCallback(
    async (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return

      updateTooltipPosition(event.clientX, event.clientY)
      clearTooltipInterval()
      cancelTooltipFetch()

      const fallback = `${info.name} 是 ${info.description}`
      if (info.type !== 'Github') return showTooltip(fallback)

      const { owner, repo } =
        new URLPattern({
          hostname: '{www.}?github.com',
          pathname: '/:owner/:repo{/*}?'
        }).exec(info.link)?.pathname.groups ?? {}
      if (!owner || !repo) return showTooltip(fallback)

      const { link } = info
      const cached = tooltipSummaryCache.get(link)
      if (cached) return showTooltip(cached)

      const serverUrl: unknown = import.meta.env.VITE_SERVER_URL
      if (typeof serverUrl !== 'string' || !serverUrl) return showTooltip(fallback)

      let dots = 0
      showTooltip('.')
      tooltipIntervalRef.current = setInterval(() => {
        dots = (dots + 1) % 3
        setTooltipText('.'.repeat(dots + 1))
      }, 400)

      const requestId = ++tooltipRequestRef.current
      const abortController = new AbortController()
      tooltipAbortRef.current = abortController
      const signal = AbortSignal.any([abortController.signal, AbortSignal.timeout(8_000)])

      try {
        let summary: string | null = null
        const readme = await Promise.any(
          ['main', 'master'].map(async (branch) => {
            const response = await fetch(
              new URL(
                `/${owner}/${repo}/refs/heads/${branch}/README.md`,
                'https://raw.githubusercontent.com'
              ),
              { signal }
            )

            if (!response.ok) throw new Error()

            return response.text()
          })
        ).catch(() => null)

        const readmeText = readme?.trim()
        if (readmeText) {
          const aiResponse = await fetch(`${serverUrl}/api/gateway/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: `请根据以下 README 内容，用一句中文简短介绍这个项目：\n\n${readmeText}`
                }
              ]
            }),
            signal
          })

          const chat = aiResponse.ok ? ((await aiResponse.json()) as ChatResponse) : undefined
          const content = chat?.content?.trim()
          if (content && !chat?.error) summary = content
        }

        if (tooltipRequestRef.current !== requestId) return

        clearTooltipInterval()
        if (!summary) return void setTooltipText(fallback)

        tooltipSummaryCache.set(link, summary)
        let charIndex = 0
        tooltipIntervalRef.current = setInterval(() => {
          if (tooltipRequestRef.current !== requestId) return clearTooltipInterval()

          charIndex++
          setTooltipText(summary.slice(0, charIndex))
          if (charIndex >= summary.length) clearTooltipInterval()
        }, 30)
      } catch {
        if (tooltipRequestRef.current !== requestId) return

        clearTooltipInterval()
        setTooltipText(fallback)
      }
    },
    [info, updateTooltipPosition]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      handleCardPointerMove(event)
      updateTooltipPosition(event.clientX, event.clientY)
    },
    [handleCardPointerMove, updateTooltipPosition]
  )

  const handlePointerLeave = useCallback(() => {
    handleCardPointerLeave()
    setIsTooltipVisible(false)
    tooltipPointerRef.current.active = false
    clearTooltipFlipTransition()

    const tooltip = tooltipRef.current
    if (tooltip) {
      const { flipX, flipY } = tooltipPointerRef.current
      const edge = (collapse: boolean) => (collapse ? '100%' : '-3px')
      tooltip.style.clipPath = `inset(${edge(flipY)} ${edge(!flipX)} ${edge(!flipY)} ${edge(flipX)} round var(--radius-xl))`
    }

    clearTooltipInterval()
    cancelTooltipFetch()
  }, [handleCardPointerLeave])

  const Wrapper = info.link ? motion.a : motion.div

  return (
    <div className={cardStage}>
      <Wrapper
        // @ts-expect-error - Wrapper is motion.a | motion.div; HTMLElement ref is compatible at runtime
        ref={ref}
        {...(info.link ? { href: info.link, ...externalLink } : undefined)}
        onPointerEnter={(event) => void handlePointerEnter(event)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        className={cardShell}
        style={{ rotateX, rotateY }}
        {...cardHover}
      >
        <CardChrome isSpacious spotlightBackground={spotlightBackground} spotlightBorder={spotlightBorder}>
          <div className="relative flex h-full translate-z-3.75 flex-col gap-2">
            <div className="mb-4 flex items-center justify-between">
              <div
                aria-hidden
                className={tw`rounded-lg bg-primary/10 p-2 text-primary ${colorBgTransition} group-hover:bg-primary group-hover:text-white dark:bg-primary/20`}
              >
                {projectStatusIcons[info.status]}
              </div>
              {info.pinned ? (
                <div aria-hidden className={`${cardMetaIcon} -rotate-15`}>
                  <Pin className="size-5" />
                </div>
              ) : info.link ? (
                <div aria-hidden className={cardMetaIcon}>
                  {projectTypeIcons[info.type]}
                </div>
              ) : null}
            </div>

            <h3
              className={tw`text-xl font-bold text-grey-800 ${colorTransition} group-hover:text-primary dark:text-grey-100`}
            >
              {info.name}
            </h3>
            <p
              className={tw`mb-2 text-sm leading-relaxed text-grey-600 ${colorTransition} dark:text-grey-400`}
            >
              {info.description}
            </p>

            <div className="mt-auto flex items-end justify-between gap-4">
              <ul className="flex translate-z-2.5 flex-wrap gap-2">
                {info.tags.map((tag) => (
                  <li key={`${info.name}-${tag}`} className={tw`${cardTag} px-2.5 py-1`}>
                    {tag}
                  </li>
                ))}
              </ul>

              {info.link && (
                <span className="mb-1 flex translate-z-2.5 items-center gap-1 text-xs font-bold whitespace-nowrap text-primary/80 transition-[color,translate] motion-emphasized group-hover:translate-x-1 group-hover:text-primary">
                  View Project <ChevronRight aria-hidden className="size-3.5" />
                </span>
              )}
            </div>
          </div>
        </CardChrome>
      </Wrapper>

      <ProjectTooltip ref={tooltipRef} text={tooltipText} isVisible={isTooltipVisible} />
    </div>
  )
})
