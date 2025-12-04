import { Project, ProjectStatus, NavigationLink, ContactInfo } from './types'

export const profileData = {
  name: "Space Time",
  tagline: "全世界会 Python 的 Web 设计师中，最懂 C/C++ 的 .Net 独立开发者",
  tags: [
    "Web 全栈",
    ".Net 全端",
    "营养全面"
  ]
}

export const navigationLinks: NavigationLink[] = [
  {
    title: "SpaceTime Center",
    description: "个人主页",
    url: "https://www.spacetimee.xyz",
    type: "Center",
    tags: ["React", "Tailwind"]
  },
  {
    title: "SpaceTime Blog",
    description: "个人博客",
    url: "https://blog.spacetimee.xyz",
    type: "Blog",
    tags: ["Hexo"]
  },
  {
    title: "SpaceTime Server",
    description: "多功能服务器",
    url: "https://server.spacetimee.xyz",
    type: "Server",
    tags: ["ASP.NET Core", "Vue"]
  },
  {
    title: "SpaceTime Alternative Blog",
    description: "备用博客",
    url: "https://www.cnblogs.com/spacetime",
    type: "Blog",
    tags: ["Vanilla Web"]
  }
]

export const projects: Project[] = [
  {
    title: "Sheas Cealer",
    description: "桌面端 SNI 伪造工具",
    link: "https://github.com/SpaceTimee/Sheas-Cealer",
    tags: ["WPF"],
    status: ProjectStatus.InProgress,
    pinned: true
  },
  {
    title: "Sheas Cealer Droid",
    description: "移动端 SNI 伪造工具",
    link: "https://github.com/SpaceTimee/Sheas-Cealer-Droid",
    tags: ["MAUI"],
    status: ProjectStatus.InProgress,
    pinned: true
  },
  {
    title: "Ona Pix",
    description: "Pixiv 直连搜图工具",
    link: "https://github.com/SpaceTimee/Ona-Pix",
    tags: ["WPF"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Ona Dop",
    description: "在线 DNS 解析工具",
    link: "https://github.com/SpaceTimee/Ona-Dop",
    tags: ["Vue"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Vight Note",
    description: "轻量级临时文本处理工具",
    link: "https://github.com/SpaceTimee/Vight-Note",
    tags: ["Winform"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Ona Prox",
    description: "反?向代理",
    link: "https://github.com/SpaceTimee/Ona-Prox",
    tags: ["Cloudflare Workers"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Sheas Dop",
    description: "DNS 抗污染解析工具",
    link: "https://github.com/SpaceTimee/Sheas-Dop",
    tags: ["WPF"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Sheas Nginx",
    description: "Pixiv Nginx 启动器",
    link: "https://github.com/SpaceTimee/Sheas-Nginx",
    tags: ["WPF"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Bot CealingCat",
    description: "提供 SNI 伪造相关服务的 Telegram Bot",
    link: "https://github.com/SpaceTimee/Bot-CealingCat",
    tags: ["WPF"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Console HostChecker",
    description: "Cealing Host 自动化检查工具",
    link: "https://github.com/SpaceTimee/Console-HostChecker",
    tags: ["Pwsh"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Console HostGenerator",
    description: "Cealing Host 自动化生成工具",
    link: "https://github.com/SpaceTimee/Console-HostGenerator",
    tags: ["Pwsh"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Fusion JetBrainsMapleMono",
    description: "JetBrains Mono + Maple Mono 合成字体",
    link: "https://github.com/SpaceTimee/Fusion-JetBrainsMapleMono",
    tags: ["Github Workflows"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Vight Univerter",
    description: "轻量级单位转换器",
    link: "https://github.com/SpaceTimee/Vight-Univerter",
    tags: ["Xamarin"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Frok PixivNginx",
    description: "Pixiv Nginx 分支",
    link: "https://github.com/SpaceTimee/Frok-PixivNginx",
    tags: ["Nginx"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Frok NextChat",
    description: "NextChat 分支",
    link: "https://github.com/SpaceTimee/Frok-NextChat",
    tags: ["Next.js"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Cealing Host",
    description: "最新的内置伪造规则",
    link: "https://github.com/SpaceTimee/Cealing-Host",
    tags: ["Json"],
    status: ProjectStatus.InProgress
  },
  {
    title: "Unity Learning",
    description: "继续学习 Unity",
    tags: ["Unity"],
    status: ProjectStatus.Planned
  },
  {
    title: "Suri Qwen 3 Playground",
    description: "Suri Qwen 3 体验场",
    link: "https://huggingface.co/spaces/SpaceTimee/Suri-Qwen-3-Playground",
    tags: ["Chainlit", "FastAPI"],
    status: ProjectStatus.Completed,
    icon: 'HuggingFace'
  },
  {
    title: "Suri Qwen 3.1 4B Uncensored",
    description: "Qwen3 4B 无审查模型",
    link: "https://huggingface.co/SpaceTimee/Suri-Qwen-3.1-4B-Uncensored",
    tags: ["PyTorch"],
    status: ProjectStatus.Completed,
    icon: 'HuggingFace'
  },
  {
    title: "Suri Qwen 3.1 4B Uncensored Hard",
    description: "Qwen3 4B 无审查特化模型",
    link: "https://huggingface.co/SpaceTimee/Suri-Qwen-3.1-4B-Uncensored-Hard",
    tags: ["PyTorch"],
    status: ProjectStatus.Completed,
    icon: 'HuggingFace'
  },
  {
    title: "YouTube Video Summarizer",
    description: "油管视频总结器",
    link: "https://summarizer.spacetimee.xyz",
    tags: ["Google Opal"],
    status: ProjectStatus.Completed,
    icon: 'Gemini'
  },
  {
    title: "Virtual Avatar Designer",
    description: "虚拟形象设计器",
    link: "https://designer.spacetimee.xyz",
    tags: ["Google Opal"],
    status: ProjectStatus.Completed,
    icon: 'Gemini'
  },
  {
    title: "Parallel World Imagineer",
    description: "平行世界生成器",
    link: "https://imagineer.spacetimee.xyz",
    tags: ["Google Opal"],
    status: ProjectStatus.Completed,
    icon: 'Gemini'
  },
  {
    title: "Veo Video Generator",
    description: "Veo3.1 体验场",
    link: "https://veo.spacetimee.xyz",
    tags: ["Google Opal"],
    status: ProjectStatus.Completed,
    icon: 'Gemini'
  },
  {
    title: "Sheas Unlocker",
    description: "Windows 外来文件解锁定工具",
    link: "https://github.com/SpaceTimee/Sheas-Unlocker",
    tags: ["Winform"],
    status: ProjectStatus.Completed
  },
  {
    title: "Frok ClashN",
    description: "ClashN 分支",
    link: "https://github.com/SpaceTimee/Frok-ClashN",
    tags: ["WPF"],
    status: ProjectStatus.Completed
  },
  {
    title: "Vizpower Plugin Installer",
    description: "无限宝第三方插件安装器",
    link: "https://github.com/SpaceTimee/Vizpower-Plugin-Installer",
    tags: ["WPF"],
    status: ProjectStatus.Completed
  },
  {
    title: "Console Werewolf",
    description: "单机狼人杀",
    link: "https://github.com/SpaceTimee/Console-Werewolf",
    tags: ["C++"],
    status: ProjectStatus.Completed
  },
  {
    title: "Scratch Games",
    description: "一些用 Scratch 制作的小游戏 (弃坑多年，年久失修)",
    tags: ["Scratch"],
    status: ProjectStatus.Completed
  }
]

export const contactInfo: ContactInfo[] = [
  {
    platform: "Email",
    value: "Zeus6_6@163.com",
    link: "mailto:Zeus6_6@163.com",
    isEmail: true
  },
  {
    platform: "Gmail",
    value: "4097507@gmail.com",
    link: "mailto:4097507@gmail.com",
    isEmail: true
  },
  {
    platform: "Github",
    value: "SpaceTimee",
    link: "https://github.com/SpaceTimee"
  },
  {
    platform: "Bilibili",
    value: "UID: 171416312",
    link: "https://space.bilibili.com/171416312"
  }
]