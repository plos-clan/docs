# Neovim 从入门到出门

这是一套会员制 Neovim 教程（迫真）。界面功能主要由 Snacks 提供，代码编辑相关功能则来自内置 LSP、Blink、Gitsigns、Diffview、mini.ai、mini.surround 和 Quicker。

学完以后，你应该可以独立完成下面这套流程：

> 进入项目 → 找文件 → 写代码 → 搜索 → 对照代码 → 跳定义 → 重构 → 看诊断 → 跑测试 → 格式化 → 审查 Git 变更 → 分块暂存 → 恢复会话

整套课程都围绕练习项目 `pocket-tasks` 展开。它会从一个空目录逐步变成带有类型检查、测试和 Git 历史的 Python 待办 CLI。每章只增加少量按键，避免一次需要记住太多内容。

## 开始练习

先在普通终端运行：

```console
mkdir -p ~/playground/pocket-tasks
cd ~/playground/pocket-tasks
git init
nvim .
```

最后一行很重要。带参数的 `nvim .` 会明确打开当前目录，并阻止会话插件自动载入上一个项目。以后直接运行不带参数的 `nvim`，则会尝试恢复最近一次会话。

课程结束时，目录大致如下：

```text
pocket-tasks/
├── .editorconfig
├── README.md
├── pyproject.toml
├── scratch.nix
├── src/
│   └── pocket_tasks/
│       ├── __init__.py
│       ├── cli.py
│       ├── model.py
│       └── service.py
└── tests/
    ├── __init__.py
    └── test_service.py
```

## 阅读顺序

| 章节 | 你会完成什么 |
| --- | --- |
| [00：认识界面](00-interface-and-mental-model.md) | 模式、Buffer、Window、Tab、启动页和弹窗 |
| [01：生存与基础交互](01-survival-and-interface.md) | 离开插入模式、移动、撤销、保存和退出 |
| [02：用文件树创建项目](02-explorer-and-skeleton.md) | 用 Snacks Explorer 创建、打开、改名和删除文件 |
| [03：快速移动与小编辑](03-navigation-and-small-edits.md) | 按词、行、文件移动，搜索并从不同位置开始输入 |
| [04：编辑语法与文本对象](04-edit-grammar-and-text-objects.md) | 组合“动作 + 范围”，复制、删除并重复修改 |
| [05：包围符与注释](05-surround-and-comments.md) | mini.surround、自动括号和内置注释 |
| [06：搜索与 Quickfix](06-search-and-quickfix.md) | 文件内搜索、项目搜索和跨文件批量修改 |
| [07：Buffer、分屏与 Tab](07-buffers-windows-and-tabs.md) | 并排看代码、来回跳转和管理打开的文件 |
| [08：补全与 Copilot](08-completion-and-copilot.md) | Blink 补全、签名提示和 AI 灰字建议 |
| [09：LSP、诊断与重构](09-lsp-diagnostics-and-refactor.md) | 跳定义、找引用、改名、代码动作和诊断检查 |
| [10：终端、测试与格式化](10-terminal-test-and-format.md) | 在右侧终端跑测试，回代码修复，再手动格式化 |
| [11：Git 变更块](11-git-hunks.md) | 逐块查看、预览、暂存、撤销暂存和 blame |
| [12：完整代码对照](12-diffview-and-comparison.md) | 任意双文件 diff、单文件 Git diff 和全项目 Diffview |
| [13：合并冲突演练](13-merge-conflicts.md) | 在 Diffview 中选择 ours、theirs 或两边内容 |
| [14：会话与最终挑战](14-sessions-and-daily-workflow.md) | 恢复项目现场并完成一轮完整开发流程 |
| [15：完整速查表](15-key-reference.md) | 配置中的快捷键、语言能力、边界和排错入口 |

建议按顺序练习。前一章创建的文件会在后一章继续使用。也可以中途跳章；每篇都会给出检查点，缺少文件时按说明补齐即可。

## 按键记法

| 写法 | 实际动作 |
| --- | --- |
| `Space` | 空格键，也叫 Leader |
| `Space` `e` | 依次按空格、e；无需同时按住 |
| `Ctrl-n` | 按住 Ctrl，再按 n |
| `Alt-l` | 按住 Alt，再按 l；文中也会写成 Meta-l |
| `Enter` | 回车 |
| `Esc` | 退出当前输入状态，回到普通模式 |
| `h` `P` | 小写 h 后接大写 P；第二下要带 Shift |

文中所有按键都默认从普通模式开始。若你正在打字，先按一次 `Esc`。若你在终端里，章节会单独说明如何回来。

## 优先使用命令面板

需要执行命令时，优先使用你已经会的命令面板：

1. 按 `F1`。
2. 输入命令名的一部分。
3. 用 `Ctrl-n` 或 `Ctrl-p` 选择。
4. 第一次按 `Enter` 选中命令。Picker 会关闭，底部命令行出现 `:write` 一类文字；这个冒号由它自动填写。
5. 再按一次 `Enter`，命令才真正执行。

例如：

- 保存当前文件：`F1`，输入 `write`，连按两次回车。
- 保存并退出全部窗口：`F1`，输入 `wqa`，连按两次回车。
- 关闭 Diffview：`F1`，输入 `DiffviewClose`，连按两次回车。

教程中偶尔会直接写出命令的正式名称，平时练习仍建议优先使用 `F1` 命令面板。

## 练习原则

1. 每章先看“本章新按键”，只记这些。
2. 每个操作亲手做一遍，观察光标、窗口和状态栏。
3. 按错后先按 `Esc` 回到普通模式，再按 `u` 撤销；大多数局部编辑错误可以这样恢复。
4. 涉及 Git 丢弃、文件删除、Quickfix 批量写回时，先提交一个基线。
5. 完成章节末尾的“隋唐小测”，再往后走。

## 开始前需要知道的三件事

- 文件不会自动保存，格式化也不会自动保存。
- `Enter` 在补全菜单出现时依旧负责换行；`Tab` 才接受 Blink 当前候选。
- 默认没有专用测试面板和调试器。日常运行、测试和 Git 提交都在右侧终端完成。

准备好后，从 [00：认识界面](00-interface-and-mental-model.md) 开始。先熟悉界面和基本概念，再继续后面的练习。
