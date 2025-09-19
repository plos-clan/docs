# NixOS 安装指南

这是一个一个一个会员制 NixOS 安装教程。

> [!IMPORTANT]  
> 虚拟机或物理机需要有 16GiB 以上存储以及 4GiB 以上内存或在安装前启用 zram/swap，否则可能安装失败（譬如只给 1GiB 内存会在 `evaluate` 阶段卡死）！

### 1. 准备工作

先把预制配置给拉下来：

```bash
cd /root
git clone https://github.com/wenxuanjun/nix-config
cd nix-config
```

### 2. 磁盘分区与格式化

> 如果已经分好区（如双系统），可跳过分区和格式化 `EFI` 分区。

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

# 格式化根分区为 btrfs（记得检查确认是这个分区！）
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
mount -o subvol=@root,compress-force=zstd /dev/nvme0n1p2 /mnt/persist
mkdir -p /mnt/persist/home
mount -o subvol=@home,compress-force=zstd /dev/nvme0n1p2 /mnt/persist/home
mount -o subvol=@nix,compress-force=zstd,noatime /dev/nvme0n1p2 /mnt/nix

# 挂载 EFI 分区
mount /dev/nvme0n1p1 /mnt/boot
```

> [!NOTE]
> **关于 Btrfs 压缩的说明**
>
> *   **`compress-force=zstd`**: 我们使用 `compress-force` 而不是 `compress`。前者会将所有数据都尝试让 Zstd 算法自己判断是否可压缩，这通常比内核的快速启发式检查（`compress`）能获得更高的压缩率。
> *   **更高压缩等级**: 如果您的磁盘空间非常有限，可以指定一个更高的压缩等级，例如 `compress-force=zstd:7`。可选范围是 -15 (快) 到 15 (慢，高压缩率)，默认是 `3`。

### 4. 自定义配置

配置过程主要包括更新硬件UUID、设置用户密码和用户名。

**a. 更新硬件配置**

首先，获取分区的 `UUID`，然后将其填入硬件配置文件：

```bash
blkid
```

使用 `vim` 或其他编辑器打开 `hosts/nixos/hardware.nix`，将上面命令输出的 EFI 分区和根分区的 `UUID` 填入文件中对应位置：

```bash
vim hosts/nixos/hardware.nix
```

> EFI 分区的 `UUID` 长得像 `A1B2-C3D4`，根分区的 `UUID` 长得像 `a1b2c3d4-e5f6-g7h8-1145-1919810abcde`~~（别问为啥写这个因为真有人不会看）~~。

其中 EFI 的 `UUID` 要修改一处，根分区的 `UUID` 要修改三处。

**b. 设置用户密码**

为你的用户创建一个加密密码。**记得把 `wendster` 和 `123456` 替换成你的用户名和密码**。

```bash
mkdir /mnt/persist/secrets
mkpasswd -m sha-512 "123456" > /mnt/persist/secrets/wendster
```

**c. 修改用户名**

把这三个配置文件中的默认用户名 `wendster` 全部替换为你的：

```bash
# 末尾的 users.wendster
vim flake.nix

# 开头的 username 和 homeDirectory
vim home/default.nix

# 中间的 users.users.wendster
vim hosts/nixos/default.nix
```

**d. 禁用不需要的配置**

编辑 `flake.nix`，注释或删掉你不需要的配置：

```bash
vim flake.nix
```

譬如，如果没有 NVIDIA 显卡，可以将 `modules` 里的 `./modules/nvidia.nix` 干掉。

**e. 保存配置（可选）**

记得把改好的配置文件保存下来：

```bash
cp -r /root/nix-config /mnt/persist/
```

可以在登录新系统后，再剪切到家目录或其他任何你喜欢的地方。

### 5. 安装并重启

所有配置完成后，执行 NixOS 安装命令：

```bash
nixos-install --flake .#nixos
```

这个命令最后会让你设置 `root` 用户密码。可以随便设置，因为 `/etc/shadow` 不会被保存。

完成后直接重启即可：

```bash
reboot
```
