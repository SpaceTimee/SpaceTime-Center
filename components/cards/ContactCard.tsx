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
import { ChevronRight, Mail, MessageCircle, Tv } from 'lucide-react'
import { motion } from 'motion/react'
import { memo, type ReactNode } from 'react'

const CONTACT_TYPE_ICON_MAP = {
  Mail: <Mail className="size-5" />,
  Github: <GithubIcon className="size-5" />,
  Bilibili: <Tv className="size-5" />,
  Default: <MessageCircle className="size-5" />
} as const satisfies Record<ContactType | 'Default', ReactNode>

const ContactCard = memo(function ContactCard({ info }: { info: ContactInfo }) {
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
            <div aria-hidden className={cardIcon}>
              {CONTACT_TYPE_ICON_MAP[info.type ?? 'Default']}
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

export default ContactCard
