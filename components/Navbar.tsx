import React, { useState, useEffect } from 'react'
import { Menu, X, Home, Compass, Layers, MessageCircle, ChevronUp, Sun, Moon } from 'lucide-react'

const Navbar: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme === 'dark' || (!savedTheme && prefersDark)
  })
  const [isScrollingToTop, setIsScrollingToTop] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          setIsScrolled(currentScrollY > 20)
          if (currentScrollY === 0) setIsScrollingToTop(false)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newMode = !isDark
    setIsDark(newMode)
    document.documentElement.classList.toggle('dark', newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
  }

  const navItems = [
    { id: 'home', label: 'About', icon: <Home className="w-4 h-4" /> },
    { id: 'navigation', label: 'Navigation', icon: <Compass className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Layers className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <MessageCircle className="w-4 h-4" /> }
  ]

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    setIsScrollingToTop(id === 'home' && window.scrollY > 0)

    const element = document.getElementById(id)
    if (element) {
      const offset = id === 'contact' ? 56 : 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
    }
  }

  const navContainerClasses =
    !isScrolled && !isOpen
      ? 'bg-white/80 dark:bg-transparent backdrop-blur-md shadow-sm rounded-full px-2.5 py-2 transition-all duration-300 flex-shrink-0'
      : 'px-2 transition-all duration-300 flex-shrink-0'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between max-[364px]:justify-center h-16 gap-4">
          <div className={navContainerClasses}>
            <div
              className="flex items-center gap-2 m-0.5 cursor-pointer group"
              onClick={() => scrollToSection('home')}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform relative overflow-hidden flex-shrink-0 will-change-transform">
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isScrollingToTop ? '-translate-y-full opacity-0' : 'opacity-100 [@media(hover:hover)]:group-hover:-translate-y-full [@media(hover:hover)]:group-hover:opacity-0'}`}
                >
                  <img
                    src="/favicon.png"
                    alt="Favicon"
                    className="w-6 h-6 object-contain"
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isScrollingToTop ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100'}`}
                >
                  <ChevronUp className="w-5 h-5" strokeWidth={3} />
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mx-1 whitespace-nowrap">
                SpaceTime <span className="text-primary">Center</span>
              </span>
            </div>
          </div>

          <div className={`${navContainerClasses} flex items-center gap-4 ml-auto max-[364px]:hidden`}>
            <div className="hidden min-[830px]:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 font-medium text-sm whitespace-nowrap"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors flex-shrink-0"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="min-[830px]:hidden flex-shrink-0 max-[415px]:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`min-[830px]:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all active:bg-primary/10"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
})

export default Navbar
