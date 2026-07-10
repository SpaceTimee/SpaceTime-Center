import FooterSection from '@/components/sections/FooterSection'
import HeaderSection from '@/components/sections/HeaderSection'
import MainSection from '@/components/sections/MainSection'
import NavbarSection from '@/components/sections/NavbarSection'
import ScrollProgress from '@/components/controls/ScrollProgress'
import { sections } from '@/consts/navigation'
import { colorTransition } from '@/consts/styles'
import { useScrollSpy } from '@/hooks/useScrollSpy'

export default function App() {
  useScrollSpy(sections)

  return (
    <div
      className={`min-h-screen text-gray-700 ${colorTransition} selection:bg-primary/20 selection:text-primary dark:text-gray-200`}
    >
      <NavbarSection />
      <HeaderSection />
      <MainSection />
      <FooterSection />
      <ScrollProgress />
    </div>
  )
}
