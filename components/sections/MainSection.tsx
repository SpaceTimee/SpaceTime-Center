import { memo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import PortalCard from '@/components/cards/PortalCard'
import ProjectCard from '@/components/cards/ProjectCard'
import { useDynamicHeight } from '@/hooks/useDynamicHeight'
import { cardGridClass, projectTabs, sectionIds, sections, springTransition } from '@/consts'
import { portals, projects } from '@/data'
import { ProjectStatus, type ProjectInfo } from '@/types'

const projectsByStatus = Object.groupBy<ProjectStatus, ProjectInfo>(projects, ({ status }) => status)

const tabs = projectTabs.map((tab) => ({
  ...tab,
  projects: projectsByStatus[tab.id] ?? []
}))

const portalsSection = sections.find((section) => section.id === sectionIds.portals)
const projectsSection = sections.find((section) => section.id === sectionIds.projects)

const MainSection = memo(() => {
  const [activeTab, setActiveTab] = useState<ProjectStatus>(ProjectStatus.InProgress)
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  const activeTabIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab)
  )
  const containerHeight = useDynamicHeight(activeTabIndex, tabRefs)

  return (
    <main className="relative z-20 mx-auto max-w-5xl space-y-16 px-6 py-16">
      <motion.section
        id={sectionIds.portals}
        aria-labelledby={`${sectionIds.portals}-title`}
        className="scroll-mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={springTransition}
      >
        <div className="mb-8 flex items-center justify-center gap-2 sm:justify-start">
          {portalsSection?.icon ? <portalsSection.icon className="text-primary size-6" /> : null}
          <h2
            id={`${sectionIds.portals}-title`}
            className="text-2xl font-bold text-gray-900 transition-colors dark:text-gray-100"
          >
            {portalsSection?.title}
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
        aria-labelledby={`${sectionIds.projects}-title`}
        className="scroll-mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={springTransition}
      >
        <div className="mb-8 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            {projectsSection?.icon ? <projectsSection.icon className="text-primary size-6" /> : null}
            <h2
              id={`${sectionIds.projects}-title`}
              className="text-2xl font-bold text-gray-900 transition-colors dark:text-gray-100"
            >
              {projectsSection?.title}
            </h2>
          </div>

          <div
            className="relative grid self-center rounded-xl bg-gray-100 p-1 transition-colors sm:self-auto dark:bg-gray-800"
            style={{
              gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`
            }}
          >
            <div
              className="absolute top-1 bottom-1 left-1 rounded-lg bg-white shadow-sm transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] dark:bg-gray-700"
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
                className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="size-4 shrink-0" />
                <span className="max-[431px]:hidden">{tab.title}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400'
                  }`}
                >
                  {tab.projects.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="-my-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8px,black_calc(100%_-_8px),transparent)] py-6 transition-[height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ height: containerHeight === 'auto' ? 'auto' : `${containerHeight + 48}px` }}
        >
          <div
            className="flex items-start transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
            style={{ transform: `translateX(-${activeTabIndex * 100}%)` }}
          >
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className="w-full shrink-0 px-2"
                ref={(element) => {
                  tabRefs.current[index] = element
                }}
                inert={tab.id !== activeTab}
              >
                <motion.div
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '50px' }}
                >
                  {tab.projects.map((project, index) => (
                    <motion.div
                      key={`${tab.id}-${project.link ?? project.name}-${index}`}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            ...springTransition,
                            delay: index * 0.1
                          }
                        }
                      }}
                    >
                      <ProjectCard info={project} />
                    </motion.div>
                  ))}
                </motion.div>

                {tab.projects.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center transition-colors dark:border-gray-700 dark:bg-gray-800/30">
                    <p className="text-gray-400 transition-colors dark:text-gray-500">
                      Nothing to see here yet
                    </p>
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
