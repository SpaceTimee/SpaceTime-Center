import { Archive, Compass, Home, Layers, ListTodo, MessageCircle } from 'lucide-react'
import { ProjectStatus } from '@/types'

export const springTransition = {
  damping: 20,
  stiffness: 260,
  type: 'spring'
} as const

export const externalLinkProps = {
  rel: 'noreferrer',
  target: '_blank'
} as const

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
