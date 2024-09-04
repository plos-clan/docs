---
layout: home

hero:
  name: "plos-clan 组织文档"
  text: ""
  tagline: 欢迎来到plos-clan文档页面
  actions:
    - theme: brand
      text:  开始
      link: /zh/index
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/plos-clan/doc
  image:
    src: /plos.png
    alt: 网页的logo图标

features:
  - icon: 🛠️
    title: 技术
    details: 社区成员不乏有很多高技术的大佬, 如`flysong` `min0911` `copi143`等
  - icon: ⚡️
    title: 更新
    details: 文档全部内容会维持在最新状态, 由众多社区成员协助编写
  - icon: 🌞
    title: 社区
    details: 由众多 "OS Devloper" 和 "Pl Devloper" 组成的友好开发交流社区
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>

> `OS Devloper` 开发自制操作系统的社区成员 \
> `Pl Devloper` 开发自制编程语言的社区成员

## :dizzy: Update commit

* 当前版本 `doc_0.0.1_vp`

### doc_0.0.1_vp
  * 更换了文档渲染器为`vitepress`
  * 支持明亮切换
  * 初步支持中英双语