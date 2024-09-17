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
          { text: 'pl_readline', link: '/project/pl_readline' },
          { text: 'plac-util', link: '/project/plac_util' },
        ]
      },
      {
        text: '项目计划',
        items: [
          { text: 'PlantOS', link: '/todo/plant_os' },
        ]
      },
      {
        text: '开发SDK文档',
        items: [
          { text: 'PlantOS', link: '/devlop/plant_os' },
          { text: 'CoolPotOS', link: '/devlop/coolpotos' },
          { text: 'CPOS DOC', link: '/devlop/cpos_doc' },
        ]
      },
      {
        text: '社区管理',
        items: [
          { text: '规章管理制度', link: '/group' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/plos-clan/docs' }
    ],
    footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © plos-clan 2024-2025',
		}
  }
})
