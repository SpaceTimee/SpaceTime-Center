import { memo, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ChevronRight, Mail, MessageCircle, Tv } from 'lucide-react'
import { CardChrome } from '@/components/controls/CardChrome'
import {
  cardArrow,
  cardDesc,
  cardIconRound,
  cardRow,
  cardShell,
  cardStage,
  cardTextCol,
  cardTitle
} from '@/consts/styles'
import GithubIcon from '@/components/icons/GithubIcon'
import { useCardAnimation } from '@/hooks/useCardAnimation'
import { cardHover } from '@/consts/motion'
import { externalLink } from '@/consts/navigation'
import type { ContactInfo, ContactType } from '@/consts/types'

const CONTACT_TYPE_ICON_MAP = {
  Mail: <Mail className="size-5" />,
  Github: <GithubIcon className="size-5" />,
  Bilibili: <Tv className="size-5" />,
  Default: <MessageCircle className="size-5" />
} as const satisfies Record<ContactType | 'Default', ReactNode>

const ContactCard = memo(({ info }: { info: ContactInfo }) => {
  const {
    handlePointerLeave,
    handlePointerMove,
    ref,
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
        {...(info.link.startsWith('http') ? externalLink : undefined)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cardShell}
        style={{ rotateX, rotateY }}
        {...cardHover}
      >
        <CardChrome spotlightBackground={spotlightBackground} spotlightBorder={spotlightBorder}>
          <div className={cardRow}>
            <div aria-hidden className={cardIconRound}>
              {CONTACT_TYPE_ICON_MAP[info.type ?? 'Default']}
            </div>
            <div className={cardTextCol}>
              <h3 className={cardTitle}>{info.name}</h3>
              <p className={cardDesc}>{info.description}</p>
            </div>
            <ChevronRight aria-hidden className={cardArrow} />
          </div>
        </CardChrome>
      </motion.a>
    </div>
  )
})

export default ContactCard
