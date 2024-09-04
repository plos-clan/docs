import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "PlosClan Docs",
  description: "Documents related to projects organised by PlosClan ",
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
        text: '社区管理',
        items: [
          { text: '规章管理制度', link: '/group' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/plos-clan/docs' }
    ]
  }
})
