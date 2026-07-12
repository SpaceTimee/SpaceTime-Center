import { tw } from '@/consts/styles'
import { memo, type RefObject } from 'react'
import { createPortal } from 'react-dom'

interface ProjectTooltipProps {
  readonly ref: RefObject<HTMLDivElement | null>
  readonly text: string
  readonly isVisible: boolean
}

const tooltipBase = tw`pointer-events-none fixed top-0 left-0 z-9999 max-w-xs rounded-xl border border-grey-100 bg-white px-3 py-2 text-sm text-grey-800 shadow-sm transition-[opacity,clip-path,color,background-color,border-color] motion-emphasized dark:border-grey-700 dark:bg-grey-800 dark:text-grey-100`

export default memo(function ProjectTooltip({ ref, text, isVisible }: ProjectTooltipProps) {
  return createPortal(
    <div ref={ref} aria-hidden className={isVisible ? tooltipBase : `${tooltipBase} opacity-0`}>
      {text}
    </div>,
    document.body
  )
})
