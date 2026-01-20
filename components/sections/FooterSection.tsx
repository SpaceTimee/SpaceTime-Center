import { memo } from 'react'
import ContactCard from '../cards/ContactCard'
import { cardGridClass, sectionIds, sections } from '../../consts'
import { contacts } from '../../data'

const FooterSection = memo(() => {
  const contactSection = sections.find((section) => section.id === sectionIds.contact)

  return (
    <>
      <footer
        id={sectionIds.contact}
        className="bg-white dark:bg-gray-800 mt-12 pt-16 border-t border-gray-100 dark:border-gray-700 scroll-mt-16 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-10">
            {contactSection && contactSection.icon ? (
              <contactSection.icon className="w-6 h-6 text-primary" />
            ) : null}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {contactSection?.title ?? 'Contact'}
            </h2>
          </div>

          <div className={cardGridClass}>
            {contacts.map((info) => (
              <ContactCard key={info.link} info={info} />
            ))}
          </div>

          <div className="mt-20 border-t border-gray-100 dark:border-gray-700 py-8 text-center">
            <div className="flex flex-col items-center gap-1">
              <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                Developer <span className="text-red-500 mx-0.5">❤️</span> Space Time
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Ver. 1.1.0</p>
            </div>
          </div>
        </div>
      </footer>
      <div id="bottom-sentinel" className="h-px w-full opacity-0 pointer-events-none" />
    </>
  )
})

export default FooterSection
