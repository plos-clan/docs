# 14｜会话与最终挑战——完整日常开发流程

前面的章节把各种操作拆开练了一遍，这一章要把它们重新串成一套完整的日常开发流程：

> 明确进入项目 → 恢复布局 → 找需求位置 → 先写失败测试 → 实现 → 看诊断 → 跑测试 → 审查差异 → 暂存提交 → 保存会话 → 明天回来

最后再单独练一次会话恢复。做完这一章以后，你应该已经能用 Neovim 走完主要的开发流程；偶尔忘了按键，也知道该去哪个章节或速查表里找。

## 工作流一的新按键：保存和载入布局

| 按键 | 效果 |
| --- | --- |
| [[Space]] [[s]] [[c]] | 保存当前工作目录的会话 |
| [[Space]] [[s]] [[l]] | 打开会话选择器 |
| [[Space]] [[s]] [[l]] [[t]] | 载入最近会话 |
| [[Space]] [[s]] [[d]] | 选择并删除会话记录 |

![Space s 打开的会话快捷键提示](screenshots/14-30-session-keymap-help.webp)

[[Space]] [[s]] [[l]] 同时也是更长组合的前缀。只按到 [[l]] 后停止，选择器可能要等待大约 500 毫秒才会出现；要载入最近会话，应在等待超时前继续按 [[t]]。

## 会话会保存哪些内容

会话主要记录：

- 当前工作目录；
- 打开的普通文件 Buffer；
- Window 与 Tab 布局；
- 折叠等编辑现场；
- 项目再次载入时需要恢复的结构信息。

不过它有几条很重要的边界：

- 未保存的文字不会写进会话文件；
- Diffview 会在保存会话前自动关闭；
- Explorer、Quickfix、终端和部分插件临时 Buffer 可能在手动保存时被关闭；
- 会话载入后，配置会重新打开 Explorer；
- 终端中的 shell 进程和输出不会随会话恢复。

> [!CAUTION] 会话不能恢复未保存的文字
> 这里默认关掉了 swap、backup、writebackup 和持久 undo。编辑器或系统突然退出时，没写进磁盘的文字很难找回来。所以要经常保存，也要把 Git 提交切小一点。会话只记录布局，代替不了文件保存。

## 最终挑战的开始状态

确保项目有下面两个服务函数：

```python
def pending_count(tasks: list[Task]) -> int:
    return sum(not task.done for task in tasks)

def completed_count(tasks: list[Task]) -> int:
    return sum(task.done for task in tasks)
```

测试应该已经全部通过，Git 工作树也应该是干净的：

```console
PYTHONPATH=src python -m unittest -v
git status --short
```

![最终挑战开始前测试通过且工作树干净](screenshots/14-01-baseline-tests-and-clean-worktree.webp)

我们要增加 `task_summary`，输出：

```text
1 pending / 1 completed
```

## 工作流二：建立本次开发布局

### 1. 明确进入项目

从普通终端运行：

```console
cd ~/playground/pocket-tasks
nvim .
```

路径按你实际创建的位置调整。带上目录参数，可以避免它自动载入另一个项目的最近会话。

### 2. 打开测试与实现的双栏布局

刚用 `nvim .` 启动时，目标文件不一定已经进了 Buffer 列表。可以照下面这套固定步骤把布局打开：

1. 按 [[Space]] [[e]] 打开 Explorer。

![打开宽度为 30 的项目 Explorer](screenshots/14-02-project-explorer-opened.webp)

2. 展开 `tests/`，高亮 `test_service.py`，按 [[Enter]] 打开。

![从 Explorer 打开 test_service.py](screenshots/14-03-test-service-opened-from-explorer.webp)

3. 焦点进入测试代码后按 [[Space]] [[e]]，关闭当前 Tab 已有的 Explorer。
4. 按 [[Space]] [[/]]，输入 `def pending_count`。

![项目搜索定位 pending_count 定义](screenshots/14-04-pending-count-project-search.webp)

5. 高亮服务文件里的结果，按 [[Ctrl]]+[[v]]，把 `service.py` 竖向打开。

