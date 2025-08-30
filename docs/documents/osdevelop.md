# 自制OS教程#0 : 预备

archlinux: gcc(clang) nasm

# 自制OS教程#1 : 步入bootloader的大门

~~这里什么也没有~~<br>

什么，你问我怎么写引导?<br>
手写MBR?<br>
借助GNU-EFI或者EDK2这样的强大工具编写UEFI引导?<br>
或者是GRUB?<br>
今天让我帮你脱离苦海😋<br>
LIMINE!永远真神!<br>
放弃困难，选择limine!<br>
阿门!<br>

这里有limine的介绍，感兴趣的可以看看:[limine explain](https://github.com/limine-bootloader/limine)<br>

~~首先，在你自己的os源码文件夹下面从github拉取limine~~<br>
你可以用我们社区提供的[Limine C Xmake Template](https://github.com/plos-clan/limine-xmake-template)引导模板即可<br>

直接像这样操作:<br>
```bash
git clone https://github.com/plos-clan/limine-xmake-template.git
```

你可能会问: 什么,如此简单?<br>
是的是的你说的对,确实如此简单<br>

接下来要干什么?<br>
~~特么仓库readme.md不看么~~<br>
嗯，你就可以在src/main.c开始你的旅程辣!<br>

编译指令：在工作目录下面输入: 
```bash
xmake
```
编译源码即可<br>

是的你没有看错, 是[xmake](https://xmake.io/guide/quick-start.html), 不是煞笔一般的cmake或者make.<br>
不需要你写一大坨的CMakelist, 不需要你一个一个文件夹写Makefile, 一个xmake.lua足矣.<br>

没了?<br>
是的，bootloader就这样结束了,一个limine就搞定, 简单, 便利, 没有繁杂的所谓"把boot.bin写到0号扇区, 前512个字节我们要切到保护模式, lba读盘, 找到loader.bin, 切换长模式, VBE, 预备页表···","使用UEFI提供的Protocol获取acpi表, 得到内核地址并解析elf文件,重定位,获取graphic frame, 拿到efi memory map"之类的东西.
如果我们要用到一些启动时的信息, 比如memory map, 我们只需要在源文件里面这样做:
```c
__attribute__( ( used, section( ".requests" ) ) ) volatile limine_memmap_request memmap_request = {
    .id = LIMINE_MEMMAP_REQUEST,
    .revision = 3,
    .response = nullptr
};
```
其中,revision视情况而定, 你使用的limine版本是多少就填多少.<br>
- 注意: 第三代limine不默认映射0~4GB物理地址到HHDM, 只映射部分, 后期我们会讲到, 这里先打个预防针


# 自制OS教程#2 : 串口, 启动!
为啥要先写串口,你先别急,我后面会慢慢告诉你原因.<br>
串口的文章可以在osdev上找到: [serial_port](https://wiki.osdev.org/Serial_Ports)<br>
在此之前, 我们需要实现这么一些函数:io_in8, io_out8, io_in16, io_out16, io_in32, io_out32 <br>
这些函数是我们进行io操作的一个基础, 当然以后学了dma, mmio之类的东西你会更能理解他们的作用了.<br>
C版本
```c
static inline uint8_t io_in8(uint16_t port) {
    uint8_t data;
    __asm__ volatile("inb %w1, %b0" : "=a"(data) : "Nd"(port));
    return data;
}

static inline uint16_t io_in16(uint16_t port) {
    uint16_t data;
    __asm__ volatile("inw %w1, %w0" : "=a"(data) : "Nd"(port));
    return data;
}

static inline uint32_t io_in32(uint16_t port) {
    uint32_t data;
    __asm__ volatile("inl %1, %0" : "=a"(data) : "Nd"(port));
    return data;
}

static inline void io_out8(uint16_t port, uint8_t data) {
    __asm__ volatile("outb %b0, %w1" : : "a"(data), "Nd"(port));
}

static inline void io_out16(uint16_t port, uint16_t data) {
    __asm__ volatile("outw %w0, %w1" : : "a"(data), "Nd"(port));
}

static inline void io_out32(uint16_t port, uint32_t data) {
    __asm__ volatile("outl %0, %1" : : "a"(data), "Nd"(port));
}
```
C++版本可以看这里：[io.hpp](https://github.com/SegmentationFaultCD/QuantumNEC/blob/limine/include/kernel/driver/cpu/io.hpp)以及[io.cpp](https://github.com/SegmentationFaultCD/QuantumNEC/blob/limine/source/kernel/driver/cpu/io.cpp)<br>

- uint32_t这些都是一些标量的typedef, 你include一下stdint.h就行了

接着按照osdev教的办法初始化串口, 如下(感觉我都没必要贴代码)
```c
#define PORT 0x3f8

static int support_serial_ports;

static int init_serial() {
   io_out8(PORT + 1, 0x00);    
   io_out8(PORT + 3, 0x80);   
   io_out8(PORT + 0, 0x03);   
   io_out8(PORT + 1, 0x00);    
   io_out8(PORT + 3, 0x03);  
   io_out8(PORT + 2, 0xC7);    
   io_out8(PORT + 4, 0x0B); 
   io_out8(PORT + 4, 0x1E);    
   io_out8(PORT + 0, 0xAE);  
    if ( IO::in8( PORT + 0 ) != 0xAE ) {
        support_serial_port = 0;
    }
    else {
        io_out8( PORT + 4, 0x0F );
        support_serial_port = 1;
    }


   return 0;
}

// 读操作
char read_serial(void) {
    if ( support_serial_port ) {
        while ( io_in8( PORT + 5 ) & 1 );
        return io_in8( PORT );
    }
    return '\0';
}
// 写操作
void write_serial(char ch) {
    if ( support_serial_port ) {
        while ( !( io_in8( PORT + 5 ) & 0x20 ) );
        io_out8( PORT, ch );
    }
    return;
}
void print(const char* str) {
    for (uint64_t i = 0 ; str[i] != '\0; ++i) {
        write_serial(str[i]);
    }
}
```
到目前为止, 一切正常的话, 我们就已经写好了串口, 你可以测试一下看看com端口是否有输出.<br>
在xmake.lua的qemu的flags中添加入`-serial chardev:com1 -chardev stdio,mux=on,id=com1`指令即可<br>
倘若成功，请查看下一个教程😋
# 自制OS教程#3 : 中断描述符表!
遇事不决, 先走一遍文档, intel手册是我们写OS最大的助手<br>
intel官网提供了下载地址[intel](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)<br>
先把手册搞到手，手中才算是有了工具，我们才能进一步开发<br>
在`CHAPTER 6 INTERRUPT AND EXCEPTION HANDLING`这一节中, 对中断进行了详细的介绍, 有兴趣的可以读一读(强烈建议先读文档再写, 我们写操作系统就是为了了解底层原理, 什么?你问我为什么那么爱调库?孩子你先好好去看看操作系统考级的大纲吧)



# 自制OS教程#4 : 全局段描述符表,任务状态段
# 自制OS教程#5 : 页内存管理, limine崭露头角
# 自制OS教程#6 : 内核堆?你认真的?
# 自制OS教程#7 : 分页--万恶之源, 萌新杀手
# 自制OS教程#8 : 拨开云雾, 打印输出
[os-terminal](https://github.com/plos-clan/libos-terminal) -- 优秀的终端库, 你要做的就是把他的release版本下载下来。<br>
把terminal.h和任意一个编译好的.a文件下载并链接进内核(ld指令怎么用我就不教了,自己查[ld](https://www.ibm.com/docs/en/aix/7.2.0?topic=l-ld-command))<br>
这就是为什么我要你直接写串口驱动而不是像别的教程一样先自己写printk--我们不需要自己写显存, 我们只用现成的库.<br>
但是我们总是要调试的, 如果出现错误, 我们就可以通过串口输出, 而不用费时费力思考怎么写显存<br>
怎么用就按照人家文档教的操作吧<br>
剩下的就是我们要自己写一个vsprintf/format, 得到格式化字符串, 然后调用ost提供的打印函数即可.<br>
整个流程我们就封装成printk, 或者你爱叫什么就叫什么.<br>
C++版本: format可以用我写的: [libformat](https://github.com/plos-clan/libformat), 按照教程操作<br>
C版本: vsprintf可以看CPOS的实现: [vsprintf]()<br>
这个, 应该不用教了吧, 封装打印，一条龙服务啊<br>
# 自制OS教程#9 : 高级中断处理
# 自制OS教程#10 : SIMD浮点支持
# 自制OS教程#11 : 多核!
# 自制OS教程#12 : 任务调度, 难上加难, 噩梦死锁的处理方法
# 自制OS教程#13 : 系统调用
# 自制OS教程#14 : 内核架构, 微内核设计与进程间通信
# 自制OS教程#15 : 初见端倪--文件系统与模块化
# 自制OS教程#17 : 大彻大悟--VFS
# 自制OS教程#18 : 设备驱动
# 自制OS教程#19 : 异常处理再一游--写时复制与页面置换算法
# 自制OS教程#20 : POSIX接口探秘
