import { url } from './site'
import type { PortalInfo } from './types'

export const portals = [
  {
    name: 'SpaceTime Center',
    description: '个人主页',
    link: url,
    tags: ['React', 'Tailwind'],
    type: 'Center'
  },
  {
    name: 'SpaceTime Blog',
    description: '个人博客',
    link: 'https://blog.spacetimee.xyz',
    tags: ['Hexo'],
    type: 'Blog'
  },
  {
    name: 'SpaceTime Server',
    description: '多功能服务器',
    link: 'https://server.spacetimee.xyz',
    tags: ['ASP.NET Core', 'Vue'],
    type: 'Server'
  },
  {
    name: 'SpaceTime Docs',
    description: '文档中心',
    link: 'https://docs.spacetimee.xyz',
    tags: ['VitePress'],
    type: 'Docs'
  },
  {
    name: 'SpaceTime Account',
    description: '账号中心',
    link: 'https://accounts.spacetimee.xyz',
    tags: ['Clerk'],
    type: 'Account'
  },
  {
    name: 'SpaceTime Status',
    description: '服务监测',
    link: 'https://status.spacetimee.xyz',
    tags: ['BetterStack'],
    type: 'Status'
  }
] as const satisfies readonly PortalInfo[]
