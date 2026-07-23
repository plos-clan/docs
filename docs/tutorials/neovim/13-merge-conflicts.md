# 13｜合并冲突——理解 ours 与 theirs

出现冲突并不表示 Git 出了问题，只是两个分支修改了同一处内容，Git 无法自动判断应该保留哪一边。本章会在两条练习分支上制造两处可控冲突，再用 Diffview 的三方界面逐块解决。

> [!IMPORTANT] 开始前先确认工作树干净
> 全程只碰 `README.md`。开始前务必保存所有文件，并确认 `git status --short` 没有输出。

## 本章核心新按键

| 按键 | 效果 |
| --- | --- |
| `]` `x` / `[` `x` | 下一个 / 上一个冲突区 |
| `Space` `c` `o` | 当前冲突选择 ours |
| `Space` `c` `t` | 当前冲突选择 theirs |
| `Space` `c` `b` | 当前冲突只保留共同祖先 base 内容 |
| `Space` `c` `a` | 按 ours → base → theirs 拼接当前冲突内容并删除标记 |
| `d` `x` | 删除整个当前冲突区 |

主练习只使用前四项中的 ours 与 theirs。其他按键先了解用途，不要求本章全部记住。

## 开始前检查

按 `F1` → `wall` →`Enter` → `Enter`，打开终端运行：

```console
git status --short
git branch --show-current
git config --local merge.conflictStyle diff3
git config --local --get merge.conflictStyle
```

![确认干净的 main 分支并启用 diff3](screenshots/13-01-clean-main-and-diff3.webp)

第一条应没有输出。第二条会告诉你当前基线分支叫什么，可能是 `main`、`master` 或别的名字。本练习会从它分出两条教学分支，原基线不会被改写。最后一条应输出 `diff3`，表示本仓库会把共同祖先内容也写进冲突标记。这项设置只作用于当前练习仓库。

## 工作流一：制作 ours 版本

在终端运行：

```console
git switch -c tutorial-ours
```

![创建并切换到 tutorial-ours](screenshots/13-02-tutorial-ours-branch-created.webp)

隐藏终端，打开 `README.md`。

![README 中两处共同祖先文本](screenshots/13-03-readme-common-base.webp)

搜索描述行：

```text
/A tiny
Enter
```

按 `c` `c`，输入：

```text
A tiny task tracker for focused terminal sessions.
```

按 `Esc`。

![ours 分支完成描述行修改](screenshots/13-04-ours-description-edited.webp)

再搜索 Quick start 的命令行：

```text
/Run
Enter
```

按 `c` `c`，输入：

```text
Run the CLI with `PYTHONPATH=src python -m pocket_tasks.cli`.
```

按 `Esc`，保存文件。打开终端运行：

![ours 分支的两处 README 修改](screenshots/13-05-ours-readme-complete.webp)

```console
git add README.md
git commit -m "describe a focused workflow"
```

![提交 tutorial-ours 的文案修改](screenshots/13-06-ours-commit-created.webp)

现在 `tutorial-ours` 比共同基线多了一个提交。

## 工作流二：从共同基线制作 theirs 版本

终端运行：

```console
git switch -c tutorial-theirs HEAD~1
```

![从共同基线创建 tutorial-theirs](screenshots/13-07-tutorial-theirs-from-common-base.webp)

这条命令从 ours 提交的父提交创建新分支，因此两边拥有同一个共同祖先。

切换分支会改写磁盘文件。回到 README 后，如果屏幕仍显示上一分支的句子：

1. 按 `F1`。
2. 输入 `edit`。
3. 连按两次 `Enter`，重新读取磁盘版本。

![重新读取 tutorial-theirs 的共同基线 README](screenshots/13-08-theirs-readme-reloaded-from-base.webp)

将同两行改成另一套文案。

描述行：

```text
A friendly task tracker for terminal-loving humans.
```

![theirs 分支完成描述行修改](screenshots/13-09-theirs-description-edited.webp)

Quick start 行：

```text
Start it with `PYTHONPATH=src python -m pocket_tasks.cli`.
```

![theirs 分支的两处 README 修改](screenshots/13-10-theirs-readme-complete.webp)

保存，终端运行：

```console
git add README.md
git commit -m "describe a friendly workflow"
```

![提交 tutorial-theirs 的文案修改](screenshots/13-11-theirs-commit-created.webp)

现在两条分支分别修改了相同的两行，因此合并时会产生冲突。

![两条教学分支从共同提交分叉](screenshots/13-12-diverged-branch-history.webp)

