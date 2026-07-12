import {
  absoluteFill,
  bgTransition,
  cardOutline,
  cardSpotlightBorder,
  cardSpotlightFill,
  opacityTransition,
  scaleTransition,
  tw
} from '@/consts/styles'
import { motion, type MotionValue } from 'motion/react'
import type { ReactNode } from 'react'

interface CardChromeProps {
  readonly children: ReactNode
  readonly isSpacious?: boolean
  readonly spotlightBackground: MotionValue<string>
  readonly spotlightBorder: MotionValue<string>
}

const cardInner = tw`relative h-full overflow-hidden rounded-card-inner bg-white ${bgTransition} dark:bg-grey-800`

export default function CardChrome({
  children,
  isSpacious = false,
  spotlightBackground,
  spotlightBorder
}: CardChromeProps) {
  return (
    <>
      <div aria-hidden>
        <div
          className={tw`${absoluteFill} -z-1 -translate-z-3.75 rounded-xl opacity-0 shadow-lg ${opacityTransition} group-hover:opacity-100`}
        />
        <motion.div className={cardSpotlightBorder} style={{ backgroundImage: spotlightBorder }} />
        <div className={tw`${absoluteFill} rounded-xl ${cardOutline} dark:border-grey-700`} />
      </div>

      <div className={`${cardInner} ${isSpacious ? 'p-6' : 'p-5'}`}>
        <div aria-hidden>
          <motion.div className={cardSpotlightFill} style={{ backgroundImage: spotlightBackground }} />
          <div
            className={tw`pointer-events-none absolute -top-12 -right-12 size-32 transform-gpu rounded-full bg-primary/5 blur-2xl ${scaleTransition} group-hover:scale-150`}
          />
        </div>

        {children}
      </div>
    </>
  )
}
