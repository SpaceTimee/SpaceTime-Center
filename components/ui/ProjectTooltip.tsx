import { memo, type RefObject } from 'react'
import { createPortal } from 'react-dom'

interface ProjectTooltipProps {
  readonly ref: RefObject<HTMLDivElement | null>
  readonly text: string
  readonly isVisible: boolean
}

const ProjectTooltip = memo(({ ref, text, isVisible }: ProjectTooltipProps) =>
  createPortal(
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed top-0 left-0 z-9999 max-w-xs rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition-[opacity,clip-path,color,background-color,border-color] duration-300 ease-out dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${
        isVisible ? '' : 'opacity-0'
      }`}
    >
      {text}
    </div>,
    document.body
  )
)

export default ProjectTooltip
