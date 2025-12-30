import { memo } from 'react'
import { ChevronRight, Github, Mail, MessageCircle, Tv } from 'lucide-react'
import { SECTION_IDS } from '../constants'
import { contactInfo } from '../data'

const ICON_MAP: Record<string, React.ReactNode> = {
  email: <Mail className="w-5 h-5" />,
  gmail: <Mail className="w-5 h-5" />,
  github: <Github className="w-5 h-5" />,
  bilibili: <Tv className="w-5 h-5" />,
  default: <MessageCircle className="w-5 h-5" />
}

const getPlatformIcon = (platform: string) => {
  const key = platform.toLowerCase()
  if (key.includes('mail') || key.includes('邮箱')) return ICON_MAP.email
  if (key.includes('github')) return ICON_MAP.github
  if (key.includes('bilibili')) return ICON_MAP.bilibili
  return ICON_MAP.default
}

const ContactSection = memo(() => {
  return (
    <footer
      id={SECTION_IDS.CONTACT}
      className="bg-white dark:bg-gray-800 mt-12 pt-16 border-t border-gray-100 dark:border-gray-700 scroll-mt-16 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-10">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Contact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactInfo.map((info, idx) => (
            <a
              key={idx}
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 dark:bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none will-change-transform transform-gpu" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
                  {getPlatformIcon(info.platform)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">
                    {info.platform}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{info.value}</p>
                </div>
                <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-20 border-t border-gray-100 dark:border-gray-700 py-8 text-center">
          <div className="flex flex-col items-center gap-1">
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">
              Developer <span className="text-red-500 mx-0.5">❤️</span> Space Time
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Ver. 1.0.8</p>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default ContactSection
