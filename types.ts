export enum ProjectStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Planned = 'Planned'
}

export type ProjectIconType = 'Github' | 'HuggingFace' | 'Gemini'

export interface Project {
  readonly title: string
  readonly description: string
  readonly link?: string
  readonly tags: readonly string[]
  readonly status: ProjectStatus
  readonly pinned?: boolean
  readonly icon?: ProjectIconType
}

export interface NavigationLink {
  readonly title: string
  readonly description: string
  readonly url: string
  readonly type: 'Center' | 'Blog' | 'Server' | 'Other'
  readonly tags?: readonly string[]
}

export interface ContactInfo {
  readonly platform: string
  readonly value: string
  readonly link?: string
  readonly isEmail?: boolean
}
