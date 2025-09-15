# NixOS 安装指南

这是一个一个一个会员制 NixOS 安装流程。

### 1. 准备工作

先把预制配置给 clone 下来：

```bash
cd /root
git clone https://github.com/wenxuanjun/nix-config
cd nix-config
```

### 2. 磁盘分区与格式化

> 如果已经有分区，可跳过分区和格式化 `EFI` 分区。

使用 `cfdisk` 对目标磁盘进行分区：

*   **分区1**: `256M`，类型选择 `EFI System`
*   **分区2**: 剩余全部空间，类型为 `（默认）Linux filesystem`

记得根据实际情况调整设备名（如 `/dev/nvme0n1`）。

```bash
cfdisk /dev/nvme0n1
```

然后格式化它们：

```bash
# 格式化 EFI 分区
mkfs.vfat -F 32 /dev/nvme0n1p1

# 格式化根分区为 btrfs
mkfs.btrfs -f /dev/nvme0n1p2
```

### 3. 创建 Btrfs 子卷并挂载

首先为根目录、家目录和 nix store 创建独立的 btrfs 子卷：

```bash
# 挂载 btrfs 根卷以创建子卷
mount /dev/nvme0n1p2 /mnt

# 创建子卷
btrfs subvolume create /mnt/@root
btrfs subvolume create /mnt/@home
btrfs subvolume create /mnt/@nix

# 完成后卸载
umount /mnt
```

然后将所有分区和子卷挂载到正确的位置：

```bash
# 挂载临时根目录
mount -t tmpfs none /mnt

# 创建挂载点
mkdir -p /mnt/{boot,nix,persist}

# 挂载 btrfs 子卷
mount -o subvol=@root,compress=zstd /dev/nvme0n1p2 /mnt/persist
mkdir -p /mnt/persist/home
mount -o subvol=@home,compress=zstd /dev/nvme0n1p2 /mnt/persist/home
mount -o subvol=@nix,compress=zstd,noatime /dev/nvme0n1p2 /mnt/nix

# 挂载 EFI 分区
mount /dev/nvme0n1p1 /mnt/boot
```

### 4. 自定义配置

配置过程主要包括更新硬件UUID、设置用户密码和用户名。

**a. 更新硬件配置**

首先，获取分区的 `UUID`，然后将其填入硬件配置文件。

```bash
blkid
```

使用 `vim` 或其他编辑器打开 `hosts/nixos/hardware.nix`，将上面命令输出的 EFI 分区和根分区的 `UUID` 填入文件中对应位置。

```bash
vim hosts/nixos/hardware.nix
```

其中 EFI 的 `UUID` 要修改一处，根分区的 `UUID` 要修改三处。

**b. 设置用户密码**

为你的用户创建一个加密密码。**请将 `wendster` 和 `"123456"` 替换为你的用户名和密码**。

```bash
mkdir /mnt/persist/secrets
mkpasswd -m sha-512 "123456" > /mnt/persist/secrets/wendster
```

**c. 修改用户名**

在三个核心配置文件中，将默认用户名 `wendster` 全部替换为你的用户名。

```bash
# 末尾的 users.wendster
vim flake.nix

# 开头的 username 和 homeDirectory
vim home/default.nix

# 中间的 users.users.wendster
vim hosts/nixos/default.nix
```

**d. 禁用不需要的配置**

编辑 `flake.nix`，注释掉你不需要的配置。

```bash
vim flake.nix
```

譬如，如果你没有 NVIDIA 显卡，可以将 `modules` 里的 `./modules/nvidia.nix` 注释掉。

### 5. 安装并重启

所有配置完成后，执行 NixOS 安装命令。

```bash
nixos-install --flake .#nixos
```

这个命令最后会让你设置 `root` 用户密码。可以随便输，因为不会保存 `/etc/shadow`。

完成后直接重启即可：

```bash
reboot
```
