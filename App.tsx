import { useState, useRef, useMemo } from 'react'
import { SECTIONS_CONFIG, SECTION_IDS, PROJECT_TABS_CONFIG } from './constants'
import Navbar from './components/Navbar'
import Header from './components/Header'
import ProjectCard from './components/ProjectCard'
import NavigationCard from './components/NavigationCard'
import ContactSection from './components/ContactSection'
import { useDynamicHeight } from './hooks/useDynamicHeight'
import { useScrollSpy } from './hooks/useScrollSpy'
import { useProjectFilter } from './hooks/useProjectFilter'
import { navigationLinks } from './data'
import { ProjectStatus } from './types'

const App = () => {
  const [activeTab, setActiveTab] = useState<ProjectStatus>(ProjectStatus.InProgress)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])

  const projectsMap = useProjectFilter()

  const { slidesData, tabsData } = useMemo(() => {
    const slides = PROJECT_TABS_CONFIG.map((tab) => ({
      id: tab.id,
      projects: projectsMap[tab.id]
    }))

    const tabs = PROJECT_TABS_CONFIG.map((tab) => ({
      ...tab,
      count: projectsMap[tab.id].length
    }))

    return { slidesData: slides, tabsData: tabs }
  }, [projectsMap])

  const activeIndex = slidesData.findIndex((tab) => tab.id === activeTab)
  const containerHeight = useDynamicHeight(activeIndex, slidesRef)

  useScrollSpy(SECTIONS_CONFIG, 'About ❤️ SpaceTime Center')

  return (
    <div className="min-h-screen font-sans text-gray-700 dark:text-gray-200 selection:bg-primary/20 selection:text-primary transition-colors duration-300 relative">
      <Navbar />
      <Header />

      <main className="max-w-5xl mx-auto px-6 mt-12 relative z-20 space-y-16">
        <section id={SECTION_IDS.NAVIGATION} className="scroll-mt-24">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-6">
            {(() => {
              const SectionIcon = SECTIONS_CONFIG.find((s) => s.id === SECTION_IDS.NAVIGATION)?.icon
              return SectionIcon ? <SectionIcon className="w-6 h-6 text-primary" /> : null
            })()}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Navigation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {navigationLinks.map((link, idx) => (
              <NavigationCard key={idx} link={link} />
            ))}
          </div>
        </section>

        <section id={SECTION_IDS.PROJECTS} className="scroll-mt-24">
          <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-2">
              {(() => {
                const SectionIcon = SECTIONS_CONFIG.find((s) => s.id === SECTION_IDS.PROJECTS)?.icon
                return SectionIcon ? <SectionIcon className="w-6 h-6 text-primary" /> : null
              })()}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
            </div>

            <div
              className="relative grid p-1 bg-gray-100 dark:bg-gray-800 rounded-xl self-center sm:self-auto transition-colors duration-300"
              style={{
                gridTemplateColumns: `repeat(${PROJECT_TABS_CONFIG.length}, minmax(0, 1fr))`
              }}
            >
              <div
                className="absolute top-1 bottom-1 left-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                style={{
                  width: `calc((100% - 0.5rem) / ${PROJECT_TABS_CONFIG.length})`,
                  transform: `translateX(${activeIndex * 100}%)`
                }}
              />

              {tabsData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 gap-2 ${
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span className="max-[442px]:hidden">{tab.label}</span>
                  <span
                    className={`text-xs py-0.5 px-1.5 rounded-full transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-200 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {tab.count}
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
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slidesData.map((slide, index) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0 px-2"
                  ref={(el) => {
                    slidesRef.current[index] = el
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slide.projects.map((project, idx) => (
                      <ProjectCard key={`${slide.id}-${idx}`} project={project} />
                    ))}
                  </div>

                  {slide.projects.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-gray-400 dark:text-gray-500">Nothing to see here yet.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ContactSection />
      <div id="bottom-sentinel" className="h-px w-full opacity-0 pointer-events-none" />
    </div>
  )
}

export default App
