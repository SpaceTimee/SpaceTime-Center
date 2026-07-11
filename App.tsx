import ScrollProgress from '@/components/controls/ScrollProgress'
import FooterSection from '@/components/sections/FooterSection'
import HeaderSection from '@/components/sections/HeaderSection'
import MainSection from '@/components/sections/MainSection'
import NavbarSection from '@/components/sections/NavbarSection'
import { sections } from '@/consts/navigation'
import { useScrollSpy } from '@/hooks/useScrollSpy'

export default function App() {
  useScrollSpy(sections)

  return (
    <>
      <NavbarSection />
      <HeaderSection />
      <MainSection />
      <FooterSection />
      <ScrollProgress />
    </>
  )
}
