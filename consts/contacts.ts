import type { ContactInfo } from './types'
import { social } from './profile'

export const contacts = [
  {
    name: 'Email',
    description: 'Zeus6_6@163.com',
    link: 'mailto:Zeus6_6@163.com',
    type: 'Mail'
  },
  {
    name: 'Gmail',
    description: '4097507@gmail.com',
    link: 'mailto:4097507@gmail.com',
    type: 'Mail'
  },
  {
    name: 'Github',
    description: social.githubUsername,
    link: social.github,
    type: 'Github'
  },
  {
    name: 'Bilibili',
    description: 'UID: 171416312',
    link: 'https://space.bilibili.com/171416312',
    type: 'Bilibili'
  }
] as const satisfies readonly ContactInfo[]
