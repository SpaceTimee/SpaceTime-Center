import { memo, type ReactNode } from 'react'
import { Brain, ChevronRight, FolderCheck, FolderClock, FolderCog, Github, Pin, Sparkles } from 'lucide-react'
import { externalLinkProps, tagPillProps } from '../../consts'
import { ProjectStatus, type ProjectInfo, type ProjectType } from '../../types'

const PROJECT_STATUS_ICON_MAP = {
  [ProjectStatus.Completed]: <FolderCheck className="w-6 h-6" />,
  [ProjectStatus.Planned]: <FolderClock className="w-6 h-6" />,
  [ProjectStatus.InProgress]: <FolderCog className="w-6 h-6" />
} as const satisfies Record<ProjectStatus, ReactNode>

const PROJECT_TYPE_ICON_MAP = {
  Github: <Github className="w-5 h-5" />,
  HuggingFace: <Brain className="w-5 h-5" />,
  Gemini: <Sparkles className="w-5 h-5" />,
  Default: <Github className="w-5 h-5" />
} as const satisfies Record<ProjectType | 'Default', ReactNode>

const ProjectCard = memo(({ info }: { info: ProjectInfo }) => {
  const isLink = Boolean(info.link)
  const Wrapper = isLink ? 'a' : 'div'

  return (
    <Wrapper
      {...(isLink ? { href: info.link, ...externalLinkProps } : undefined)}
      className={`group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 h-full overflow-hidden ${
        isLink
          ? 'hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 cursor-pointer'
          : 'cursor-default'
      }`}
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 dark:bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none will-change-transform transform-gpu" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            {PROJECT_STATUS_ICON_MAP[info.status]}
          </div>
          {info.pinned ? (
            <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transform rotate-[-15deg] transition-colors duration-300">
              <Pin className="w-5 h-5" />
            </div>
          ) : (
            isLink && (
              <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                {PROJECT_TYPE_ICON_MAP[info.type ?? 'Default']}
              </div>
            )
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
          {info.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
          {info.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {info.tags.map((tag) => (
              <span key={`${info.name}-${tag}`} {...tagPillProps.md}>
                {tag}
              </span>
            ))}
          </div>

          {isLink && (
            <div className="flex items-center text-xs font-bold text-primary/80 group-hover:text-primary transition-all duration-300 whitespace-nowrap relative z-20 group-hover:translate-x-1">
              View Project <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  )
})

export default ProjectCard