## 工作流三：制造冲突

终端运行：

```console
git switch tutorial-ours
git merge tutorial-theirs
```

![合并暂停并报告 README 内容冲突](screenshots/13-13-merge-conflict-reported.webp)

Git 应该会报告 `README.md` 存在 content conflict，并暂停合并。这正是本章需要的练习状态。

隐藏终端。如果 README 仍显示切换前的内容，执行一次 `F1` → `edit` → `Enter` → `Enter`。

此时直接打开文件会看到类似标记：

![README 中的两处 diff3 冲突标记](screenshots/13-14-first-diff3-conflict-markers.webp)

```text
<<<<<<< HEAD
A tiny task tracker for focused terminal sessions.
||||||| 共同祖先提交
A tiny task tracker for terminal-loving humans.
=======
A friendly task tracker for terminal-loving humans.
>>>>>>> tutorial-theirs
```

![Quick start 行的 diff3 冲突标记](screenshots/13-15-second-diff3-conflict-markers.webp)

也可以手工删除冲突标记，但本节使用 Diffview 三方界面，以便直接比较各版本内容。

### 为什么练习启用 diff3

中间以 `|||||||` 开头的段落就是 BASE，也就是两个分支修改前的共同祖先。Diffview 的 `b` 与 `a` 操作会读取 LOCAL 文件中的这段冲突标记：

- 有 BASE 时，`Space` `c` `b` 会只留下共同祖先内容；
- 有 BASE 时，`Space` `c` `a` 会按 ours → base → theirs 的顺序拼接三段内容，再删除标记；
- 缺少 BASE 标记时，`b` 会把 BASE 当作空内容，当前冲突可能被清空；
- 缺少 BASE 标记时，`a` 会拼接现有的 ours 与 theirs；
- BASE 标记存在、段落内容恰好为空时，`b` 得到的结果同样为空。

大写 `B` 与 `A` 会把相应操作应用到当前文件的所有冲突，因此影响范围更大。在真实项目中使用 `b/B` 或 `a/A` 前，先确认 LOCAL 中确实存在 `|||||||` BASE 标记。

## 工作流四：在三方界面逐块解决

按：

`Space` `g` `s`

Diffview 发现未合并文件后会启用 merge tool。默认 `diff3_horizontal` 布局把三个版本横向排开：

```text
┌──────── OURS ────────┬──────── LOCAL ────────┬─────── THEIRS ───────┐
│ 当前分支版本         │ 磁盘上的合并结果       │ 传入分支版本          │
│ A                    │ B，可编辑              │ C                     │
└──────────────────────┴────────────────────────┴───────────────────────┘
```

![Diffview 识别 README 的两处合并冲突](screenshots/13-16-diffview-merge-overview.webp)

- OURS 是当前分支 `tutorial-ours`；
- THEIRS 是正在合入的 `tutorial-theirs`；
- LOCAL 是最终要保存并暂存的工作文件；
- BASE 是两边共同祖先，默认三窗布局没有单独展示它，但选择键仍可取用。

用 `Ctrl-w` 加 `h`/`l` 移到标题含 LOCAL 的中间窗口。

### 第一处冲突选 ours

1. 按 `g` `g` 到顶部。
2. 按 `]` `x` 跳到第一处冲突。
3. 确认三窗显示的是 README 描述行。

![在三方界面比较第一处冲突](screenshots/13-17-first-conflict-three-versions.webp)

4. 按 `Space` `c` `o`。

LOCAL 中这一块应变成：

```text
A tiny task tracker for focused terminal sessions.
```

![第一处冲突在 LOCAL 中采用 ours](screenshots/13-18-first-conflict-ours-applied.webp)

冲突标记随之消失。

### 第二处冲突选 theirs

1. 再按 `]` `x`。
2. 光标来到 Quick start 行的冲突。

![在三方界面比较第二处冲突](screenshots/13-19-second-conflict-three-versions.webp)

3. 按 `Space` `c` `t`。

LOCAL 中这一块应变成：

```text
Start it with `PYTHONPATH=src python -m pocket_tasks.cli`.
```

![第二处冲突在 LOCAL 中采用 theirs](screenshots/13-20-second-conflict-theirs-applied.webp)

最终结果分别采用了两个分支中的一处修改，README 的两处冲突都已经解决。

![README 已解决但仍等待暂存](screenshots/13-21-resolved-local-before-staging.webp)

### 另外三种选择何时有用

