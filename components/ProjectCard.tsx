import { memo } from 'react'
import type { Project } from '../types'
import { ProjectStatus, ProjectIconType } from '../types'
import { Github, ChevronRight, FolderCog, FolderCheck, FolderClock, Pin, Sparkles, Brain } from 'lucide-react'

const STATUS_ICON_MAP: Record<ProjectStatus, React.ReactNode> = {
  [ProjectStatus.Completed]: <FolderCheck className="w-6 h-6" />,
  [ProjectStatus.Planned]: <FolderClock className="w-6 h-6" />,
  [ProjectStatus.InProgress]: <FolderCog className="w-6 h-6" />
}

const PROJECT_ICON_MAP: Record<ProjectIconType | 'default', React.ReactNode> = {
  HuggingFace: <Brain className="w-5 h-5" />,
  Gemini: <Sparkles className="w-5 h-5" />,
  Github: <Github className="w-5 h-5" />,
  default: <Github className="w-5 h-5" />
}

const ProjectCard = memo(({ project }: { project: Project }) => {
  const Component = project.link ? 'a' : 'div'
  const isLink = !!project.link

  return (
    <Component
      href={project.link}
      target={isLink ? '_blank' : undefined}
      rel={isLink ? 'noopener noreferrer' : undefined}
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
            {STATUS_ICON_MAP[project.status]}
          </div>
          {project.pinned ? (
            <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transform rotate-[-15deg] transition-colors duration-300">
              <Pin className="w-5 h-5" />
            </div>
          ) : (
            isLink && (
              <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                {PROJECT_ICON_MAP[project.icon || 'default']}
              </div>
            )
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary dark:group-hover:text-primary transition-all"
              >
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
    </Component>
  )
})

export default ProjectCard
