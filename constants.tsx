import { Archive, Compass, Home, Layers, ListTodo, MessageCircle } from 'lucide-react'
import { ProjectStatus } from './types'

export const SECTION_IDS = {
  HOME: 'home',
  PORTALS: 'portals',
  PROJECTS: 'projects',
  CONTACT: 'contact'
} as const

export const SECTIONS_CONFIG = [
  {
    id: SECTION_IDS.HOME,
    title: 'About',
    icon: Home
  },
  {
    id: SECTION_IDS.PORTALS,
    title: 'Portals',
    icon: Compass
  },
  {
    id: SECTION_IDS.PROJECTS,
    title: 'Projects',
    icon: Layers
  },
  {
    id: SECTION_IDS.CONTACT,
    title: 'Contact',
    icon: MessageCircle
  }
] as const

export const PROJECT_TABS_CONFIG = [
  {
    id: ProjectStatus.InProgress,
    label: 'Doing',
    icon: Layers
  },
  {
    id: ProjectStatus.Completed,
    label: 'Did',
    icon: Archive
  },
  {
    id: ProjectStatus.Planned,
    label: 'To-Do',
    icon: ListTodo
  }
] as const
