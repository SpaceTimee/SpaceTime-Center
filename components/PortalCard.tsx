import { memo } from 'react'
import { ChevronRight, FileText, Globe, Server } from 'lucide-react'
import type { PortalLink } from '../types'

const ICON_MAP: Record<string, React.ReactNode> = {
  Blog: <FileText className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  default: <Globe className="w-5 h-5" />
}

const getIcon = (type: string) => ICON_MAP[type] || ICON_MAP.default

const PortalCard = memo(({ link }: { link: PortalLink }) => {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 dark:bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none will-change-transform transform-gpu" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
          {getIcon(link.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">
            {link.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2 truncate">{link.description}</p>
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {link.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary dark:group-hover:text-primary transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </a>
  )
})

export default PortalCard
