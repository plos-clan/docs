# DoglinkOS-2nd /dev 文件系统文档

## `/dev/disk<x>`

`x` 从 0 开始计数，第 `x` 块 AHCI 硬盘。

可 `read` / `write`（会导致 `kernel panic: unwrap()`） / `seek`。

## `/dev/nvme<x>-<y>`

`x` `y` 从 0 开始计数，第 `x` 个 NVMe 设备的第 `y` 个 namespace。

可 `read` / `write`（会导致 `kernel panic: unwrap()`） / `seek`。

## `/dev/initrd`

Initial ramdisk.

可 `read` / `write` / `seek`。

## `/dev/stdout`

`stdout` device.

可 `write`。

## `/dev/stderr`

`stderr` device.

可 `write`。

## `/dev/pcspk`

PC Speaker 控制。写入一个整数 `freq` 开始以该频率蜂鸣，写入 `stop` 停止。

可 `write`。

## `/dev/power`

电源控制。写入 `poweroff` 关机，写入 `reboot` 重启。

可 `write`。
