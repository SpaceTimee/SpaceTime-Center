export enum ProjectStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Planned = 'Planned'
}

export type PortalType = 'Account' | 'Blog' | 'Center' | 'Docs' | 'Server' | 'Status'
export type ProjectType = 'Github' | 'HuggingFace' | 'Gemini'
export type ContactType = 'Mail' | 'Github' | 'Bilibili'

interface NamedInfo {
  readonly name: string
}

interface BaseInfo {
  readonly description: string
}

interface LinkedInfo {
  readonly link: string
}

interface TaggedInfo {
  readonly tags: readonly string[]
}

interface TypedInfo<TType> {
  readonly type?: TType
}

export type ProfileInfo = NamedInfo & BaseInfo & TaggedInfo

export type PortalInfo = NamedInfo & BaseInfo & LinkedInfo & TaggedInfo & TypedInfo<PortalType>

export type ProjectInfo = NamedInfo &
  BaseInfo &
  TaggedInfo &
  TypedInfo<ProjectType> & {
    readonly link?: string
    readonly status: ProjectStatus
    readonly pinned?: boolean
  }

export type ContactInfo = NamedInfo & BaseInfo & LinkedInfo & TypedInfo<ContactType>
