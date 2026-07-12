export const ProjectStatus = { InProgress: 'InProgress', Completed: 'Completed', Planned: 'Planned' } as const

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]
export type PortalType = 'Account' | 'Blog' | 'Center' | 'Docs' | 'Server' | 'Status'
export type ProjectType = 'Github' | 'HuggingFace' | 'Gemini' | 'External'
export type ContactType = 'Mail' | 'Github' | 'Bilibili'

interface NamedInfo {
  readonly name: string
}

interface DescribedInfo {
  readonly description: string
}

interface LinkedInfo {
  readonly link: string
}

interface TaggedInfo {
  readonly tags: readonly string[]
}

interface TypedInfo<TType> {
  readonly type: TType
}

export interface ProfileInfo extends NamedInfo, DescribedInfo, TaggedInfo {}
export interface PortalInfo extends NamedInfo, DescribedInfo, LinkedInfo, TaggedInfo, TypedInfo<PortalType> {}
export interface ContactInfo extends NamedInfo, DescribedInfo, LinkedInfo, TypedInfo<ContactType> {}

interface ProjectBase extends NamedInfo, DescribedInfo, TaggedInfo {
  readonly status: ProjectStatus
  readonly pinned?: true
}

interface LinkedProject extends ProjectBase, LinkedInfo, TypedInfo<ProjectType> {}

interface UnlinkedProject extends ProjectBase {
  readonly link?: undefined
  readonly type?: undefined
}

export type ProjectInfo = LinkedProject | UnlinkedProject
