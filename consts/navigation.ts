import { Archive, Compass, Home, Layers, ListTodo, MessageCircle, type LucideIcon } from 'lucide-react'
import { ProjectStatus } from './types'

export const sectionIds = {
  home: 'home',
  portals: 'portals',
  projects: 'projects',
  contact: 'contact'
} as const

type SectionId = (typeof sectionIds)[keyof typeof sectionIds]

interface NavItem<TId extends string = string> {
  readonly id: TId
  readonly title: string
  readonly icon: LucideIcon
}

interface SectionItem extends NavItem<SectionId> {
  readonly href: `#${SectionId}`
  readonly titleId: `${SectionId}-title`
}

const defineSection = <TId extends SectionId>(id: TId, title: string, icon: LucideIcon) =>
  ({ id, title, icon, href: `#${id}`, titleId: `${id}-title` }) as const

export const sections = [
  defineSection(sectionIds.home, 'About', Home),
  defineSection(sectionIds.portals, 'Portals', Compass),
  defineSection(sectionIds.projects, 'Projects', Layers),
  defineSection(sectionIds.contact, 'Contact', MessageCircle)
] as const satisfies readonly SectionItem[]

const sectionById = Object.fromEntries(sections.map((section) => [section.id, section])) as {
  readonly [K in SectionId]: Extract<(typeof sections)[number], { readonly id: K }>
}

export const getSection = <TId extends SectionId>(id: TId) => sectionById[id]

export const projectTabs = [
  {
    id: ProjectStatus.InProgress,
    title: 'Doing',
    icon: Layers
  },
  {
    id: ProjectStatus.Completed,
    title: 'Done',
    icon: Archive
  },
  {
    id: ProjectStatus.Planned,
    title: 'To-Do',
    icon: ListTodo
  }
] as const satisfies readonly NavItem<ProjectStatus>[]

export const externalLink = { rel: 'noreferrer', target: '_blank' } as const
