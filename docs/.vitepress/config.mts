import { defineConfig } from 'vitepress'
import { chineseSearchOptimize, pagefindPlugin } from 'vitepress-plugin-pagefind'

export default defineConfig({
  title: "PlosClan Docs",
  description: "Documents of projects by PlosClan",
  lang: 'zh-cn',
  vite: {
    plugins: [pagefindPlugin({
      customSearchQuery: chineseSearchOptimize
    })],
  },
  themeConfig: {
    logo: '/icon.jpg',

    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: '项目列表',
        items: [
          { text: 'PlantOS', link: '/project/plant_os' },
          { text: 'CoolPotOS', link: '/project/coolpotos' },
          { text: 'Uinxed-Kernel', link: '/project/uinxed-kernel' },
          { text: 'racaOS', link: '/project/racaos' },
          { text: 'QuantumNEC', link: '/project/QuantumNEC' },
<<<<<<< HEAD
          { text: 'pl_readline', link: '/project/pl_readline' },
          { text: 'os_terminal', link: '/project/os_terminal' },
=======
          { text: 'Stamon2', link: '/project/stamon' },
          { text: 'DoglinkOS-2nd', link: '/project/DoglinkOS-2nd'},
>>>>>>> 5ee037a1a9f4651a2131b28340cfac5c9f4e0004
        ]
      },
      {
        text: '开发SDK文档',
        items: [
          { text: 'PlantOS', link: '/devlop/plant_os' },
          { text: 'CoolPotOS', link: '/devlop/coolpotos' },
        ]
      },
      {
        text: '相关资料',
        items: [
          { text: '内核模块加载', link: '/documents/module_loader' },
        ]
      },
      {
        text: '社区管理',
        items: [
          { text: '规章管理制度', link: '/group' },
          { text: '管理组织', link: '/group/group' },
          { text: '群宪法（制定中）', link: '/group/constitution' },
        ]
      },
      {
        text: '娱乐-历史',
        items: [
          { text: '娱乐', link: '/history' },
          { text: '历史组织', link: '/history/group' },
          { text: '群界大战', link: '/history/war' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/plos-clan/docs' }
    ],
    footer: {
			message: '本文档采用 知识共享 署名-相同方式共享 4.0 协议 进行许可。',
			copyright: 'Copyright © 2024-2025 plos-clan',
		}
  }
})
