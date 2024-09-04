import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "plos-clan doc",
  description: "plos-clan Document",
  themeConfig: {
    logo: '/icon.jpg',
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: '项目列表',
        items: [
          { text: 'PlantOS', link: '/zh/project/plant_os' },
          { text: 'CoolPotOS', link: '/zh/project/coolpotos' },
          { text: 'pl_readline', link: '/zh/project/pl_readline' },
          { text: 'plac-util', link: '/zh/project/plac_util' },
        ]
      },
      {
        text: '项目计划',
        items: [
          { text: 'PlantOS', link: '/zh/todo/plant_os' },
        ]
      },
      {
        text: '社区管理',
        items: [
          { text: '规章管理制度', link: '/zh/group/group' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/plos-clan/doc' }
    ]
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh',
      link: '/'
    },
    en: {
      label: 'English',
      lang: 'en', 
      link: '/en/main'
    }
  }
})
