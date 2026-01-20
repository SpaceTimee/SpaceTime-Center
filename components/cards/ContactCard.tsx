import { memo, type ReactNode } from 'react'
import { ChevronRight, Github, Mail, MessageCircle, Tv } from 'lucide-react'
import { externalLinkProps } from '../../consts'
import type { ContactInfo, ContactType } from '../../types'

const CONTACT_TYPE_ICON_MAP = {
  Mail: <Mail className="w-5 h-5" />,
  Github: <Github className="w-5 h-5" />,
  Bilibili: <Tv className="w-5 h-5" />,
  Default: <MessageCircle className="w-5 h-5" />
} as const satisfies Record<ContactType | 'Default', ReactNode>

const ContactCard = memo(({ info }: { info: ContactInfo }) => {
  return (
    <a
      href={info.link}
      {...externalLinkProps}
      className="block group relative bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 dark:bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none will-change-transform transform-gpu" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
          {CONTACT_TYPE_ICON_MAP[info.type ?? 'Default']}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">
            {info.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{info.description}</p>
        </div>
        <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </a>
  )
})

export default ContactCard
