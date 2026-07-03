import FooterSection from '@/components/sections/FooterSection'
import HeaderSection from '@/components/sections/HeaderSection'
import MainSection from '@/components/sections/MainSection'
import NavbarSection from '@/components/sections/NavbarSection'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { sections } from '@/consts'
import { useScrollSpy } from '@/hooks/useScrollSpy'

export default function App() {
  useScrollSpy(sections)

  return (
    <div className="selection:bg-primary/20 selection:text-primary relative min-h-screen font-sans text-gray-700 transition-colors dark:text-gray-200">
      <NavbarSection />
      <HeaderSection />
      <MainSection />
      <FooterSection />
      <ScrollProgress />
    </div>
  )
}
