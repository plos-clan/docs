# CoolPotOS

由众多 `CoolPotOS` 贡献者们开发的适用于x86平台的宏内核操作系统,现已存在三个版本

* CoolPotOS i386 - CoolPotOS仓库主分支 (32位版本)
* CoolPotOS x86_64 - CoolPotOS仓库 `x86_64` 分支 (64位版本)
* CoolPotOS Vlang Edition - CoolPotOS-x64-V仓库 (64位Vlang版本)

<div>
  <img id="logo" class="shadow" src="/cpos_icon.png" width="150" height="150" align="right">
</div>

<style>
.shadow{
    filter: drop-shadow(0px 2px 20px #000000);
}
</style>

<img align="center" src="https://github-readme-stats.vercel.app/api/pin/?username=xiaoyi1212&repo=CoolPotOS&title_color=ffffff&text_color=c9cacc&icon_color=2bbc8a&bg_color=1d1f21" />

* 最初的系统名叫 `CrashPowerDOS for x86` 后觉得太长改名
* XIAOYI12对OS的各种模块做了高度解耦, 所以将该系统的源码移植到您的项目相对来说比较容易
* CoolPotOS沿用了很多 `plos-clan` 社区的模块和技术栈, 同时社区的一些项目也受CoolPotOS影响

> 基于 `CP_Kernel` 的衍生版本操作系统还有 `MdrOS`, 由梦猫大典团队维护 \
> [Mdr-C-Tutorial/MdrOS](https://github.com/Mdr-C-Tutorial/MdrOS)

## 贡献者

> 排名按照第一次参与贡献的时间开始, 名称为github用户名

* `xiaoyi1212` OS主要开发者
* `min0911Y` OS文件系统部分开发
* `QtLittleXu` OS文档编写
* `copi143` 用户堆分配系统开发
* `VinbeWan` IIC驱动开发
* `ViudiraTech` PCI设备信息优化 <Badge type="warning" text="组织" />
* `wenxuanjun` Vlang Edition开发
* `A4-Tacks` CPOS 旧版多线程构建优化
* `Minsecrus` CP_Kernel 内存统计算法优化
* `CLimber-Rong` 软件生态贡献
* `zzjrabbit` 新版RUST SDK贡献以及软件生态贡献
* `yuemingruoan` 补充注释和优化代码
* `onion108` 翻译了法语文档
* `LY-Xiang` 优化了workflow(GitHub Actions)
* `FengHeting` 增加SMBIOS信息获取