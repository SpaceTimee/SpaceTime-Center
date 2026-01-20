import { Archive, Compass, Home, Layers, ListTodo, MessageCircle } from 'lucide-react'
import { ProjectStatus } from './types'

export const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
} as const

const tagPillClass =
  'inline-block text-xs font-semibold rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary dark:group-hover:text-primary transition-all'

export const tagPillProps = {
  sm: { className: `${tagPillClass} px-2 py-0.5` },
  md: { className: `${tagPillClass} px-2.5 py-1` }
} as const

export const cardGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-4'

export const sectionIds = {
  home: 'home',
  portals: 'portals',
  projects: 'projects',
  contact: 'contact'
} as const

export const sections = [
  {
    id: sectionIds.home,
    title: 'About',
    icon: Home
  },
  {
    id: sectionIds.portals,
    title: 'Portals',
    icon: Compass
  },
  {
    id: sectionIds.projects,
    title: 'Projects',
    icon: Layers
  },
  {
    id: sectionIds.contact,
    title: 'Contact',
    icon: MessageCircle
  }
] as const

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
] as const
