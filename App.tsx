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
    <div className="selection:bg-primary/20 selection:text-primary min-h-screen text-gray-700 transition-[color] dark:text-gray-200">
      <NavbarSection />
      <HeaderSection />
      <MainSection />
      <FooterSection />
      <ScrollProgress />
    </div>
  )
}
