# DoglinkOS-2nd

由 `Ruster` 使用 `Rust` 开发的仅用于UEFI平台的64位操作系统

![Static Badge](https://img.shields.io/badge/License-GPLv3-blue)

![Static Badge](https://img.shields.io/badge/star-4-8A2BE2)

* 最初是[DoglinkOS](https://github.com/wuyukai0403/DoglinkOS)，使用C语言和汇编bootloader
* 后来因为中断不工作，被放弃，于是有了现在使用 `Limine` 和 `Rust` 的二代
* 现在能运行[`pl_editor`](https://github.com/plos-clan/pl_editor/tree/6286bb2)和 `lua`。

## 已知问题

* `pl_editor` 版本号显示怪异。
* `lua` 中浮点数工作不正常（其实是C库里没实现）

## 构建、运行方法

**对于 `73d7b3a Version 1.2, partially support Rust std`（含）到 `f2095c3 make hello_std a binary asset`（不含）之间的递交，你需要编译安装[修改版的 `Rust` 工具链](https://github.com/Doglinkify/rust/tree/dlos)。**

你需要安装 `nightly` 版本的 `Rust` 工具链，以及 `qemu` 。

（克隆源码后在源码根目录运行）

仅构建请用 `cargo run --release` 。（没错是run）

构建并运行请用 `cargo run --release -- --boot` 。

## 贡献者

* `Ruster/wuyukai0403` OS~~唯一~~开发者
* `Liminer/Ver/wenxuanjun` 提供builder
* `XIAOYI12` 真机测试反馈bug
* `shc2012` 在 `apps-ext` 写了一堆还用不了的东西
