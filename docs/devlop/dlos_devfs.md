# DoglinkOS-2nd `/dev` 文件系统文档

## 概览

`/dev` 用于提供系统中的设备文件。

当前包含这些固定节点：

- `initrd`
- `stdout`
- `stderr`
- `tty`
- `serial`
- `cmdline`
- `pcspk`
- `power`

此外还会动态生成块设备节点：

- `disk<x>`：第 `x` 个 AHCI 设备，`x` 从 `0` 开始。
- `nvme<x>-<y>`：第 `x` 个 NVMe 控制器的第 `y` 个 namespace，`x` 和 `y` 都从 `0` 开始。

## 设备节点

## `/dev/disk<x>`

第 `x` 个 AHCI 块设备。

- 支持 `read`
- 支持 `write`
- 支持 `seek`

## `/dev/nvme<x>-<y>`

第 `x` 个 NVMe 设备的第 `y` 个 namespace。

- 支持 `read`
- 支持 `write`
- 支持 `seek`

## `/dev/initrd`

初始内存盘设备。

- 支持 `read`
- 支持 `write`
- 支持 `seek`

## `/dev/stdout`

标准输出设备。

- 支持 `write`

## `/dev/stderr`

标准错误输出设备。

- 支持 `write`

## `/dev/tty`

终端设备。`/dev/terminal` 也可作为同一设备的访问路径。

- 支持 `read`
- 支持 `write`

## `/dev/serial`

串口设备。

- 支持 `read`
- 支持 `write`

## `/dev/cmdline`

内核启动命令行。

- 支持 `read`
- 支持 `seek`

## `/dev/pcspk`

PC Speaker 控制设备。

- 支持 `write`
- 写入整数频率可开始蜂鸣
- 写入 `stop` 可停止蜂鸣

## `/dev/power`

电源控制设备。

- 支持 `write`
- 写入 `poweroff` 可关机
- 写入 `reboot` 可重启
