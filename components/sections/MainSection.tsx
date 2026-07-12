import PortalCard from '@/components/cards/PortalCard'
import ProjectCard from '@/components/cards/ProjectCard'
import { staggerInView, staggerItem } from '@/consts/motion'
import { getSection, projectTabs, sectionIds } from '@/consts/navigation'
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
import { useElementHeight } from '@/hooks/useElementHeight'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'

const portalsSection = getSection(sectionIds.portals)
const portalsTitleId = portalsSection.titleId
const projectsSection = getSection(sectionIds.projects)
const projectsTitleId = projectsSection.titleId

const sectionHeading = tw`text-2xl ${sectionTitle}`

const projectsByStatus = Map.groupBy<ProjectStatus, ProjectInfo>(projects, ({ status }) => status)
const tabs = projectTabs.map((tab) => ({
  ...tab,
  projects: projectsByStatus.get(tab.id) ?? [],
  tabId: `${projectsSection.id}-tab-${tab.id}`,
  panelId: `${projectsSection.id}-panel-${tab.id}`
}))
const tabIndexById = Object.fromEntries(tabs.map((tab, index) => [tab.id, index])) as Record<
  ProjectStatus,
  number
>

const tabIndicator = tw`absolute inset-y-1 left-1 w-tab-indicator rounded-lg bg-white shadow-sm transition-[translate,background-color] motion-emphasized dark:bg-grey-700`
const tabIndicatorClasses = [
  tabIndicator,
  tw`${tabIndicator} translate-x-full`,
  tw`${tabIndicator} translate-x-200`
] as const

const tabButton = tw`z-10 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${colorTransition}`
const tabButtonActive = tw`${tabButton} text-primary`
const tabButtonInactive = tw`${tabButton} text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-200`
const tabCount = tw`rounded-full px-1.5 py-0.5 text-xs ${colorBgTransition}`
const tabCountActive = tw`${tabCount} bg-primary/10 text-primary`
const tabCountInactive = tw`${tabCount} bg-grey-200 text-grey-500 dark:bg-grey-700/50 dark:text-grey-400`

const tabTrack = tw`flex items-start transition-[translate] motion-emphasized will-change-transform`
const tabTrackClasses = [
  tabTrack,
  tw`${tabTrack} -translate-x-full`,
  tw`${tabTrack} -translate-x-200`
] as const

export default function MainSection() {
  const [activeTab, setActiveTab] = useState<ProjectStatus>(ProjectStatus.InProgress)
  const tabPanelRefs = useRef<(HTMLDivElement | null)[]>([])

  const activeTabIndex = tabIndexById[activeTab]
  const tabPanelHeight = useElementHeight(activeTabIndex, tabPanelRefs)

  return (
    <main className={tw`relative z-20 flex flex-col gap-16 py-16 ${contentContainer}`}>
      <section id={portalsSection.id} aria-labelledby={portalsTitleId} className={scrollMargin}>
        <div className={tw`mb-8 ${sectionLabel} justify-center sm:justify-start`}>
          <portalsSection.icon aria-hidden className={sectionIcon} />
          <h2 id={portalsTitleId} className={sectionHeading}>
            {portalsSection.title}
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

      <section id={projectsSection.id} aria-labelledby={projectsTitleId} className={scrollMargin}>
        <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className={sectionLabel}>
            <projectsSection.icon aria-hidden className={sectionIcon} />
            <h2 id={projectsTitleId} className={sectionHeading}>
              {projectsSection.title}
            </h2>
          </div>

          <div
            role="tablist"
            aria-labelledby={projectsTitleId}
            className={tw`relative grid grid-cols-3 rounded-xl bg-grey-100 p-1 ${bgTransition} dark:bg-grey-800`}
          >
            <div aria-hidden className={tabIndicatorClasses[activeTabIndex]} />
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  id={tab.tabId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={tab.panelId}
                  onClick={() => setActiveTab(tab.id)}
                  className={isActive ? tabButtonActive : tabButtonInactive}
                >
                  <tab.icon aria-hidden className="size-4 shrink-0" />
                  <span className="max-tab:sr-only">{tab.title}</span>
                  <span className={isActive ? tabCountActive : tabCountInactive}>{tab.projects.length}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          className="-my-6 overflow-hidden mask-fade-x py-6 transition-[height] motion-emphasized contain-inline-size"
          style={tabPanelHeight === 'auto' ? undefined : { height: tabPanelHeight + 48 }}
        >
          <div className={tabTrackClasses[activeTabIndex]}>
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                ref={(element) => void (tabPanelRefs.current[index] = element)}
                id={tab.panelId}
                role="tabpanel"
                aria-labelledby={tab.tabId}
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
                    className={tw`rounded-2xl border border-dashed border-grey-200 bg-grey-50 py-20 text-center ${bgBorderTransition} dark:border-grey-700 dark:bg-grey-800/30`}
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
}
