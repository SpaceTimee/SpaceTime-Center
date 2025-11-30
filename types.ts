export enum ProjectStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Planned = 'Planned'
}

export type ProjectIconType = 'Github' | 'HuggingFace' | 'Gemini';

export interface Project {
  title: string;
  description: string;
  link?: string;
  tags: string[];
  status: ProjectStatus;
  pinned?: boolean;
  icon?: ProjectIconType;
}

export interface NavigationLink {
  title: string;
  description: string;
  url: string;
  type: 'Center' | 'Blog' | 'Server' | 'Other';
  tags?: string[];
}

export interface ContactInfo {
  platform: string;
  value: string;
  link?: string;
  isEmail?: boolean;
}