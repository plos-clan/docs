import { defineConfig } from "vitepress";

export default defineConfig({
  title: "PlosClan Docs",
  description: "Documents of projects by PlosClan",
  lang: "zh-cn",
  themeConfig: {
    logo: "/icon.jpg",

    nav: [{ text: "Home", link: "/" }],

    search: {
      provider: "local",
    },

    sidebar: [
      {
        text: "项目列表",
        items: [
          { text: "PlantOS", link: "/project/plant_os" },
          { text: "CoolPorOS", link: "/project/coolpotos" },
          { text: "racaOS", link: "/project/racaos" },
          { text: "QuantumNEC", link: "/project/QuantumNEC" },
          { text: "pl_readline", link: "/project/pl_readline" },
          { text: "os_terminal", link: "/project/os_terminal" },
          { text: "Stamon2", link: "/project/stamon" },
          { text: "DoglinkOS-2nd", link: "/project/DoglinkOS-2nd" },
          { text: "Calico", link: "/project/calico" },
        ],
      },
      {
        text: "开发SDK文档",
        items: [
          { text: "PlantOS", link: "/devlop/plant_os" },
          { text: "CoolPotOS", link: "/devlop/coolpotos" },
          { text: "DoglinkOS-2nd 系统调用文档", link: "/devlop/dlos_syscalls" },
        ],
      },
      {
        text: "相关资料",
        items: [
          { text: "内核模块加载", link: "/documents/module_loader" },
          { text: "动态链接器", link: "/documents/dynamic_linker" },
          { text: "系统调用标准", link: "/documents/plos_syscall" },
          { text: "NixOS 安装指南", link: "/documents/nixos_install" },
        ],
      },
      {
        text: "社区管理",
        items: [
          { text: "规章管理制度", link: "/group" },
          { text: "管理组织", link: "/group/group" },
          { text: "群宪法（制定中）", link: "/group/constitution" },
        ],
      },
      {
        text: "娱乐-历史",
        items: [
          { text: "娱乐", link: "/history" },
          { text: "历史组织", link: "/history/group" },
          { text: "群界大战", link: "/history/war" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/plos-clan/docs" },
    ],
    footer: {
      message: "本文档采用 知识共享 署名-相同方式共享 4.0 协议 进行许可。",
      copyright: "Copyright © 2024-2025 plos-clan",
    },
  },
});
