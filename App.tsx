import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import NavigationCard from './components/NavigationCard';
import ContactSection from './components/ContactSection';
import { projects, navigationLinks } from './data';
import { ProjectStatus } from './types';
import { Compass, ListTodo, Archive, Layers } from 'lucide-react';

const inProgressProjects = projects.filter(p => p.status === ProjectStatus.InProgress);
const completedProjects = projects.filter(p => p.status === ProjectStatus.Completed);
const plannedProjects = projects.filter(p => p.status === ProjectStatus.Planned);

const slidesData = [
  { id: ProjectStatus.InProgress, projects: inProgressProjects },
  { id: ProjectStatus.Completed, projects: completedProjects },
  { id: ProjectStatus.Planned, projects: plannedProjects },
];

const tabsData = [
  { id: ProjectStatus.InProgress, label: 'Doing', icon: <Layers className="w-4 h-4 shrink-0" />, count: inProgressProjects.length },
  { id: ProjectStatus.Completed, label: 'Did', icon: <Archive className="w-4 h-4 shrink-0" />, count: completedProjects.length },
  { id: ProjectStatus.Planned, label: 'To-Do', icon: <ListTodo className="w-4 h-4 shrink-0" />, count: plannedProjects.length },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectStatus>(ProjectStatus.InProgress);
  const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');

  const currentTitleRef = useRef<string>('About ❤️ SpaceTime Center');
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const activeIndex = slidesData.findIndex(tab => tab.id === activeTab);

  useEffect(() => {
    const sections = [
      { id: 'home', title: 'About' },
      { id: 'navigation', title: 'Navigation' },
      { id: 'projects', title: 'Projects' },
      { id: 'contact', title: 'Contact' }
    ];

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = sections.find(s => s.id === entry.target.id);
          if (section && section.id !== 'contact') {
            currentTitleRef.current = `${section.title} ❤️ SpaceTime Center`;
            if (document.title !== 'Contact ❤️ SpaceTime Center') {
              document.title = currentTitleRef.current;
            }
          }
        }
      });
    }, { rootMargin: '-70px 0px -80% 0px', threshold: 0 });

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) sectionObserver.observe(el);
    });

    const bottomObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        document.title = entry.isIntersecting ? 'Contact ❤️ SpaceTime Center' : currentTitleRef.current;
      });
    }, { rootMargin: '0px', threshold: 0 });

    const sentinel = document.getElementById('bottom-sentinel');
    if (sentinel) bottomObserver.observe(sentinel);

    return () => {
      sectionObserver.disconnect();
      bottomObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      const activeSlide = slidesRef.current[activeIndex];
      if (activeSlide) {
        setContainerHeight(activeSlide.offsetHeight + 48);
      }
    };

    updateHeight();
    const timer = setTimeout(updateHeight, 50);
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timer);
    };
  }, [activeIndex]);

  return (
    <div className="min-h-screen font-sans text-gray-700 dark:text-gray-200 selection:bg-primary/20 selection:text-primary transition-colors duration-300 relative">
      <Navbar />
      <Header />

      <main className="max-w-5xl mx-auto px-6 mt-12 relative z-20 space-y-16">
        <section id="navigation" className="scroll-mt-24">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-6">
            <Compass className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Navigation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {navigationLinks.map((link, idx) => (
              <NavigationCard key={idx} link={link} />
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-mt-24">
          <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
            </div>

            <div className="relative grid grid-cols-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl self-center sm:self-auto transition-colors duration-300">
              <div
                className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />

              {tabsData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 gap-2 ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  {tab.icon}
                  <span className="max-[442px]:hidden">{tab.label}</span>
                  <span className={`text-xs py-0.5 px-1.5 rounded-full transition-colors duration-200 ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-gray-200 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="overflow-hidden -mx-1 px-1 py-6 -my-6 transition-[height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ height: containerHeight === 'auto' ? 'auto' : `${containerHeight}px` }}
          >
            <div
              className="flex items-start transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slidesData.map((slide, index) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0 px-2"
                  ref={(el) => { slidesRef.current[index] = el; }}
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
  );
};

export default App;