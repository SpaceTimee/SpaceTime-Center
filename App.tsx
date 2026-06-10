import FooterSection from './components/sections/FooterSection'
import HeaderSection from './components/sections/HeaderSection'
import MainSection from './components/sections/MainSection'
import NavbarSection from './components/sections/NavbarSection'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { useScrollSpy } from './hooks/useScrollSpy'
import { sectionIds, sections } from './consts'

export default function App() {
  useScrollSpy(sections, { contactId: sectionIds.contact })

  return (
    <div className="min-h-screen font-sans text-gray-700 dark:text-gray-200 selection:bg-primary/20 selection:text-primary transition-colors duration-300 relative">
      <NavbarSection />
      <HeaderSection />
      <MainSection />
      <FooterSection />
      <ScrollProgress />
    </div>
  )
}
