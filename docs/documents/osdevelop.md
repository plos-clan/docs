# 自制OS教程#1 : 步入bootloader的大门

~~这里什么也没有~~<br>

什么，你问我怎么写引导？<br>
手写MBR？<br>
借助GNU-EFI或者EDK2这样的强大工具编写UEFI引导？<br>
或者是GRUB？<br>
今天让我帮你脱离苦海😋<br>
LIMINE！永远真神！<br>
放弃困难，选择limine！<br>
阿门！<br>

这里有limine的介绍，感兴趣的可以看看:[limine explain](https://github.com/limine-bootloader/limine)<br>

~~首先，在你自己的os源码文件夹下面从github拉取limine~~<br>
你可以用我们社区提供的**[Limine C Xmake Template](https://github.com/plos-clan/limine-xmake-template)**引导模板即可<br>

直接像这样操作:<br>
```bash
git clone https://github.com/plos-clan/limine-xmake-template.git
```

你可能会问：什么，如此简单？<br>
是的是的你说的对，确实如此简单<br>

接下来要干什么？<br>
~~特么仓库readme.md不看么~~<br>
嗯，你就可以在src/main.c开始你的旅程辣！<br>

编译指令：在工作目录下面输入：
```bash
xmake
```
编译源码即可<br>

是的你没有看错，是[xmake](https://xmake.io/guide/quick-start.html)，不是煞笔一般的cmake或者make。<br>
不需要你写一大坨的CMakelist, 不需要你一个一个文件夹写Makefile, 一个xmake.lua足矣。<br>

没了？<br>
是的，bootloader就这样结束了，一个limine就搞定，简单，便利，没有繁杂的所谓“把boot.bin写到0号扇区，前512个字节我们要切到保护模式，lba读盘，找到loader.bin，切换长模式，VBE，预备页表···”， “使用UEFI提供的Protocol获取acpi表，得到内核地址并解析elf文件，重定位，获取graphic frame，拿到efi memory map”之类的东西。
如果我们要用到一些启动时的信息，比如memory map，我们只需要在源文件里面这样做：
```c
__attribute__( ( used, section( ".requests" ) ) ) volatile limine_memmap_request memmap_request = {
    .id = LIMINE_MEMMAP_REQUEST,
    .revision = 3,
    .response = nullptr
};
```
其中，revision视情况而定，你使用的limine版本是多少就填多少。<br>
- 注意：第三代limine不默认映射0~4GB物理地址到HHDM，只映射部分，后期我们会讲到，这里先打个预防针


# 自制OS教程#2 : 串口，启动！
为啥要先写串口，你先别急，我后面会慢慢告诉你原因。<br>
串口的文章可以在osdev上找到：[serial_port](https://wiki.osdev.org/Serial_Port)<br>
在此之前，我们需要实现这么一些函数：in_8, out_8, in_16, out_16, in_32, out_32 <br>
这些函数是我们进行io操作的一个基础，当然以后学了dma，mmio之类的东西你会更能理解他们的作用了。<br>




