import { memo, type ReactNode } from 'react'
import { ChevronRight, FileText, Globe, Server } from 'lucide-react'
import { externalLinkProps, tagPillProps } from '../../consts'
import type { PortalInfo, PortalType } from '../../types'

const PORTAL_TYPE_ICON_MAP = {
  Center: <Globe className="w-5 h-5" />,
  Blog: <FileText className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Default: <Globe className="w-5 h-5" />
} as const satisfies Record<PortalType | 'Default', ReactNode>

const PortalCard = memo(({ info }: { info: PortalInfo }) => {
  return (
    <a
      href={info.link}
      {...externalLinkProps}
      className="block group relative bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 dark:bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none will-change-transform transform-gpu" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
          {PORTAL_TYPE_ICON_MAP[info.type ?? 'Default']}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">
            {info.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2 truncate">{info.description}</p>
          <div className="flex flex-wrap gap-2">
            {info.tags.map((tag) => (
              <span key={`${info.name}-${tag}`} {...tagPillProps.sm}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </a>
  )
})

export default PortalCard
