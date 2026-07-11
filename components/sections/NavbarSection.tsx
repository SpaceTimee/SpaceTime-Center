import { expandCollapse, fadeDownMotion } from '@/consts/motion'
import { sectionIds, sections } from '@/consts/navigation'
import { nameAccent, namePlain } from '@/consts/site'
import { bgBorderTransition, colorBgTransition, scaleTransition, sectionTitle, tw } from '@/consts/styles'
import { useTheme } from '@/hooks/useTheme'
import { ChevronUp, Menu, Moon, Sun, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { memo, useEffect, useState, type MouseEvent } from 'react'

const navLogoSwap = tw`absolute inset-0 flex items-center justify-center transition-[translate,opacity] motion-emphasized`
const navLink = tw`text-gray-600 ${colorBgTransition} hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/10`
const navIcon = tw`shrink-0 rounded-full p-2 ${colorBgTransition} hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800`

const NavbarSection = memo(function NavbarSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingToTop, setIsScrollingToTop] = useState(false)

  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const controller = new AbortController()
    let ticking = false

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY
            setIsScrolled(currentScrollY > 20)
            if (currentScrollY === 0) setIsScrollingToTop(false)
            ticking = false
          })
          ticking = true
        }
      },
      { passive: true, signal: controller.signal }
    )

    return () => controller.abort()
  }, [])

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const id = event.currentTarget.hash.slice(1)
    setIsScrollingToTop(id === sectionIds.home && window.scrollY > 0)
    setIsOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView())
  }

  const navContainer = `transition-[background-color,backdrop-filter,box-shadow,border-radius,padding] shrink-0 ${
    !isScrolled && !isOpen
      ? 'rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-md dark:bg-transparent'
      : 'px-2'
  }`

  return (
    <motion.nav
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,border-width,box-shadow,backdrop-filter] ${isScrolled || isOpen ? 'border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90' : ''}`}
      {...fadeDownMotion}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between gap-6 max-logo:justify-center">
          <div className={navContainer}>
            <a
              href={`#${sectionIds.home}`}
              onClick={onNavClick}
              className="group m-0.5 flex items-center gap-2 rounded-full"
            >
              <div className="size-8 shrink-0 overflow-hidden rounded-full">
                <div
                  className={`relative size-full rounded-full bg-primary text-white shadow-lg shadow-primary/30 ${scaleTransition} group-hover:scale-105`}
                >
                  <span
                    className={`${navLogoSwap} ${isScrollingToTop ? '-translate-y-full opacity-0' : 'hoverable:group-hover:-translate-y-full hoverable:group-hover:opacity-0'}`}
                  >
                    <img
                      src="/favicon.png"
                      alt=""
                      onError={(event) => (event.currentTarget.hidden = true)}
                      className="size-6 object-contain"
                      decoding="async"
                    />
                  </span>
                  <span
                    className={`${navLogoSwap} ${isScrollingToTop ? '' : 'translate-y-full opacity-0 hoverable:group-hover:translate-y-0 hoverable:group-hover:opacity-100'}`}
                  >
                    <ChevronUp aria-hidden className="size-5" strokeWidth={3} />
                  </span>
                </div>
              </div>
              <span className={`mx-1 text-xl tracking-tight whitespace-nowrap ${sectionTitle}`}>
                {namePlain} <span className="text-primary">{nameAccent}</span>
              </span>
            </a>
          </div>

          <div className={`${navContainer} flex items-center gap-6 max-logo:hidden`}>
            <ul className="hidden items-center gap-1 min-nav:flex">
              {sections.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavClick}
                    className={`${navLink} flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap`}
                  >
                    <item.icon aria-hidden className="size-4" />
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              aria-label="Toggle Theme"
              aria-pressed={isDark}
              onClick={toggleTheme}
              className={`${navIcon} text-gray-500 dark:text-gray-400`}
            >
              {isDark ? <Sun aria-hidden className="size-5" /> : <Moon aria-hidden className="size-5" />}
            </button>

            <button
              type="button"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`${navIcon} text-gray-600 max-menu:hidden min-nav:hidden dark:text-gray-300`}
            >
              {isOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            className={`absolute inset-x-0 top-16 overflow-hidden border-b border-gray-100 bg-white shadow-lg ${bgBorderTransition} min-nav:hidden dark:border-gray-800 dark:bg-gray-900`}
            {...expandCollapse}
          >
            <ul className="flex flex-col gap-2 p-4">
              {sections.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavClick}
                    className={`${navLink} flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium active:bg-primary/10`}
                  >
                    <item.icon aria-hidden className="size-4" />
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
})

export default NavbarSection
