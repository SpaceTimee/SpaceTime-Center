import { memo, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ChevronRight, Mail, MessageCircle, Tv } from 'lucide-react'
import GithubIcon from '@/components/icons/GithubIcon'
import { useCardAnimation } from '@/hooks/useCardAnimation'
import { externalLinkProps } from '@/consts'
import type { ContactInfo, ContactType } from '@/types'

const CONTACT_TYPE_ICON_MAP = {
  Mail: <Mail className="size-5" />,
  Github: <GithubIcon className="size-5" />,
  Bilibili: <Tv className="size-5" />,
  Default: <MessageCircle className="size-5" />
} as const satisfies Record<ContactType | 'Default', ReactNode>

const ContactCard = memo(({ info }: { info: ContactInfo }) => {
  const {
    handlePointerLeave,
    handlePointerMove,
    ref,
    rotateX,
    rotateY,
    spotlightBackground,
    spotlightBorder
  } = useCardAnimation<HTMLAnchorElement>()

  return (
    <div className="h-full perspective-distant">
      <motion.a
        ref={ref}
        href={info.link}
        {...(info.link.startsWith('http') ? externalLinkProps : undefined)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="group relative block h-full rounded-xl bg-white p-px shadow-sm transition-[background-color] will-change-transform transform-3d dark:bg-gray-800"
        style={{
          rotateX,
          rotateY
        }}
        whileHover={{ y: -4 }}
      >
        <div className="pointer-events-none absolute inset-0 -z-1 -translate-z-[15px] rounded-xl opacity-0 shadow-lg transition-opacity duration-500 group-hover:opacity-100" />

        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-15 dark:group-hover:opacity-30"
          style={{ backgroundImage: spotlightBorder }}
        />

        <div className="group-hover:border-primary/30 pointer-events-none absolute inset-0 rounded-xl border border-gray-100 transition-[border-color] dark:border-gray-700" />

        <div className="relative h-full overflow-hidden rounded-[calc(var(--radius-xl)-1px)] bg-white p-5 transition-[background-color] dark:bg-gray-800">
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity group-hover:opacity-[0.03] dark:group-hover:opacity-5"
            style={{ backgroundImage: spotlightBackground }}
          />

          <div className="bg-primary/5 ease-emphasized pointer-events-none absolute -top-10 -right-10 size-32 transform-gpu rounded-full blur-2xl transition-[scale] duration-500 group-hover:scale-150" />

          <div className="relative flex translate-z-[15px] items-center gap-4">
            <div
              aria-hidden
              className="bg-primary-light dark:bg-primary/20 text-primary group-hover:bg-primary flex size-12 shrink-0 items-center justify-center rounded-full transition-[color,background-color] group-hover:text-white"
            >
              {CONTACT_TYPE_ICON_MAP[info.type ?? 'Default']}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="group-hover:text-primary truncate font-bold text-gray-900 transition-[color] dark:text-gray-100">
                {info.name}
              </h3>
              <p className="truncate text-sm text-gray-500 transition-[color] dark:text-gray-400">
                {info.description}
              </p>
            </div>
            <ChevronRight
              aria-hidden
              className="group-hover:text-primary size-5 shrink-0 text-gray-300 transition-[color,translate] group-hover:translate-x-1 dark:text-gray-600"
            />
          </div>
        </div>
      </motion.a>
    </div>
  )
})

export default ContactCard
