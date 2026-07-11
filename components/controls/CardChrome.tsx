import {
  cardBlob,
  cardBorder,
  cardInner,
  cardShadow,
  cardSpotlightBorder,
  cardSpotlightFill
} from '@/consts/styles'
import { motion, type MotionValue } from 'motion/react'
import type { ReactNode } from 'react'

interface CardChromeProps {
  readonly children: ReactNode
  readonly paddingClass?: string
  readonly spotlightBackground: MotionValue<string>
  readonly spotlightBorder: MotionValue<string>
}

export default function CardChrome({
  children,
  paddingClass = 'p-5',
  spotlightBackground,
  spotlightBorder
}: CardChromeProps) {
  return (
    <>
      <div aria-hidden>
        <div className={cardShadow} />
        <motion.div className={cardSpotlightBorder} style={{ backgroundImage: spotlightBorder }} />
        <div className={cardBorder} />
      </div>
      <div className={`${cardInner} ${paddingClass}`}>
        <div aria-hidden>
          <motion.div className={cardSpotlightFill} style={{ backgroundImage: spotlightBackground }} />
          <div className={cardBlob} />
        </div>
        {children}
      </div>
    </>
  )
}
