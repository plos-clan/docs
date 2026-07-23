import { defineConfig } from "vitepress";

export default defineConfig({
  title: "PlosClan Docs",
  description: "Documents of projects by PlosClan",
  lang: "zh-cn",
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
  themeConfig: {
    logo: "/icon.jpg",

    nav: [
      { text: "Home", link: "/" },
      {
        text: "教程",
        items: [
          {
            text: "Neovim 从入门到出门",
            link: "/tutorials/neovim/",
          },
        ],
      },
    ],

    search: {
      provider: "local",
    },

    sidebar: {
      "/tutorials/neovim/": [
        {
          text: "Neovim 从入门到出门",
          link: "/tutorials/neovim/",
        },
        {
          text: "起步与项目骨架",
          collapsed: false,
          items: [
            {
              text: "00｜先认识界面",
              link: "/tutorials/neovim/00-interface-and-mental-model",
            },
            {
              text: "01｜生存与基础交互",
              link: "/tutorials/neovim/01-survival-and-interface",
            },
            {
              text: "02｜用文件树创建项目",
              link: "/tutorials/neovim/02-explorer-and-skeleton",
            },
          ],
        },
        {
          text: "核心编辑",
          collapsed: false,
          items: [
            {
              text: "03｜快速移动与小编辑",
              link: "/tutorials/neovim/03-navigation-and-small-edits",
            },
            {
              text: "04｜编辑语法与文本对象",
              link: "/tutorials/neovim/04-edit-grammar-and-text-objects",
            },
            {
              text: "05｜包围符与注释",
              link: "/tutorials/neovim/05-surround-and-comments",
            },
          ],
        },
        {
          text: "项目导航与代码智能",
          collapsed: false,
          items: [
            {
              text: "06｜搜索与 Quickfix",
              link: "/tutorials/neovim/06-search-and-quickfix",
            },
            {
              text: "07｜Buffer、分屏与 Tab",
              link: "/tutorials/neovim/07-buffers-windows-and-tabs",
            },
            {
              text: "08｜补全与 Copilot",
              link: "/tutorials/neovim/08-completion-and-copilot",
            },
            {
              text: "09｜LSP、诊断与重构",
              link: "/tutorials/neovim/09-lsp-diagnostics-and-refactor",
            },
          ],
        },
        {
          text: "测试与版本控制",
          collapsed: false,
          items: [
            {
              text: "10｜终端、测试与格式化",
              link: "/tutorials/neovim/10-terminal-test-and-format",
            },
            {
              text: "11｜Git 变更块",
              link: "/tutorials/neovim/11-git-hunks",
            },
            {
              text: "12｜完整代码对照",
              link: "/tutorials/neovim/12-diffview-and-comparison",
            },
            {
              text: "13｜合并冲突演练",
              link: "/tutorials/neovim/13-merge-conflicts",
            },
          ],
        },
        {
          text: "完整工作流与参考",
          collapsed: false,
          items: [
            {
              text: "14｜会话与毕业挑战",
              link: "/tutorials/neovim/14-sessions-and-daily-workflow",
            },
            {
              text: "15｜完整速查表",
              link: "/tutorials/neovim/15-key-reference",
            },
          ],
        },
      ],
      "/": [
        {
          text: "项目列表",
          items: [
            { text: "PlantOS", link: "/project/plant_os" },
            { text: "CoolPornOS", link: "/project/coolpotos" },
            { text: "racaOS", link: "/project/racaos" },
            { text: "QuantumNEC", link: "/project/QuantumNEC" },
            { text: "pl_readline", link: "/project/pl_readline" },
            { text: "os_terminal", link: "/project/os_terminal" },
            { text: "Stamon2", link: "/project/stamon" },
            { text: "DoglinkOS-2nd", link: "/project/DoglinkOS-2nd" },
            { text: "Ciallo~(∠・ω< )⌒☆", link: "/project/calico" },
          ],
        },
        {
          text: "开发 SDK 文档",
          items: [
            { text: "PlantOS", link: "/devlop/plant_os" },
            { text: "CoolPotOS", link: "/devlop/coolpotos" },
            {
              text: "DoglinkOS-2nd 系统调用文档",
              link: "/devlop/dlos_syscalls",
            },
            {
              text: "DoglinkOS-2nd /dev 文件系统文档",
              link: "/devlop/dlos_devfs",
            },
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
          text: "娱乐 - 历史",
          items: [
            { text: "娱乐", link: "/history" },
            { text: "历史组织", link: "/history/group" },
            { text: "群界大战", link: "/history/war" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/plos-clan/docs" },
    ],
    footer: {
      message: "本文档采用 知识共享 署名-相同方式共享 4.0 协议 进行许可。",
      copyright: "Copyright © 2024-2025 plos-clan",
    },
  },
});
