# DoglinkOS-2nd

由 `Ruster` 使用 `Rust` 开发的仅用于UEFI平台的64位操作系统

![Static Badge](https://img.shields.io/badge/License-GPLv3-blue) 
![Static Badge](https://img.shields.io/badge/star-0-8A2BE2)

* 最初是[DoglinkOS](https://github.com/wuyukai0403/DoglinkOS)，使用C语言和汇编bootloader
* 后来因为中断不工作，被放弃，于是有了现在使用 `Limine` 和 `Rust` 的二代
* ~~ 啥也干不了 ~~

## 已知问题

* 键盘中断在多核平台不工作
* 编译Warning过多
* ~~ `Ruster` 纯度不够 ~~

## 构建、运行方法

你需要安装 `nightly` 版本的 `Rust` 工具链，以及 `qemu` 。

（克隆源码后在源码根目录运行）

仅构建请用 `cargo run` 。（没错是run）

构建并运行请用 `cargo run -- --boot` 。

## 贡献者

* `Ruster/wuyukai0403` OS~~ 唯一 ~~开发者
* `Liminer/Ver/wenxuanjun` 提供builder
