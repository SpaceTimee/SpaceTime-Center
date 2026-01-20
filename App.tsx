import FooterSection from './components/sections/FooterSection'
import MainSection from './components/sections/MainSection'
import HeaderSection from './components/sections/HeaderSection'
import NavbarSection from './components/sections/NavbarSection'
import { useScrollSpy } from './hooks/useScrollSpy'
import { sectionIds, sections } from './consts'

const App = () => {
  useScrollSpy(sections, { contactId: sectionIds.contact })

  return (
    <div className="min-h-screen font-sans text-gray-700 dark:text-gray-200 selection:bg-primary/20 selection:text-primary transition-colors duration-300 relative">
      <NavbarSection />
      <HeaderSection />
      <MainSection />
      <FooterSection />
    </div>
  )
}

export default App
