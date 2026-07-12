import ContactCard from '@/components/cards/ContactCard'
import { contacts } from '@/consts/contacts'
import { staggerInView, staggerItem } from '@/consts/motion'
import { getSection, sectionIds } from '@/consts/navigation'
import { profile } from '@/consts/profile'
import { version } from '@/consts/site'
import {
  bgBorderTransition,
  cardGrid,
  contentContainer,
  mutedText,
  sectionIcon,
  sectionLabel,
  sectionTitle,
  tw
} from '@/consts/styles'
import { motion } from 'motion/react'

const contactSection = getSection(sectionIds.contact)
const contactTitleId = contactSection.titleId

const footerDivider = tw`border-t border-grey-100 dark:border-grey-700`
const footerCaption = tw`text-sm ${mutedText}`

export default function FooterSection() {
  return (
    <>
      <footer className={tw`${footerDivider} bg-white pt-16 ${bgBorderTransition} dark:bg-grey-800`}>
        <div className={contentContainer}>
          <section id={contactSection.id} aria-labelledby={contactTitleId} className="scroll-mt-16">
            <div className={tw`mb-8 ${sectionLabel} justify-center`}>
              <contactSection.icon aria-hidden className={sectionIcon} />
              <h2 id={contactTitleId} className={tw`text-3xl tracking-tight ${sectionTitle}`}>
                {contactSection.title}
              </h2>
            </div>

            <motion.div className={cardGrid} {...staggerInView}>
              {contacts.map((contact) => (
                <motion.div key={contact.link} variants={staggerItem}>
                  <ContactCard info={contact} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          <div
            className={tw`mt-16 flex flex-col items-center gap-1 ${footerDivider} py-8 transition-[border-color] motion-emphasized`}
          >
            <small className={`${footerCaption} font-medium`}>
              Developer{' '}
              <span aria-hidden className="mx-0.5 text-red-500">
                ❤️
              </span>{' '}
              {profile.name}
            </small>
            <small className={footerCaption}>Ver. {version}</small>
          </div>
        </div>
      </footer>

      <div id="bottom-sentinel" aria-hidden className="pointer-events-none h-px opacity-0" />
    </>
  )
}
