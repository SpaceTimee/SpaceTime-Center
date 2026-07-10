import { memo } from 'react'
import { motion } from 'motion/react'
import ContactCard from '@/components/cards/ContactCard'
import { sectionIds, sections, springTransition } from '@/consts'
import { contacts } from '@/data'

const contactSection = sections.find((section) => section.id === sectionIds.contact)

const FooterSection = memo(() => {
  return (
    <>
      <motion.footer
        className="border-t border-gray-100 bg-white pt-16 transition-[background-color,border-color] dark:border-gray-700 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={springTransition}
      >
        <div className="mx-auto max-w-5xl px-6">
          <section
            id={sectionIds.contact}
            aria-labelledby={`${sectionIds.contact}-title`}
            className="scroll-mt-16"
          >
            <div className="mb-8 flex items-center justify-center gap-2">
              {contactSection?.icon ? (
                <contactSection.icon aria-hidden className="text-primary size-6" />
              ) : null}
              <h2
                id={`${sectionIds.contact}-title`}
                className="text-3xl font-bold tracking-tight text-gray-900 transition-[color] dark:text-gray-100"
              >
                {contactSection?.title}
              </h2>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '50px' }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {contacts.map((info) => (
                <motion.div
                  key={info.link}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: springTransition
                    }
                  }}
                >
                  <ContactCard info={info} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          <p className="mt-16 flex flex-col items-center gap-1 border-t border-gray-100 py-8 transition-[border-color] dark:border-gray-700">
            <small className="text-sm font-medium text-gray-400 transition-[color] dark:text-gray-500">
              Developer{' '}
              <span aria-hidden className="mx-0.5 text-red-500">
                ❤️
              </span>{' '}
              Space Time
            </small>
            <small className="text-sm text-gray-400 transition-[color] dark:text-gray-500">Ver. 1.2.1</small>
          </p>
        </div>
      </motion.footer>
      <div id="bottom-sentinel" aria-hidden className="pointer-events-none h-px opacity-0" />
    </>
  )
})

export default FooterSection
