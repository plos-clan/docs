# DoglinkOS-2nd 系统调用文档

`DoglinkOS-2nd` 使用传统的 `int $0x80` 方式进行系统调用。系统调用号通过 `rax` 寄存器传递。

## 系统调用列表

`NUM_SYSCALLS` 目前为 `17`。

### sys_test (0)

参数：无

返回值：`none`

由内核输出 `test syscall`。

### sys_write (1)

参数：3 个

`rdi` `fd` 目标文件描述符

`rsi` `buf` 指向要写入的内容的指针

`rcx` `len` 内容长度

返回值：`none`

### sys_fork (2)

参数：无

返回值（`rcx`）：在原进程返回新进程 `pid`，在新进程返回 `0`。

### sys_exec (3)

参数：2 个

`rdi` `path` 指向目标程序路径的指针

`rcx` `len` 路径长度

返回值：`noreturn | none`

### sys_exit (4)

参数：无

返回值：`noreturn`

### sys_read (5)

参数：无

返回值（`rcx`）：读取到的值（`0xff` 表示输入缓冲区空）

从标准输入读取一个字节。

### sys_setfsbase (6)

参数：1 个

`rdi` `fs_base` 要设置的值

返回值：`none`

设置 `IA32_FS_BASE MSR`。

### sys_brk (7)

参数：1 个

`rdi` `brk` 要设置的值（不设置时为 0）

返回值（`rsi`）：原来的值

设置及获取 `brk` 值。

### sys_waitpid (8)

参数：1 个

`rdi` `pid` 目标进程

返回值：`none`

阻塞当前进程，等待目标进程结束

### sys_getpid (9)

参数：无

返回值（`rcx`）：当前进程 `pid`

### sys_getticks (10)

参数：无

返回值（`rcx`）：内核时钟刻数

### sys_info (11)

参数：1 个

`rdi` `type` 要查询的信息类型。

```c
#define INFO_CONSOLE_COLS 0
#define INFO_CONSOLE_ROWS 1
#define INFO_PID 2
#define INFO_TICKS 3
#define INFO_CONSOLE_ECHO_OFF 4
#define INFO_CONSOLE_ECHO_ON 5
#define INFO_FRAMEBUFFER_WIDTH 6
#define INFO_FRAMEBUFFER_HEIGHT 7
#define INFO_FRAMEBUFFER_ADDR 8
#define INFO_FRAMEBUFFER_PITCH 9
```

返回值（`rcx`）：查询结果（`INFO_CONSOLE_ECHO_OFF` 和 `INFO_CONSOLE_ECHO_ON` 为仅设置，返回 0）

### sys_open (12)

参数：3 个

`rdi` `path` 指向目标文件路径的指针

`rcx` `len` 路径长度

`r10` `do_create` 非零表示如果不存在则创建，否则不存在会返回错误

返回值（`rsi`）：文件描述符，如果出错则返回 `u64::MAX`

### sys_read2 (13)

参数：3 个

`rsi` `fd` 目标文件描述符

`rdi` `buf` 内容缓冲区

`rcx` `len` 缓冲区长度

返回值：`none`

### sys_seek (14)

参数：3 个

`rsi` `fd` 目标文件描述符

`rdi` `from`

```c
#define SEEK_CUR 0
#define SEEK_END 1
#define SEEK_SET 2
```

`rcx` `offset` 偏移

返回值（`r10`）：新的绝对位置

### sys_close (15)

参数：1个

`rsi` `fd` 目标文件描述符

返回值：`none`

### sys_remove (16)

参数：2个

`rdi` `path` 指向目标文件路径的指针

`rcx` `len` 路径长度

返回值：`none`
