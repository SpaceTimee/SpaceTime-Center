import { ProjectStatus, type ProjectInfo } from './types'

export const projects = [
  {
    name: 'Sheas Cealer',
    description: '桌面端 SNI 伪造工具',
    link: 'https://github.com/SpaceTimee/Sheas-Cealer',
    tags: ['WPF'],
    type: 'Github',
    status: ProjectStatus.InProgress,
    pinned: true
  },
  {
    name: 'Sheas Cealer Droid',
    description: '移动端 SNI 伪造工具',
    link: 'https://github.com/SpaceTimee/Sheas-Cealer-Droid',
    tags: ['MAUI'],
    type: 'Github',
    status: ProjectStatus.InProgress,
    pinned: true
  },
  {
    name: 'Ona Pix',
    description: 'Pixiv 直连搜图工具',
    link: 'https://github.com/SpaceTimee/Ona-Pix',
    tags: ['WPF'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Suri Simu 1 LoRA',
    description: '像素猫猫 LoRA 模型',
    link: 'https://huggingface.co/collections/SpaceTimee/suri-simu-1',
    tags: ['Civitai'],
    type: 'HuggingFace',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Suri Qwen 3 Uncensored',
    description: 'Qwen 3.x 无审查模型',
    link: 'https://huggingface.co/collections/SpaceTimee/suri-qwen-3',
    tags: ['PyTorch'],
    type: 'HuggingFace',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Suri Qwen 3 Playground',
    description: 'Suri Qwen 3 体验场',
    link: 'https://huggingface.co/collections/SpaceTimee/suri-qwen-3',
    tags: ['Chainlit', 'FastAPI'],
    type: 'HuggingFace',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Suri Qwen 3 Autochat',
    description: 'Suri Qwen 3 自聊群',
    link: 'https://huggingface.co/collections/SpaceTimee/suri-qwen-3',
    tags: ['Chainlit', 'FastAPI'],
    type: 'HuggingFace',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Sheas Frameg',
    description: '在线视频插帧工具',
    link: 'https://github.com/SpaceTimee/Sheas-Frameg',
    tags: ['Next', 'Tailwind'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Ona Dop',
    description: '在线 DNS 解析工具',
    link: 'https://github.com/SpaceTimee/Ona-Dop',
    tags: ['Vue'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Vight Note',
    description: '轻量级临时文本处理工具',
    link: 'https://github.com/SpaceTimee/Vight-Note',
    tags: ['Winform'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Ona Prox',
    description: '反?向代理',
    link: 'https://github.com/SpaceTimee/Ona-Prox',
    tags: ['Cloudflare Workers'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'SpaceTime Gateway',
    description: '鉴权网关',
    link: 'https://github.com/SpaceTimee/SpaceTime-Gateway',
    tags: ['Cloudflare Workers'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Sheas Dop',
    description: 'DNS 抗污染解析工具',
    link: 'https://github.com/SpaceTimee/Sheas-Dop',
    tags: ['WPF'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Sheas Nginx',
    description: 'Pixiv Nginx 启动器',
    link: 'https://github.com/SpaceTimee/Sheas-Nginx',
    tags: ['WPF'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Bot CealingCat',
    description: '提供 SNI 伪造相关服务的 Telegram Bot',
    link: 'https://github.com/SpaceTimee/Bot-CealingCat',
    tags: ['ASP.NET Core', 'Vue'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Console CensorChecker',
    description: 'Tcping 批量拨测与审查检测脚本',
    link: 'https://github.com/SpaceTimee/Console-CensorChecker',
    tags: ['Pwsh', 'Github Actions', 'Github Workflows'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Console HostChecker',
    description: 'Cealing Host 自动化检查脚本',
    link: 'https://github.com/SpaceTimee/Console-HostChecker',
    tags: ['Pwsh', 'Github Workflows'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Console HostGenerator',
    description: 'Cealing Host 自动化生成脚本',
    link: 'https://github.com/SpaceTimee/Console-HostGenerator',
    tags: ['Pwsh'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Fusion JetBrainsMapleMono',
    description: 'JetBrains Mono + Maple Mono 合成字体',
    link: 'https://github.com/SpaceTimee/Fusion-JetBrainsMapleMono',
    tags: ['Github Workflows'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Vight Univerter',
    description: '轻量级单位转换器',
    link: 'https://github.com/SpaceTimee/Vight-Univerter',
    tags: ['Xamarin'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Frok PixivNginx',
    description: 'Pixiv Nginx 分支',
    link: 'https://github.com/SpaceTimee/Frok-PixivNginx',
    tags: ['Nginx'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Frok NextChat',
    description: 'NextChat 分支',
    link: 'https://github.com/SpaceTimee/Frok-NextChat',
    tags: ['Next'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Cealing Host',
    description: '最新的内置伪造规则',
    link: 'https://github.com/SpaceTimee/Cealing-Host',
    tags: ['Json'],
    type: 'Github',
    status: ProjectStatus.InProgress
  },
  {
    name: 'Vight Rand',
    description: 'MDRI 数字随机性量化工具',
    tags: ['Spline', 'Vanilla Web'],
    status: ProjectStatus.Planned
  },
  {
    name: 'Unity Learning',
    description: '继续学习 Unity',
    tags: ['Unity'],
    status: ProjectStatus.Planned
  },
  {
    name: 'YouTube Video Summarizer',
    description: '油管视频总结器',
    link: 'https://summarizer.spacetimee.xyz',
    tags: ['Google Opal'],
    type: 'Gemini',
    status: ProjectStatus.Completed
  },
  {
    name: 'Virtual Avatar Designer',
    description: '虚拟形象设计器',
    link: 'https://designer.spacetimee.xyz',
    tags: ['Google Opal'],
    type: 'Gemini',
    status: ProjectStatus.Completed
  },
  {
    name: 'Parallel World Imagineer',
    description: '平行世界生成器',
    link: 'https://imagineer.spacetimee.xyz',
    tags: ['Google Opal'],
    type: 'Gemini',
    status: ProjectStatus.Completed
  },
  {
    name: 'SpaceTime Alternative Blog',
    description: '备用博客',
    link: 'https://www.cnblogs.com/spacetime',
    tags: ['Vanilla Web'],
    type: 'External',
    status: ProjectStatus.Completed
  },
  {
    name: 'Sheas Unlocker',
    description: 'Windows 外来文件解锁定工具',
    link: 'https://github.com/SpaceTimee/Sheas-Unlocker',
    tags: ['Winform'],
    type: 'Github',
    status: ProjectStatus.Completed
  },
  {
    name: 'Frok ClashN',
    description: 'ClashN 分支',
    link: 'https://github.com/SpaceTimee/Frok-ClashN',
    tags: ['WPF'],
    type: 'Github',
    status: ProjectStatus.Completed
  },
  {
    name: 'Vizpower Plugin Installer',
    description: '无限宝第三方插件安装器',
    link: 'https://github.com/SpaceTimee/Vizpower-Plugin-Installer',
    tags: ['WPF'],
    type: 'Github',
    status: ProjectStatus.Completed
  },
  {
    name: 'Console Werewolf',
    description: '单机狼人杀',
    link: 'https://github.com/SpaceTimee/Console-Werewolf',
    tags: ['C++'],
    type: 'Github',
    status: ProjectStatus.Completed
  },
  {
    name: 'Scratch Games',
    description: '一些用 Scratch 制作的小游戏 (弃坑多年，年久失修)',
    tags: ['Scratch'],
    status: ProjectStatus.Completed
  }
] as const satisfies readonly ProjectInfo[]
