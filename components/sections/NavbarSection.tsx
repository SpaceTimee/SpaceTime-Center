import { expandCollapse, fadeDownMotion } from '@/consts/motion'
import { getSection, sectionIds, sections } from '@/consts/navigation'
import { nameAccent, namePlain } from '@/consts/site'
import { bgBorderTransition, colorBgTransition, scaleTransition, sectionTitle, tw } from '@/consts/styles'
import { useMinNav } from '@/hooks/useMinNav'
import { useTheme } from '@/hooks/useTheme'
import { ChevronUp, Menu, Moon, Sun, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type MouseEvent } from 'react'

const navShell = tw`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,border-width,box-shadow,backdrop-filter]`
const navContainerBase = tw`shrink-0 transition-[background-color,backdrop-filter,box-shadow,border-radius,padding]`
const navContainerSolid = tw`${navContainerBase} px-2`
const navContainerFloat = tw`${navContainerBase} rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-md dark:bg-transparent`
const navActionsBase = tw`flex items-center gap-6 max-logo:hidden`
const navLogoSwap = tw`absolute inset-0 flex items-center justify-center transition-[translate,opacity] motion-emphasized`
const navLogoDefault = tw`${navLogoSwap} hoverable:group-hover:-translate-y-full hoverable:group-hover:opacity-0`
const navLogoToTop = tw`${navLogoSwap} -translate-y-full opacity-0`
const navChevronDefault = tw`${navLogoSwap} translate-y-full opacity-0 hoverable:group-hover:translate-y-0 hoverable:group-hover:opacity-100`
const navLink = tw`text-grey-600 ${colorBgTransition} hover:bg-primary/5 hover:text-primary dark:text-grey-300 dark:hover:bg-primary/10`
const navLinkDesktop = tw`${navLink} flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap`
const navLinkMobile = tw`${navLink} flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium active:bg-primary/10`
const navIcon = tw`shrink-0 rounded-full p-2 ${colorBgTransition} hover:bg-grey-100 hover:text-primary dark:hover:bg-grey-800`

export default function NavbarSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(() => scrollY > 20)
  const [isScrollingToTop, setIsScrollingToTop] = useState(false)

  const isMinNav = useMinNav()
  const { isDark, toggleTheme } = useTheme()

  if (isMinNav && isMenuOpen) setIsMenuOpen(false)

  useEffect(() => {
    const controller = new AbortController()
    let isRafPending = false
    const syncScrollState = () => {
      const currentScrollY = scrollY
      setIsScrolled(currentScrollY > 20)
      if (currentScrollY <= 0) setIsScrollingToTop(false)
    }

    syncScrollState()
    addEventListener(
      'scroll',
      () => {
        if (isRafPending) return

        isRafPending = true
        requestAnimationFrame(() => {
          syncScrollState()
          isRafPending = false
        })
      },
      { passive: true, signal: controller.signal }
    )

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const controller = new AbortController()
    addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') setIsMenuOpen(false)
      },
      { signal: controller.signal }
    )

    return () => controller.abort()
  }, [isMenuOpen])

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const sectionId = event.currentTarget.hash.slice(1)

    setIsScrollingToTop(sectionId === sectionIds.home && scrollY > 0)
    setIsMenuOpen(false)
    setTimeout(() => document.getElementById(sectionId)?.scrollIntoView())
  }

  const isSolid = isScrolled || isMenuOpen

  return (
    <motion.nav
      className={
        isSolid
          ? tw`${navShell} border-b border-grey-100 bg-white/90 shadow-sm backdrop-blur-md dark:border-grey-800 dark:bg-grey-900/90`
          : navShell
      }
      {...fadeDownMotion}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between gap-6 max-logo:justify-center">
          <div className={isSolid ? navContainerSolid : navContainerFloat}>
            <a
              href={getSection(sectionIds.home).href}
              onClick={handleNavClick}
              className="group m-0.5 flex items-center gap-2 rounded-full"
            >
              <div className="size-8 shrink-0 overflow-hidden rounded-full">
                <div
                  className={tw`relative size-full rounded-full bg-primary text-white shadow-lg shadow-primary/30 ${scaleTransition} group-hover:scale-105`}
                >
                  <span className={isScrollingToTop ? navLogoToTop : navLogoDefault}>
                    <img
                      src="/favicon.png"
                      alt=""
                      onError={(event) => (event.currentTarget.hidden = true)}
                      className="size-6 object-contain"
                      decoding="async"
                    />
                  </span>
                  <span className={isScrollingToTop ? navLogoSwap : navChevronDefault}>
                    <ChevronUp aria-hidden className="size-5" strokeWidth={3} />
                  </span>
                </div>
              </div>
              <span className={tw`mx-1 text-xl tracking-tight whitespace-nowrap ${sectionTitle}`}>
                {namePlain} <span className="text-primary">{nameAccent}</span>
              </span>
            </a>
          </div>

          <div
            className={
              isSolid ? `${navContainerSolid} ${navActionsBase}` : `${navContainerFloat} ${navActionsBase}`
            }
          >
            <ul className="hidden items-center gap-1 min-nav:flex">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={section.href} onClick={handleNavClick} className={navLinkDesktop}>
                    <section.icon aria-hidden className="size-4" />
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              aria-label="Toggle Theme"
              aria-pressed={isDark}
              onClick={toggleTheme}
              className={`${navIcon} text-grey-500 dark:text-grey-400`}
            >
              {isDark ? <Sun aria-hidden className="size-5" /> : <Moon aria-hidden className="size-5" />}
            </button>

            <button
              type="button"
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`${navIcon} text-grey-600 max-menu:hidden min-nav:hidden dark:text-grey-300`}
            >
              {isMenuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-nav"
            className={tw`absolute inset-x-0 top-16 overflow-hidden border-b border-grey-100 bg-white shadow-lg ${bgBorderTransition} min-nav:hidden dark:border-grey-800 dark:bg-grey-900`}
            {...expandCollapse}
          >
            <ul className="flex flex-col gap-2 p-4">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={section.href} onClick={handleNavClick} className={navLinkMobile}>
                    <section.icon aria-hidden className="size-4" />
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