| 按键 | 适合的情况 |
| --- | --- |
| `Space` `c` `b` | 两边的修改都不合适，先恢复共同祖先内容再重写 |
| `Space` `c` `a` | 按 ours → base → theirs 拼接后，再手工去重与整理 |
| `d` `x` | 整块内容都应删除 |

这三项会直接修改 LOCAL。拿不准时先阅读三窗，再动手。

## 保存、暂存、完成合并

确认焦点位于 LOCAL 窗口，然后：

1. 按 `F1`。
2. 输入 `write`。

![在 F1 Picker 中选择 write 保存 LOCAL](screenshots/13-22-write-resolved-local-picker.webp)

3. 连按两次 `Enter`。
4. 按 `Space` `e` 聚焦 Diffview 文件面板。
5. 把光标放在 `README.md` 上，按小写 `s` 暂存整份已解决文件。

![已解决的 README 进入 Staged changes](screenshots/13-23-resolved-readme-staged.webp)

6. 按 `F1` → `DiffviewClose` →`Enter` → `Enter`。

![在 F1 Picker 中选择 DiffviewClose](screenshots/13-24-diffview-close-after-resolution.webp)

打开终端运行：

```console
git status
git diff --cached --check
PYTHONPATH=src python -m unittest -v
```

![冲突已解决且合并仍在进行](screenshots/13-25-merge-resolved-status.webp)

Git 应提示冲突已经解决、合并仍在进行。测试通过后完成合并提交：

![合并提交前完整测试套件通过](screenshots/13-26-merge-test-suite-passes.webp)

```console
git commit -m "merge tutorial conflict branches"
git status --short
```

![创建合并提交后工作树干净](screenshots/13-27-merge-commit-created-clean.webp)

最后一条应没有输出。当前分支仍是 `tutorial-ours`，并包含一个合并提交。

真实项目中也可在暂存完成后运行 `git merge --continue`。Git 若打开提交信息编辑器，确认信息后保存退出即可。

::: details 重新开始冲突练习

只要合并提交还没创建，就可以关闭 Diffview，在终端运行：

```console
git merge --abort
```

工作树会恢复到合并开始前的 `tutorial-ours`。随后再次执行 `git merge tutorial-theirs`，即可重新生成冲突。

:::

::: details 高风险：单次应用全部

下面这些映射会一次处理当前文件里的全部冲突：

> [!CAUTION] 大写映射会处理整份文件
> 大小写只差一个 Shift，但影响范围会从当前冲突扩大到整个文件。优先使用小写逐块处理；只有确认所有冲突都采用同一策略时，才考虑大写版本。

| 按键 | 效果 |
| --- | --- |
| `Space` `c` `O` | 全文件选择 ours |
| `Space` `c` `T` | 全文件选择 theirs |
| `Space` `c` `B` | 每处冲突都只保留共同祖先 base 内容 |
| `Space` `c` `A` | 每处冲突都按 ours → base → theirs 拼接并删除标记 |
| `d` `X` | 删除全文件的全部冲突区 |

:::

## rebase 中 ours 与 theirs 的含义

普通 merge 中：

- ours 通常是当前所在的分支；
- theirs 通常是正在合入的分支。

rebase 会把提交逐个应用到目标分支上。此时 Git 所说的 ours 往往是 rebase 目标分支的状态，theirs 则往往是当前正在应用的提交，这与普通 merge 时的直觉可能相反。

所以遇到 rebase 冲突时：

1. 先读 Diffview 窗口标题；
2. 再看两边具体内容；
3. 确认版本身份后才按 `Space` `c` `o` 或 `Space` `c` `t`。

> [!WARNING] rebase 中不要凭 ours/theirs 的名称判断版本
> 不要只根据 ours/theirs 的名称判断版本身份，应先阅读窗口标题和实际内容。

## 冲突处理固定流程

以后可以按下面的固定流程处理：

1. 终端执行 merge 或 rebase。
2. 保存其他工作，按 `Space` `g` `s`。
3. `]` `x` 逐块跳。
4. 每块选 ours、theirs、base、all，或手工编辑 LOCAL。
5. 保存 LOCAL。
6. 文件面板按 `s` 暂存已解决文件。
7. 关闭 Diffview。
8. 跑测试和 `git diff --cached --check`。
9. 终端完成 merge 或 rebase。

下一章进入 [14：会话与日常工作流](14-sessions-and-daily-workflow.md)。我们会把编辑、LSP、测试、Git 审查、会话保存和恢复串成完整的日常开发流程。
