import { memo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Brain, ChevronRight, FolderCheck, FolderClock, FolderCog, Github, Pin, Sparkles } from 'lucide-react'
import { externalLinkProps, tagPillProps } from '../../consts'
import { ProjectStatus, type ProjectInfo, type ProjectType } from '../../types'
import { useCardAnimation } from '../../hooks/useCardAnimation'

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
  const Wrapper = isLink ? motion.a : motion.div

  const {
    ref,
    rotateX,
    rotateY,
    spotlightBackground,
    spotlightBorder,
    handlePointerMove,
    handlePointerLeave
  } = useCardAnimation<HTMLElement>()

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <Wrapper
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        {...(isLink ? { href: info.link, ...externalLinkProps } : undefined)}
        whileHover={{ y: -4 }}
        className={`group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl p-[1px] shadow-sm transition-shadow duration-300 transform-gpu will-change-transform h-full ${
          isLink ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <div
          className="absolute inset-0 z-[-1] rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ transform: 'translateZ(-15px)' }}
        />

        <motion.div
          className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-[0.15] dark:group-hover:opacity-[0.3] transition-opacity duration-300"
          style={{ background: spotlightBorder }}
        />

        <div className="absolute inset-0 z-0 rounded-xl border border-gray-100 dark:border-gray-700 group-hover:border-primary/30 dark:group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full bg-white dark:bg-gray-800 rounded-[11px] p-6 overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none mix-blend-screen"
            style={{ background: spotlightBackground }}
          />

          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 dark:bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none will-change-transform transform-gpu" />

          <div className="relative z-20 flex flex-col h-full" style={{ transform: 'translateZ(15px)' }}>
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
              <div className="flex flex-wrap gap-2" style={{ transform: 'translateZ(10px)' }}>
                {info.tags.map((tag) => (
                  <span key={`${info.name}-${tag}`} {...tagPillProps.md}>
                    {tag}
                  </span>
                ))}
              </div>

              {isLink && (
                <div
                  className="flex items-center text-xs font-bold text-primary/80 group-hover:text-primary transition-all duration-300 whitespace-nowrap relative z-20 group-hover:translate-x-1"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  View Project <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  )
})

export default ProjectCard
