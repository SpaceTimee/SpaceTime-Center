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
    <div className="h-full [perspective:1200px]">
      <motion.a
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        href={info.link}
        {...externalLinkProps}
        whileHover={{ y: -4 }}
        className="group relative block h-full transform-gpu rounded-xl bg-white p-[1px] shadow-sm transition-[box-shadow,background-color] will-change-transform dark:bg-gray-800"
      >
        <div className="pointer-events-none absolute inset-0 z-[-1] [transform:translateZ(-15px)] rounded-xl opacity-0 shadow-lg transition-opacity duration-500 group-hover:opacity-100" />

        <motion.div
          className="absolute inset-0 z-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-[0.15] dark:group-hover:opacity-[0.3]"
          style={{ background: spotlightBorder }}
        />

        <div className="group-hover:border-primary/30 pointer-events-none absolute inset-0 z-0 rounded-xl border border-gray-100 transition-colors dark:border-gray-700" />

        <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[11px] bg-white p-5 transition-colors dark:bg-gray-800">
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 opacity-0 mix-blend-screen transition-opacity group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05]"
            style={{ background: spotlightBackground }}
          />

          <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 size-32 transform-gpu rounded-full blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform group-hover:scale-150" />

          <div className="relative z-20 flex [transform:translateZ(15px)] items-center gap-4">
            <div className="bg-primary-light dark:bg-primary/20 text-primary group-hover:bg-primary flex size-12 shrink-0 items-center justify-center rounded-full transition-colors group-hover:text-white">
              {CONTACT_TYPE_ICON_MAP[info.type ?? 'Default']}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="group-hover:text-primary truncate font-bold text-gray-900 transition-colors dark:text-gray-100">
                {info.name}
              </h3>
              <p className="truncate text-sm text-gray-500 transition-colors dark:text-gray-400">
                {info.description}
              </p>
            </div>
            <ChevronRight className="group-hover:text-primary size-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 dark:text-gray-600" />
          </div>
        </div>
      </motion.a>
    </div>
  )
})

export default ContactCard
