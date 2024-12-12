# CoolPotOS 应用程序开发文档

适用于 `CP_Kernel` 衍生操作系统的应用程序API开发文档

> 该文档适用于 `CoolPotOS` `MdrOS` 操作系统的应用程序开发

> 注意: 旧版的CPOS应用程序不适用于该文档, 我们也不建议您开发旧版CP_Kenrel的程序

## 环境搭建

* [**SDK仓库**](https://github.com/Mdr-C-Tutorial/MdrSDK)

在开发应用程序之前, 您需要clone`Mdr-C-Tutorial/MdrSDK`存储库.

* MdrSDK 要求您在Linux环境下拥有 `xmake` `zig_cc` `nasm` 三个工具
> 当然如果你能在Windows下配置好zig cc和nasm也是可以的


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
* 将 `app.elf` 放入ISO映像内,并用虚拟机启动操作系统
> 如果您有丰富的经验的话，找一个废弃的x86 PC实体机也是可以测试的

* 在shell中输入 `/app.elf` 按下回车即可看到您程序的运行结果
> 在CoolPotOS `a23c7b2` 之后的递交, shell支持您简写应用程序名称来运行 \
> 如 `app` `app.elf` `/app` 

## 开发接口

你可以注意到在SDK项目中有一个名为 `lib` 的目录, 其内部即实现了适用于 `CP_Kernel` 的C标准库与POSIX规范库实现. 非必要情况下我们不建议你修改该目录下的源码

> 除非您有更好的方式实现或者发现了其中某些潜在错误并修复

* 在新版 `CP_Kernel` 中去除了CPOS私有接口
* 新版与旧版的 `CP_Kernel syscall` 调用号不完全相同, 因此两者的应用程序兼容性很差
