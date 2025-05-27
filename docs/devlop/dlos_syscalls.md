# DoglinkOS-2nd v1.1 系统调用文档

`DoglinkOS-2nd` 使用传统的 `int $0x80` 方式进行系统调用。系统调用号通过 `rax` 寄存器传递。

## 系统调用列表

`NUM_SYSCALLS` 目前为 `8`。

### sys_test (0)

参数：无

返回值：无

由内核输出 `test syscall`。

### sys_write (1)

参数：3个

`rdi` 表示目标文件描述符（0表示 `stderr`，1表示 `stdout`）

`rsi` 为指向要写入的内容的指针

`rcx` 为内容长度

返回值：无

写入文件。

### sys_fork (2)

参数：无

返回值（`rcx`）：在原进程返回新进程 `pid`，在新进程返回 `0`。

复制当前进程。

### sys_exec (3)

参数：2个

`rdi` 为指向目标程序路径的指针

`rcx` 为路径长度

返回值：`noreturn`

（谁都知道 `exec` 是干嘛的）

### sys_exit (4)

参数：无

返回值：`noreturn`

退出程序。

### sys_read (5)

参数：无

返回值（`rcx`）：读取到的值（`0xff` 表示暂时无内容）

### sys_setfsbase (6)

### sys_brk (7)
