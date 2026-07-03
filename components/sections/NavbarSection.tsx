import { memo, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronUp, Menu, Moon, Sun, X } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTheme } from '@/hooks/useTheme'
import { sectionIds, sections, springTransition } from '@/consts'

const NavbarSection = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingToTop, setIsScrollingToTop] = useState(false)
  const prefersReducedMotion = useReducedMotion()

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

  const scrollToSection = useCallback(
    (id: string) => {
      setIsOpen(false)
      setIsScrollingToTop(id === sectionIds.home && window.scrollY > 0)

      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - (id === sectionIds.contact ? 64 : 96),
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          })
        }
      })
    },
    [prefersReducedMotion]
  )

  const navContainerClass =
    !isScrolled && !isOpen
      ? 'bg-white/80 dark:bg-transparent backdrop-blur-md shadow-sm rounded-full p-2 transition-all shrink-0'
      : 'px-2 transition-all shrink-0'

  return (
    <motion.nav
      aria-label="Navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ ...springTransition, delay: 0.1 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-colors ${
        isScrolled || isOpen
          ? 'border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90'
          : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between gap-6 max-[364px]:justify-center">
          <div className={navContainerClass}>
            <button
              type="button"
              className="group m-0.5 flex items-center gap-2 rounded-full"
              onClick={() => scrollToSection(sectionIds.home)}
            >
              <div className="size-8 shrink-0 overflow-hidden rounded-full">
                <div className="bg-primary shadow-primary/30 relative flex size-full items-center justify-center overflow-hidden rounded-full text-lg font-bold text-white shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform group-hover:scale-105">
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-all ${
                      isScrollingToTop
                        ? '-translate-y-full opacity-0'
                        : 'opacity-100 [@media(hover:hover)]:group-hover:-translate-y-full [@media(hover:hover)]:group-hover:opacity-0'
                    }`}
                  >
                    <img
                      src="/favicon.png"
                      alt="Favicon"
                      className="size-6 object-contain"
                      decoding="async"
                      fetchPriority="high"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-all ${
                      isScrollingToTop
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100'
                    }`}
                  >
                    <ChevronUp className="size-5" strokeWidth={3} />
                  </span>
                </div>
              </div>
              <span className="mx-1 text-xl font-bold tracking-tight whitespace-nowrap text-gray-900 transition-colors dark:text-gray-100">
                SpaceTime <span className="text-primary">Center</span>
              </span>
            </button>
          </div>

          <div className={`${navContainerClass} ml-auto flex items-center gap-6 max-[364px]:hidden`}>
            <ul className="hidden items-center gap-1 min-[819px]:flex">
              {sections.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-600 transition-all dark:text-gray-300"
                  >
                    <item.icon className="size-4" />
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={toggleTheme}
              className="hover:text-primary dark:hover:text-primary shrink-0 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>

            <div className="shrink-0 max-[424px]:hidden min-[819px]:hidden">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="hover:text-primary dark:hover:text-primary rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-16 right-0 left-0 overflow-hidden border-b border-gray-100 bg-white shadow-lg transition-colors min-[819px]:hidden dark:border-gray-800 dark:bg-gray-900"
          >
            <ul className="space-y-2 p-4">
              {sections.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 active:bg-primary/10 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all dark:text-gray-300"
                  >
                    <item.icon className="size-4" />
                    <span className="font-medium">{item.title}</span>
                  </button>
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
