import { ProjectStatus, type ContactInfo, type PortalInfo, type ProfileInfo, type ProjectInfo } from './types'

export const profile = {
  name: 'Space Time',
  description: '个人势 VCoder，独立死灵法师，项目皆为设定，请勿带入现实哦',
  tags: ['Web 全栈', '.Net 全端', '营养全面']
} as const satisfies ProfileInfo

export const portals = [
  {
    name: 'SpaceTime Center',
    description: '个人主页',
    link: 'https://www.spacetimee.xyz',
    type: 'Center',
    tags: ['React', 'Tailwind']
  },
  {
    name: 'SpaceTime Blog',
    description: '个人博客',
    link: 'https://blog.spacetimee.xyz',
    type: 'Blog',
    tags: ['Hexo']
  },
  {
    name: 'SpaceTime Server',
    description: '多功能服务器',
    link: 'https://server.spacetimee.xyz',
    type: 'Server',
    tags: ['ASP.NET Core', 'Vue']
  },
  {
    name: 'SpaceTime Alternative Blog',
    description: '备用博客',
    link: 'https://www.cnblogs.com/spacetime',
    type: 'Blog',
    tags: ['Vanilla Web']
  }
] as const satisfies readonly PortalInfo[]

export const projects = [
  {
    name: 'Sheas Cealer',
    description: '桌面端 SNI 伪造工具',
    link: 'https://github.com/SpaceTimee/Sheas-Cealer',
    tags: ['WPF'],
    status: ProjectStatus.InProgress,
    pinned: true
  },
  {
    name: 'Sheas Cealer Droid',
    description: '移动端 SNI 伪造工具',
    link: 'https://github.com/SpaceTimee/Sheas-Cealer-Droid',
    tags: ['MAUI'],
    status: ProjectStatus.InProgress,
    pinned: true
  },
  {
    name: 'Ona Pix',
    description: 'Pixiv 直连搜图工具',
    link: 'https://github.com/SpaceTimee/Ona-Pix',
    tags: ['WPF'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Sheas Frameg',
    description: '在线视频插帧工具',
    link: 'https://github.com/SpaceTimee/Sheas-Frameg',
    tags: ['Next', 'Tailwind'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Ona Dop',
    description: '在线 DNS 解析工具',
    link: 'https://github.com/SpaceTimee/Ona-Dop',
    tags: ['Vue'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Vight Note',
    description: '轻量级临时文本处理工具',
    link: 'https://github.com/SpaceTimee/Vight-Note',
    tags: ['Winform'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Ona Prox',
    description: '反?向代理',
    link: 'https://github.com/SpaceTimee/Ona-Prox',
    tags: ['Cloudflare Workers'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Sheas Dop',
    description: 'DNS 抗污染解析工具',
    link: 'https://github.com/SpaceTimee/Sheas-Dop',
    tags: ['WPF'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Sheas Nginx',
    description: 'Pixiv Nginx 启动器',
    link: 'https://github.com/SpaceTimee/Sheas-Nginx',
    tags: ['WPF'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Bot CealingCat',
    description: '提供 SNI 伪造相关服务的 Telegram Bot',
    link: 'https://github.com/SpaceTimee/Bot-CealingCat',
    tags: ['ASP.NET Core', 'Vue'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Console HostChecker',
    description: 'Cealing Host 自动化检查工具',
    link: 'https://github.com/SpaceTimee/Console-HostChecker',
    tags: ['Pwsh', 'Github Workflows'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Console HostGenerator',
    description: 'Cealing Host 自动化生成工具',
    link: 'https://github.com/SpaceTimee/Console-HostGenerator',
    tags: ['Pwsh'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Fusion JetBrainsMapleMono',
    description: 'JetBrains Mono + Maple Mono 合成字体',
    link: 'https://github.com/SpaceTimee/Fusion-JetBrainsMapleMono',
    tags: ['Github Workflows'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Vight Univerter',
    description: '轻量级单位转换器',
    link: 'https://github.com/SpaceTimee/Vight-Univerter',
    tags: ['Xamarin'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Frok PixivNginx',
    description: 'Pixiv Nginx 分支',
    link: 'https://github.com/SpaceTimee/Frok-PixivNginx',
    tags: ['Nginx'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Frok NextChat',
    description: 'NextChat 分支',
    link: 'https://github.com/SpaceTimee/Frok-NextChat',
    tags: ['Next'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Cealing Host',
    description: '最新的内置伪造规则',
    link: 'https://github.com/SpaceTimee/Cealing-Host',
    tags: ['Json'],
    status: ProjectStatus.InProgress
  },
  {
    name: 'Unity Learning',
    description: '继续学习 Unity',
    tags: ['Unity'],
    status: ProjectStatus.Planned
  },
  {
    name: 'Suri Simu 1.0 LoRA',
    description: '像素猫猫 LoRA 模型',
    link: 'https://huggingface.co/SpaceTimee/Suri-Simu-1.0-LoRA',
    tags: ['Civitai'],
    status: ProjectStatus.Completed,
    type: 'HuggingFace'
  },
  {
    name: 'Suri Qwen 3 Playground',
    description: 'Suri Qwen 3 体验场',
    link: 'https://huggingface.co/spaces/SpaceTimee/Suri-Qwen-3-Playground',
    tags: ['Chainlit', 'FastAPI'],
    status: ProjectStatus.Completed,
    type: 'HuggingFace'
  },
  {
    name: 'Suri Qwen 3.1 4B Uncensored',
    description: 'Qwen3 4B 无审查模型',
    link: 'https://huggingface.co/SpaceTimee/Suri-Qwen-3.1-4B-Uncensored',
    tags: ['PyTorch'],
    status: ProjectStatus.Completed,
    type: 'HuggingFace'
  },
  {
    name: 'Suri Qwen 3.1 4B Uncensored Hard',
    description: 'Qwen3 4B 无审查特化模型',
    link: 'https://huggingface.co/SpaceTimee/Suri-Qwen-3.1-4B-Uncensored-Hard',
    tags: ['PyTorch'],
    status: ProjectStatus.Completed,
    type: 'HuggingFace'
  },
  {
    name: 'YouTube Video Summarizer',
    description: '油管视频总结器',
    link: 'https://summarizer.spacetimee.xyz',
    tags: ['Google Opal'],
    status: ProjectStatus.Completed,
    type: 'Gemini'
  },
  {
    name: 'Virtual Avatar Designer',
    description: '虚拟形象设计器',
    link: 'https://designer.spacetimee.xyz',
    tags: ['Google Opal'],
    status: ProjectStatus.Completed,
    type: 'Gemini'
  },
  {
    name: 'Parallel World Imagineer',
    description: '平行世界生成器',
    link: 'https://imagineer.spacetimee.xyz',
    tags: ['Google Opal'],
    status: ProjectStatus.Completed,
    type: 'Gemini'
  },
  {
    name: 'Sheas Unlocker',
    description: 'Windows 外来文件解锁定工具',
    link: 'https://github.com/SpaceTimee/Sheas-Unlocker',
    tags: ['Winform'],
    status: ProjectStatus.Completed
  },
  {
    name: 'Frok ClashN',
    description: 'ClashN 分支',
    link: 'https://github.com/SpaceTimee/Frok-ClashN',
    tags: ['WPF'],
    status: ProjectStatus.Completed
  },
  {
    name: 'Vizpower Plugin Installer',
    description: '无限宝第三方插件安装器',
    link: 'https://github.com/SpaceTimee/Vizpower-Plugin-Installer',
    tags: ['WPF'],
    status: ProjectStatus.Completed
  },
  {
    name: 'Console Werewolf',
    description: '单机狼人杀',
    link: 'https://github.com/SpaceTimee/Console-Werewolf',
    tags: ['C++'],
    status: ProjectStatus.Completed
  },
  {
    name: 'Scratch Games',
    description: '一些用 Scratch 制作的小游戏 (弃坑多年，年久失修)',
    tags: ['Scratch'],
    status: ProjectStatus.Completed
  }
] as const satisfies readonly ProjectInfo[]

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
    description: 'SpaceTimee',
    link: 'https://github.com/SpaceTimee',
    type: 'Github'
  },
  {
    name: 'Bilibili',
    description: 'UID: 171416312',
    link: 'https://space.bilibili.com/171416312',
    type: 'Bilibili'
  }
] as const satisfies readonly ContactInfo[]
