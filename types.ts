export enum ProjectStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Planned = 'Planned'
}

export type PortalType = 'Center' | 'Blog' | 'Server'
export type ProjectType = 'Github' | 'HuggingFace' | 'Gemini'
export type ContactType = 'Mail' | 'Github' | 'Bilibili'

interface BaseInfo {
  readonly description: string
}

interface NamedInfo {
  readonly name: string
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

export type ProfileInfo = BaseInfo & NamedInfo & TaggedInfo

export type PortalInfo = BaseInfo & NamedInfo & LinkedInfo & TaggedInfo & TypedInfo<PortalType>

export type ProjectInfo = BaseInfo &
  NamedInfo &
  TaggedInfo &
  TypedInfo<ProjectType> & {
    readonly link?: string
    readonly status: ProjectStatus
    readonly pinned?: boolean
  }

export type ContactInfo = BaseInfo & NamedInfo & LinkedInfo & TypedInfo<ContactType>
