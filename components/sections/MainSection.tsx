import PortalCard from '@/components/cards/PortalCard'
import ProjectCard from '@/components/cards/ProjectCard'
import { staggerInView, staggerItem } from '@/consts/motion'
import { projectTabs, sectionIds, sections } from '@/consts/navigation'
import { portals } from '@/consts/portals'
import { projects } from '@/consts/projects'
import {
  bgBorderTransition,
  bgTransition,
  cardGrid,
  colorBgTransition,
  colorTransition,
  contentContainer,
  mutedText,
  scrollMargin,
  sectionIcon,
  sectionLabel,
  sectionTitle,
  tw
} from '@/consts/styles'
import { ProjectStatus, type ProjectInfo } from '@/consts/types'
import { useDynamicHeight } from '@/hooks/useDynamicHeight'
import { motion } from 'motion/react'
import { memo, useRef, useState } from 'react'

const sectionHeading = tw`text-2xl ${sectionTitle}`
const tabIndicatorTranslate = ['', 'translate-x-full', 'translate-x-200'] as const
const tabPanelTranslate = ['', '-translate-x-full', '-translate-x-200'] as const

const projectsByStatus = Object.groupBy<ProjectStatus, ProjectInfo>(projects, ({ status }) => status)

const tabs = projectTabs.map((tab) => ({
  ...tab,
  projects: projectsByStatus[tab.id] ?? []
}))

const portalsSection = sections.find((section) => section.id === sectionIds.portals)
const projectsSection = sections.find((section) => section.id === sectionIds.projects)

const MainSection = memo(function MainSection() {
  const [activeTab, setActiveTab] = useState<ProjectStatus>(ProjectStatus.InProgress)
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  const activeTabIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab)
  )
  const containerHeight = useDynamicHeight(activeTabIndex, tabRefs)

  return (
    <main className={`relative z-20 flex flex-col gap-16 py-16 ${contentContainer}`}>
      <section
        id={sectionIds.portals}
        aria-labelledby={`${sectionIds.portals}-title`}
        className={scrollMargin}
      >
        <div className={`mb-8 ${sectionLabel} justify-center sm:justify-start`}>
          {portalsSection?.icon ? <portalsSection.icon aria-hidden className={sectionIcon} /> : null}
          <h2 id={`${sectionIds.portals}-title`} className={sectionHeading}>
            {portalsSection?.title}
          </h2>
        </div>

        <motion.div className={cardGrid} {...staggerInView}>
          {portals.map((portal) => (
            <motion.div key={portal.link} variants={staggerItem}>
              <PortalCard info={portal} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section
        id={sectionIds.projects}
        aria-labelledby={`${sectionIds.projects}-title`}
        className={scrollMargin}
      >
        <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className={sectionLabel}>
            {projectsSection?.icon ? <projectsSection.icon aria-hidden className={sectionIcon} /> : null}
            <h2 id={`${sectionIds.projects}-title`} className={sectionHeading}>
              {projectsSection?.title}
            </h2>
          </div>

          <div
            role="tablist"
            aria-labelledby={`${sectionIds.projects}-title`}
            className={`relative grid grid-cols-3 rounded-xl bg-gray-100 p-1 ${bgTransition} dark:bg-gray-800`}
          >
            <div
              aria-hidden
              className={`absolute inset-y-1 left-1 w-tab-indicator rounded-lg bg-white shadow-sm transition-[translate,background-color] motion-emphasized dark:bg-gray-700 ${tabIndicatorTranslate[activeTabIndex]}`}
            />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`${sectionIds.projects}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${sectionIds.projects}-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`z-10 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${colorTransition} ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                <tab.icon aria-hidden className="size-4 shrink-0" />
                <span className="max-tab:sr-only">{tab.title}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${colorBgTransition} ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400'}`}
                >
                  {tab.projects.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="-my-6 overflow-hidden mask-fade-x py-6 transition-[height] motion-emphasized contain-inline-size"
          style={containerHeight === 'auto' ? undefined : { height: containerHeight + 48 }}
        >
          <div
            className={`flex items-start transition-[translate] motion-emphasized will-change-transform ${tabPanelTranslate[activeTabIndex]}`}
          >
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                ref={(element) => void (tabRefs.current[index] = element)}
                id={`${sectionIds.projects}-panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`${sectionIds.projects}-tab-${tab.id}`}
                inert={tab.id !== activeTab}
                className="w-full shrink-0 px-2"
              >
                <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" {...staggerInView}>
                  {tab.projects.map((project, index) => (
                    <motion.div
                      key={`${tab.id}-${project.link ?? project.name}-${index}`}
                      variants={staggerItem}
                    >
                      <ProjectCard info={project} />
                    </motion.div>
                  ))}
                </motion.div>

                {tab.projects.length === 0 && (
                  <div
                    className={`rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center ${bgBorderTransition} dark:border-gray-700 dark:bg-gray-800/30`}
                  >
                    <p className={mutedText}>Nothing to see here yet</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
})

export default MainSection
