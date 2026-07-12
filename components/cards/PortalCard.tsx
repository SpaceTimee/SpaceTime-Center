import CardChrome from '@/components/controls/CardChrome'
import { cardHover } from '@/consts/motion'
import { externalLink } from '@/consts/navigation'
import {
  cardArrow,
  cardContent,
  cardDescription,
  cardIcon,
  cardRow,
  cardShell,
  cardStage,
  cardTag,
  cardTitle,
  tw
} from '@/consts/styles'
import type { PortalInfo, PortalType } from '@/consts/types'
import { useCardAnimation } from '@/hooks/useCardAnimation'
import { BookOpenText, ChevronRight, CircleUser, FileText, Globe, Server, SquareActivity } from 'lucide-react'
import { motion } from 'motion/react'
import { memo, type ReactNode } from 'react'

const portalTypeIcons = {
  Center: <Globe className="size-5" />,
  Blog: <FileText className="size-5" />,
  Server: <Server className="size-5" />,
  Docs: <BookOpenText className="size-5" />,
  Account: <CircleUser className="size-5" />,
  Status: <SquareActivity className="size-5" />
} as const satisfies Record<PortalType, ReactNode>

export default memo(function PortalCard({ info }: { readonly info: PortalInfo }) {
  const {
    ref,
    handlePointerLeave,
    handlePointerMove,
    rotateX,
    rotateY,
    spotlightBackground,
    spotlightBorder
  } = useCardAnimation<HTMLAnchorElement>()

  return (
    <div className={cardStage}>
      <motion.a
        ref={ref}
        href={info.link}
        {...externalLink}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        className={cardShell}
        style={{ rotateX, rotateY }}
        {...cardHover}
      >
        <CardChrome spotlightBackground={spotlightBackground} spotlightBorder={spotlightBorder}>
          <div className={cardRow}>
            <div aria-hidden className={cardIcon}>
              {portalTypeIcons[info.type]}
            </div>
            <div className={cardContent}>
              <h3 className={cardTitle}>{info.name}</h3>
              <p className={tw`mb-1 ${cardDescription}`}>{info.description}</p>
              <ul className="flex flex-wrap gap-2">
                {info.tags.map((tag) => (
                  <li key={`${info.name}-${tag}`} className={tw`${cardTag} px-2 py-0.5`}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <ChevronRight aria-hidden className={cardArrow} />
          </div>
        </CardChrome>
      </motion.a>
    </div>
  )
})
