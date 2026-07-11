import ContactCard from '@/components/cards/ContactCard'
import { contacts } from '@/consts/contacts'
import { staggerInView, staggerItem } from '@/consts/motion'
import { sectionIds, sections } from '@/consts/navigation'
import { profile } from '@/consts/profile'
import { version } from '@/consts/site'
import {
  borderTransition,
  cardGrid,
  contentWidth,
  mutedText,
  sectionIcon,
  sectionLabel,
  sectionTitle,
  surfaceTransition
} from '@/consts/styles'
import { motion } from 'motion/react'
import { memo } from 'react'

const contactSection = sections.find((section) => section.id === sectionIds.contact)

const FooterSection = memo(function FooterSection() {
  return (
    <>
      <footer
        className={`border-t border-gray-100 bg-white pt-16 ${surfaceTransition} dark:border-gray-700 dark:bg-gray-800`}
      >
        <div className={`mx-auto px-6 ${contentWidth}`}>
          <section
            id={sectionIds.contact}
            aria-labelledby={`${sectionIds.contact}-title`}
            className="scroll-mt-16"
          >
            <div className={`mb-8 ${sectionLabel} justify-center`}>
              {contactSection?.icon ? <contactSection.icon aria-hidden className={sectionIcon} /> : null}
              <h2
                id={`${sectionIds.contact}-title`}
                className={`text-3xl font-bold tracking-tight ${sectionTitle}`}
              >
                {contactSection?.title}
              </h2>
            </div>

            <motion.div className={cardGrid} {...staggerInView}>
              {contacts.map((info) => (
                <motion.div key={info.link} variants={staggerItem}>
                  <ContactCard info={info} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          <p
            className={`mt-16 flex flex-col items-center gap-1 border-t border-gray-100 py-8 ${borderTransition} dark:border-gray-700`}
          >
            <small className={`text-sm font-medium ${mutedText}`}>
              Developer{' '}
              <span aria-hidden className="mx-0.5 text-red-500">
                ❤️
              </span>{' '}
              {profile.name}
            </small>
            <small className={`text-sm ${mutedText}`}>Ver. {version}</small>
          </p>
        </div>
      </footer>
      <div id="bottom-sentinel" aria-hidden className="pointer-events-none h-px opacity-0" />
    </>
  )
})

export default FooterSection
