import CardChrome from '@/components/controls/CardChrome'
import GithubIcon from '@/components/icons/GithubIcon'
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
  cardTitle
} from '@/consts/styles'
import type { ContactInfo, ContactType } from '@/consts/types'
import { useCardAnimation } from '@/hooks/useCardAnimation'
import { ChevronRight, Mail, Tv } from 'lucide-react'
import { motion } from 'motion/react'
import { memo, type ReactNode } from 'react'

const contactTypeIcons = {
  Mail: <Mail className="size-5" />,
  Github: <GithubIcon className="size-5" />,
  Bilibili: <Tv className="size-5" />
} as const satisfies Record<ContactType, ReactNode>

export default memo(function ContactCard({ info }: { readonly info: ContactInfo }) {
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
        {...(info.type === 'Mail' ? undefined : externalLink)}
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
              {contactTypeIcons[info.type]}
            </div>
            <div className={cardContent}>
              <h3 className={cardTitle}>{info.name}</h3>
              <p className={cardDescription}>{info.description}</p>
            </div>
            <ChevronRight aria-hidden className={cardArrow} />
          </div>
        </CardChrome>
      </motion.a>
    </div>
  )
})
