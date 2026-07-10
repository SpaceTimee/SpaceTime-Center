import { memo, useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronUp, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { sectionIds, sections, springTransition } from '@/consts'

const NavbarSection = memo(() => {
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
    setIsOpen(false)
    const id = event.currentTarget.hash.slice(1)
    setIsScrollingToTop(id === sectionIds.home && window.scrollY > 0)
    document.getElementById(id)?.scrollIntoView()
  }

  const navContainerClass = `transition-[background-color,backdrop-filter,box-shadow,border-radius,padding] shrink-0 ${
    !isScrolled && !isOpen
      ? 'rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-md dark:bg-transparent'
      : 'px-2'
  }`

  return (
    <motion.nav
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,border-width,box-shadow,backdrop-filter] ${
        isScrolled || isOpen
          ? 'border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90'
          : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ ...springTransition, delay: 0.1 }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between gap-6 max-[372px]:justify-center">
          <div className={navContainerClass}>
            <a
              href={`#${sectionIds.home}`}
              onClick={onNavClick}
              className="group m-0.5 flex items-center gap-2 rounded-full"
            >
              <div className="size-8 shrink-0 overflow-hidden rounded-full">
                <div className="bg-primary shadow-primary/30 ease-emphasized relative size-full rounded-full text-white shadow-lg transition-[scale] duration-300 will-change-[scale] group-hover:scale-105">
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-[translate,opacity] ${
                      isScrollingToTop
                        ? '-translate-y-full opacity-0'
                        : 'hoverable:group-hover:-translate-y-full hoverable:group-hover:opacity-0'
                    }`}
                  >
                    <img
                      src="/favicon.png"
                      alt=""
                      onError={(event) => {
                        event.currentTarget.hidden = true
                      }}
                      className="size-6 object-contain"
                      decoding="async"
                    />
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-[translate,opacity] ${
                      isScrollingToTop
                        ? ''
                        : 'hoverable:group-hover:translate-y-0 hoverable:group-hover:opacity-100 translate-y-full opacity-0'
                    }`}
                  >
                    <ChevronUp aria-hidden className="size-5" strokeWidth={3} />
                  </span>
                </div>
              </div>
              <span className="mx-1 text-xl font-bold tracking-tight whitespace-nowrap text-gray-900 transition-[color] dark:text-gray-100">
                SpaceTime <span className="text-primary">Center</span>
              </span>
            </a>
          </div>

          <div className={`${navContainerClass} flex items-center gap-6 max-[372px]:hidden`}>
            <ul className="hidden items-center gap-1 min-[827px]:flex">
              {sections.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavClick}
                    className="hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-600 transition-[color,background-color] dark:text-gray-300"
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
              className="hover:text-primary shrink-0 rounded-full p-2 text-gray-500 transition-[color,background-color] hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun aria-hidden className="size-5" /> : <Moon aria-hidden className="size-5" />}
            </button>

            <button
              type="button"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsOpen((prev) => !prev)}
              className="hover:text-primary shrink-0 rounded-full p-2 text-gray-600 transition-[color,background-color] hover:bg-gray-100 max-[432px]:hidden min-[827px]:hidden dark:text-gray-300 dark:hover:bg-gray-800"
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
            className="absolute inset-x-0 top-16 overflow-hidden border-b border-gray-100 bg-white shadow-lg transition-[background-color,border-color] min-[827px]:hidden dark:border-gray-800 dark:bg-gray-900"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ease: 'easeInOut' }}
          >
            <ul className="flex flex-col gap-2 p-4">
              {sections.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavClick}
                    className="hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 active:bg-primary/10 flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-600 transition-[color,background-color] dark:text-gray-300"
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
