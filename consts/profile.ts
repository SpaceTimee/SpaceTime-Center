import type { ProfileInfo } from './types'

export const profile = {
  name: 'Space Time',
  description: '个人势 VCoder，独立死灵法师，项目皆为设定，请勿带入现实',
  tags: ['Web 全栈', '.Net 全端', '营养全面']
} as const satisfies ProfileInfo

export const social = {
  githubUsername: 'SpaceTimee',
  github: 'https://github.com/SpaceTimee',
  huggingFace: 'https://huggingface.co/SpaceTimee'
} as const

export const assets = {
  banner: '/banner.webp',
  avatar: '/avatar.png',
  avatarDark: '/avatar-dark.png'
} as const
