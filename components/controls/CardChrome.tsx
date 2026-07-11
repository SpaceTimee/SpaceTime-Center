import {
  absoluteFill,
  bgTransition,
  cardOutline,
  cardSpotlightBorder,
  cardSpotlightFill,
  opacityTransition,
  scaleTransition
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
        <div
          className={`${absoluteFill} -z-1 -translate-z-3.75 rounded-xl opacity-0 shadow-lg ${opacityTransition} group-hover:opacity-100`}
        />
        <motion.div className={cardSpotlightBorder} style={{ backgroundImage: spotlightBorder }} />
        <div className={`${absoluteFill} rounded-xl ${cardOutline} dark:border-gray-700`} />
      </div>
      <div
        className={`relative h-full overflow-hidden rounded-card-inner bg-white ${bgTransition} ${paddingClass} dark:bg-gray-800`}
      >
        <div aria-hidden>
          <motion.div className={cardSpotlightFill} style={{ backgroundImage: spotlightBackground }} />
          <div
            className={`pointer-events-none absolute -top-12 -right-12 size-32 transform-gpu rounded-full bg-primary/5 blur-2xl ${scaleTransition} group-hover:scale-150`}
          />
        </div>
        {children}
      </div>
    </>
  )
}
