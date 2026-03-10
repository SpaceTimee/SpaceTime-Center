import { memo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PortalCard from '../cards/PortalCard'
import ProjectCard from '../cards/ProjectCard'
import { cardGridClass, projectTabs, sectionIds, sections, springTransition } from '../../consts'
import { portals, projects } from '../../data'
import { useDynamicHeight } from '../../hooks/useDynamicHeight'
import { ProjectStatus, type ProjectInfo } from '../../types'

const tabs = (() => {
  const groups: Record<ProjectStatus, ProjectInfo[]> = {
    [ProjectStatus.InProgress]: [],
    [ProjectStatus.Completed]: [],
    [ProjectStatus.Planned]: []
  }

  projects.forEach((project) => {
    groups[project.status].push(project)
  })

  return projectTabs.map((tab) => ({
    ...tab,
    projects: groups[tab.id]
  }))
})()

const MainSection = memo(() => {
  const [activeTab, setActiveTab] = useState<ProjectStatus>(ProjectStatus.InProgress)
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  const activeTabIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab)
  )
  const containerHeight = useDynamicHeight(activeTabIndex, tabRefs)

  const portalsSection = sections.find((section) => section.id === sectionIds.portals)
  const projectsSection = sections.find((section) => section.id === sectionIds.projects)

  return (
    <main className="max-w-5xl mx-auto px-6 mt-12 relative z-20 space-y-16">
      <motion.section
        id={sectionIds.portals}
        className="scroll-mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={springTransition}
      >
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-6">
          {portalsSection && portalsSection.icon ? (
            <portalsSection.icon className="w-6 h-6 text-primary" />
          ) : null}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {portalsSection?.title ?? 'Portals'}
          </h2>
        </div>
        <motion.div
          className={cardGridClass}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '50px' }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {portals.map((portal) => (
            <motion.div
              key={portal.link}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: springTransition
                }
              }}
            >
              <PortalCard info={portal} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        id={sectionIds.projects}
        className="scroll-mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={springTransition}
      >
        <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            {projectsSection && projectsSection.icon ? (
              <projectsSection.icon className="w-6 h-6 text-primary" />
            ) : null}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {projectsSection?.title ?? 'Projects'}
            </h2>
          </div>

          <div
            className="relative grid p-1 bg-gray-100 dark:bg-gray-800 rounded-xl self-center sm:self-auto transition-colors duration-300"
            style={{
              gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`
            }}
          >
            <div
              className="absolute top-1 bottom-1 left-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
              style={{
                width: `calc((100% - 0.5rem) / ${tabs.length})`,
                transform: `translateX(${activeTabIndex * 100}%)`
              }}
            />

            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 gap-2 ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span className="max-[442px]:hidden">{tab.title}</span>
                <span
                  className={`text-xs py-0.5 px-1.5 rounded-full transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-200 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {tab.projects.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="overflow-hidden -mx-1 px-1 py-6 -my-6 transition-[height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ height: containerHeight === 'auto' ? 'auto' : `${containerHeight + 48}px` }}
        >
          <div
            className="flex items-start transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
            style={{ transform: `translateX(-${activeTabIndex * 100}%)` }}
          >
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className="w-full flex-shrink-0 px-2"
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
              >
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '50px' }}
                >
                  {tab.projects.map((project, index) => {
                    const row = Math.floor(index / 3)
                    const col = index % 3
                    const delay = row * 0.1 + col * 0.1

                    return (
                      <motion.div
                        key={`${tab.id}-${project.link ?? project.name}-${index}`}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              ...springTransition,
                              delay: delay
                            }
                          }
                        }}
                      >
                        <ProjectCard info={project} />
                      </motion.div>
                    )
                  })}
                </motion.div>

                {tab.projects.length === 0 && (
                  <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-400 dark:text-gray-500">Nothing to see here yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  )
})

export default MainSection
