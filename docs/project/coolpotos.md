# CoolPotOS

由 `XIAOYI12` 基于 `Multiboot1` 引导规范开发的适用于x86平台的32位宏内核操作系统

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
* XIAOYI12对OS的各种模块做了高度解耦, 所以将该系统的源码移植到您的项目非常容易
* CoolPotOS沿用了很多PlantOS的技术栈, 包括文件系统, 硬盘驱动接口, VFS

> 基于 `CP_Kernel` 的新一代衍生版本操作系统还有 `MdrOS`, 由梦猫大典团队维护 \
> [Mdr-C-Tutorial/MdrOS](https://github.com/Mdr-C-Tutorial/MdrOS)

## 贡献者

* `XIAOYI12/xiaoyi1212` OS主要开发者
* `min0911Y` OS文件系统部分开发
* `QtLittleXu/Xu Yuxuan` OS文档编写
* `copi143` 用户堆分配系统开发
* `VinbeWan` IIC驱动开发
* `ViudiraTech` Uinxed-Mark 性能测试软件
* `wenxuanjun` CPOS_Rust SDK 开发
* `A4-Tacks` CPOS 旧版多线程构建优化
* `Minsecrus` CP_Kernel 内存统计算法优化