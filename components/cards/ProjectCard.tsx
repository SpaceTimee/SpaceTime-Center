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

const cardStack = tw`relative flex h-full translate-z-[15px] flex-col gap-2`
const cardTags = tw`flex translate-z-[10px] flex-wrap gap-2`
const cardTitleLarge = tw`text-xl font-bold text-gray-800 ${colorTransition} group-hover:text-primary dark:text-gray-100`
const cardDescBody = tw`mb-2 text-sm leading-relaxed text-gray-600 ${colorTransition} dark:text-gray-400`
const cardIconSquare = tw`rounded-lg bg-primary/10 p-2 text-primary ${colorBgTransition} group-hover:bg-primary group-hover:text-white dark:bg-primary/20`
const cardMetaIcon = tw`text-gray-300 ${colorTransition} group-hover:text-primary dark:text-gray-600`
const cardCta = tw`mb-1 flex translate-z-[10px] items-center gap-1 text-xs font-bold whitespace-nowrap text-primary/80 transition-[color,translate] ui-transition group-hover:translate-x-1 group-hover:text-primary`

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

const ProjectCard = memo(function ProjectCard({ info }: { info: ProjectInfo }) {
  const {
    ref,
    handlePointerLeave: cardPointerLeave,
    handlePointerMove: cardPointerMove,
    rotateX,
    rotateY,
    spotlightBackground,
    spotlightBorder
  } = useCardAnimation()

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
    <div className={cardStage}>
      <Wrapper
        // @ts-expect-error - Wrapper is motion.a | motion.div; HTMLElement ref is compatible at runtime
        ref={ref}
        {...(isLink ? { href: info.link, ...externalLink } : undefined)}
        onPointerEnter={(event) => void handlePointerEnter(event)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cardShell}
        style={{ rotateX, rotateY }}
        {...cardHover}
      >
        <CardChrome
          paddingClass="p-6"
          spotlightBackground={spotlightBackground}
          spotlightBorder={spotlightBorder}
        >
          <div className={cardStack}>
            <div className="mb-4 flex items-center justify-between">
              <div aria-hidden className={cardIconSquare}>
                {PROJECT_STATUS_ICON_MAP[info.status]}
              </div>
              {info.pinned ? (
                <div aria-hidden className={`${cardMetaIcon} -rotate-[15deg]`}>
                  <Pin className="size-5" />
                </div>
              ) : (
                isLink && (
                  <div aria-hidden className={cardMetaIcon}>
                    {PROJECT_TYPE_ICON_MAP[info.type ?? 'Default']}
                  </div>
                )
              )}
            </div>

            <h3 className={cardTitleLarge}>{info.name}</h3>

            <p className={cardDescBody}>{info.description}</p>

            <div className="mt-auto flex items-end justify-between gap-4">
              <ul className={cardTags}>
                {info.tags.map((tag) => (
                  <li key={`${info.name}-${tag}`} className={`${cardTag} px-2.5 py-1`}>
                    {tag}
                  </li>
                ))}
              </ul>

              {isLink && (
                <span className={cardCta}>
                  View Project <ChevronRight aria-hidden className="size-3.5" />
                </span>
              )}
            </div>
          </div>
        </CardChrome>
      </Wrapper>

      <ProjectTooltip ref={tooltipRef} text={tooltipText} isVisible={tooltipVisible} />
    </div>
  )
})

export default ProjectCard
