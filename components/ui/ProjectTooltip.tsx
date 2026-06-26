import type { RefObject } from 'react'
import { createPortal } from 'react-dom'

interface ProjectTooltipProps {
  readonly ref: RefObject<HTMLDivElement | null>
  readonly text: string
  readonly visible: boolean
}

export const ProjectTooltip = ({ ref, text, visible }: ProjectTooltipProps) =>
  createPortal(
    <div
      ref={ref}
      className={`fixed z-[9999] max-w-xs px-3 py-2 text-sm rounded-xl shadow-sm pointer-events-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ left: 0, top: 0, transition: 'opacity 300ms ease-out, clip-path 300ms ease-out' }}
    >
      {text}
    </div>,
    document.body
  )
