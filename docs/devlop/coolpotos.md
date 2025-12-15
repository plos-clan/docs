# CoolPotOS 应用程序开发文档

适用于 `CP_Kernel-i386` 衍生操作系统的应用程序 API 开发文档

> 该文档适用于 `CoolPotOS` `MdrOS` 操作系统的应用程序开发

> 注意：CoolPotOS x64 riscv64 等其他架构的应用程序拥有 Linux 兼容层，可以直接运行 LINUX 应用程序，无需使用开发 SDK.

## 环境搭建

* [**SDK 仓库**](https://github.com/Mdr-C-Tutorial/MdrSDK)

在开发应用程序之前，您需要 clone`Mdr-C-Tutorial/MdrSDK`存储库。

* MdrSDK 要求您在 Linux 环境下拥有 `xmake` `zig_cc` `nasm` 三个工具
> 当然如果你能在 Windows 下配置好 zig cc 和 nasm 也是可以的


## 第一个源文件

* `main.c`

```C 
#include <stdio.h>

int main(int argc,char** argv){
    printf("Hello! CoolPotOS!\n");
    return 0;
}
```

* 然后在控制台运行`xmake build`构建您的应用程序 \
  程序构建完成后您会在项目根目录中看到 `app.elf`, 该文件即您的程序本体
* 将 `app.elf` 放入 ISO 映像内，并用虚拟机启动操作系统
> 如果您有丰富的经验的话，找一个废弃的 x86 PC 实体机也是可以测试的

* 在 shell 中输入 `/app.elf` 按下回车即可看到您程序的运行结果
> 在 CoolPotOS `a23c7b2` 之后的递交，shell 支持您简写应用程序名称来运行 \
> 如 `app` `app.elf` `/app` 

## 开发接口

你可以注意到在 SDK 项目中有一个名为 `lib` 的目录，其内部即实现了适用于 `CP_Kernel` 的 C 标准库与 POSIX 规范库实现。非必要情况下我们不建议你修改该目录下的源码

> 除非您有更好的方式实现或者发现了其中某些潜在错误并修复

* 在新版 `CP_Kernel` 中去除了 CPOS 私有接口
* 新版与旧版的 `CP_Kernel syscall` 调用号不完全相同，因此两者的应用程序兼容性很差
