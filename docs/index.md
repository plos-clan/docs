---
layout: home

hero:
  name: "PlosClan 组织文档"
  text: ""
  tagline: 欢迎来到 PlosClan 文档页面
  actions:
    - theme: brand
      text:  开始
      link: /projects
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/plos-clan/docs
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

<script setup>
	import { VPTeamMembers } from 'vitepress/theme'

	const members = [
    {
	    avatar: 'https://www.github.com/min0911.png',
	    name: 'min0911Y',
	    title: 'Owner',
	    links: [
	      { icon: 'github', link: 'https://github.com/min0911' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/copi143.png',
	    name: 'copi143',
	    title: 'Owner',
	    links: [
	      { icon: 'github', link: 'https://github.com/copi143' }
	    ]
	  },
	  {
	    avatar: 'https://www.github.com/xiaoyi1212.png',
	    name: 'XIAOYI12',
	    title: 'Owner',
	    links: [
	      { icon: 'github', link: 'https://github.com/xiaoyi1212' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/wenxuanjun.png',
	    name: 'wenxuanjun',
	    title: 'Member',
	    links: [
	      { icon: 'github', link: 'https://github.com/wenxuanjun' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/CLimber-Rong.png',
	    name: 'CLimber-Rong',
	    title: 'Member',
	    links: [
	      { icon: 'github', link: 'https://github.com/CLimber-Rong' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/theflysong.png',
	    name: 'flysong',
	    title: 'Member',
	    links: [
	      { icon: 'github', link: 'https://github.com/theflysong' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/yywd123.png',
	    name: 'yywd123',
	    title: 'Member',
	    links: [
	      { icon: 'github', link: 'https://github.com/yywd123' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/zzjrabbit.png',
	    name: 'Zeng Zhenjia',
	    title: 'Member',
	    links: [
	      { icon: 'github', link: 'https://github.com/zzjrabbit' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/duoduo70.png',
	    name: 'duoduo70',
	    title: 'Owner',
	    links: [
	      { icon: 'github', link: 'https://github.com/duoduo70' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/Sdfzngf.png',
	    name: '神都服主拿高分',
	    title: 'Member',
	    links: [
	      { icon: 'github', link: 'https://github.com/Sdfzngf' }
	    ]
	  },
    {
	    avatar: 'https://www.github.com/xiguajerry.png',
	    name: 'SagiriXiguajerry',
	    title: 'Member',
	    links: [
	      { icon: 'github', link: 'https://github.com/xiguajerry' }
	    ]
	  },
	]
</script>

<hr>

# Plos-Clan 主要的活跃管理员们

<VPTeamMembers size="small" :members="members" />