![测试与服务实现的竖向双栏布局](screenshots/14-05-test-and-service-vertical-layout.webp)

6. 用 [[Ctrl]]+[[w]] 加 [[h]]/[[l]] 在两栏间移动。

现在左栏是测试，右栏是实现。不过分屏方向可能会受当前布局影响，还是要看窗口里的文件名确认内容，别只认左右位置。

### 3. 保存一份布局快照

先按 [[F1]] → `wall` →[[Enter]] → [[Enter]]，再按：

![保存会话前在 F1 Picker 中选择 wall](screenshots/14-06-session-layout-saved.webp)

[[Space]] [[s]] [[c]]

你可能会看到 Explorer 或其他工具窗口被收起来，这是保存会话前清理临时 Buffer 的结果。普通文件和分屏布局都会记录下来。还想看文件树，再按 [[Space]] [[e]] 就好。

## 工作流三：完成一轮测试驱动开发

这一轮不再加新快捷键，专心把已经学过的动作串起来。

### 第一步：开功能分支

按 [[Ctrl]]+[[&#92;]] 打开终端，运行：

```console
git switch -c feature/task-summary
```

![创建 feature/task-summary 功能分支](screenshots/14-07-feature-task-summary-branch-created.webp)

隐藏终端。

### 第二步：先写失败测试

在 `tests/test_service.py` 的导入列表加入 `task_summary`：

```python
from pocket_tasks.service import (
    add_task,
    complete_task,
    completed_count,
    pending_count,
    task_summary,
    visible_titles,
)
```

![加入尚不存在的 task_summary 导入](screenshots/14-08-task-summary-import-diagnostic.webp)

在 `ServiceTests` 中加入：

```python
    def test_task_summary(self) -> None:
        tasks = [
            Task(title="write docs"),
            Task(title="drink water", done=True),
        ]
        self.assertEqual(
            task_summary(tasks),
            "1 pending / 1 completed",
        )
```

![完整写入 task_summary 的失败测试](screenshots/14-09-failing-task-summary-test-complete.webp)

按 [[Esc]]，用 [[F1]] → `write` → [[Enter]] → [[Enter]] 保存测试。

左侧符号栏应该会出现诊断，因为要导入的东西还不存在。把光标放在 `task_summary` 上，按 [[Space]] [[l]] [[e]]，浮窗就会显示当前诊断的详细内容。

![查看尚未实现的 task_summary 导入诊断](screenshots/14-10-task-summary-diagnostic-popup.webp)

打开终端，直接输入并执行：

```console
PYTHONPATH=src python -m unittest -v
```

这里应该会出现 ImportError。这正是当前阶段想看到的失败。

![运行失败测试得到预期的 ImportError](screenshots/14-11-expected-import-error.webp)

### 第三步：从已有定义跳到实现文件

隐藏终端，在测试导入中的 `pending_count` 上按：

[[Space]] [[l]] [[g]] [[d]]

![从测试导入跳到 service.py 中的 pending_count 定义](screenshots/14-12-definition-jump-to-service.webp)

LSP 会跳到 `service.py` 里的定义。当然，也可以用 [[Space]] [[,]] 直接切到这个 Buffer；走法不同，目的地是一样的。

在 `completed_count` 后加入：

```python
def task_summary(tasks: list[Task]) -> str:
    return (
        f"{pending_count(tasks)} pending / "
        f"{completed_count(tasks)} completed"
    )
```

![完整实现 task_summary](screenshots/14-14-task-summary-implementation-complete.webp)

输入函数名时，Blink 的自动补全菜单通常会弹出来：

![在 task_summary 中使用 Blink 补全已有函数](screenshots/14-13-task-summary-completion-menu.webp)

1. 用 [[Ctrl]]+[[n]] /[[Ctrl]]+[[p]] 选候选；
2. 按 [[Tab]] 接受；
3. [[Enter]] 继续只负责换行。

按 [[Esc]]，保存实现文件。

### 第四步：检查诊断并重新运行测试

在当前文件按 [[&#93;]] [[d]]。如果没有下一条诊断，Neovim 会提示已经到边界，或是找不到诊断；这通常说明当前文件没什么可报告的问题。

![实现完成后当前文件没有可跳转诊断](screenshots/14-15-task-summary-diagnostics-cleared.webp)

打开终端，按 [[Up]]、[[Enter]] 重跑测试。所有测试应该都会通过。

![重跑后七项测试全部通过](screenshots/14-16-seven-tests-pass.webp)

Python 的 BasedPyright 不提供格式化能力，所以在这个项目里按 [[Space]] [[c]] [[f]]，可能找不到能运行的格式器。代码已经按清楚的布局写好了，直接保存即可。换到 Nix 这类已经配好格式器的文件时，再走“格式化、等待、保存”三步。

### 第五步：全项目搜索验收

隐藏终端，按：

[[Space]] [[/]]

输入 `task_summary`。结果里至少应该有：

- 服务函数定义；
- 测试文件导入；
- 测试调用。

![全项目搜索 task_summary 的定义与测试引用](screenshots/14-17-task-summary-project-search.webp)

用 [[Ctrl]]+[[n]] /[[Ctrl]]+[[p]] 把三处预览都看一遍，确认后按 [[Esc]] 关闭。如果想打开当前项，就按 [[Enter]]；想把所有结果留在底部慢慢看，就按 [[Ctrl]]+[[q]] 加入 Quickfix。

## 工作流四：提交前总审查

### 1. 保存与测试

按 [[F1]] → `wall` →[[Enter]] → [[Enter]]。打开终端运行：

```console
PYTHONPATH=src python -m unittest -v
git diff --check
git status --short
```

确认测试通过，而且只有 `service.py` 和 `test_service.py` 发生了变化。

![测试通过且只有两个目标文件发生变化](screenshots/14-18-final-tests-and-two-modified-files.webp)

### 2. 用 Diffview 看完整补丁

隐藏终端，按 [[Space]] [[g]] [[s]]。

![Diffview 中列出两个待审查文件](screenshots/14-19-diffview-two-file-overview.webp)

1. 按 [[Tab]] 在两份文件之间切换。

![切换到 test_service.py 审查导入与测试补丁](screenshots/14-21-diffview-test-change.webp)

2. 每份文件用 [[&#93;]] [[c]] 逐块阅读。

![在 Diffview 中逐块审查 service.py 新增函数](screenshots/14-20-diffview-service-change.webp)

3. 需要修正时按 [[g]] [[f]] 回真实文件，修改并保存。
4. 回 Diffview 后按 [[Space]] [[e]]，再按 [[R]] 刷新。
5. 在文件面板对两个 Unstaged 条目分别按小写 [[s]]。

![暂存 service.py 后区分未暂存与已暂存文件](screenshots/14-22-service-file-staged.webp)

![两个功能文件全部进入 Staged changes](screenshots/14-23-all-feature-files-staged.webp)

6. 用 [[F1]] → `DiffviewClose` → 两次 [[Enter]] 退出。

![在 F1 Picker 中选择 DiffviewClose](screenshots/14-24-diffview-close-picker.webp)

### 3. 检查 index 并提交

打开终端运行：

```console
git diff --cached --check
git diff --cached
```

![在终端 pager 中阅读已暂存的完整补丁](screenshots/14-25-cached-diff-pager.webp)

把补丁读完，按 [[q]] 退出 pager。确认没问题以后：

```console
git commit -m "add task summary"
git status --short
```

![提交 task summary 功能](screenshots/14-26-task-summary-commit-created.webp)

工作树应该会重新变干净。到这里，这个功能已经走完了测试、实现、诊断检查、搜索验证、代码审查和提交。

![提交后 git status short 无输出](screenshots/14-27-clean-worktree-after-commit.webp)

## 工作流五：保存并恢复工作现场

### 安全退出

1. 按 [[F1]] → `wall` →[[Enter]] → [[Enter]]。
2. 确认 Diffview 已关闭。
3. 按 [[Space]] [[s]] [[c]] 保存当前目录会话。
4. 按 [[F1]]，输入 `wqa`，连按两次 [[Enter]]。

![在 F1 Picker 中选择 wqall 安全退出](screenshots/14-28-wqa-picker-before-exit.webp)

退出时，插件也会尝试自动保存当前工作目录的会话。不过手动保存这一步仍然有价值：你可以确定，这份快照是在所有文件都落盘以后留下的。

### 恢复最近会话

在普通终端运行：

```console
nvim
```

不带参数启动时，Neovim 会自动尝试载入全局最近会话，很适合回到刚才这个项目。载入完成后 Explorer 会自动打开，之前的普通文件和分屏布局也应该会回来。

![无参数启动后恢复 Explorer 与双栏布局](screenshots/14-29-restored-explorer-two-pane-layout.webp)

### 明确打开另一个项目

进入另一个项目时使用：

```console
cd /path/to/other-project
nvim .
```

目录参数会阻止全局最近会话自动载入。如果这个项目以前保存过布局，再按 [[Space]] [[s]] [[l]]，等会话 Picker 出现，选中对应路径并回车。

![载入会话 Picker 中列出已保存项目](screenshots/14-31-session-load-picker.webp)

### 快速载入最近会话

在已打开的 Neovim 中连续按：

[[Space]] [[s]] [[l]] [[t]]

> [!WARNING] 载入会话前先保存当前内容
> 这个动作可能会删除当前 Buffer，并把整套布局切走，动手前先保存。

若当前有未保存内容，载入过程中可能出现确认：

- Yes：先写入修改，再继续载入；
- No：丢掉修改，继续载入；
- Cancel：取消本次载入。

拿不准该不该继续时，就选 Cancel。回来以后用 [[F1]] → `wall` → 两次 [[Enter]] 保存，再重新载入会话。

### 删除旧会话记录

按 [[Space]] [[s]] [[d]]，在 Picker 里选中旧会话并确认。这只会删除布局记录，不会修改项目文件。路径相似时，先确认完整预览，避免删除仍在使用的会话。

![删除会话 Picker 中核对旧项目路径](screenshots/14-32-session-delete-picker.webp)

## 日常开发的主要流程

| 阶段 | 推荐动作 |
| --- | --- |
| 进入明确项目 | `cd 项目 `，然后 `nvim .` |
| 回最近现场 | 无参数 `nvim` |
| 找文件 | [[Space]] [[e]] 或 [[Space]] [[,]] |
| 找代码 | [[Space]] [[/]] |
| 并排理解 | Picker 中 [[Ctrl]]+[[v]] |
| 写与重构 | 文本对象、[[.]]、补全、LSP 定义/引用/重命名 |
| 看问题 | [[&#93;]] [[d]]、诊断浮窗 |
| 运行与测试 | [[Ctrl]]+[[&#92;]] |
| 格式化 | 有可用格式器时 [[Space]] [[c]] [[f]]，等待后保存 |
| 小块审查 | [[&#93;]] [[c]]、[[Space]] [[h]] [[P]] |
| 全项目审查 | [[Space]] [[g]] [[s]] |
| 提交 | Diffview/Gitsigns 暂存，终端运行 Git |
| 结束工作 | `wall`，[[Space]] [[s]] [[c]]，`wqa` |

## 最终自测

不看前文，尝试回答并亲手做一遍：

1. 怎样明确打开一个新项目，避免载入上个项目？
2. 怎样把两个已打开文件竖向并排？
3. 怎样在整个项目搜索一个函数名，并把结果加入 Quickfix？
4. 怎样跳定义、找引用、重命名和查看诊断？
5. 补全菜单里哪颗键接受候选，哪颗键继续换行？
6. 怎样打开右侧终端、跑测试、回代码、再重跑？
7. 怎样逐 hunk 预览和暂存？
8. 怎样打开全项目 Diffview，又怎样完整关闭？
9. 怎样解决下一处冲突并选择 theirs？
10. 会话保存前，为什么仍要先保存文件？

如果有两三题做不出来，可以翻一下 [15：完整速查表](15-key-reference.md)，然后立刻回到项目里再做一遍。查完就练，比只看不动手更容易记住。
