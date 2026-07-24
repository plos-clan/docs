# 08｜补全与 Copilot

第 07 章已经把 `model.py`、`service.py`、测试和 CLI 的窗口布局准备好了。这一章不加新功能，只把现有代码重写几行，借此练习 Blink 补全、函数签名提示和 Copilot 灰字建议。练完以后，文件内容还会和第 07 章结尾保持一致，第 10 章可以直接接着跑测试。

本章最重要的一条规则是：

> 看到候选菜单，用 [[Ctrl]]+[[n]] / [[Ctrl]]+[[p]] 选择，再用 [[Ctrl]]+[[y]] 或 [[Tab]] 接受；看到行内灰字，用 [[Alt]]+[[l]] 接受；[[Enter]] 只负责换行。

## 本章结束时，你会掌握

- 分清 Blink 候选菜单、签名浮窗与 Copilot 行内灰字；
- 用 [[Ctrl]]+[[n]] / [[Ctrl]]+[[p]] 浏览补全，用 [[Ctrl]]+[[y]] 或 [[Tab]] 接受；
- 明确当前配置中的 [[Enter]] 只换行；
- 用 [[Alt]]+[[l]] 接受 Copilot 建议，同时保留人工审查；
- 补全暂时没有出现时，也能继续输入和排查原因。

本章只新增下面几个按键：

| 按键 | 使用位置 | 效果 |
| --- | --- | --- |
| [[Ctrl]]+[[n]] / [[Ctrl]]+[[p]] | 插入模式的 Blink 菜单 | 选择下一项 / 上一项 |
| [[Ctrl]]+[[y]] | Blink 菜单 | 接受当前候选 |
| [[Tab]] | Blink 菜单 | 接受当前候选；没有可接受候选时执行普通 [[Tab]] |
| [[Ctrl]]+[[Space]] | 插入模式 | 手动请求显示补全菜单 |
| [[Alt]]+[[l]] | Copilot 灰字出现时 | 接受整条行内建议 |

[[Alt]]+[[l]] 里的 [[l]] 是小写字母 L。有些终端字体会把它画得很像数字 1，别按错了。

## 1. 开始前：确认 CLI 基线

按 [[g]] [[t]] 或 [[g]] [[T]]，切到 `cli.py` 所在的 Tab。如果第 07 章留下的 Tab 已经关了，就按 [[Space]] [[,]]，输入 `cli`，选中 `src/pocket_tasks/cli.py` 后按 [[Enter]]。

文件应为：

```python
from pocket_tasks.model import Task
from pocket_tasks.service import add_task, visible_titles

def main() -> None:
    tasks: list[Task] = []
    tasks = add_task(tasks, "learn nvim")
    for title in visible_titles(tasks):
        print(f"- {title}")

if __name__ == "__main__":
    main()
```

![CLI Tab 中的第 07 章基线](screenshots/08-01-cli-baseline.webp)

内容有一点出入也没关系，先把这一章会练到的几行改成示例里的样子。保存时依次按 [[Esc]] → [[F1]] → 输入 `write` → [[Enter]] → [[Enter]]。

第一次回车只是选中命令，把 `:write` 放到底部命令行；第二次回车才会真的写入文件。

### 三种提示的显示形式

| 屏幕现象 | 提示来源 | 常用操作 |
| --- | --- | --- |
| 一列可上下选择的候选，旁边可能有文档 | Blink | [[Ctrl]]+[[n]] / [[Ctrl]]+[[p]]，再按 [[Ctrl]]+[[y]] 或 [[Tab]] |
| 函数名、参数与返回类型的小浮窗 | LSP 签名提示 | 阅读后继续输入参数 |
| 光标后方的一段浅色行内文字 | Copilot | 审查内容，合适时按 [[Alt]]+[[l]] |

Blink 候选菜单通常给的是短小、结构化的补全项，Copilot 则更常给出一整段建议。不管是哪一种，接受前都要先看清内容。

## 2. 工作流一：用 Blink 重写类型标注

下面把 `tasks: list[Task] = []` 重新输一遍。代码本身不变，我们主要练补全怎么用。

### 第一步：让 `list` 出现在候选菜单

1. 普通模式输入 `/tasks:`，按 [[Enter]]，光标跳到类型标注这一行。

![搜索并定位 tasks 类型标注](screenshots/08-02-search-tasks-type.webp)

2. 按 [[c]] [[c]]。当前行内容被清空，Neovim 进入插入模式，并保留 Python 缩进。
3. 输入 `tasks: li`，先停一下。

![输入 li 后出现 Blink 候选菜单](screenshots/08-03-blink-list-candidates.webp)

这时光标附近应该会出现 Blink 候选菜单，里面能找到 `list`。切换高亮项以后，旁边可能要过大约 200 毫秒才会显示说明文档。

1. 按 [[Ctrl]]+[[n]]，高亮移到下一项。

![用 Ctrl-n 选中 list 候选](screenshots/08-04-blink-list-selected.webp)

2. 按 [[Ctrl]]+[[p]]，高亮回到上一项。
3. 确认高亮的是 `list`，按 [[Ctrl]]+[[y]]。

![用 Ctrl-y 接受 list](screenshots/08-05-blink-list-accepted.webp)

接受以后，Buffer 里会变成 `tasks: list`，这时 `list` 才算真的写进代码。

### 第二步：用 [[Tab]] 接受 `Task`

1. 紧接着输入 `[Ta`。
2. 候选菜单里找到 `Task`。若当前项不对，用 [[Ctrl]]+[[n]] / [[Ctrl]]+[[p]] 调整。

![Blink 选中项目中的 Task 类型](screenshots/08-06-blink-task-candidates.webp)

3. 按 [[Tab]] 接受。
4. 输入 `] = []`，按 [[Esc]]。

![用 Tab 接受 Task 后恢复完整类型行](screenshots/08-07-type-line-restored.webp)

这一行最终仍是：

```python
    tasks: list[Task] = []
```

这里的 [[Tab]] 会优先接受候选；如果菜单里没有能接受的内容，它就会退回普通 Tab 的行为，比如用来缩进。

值得注意的是，[[Tab]] 的明确职责就是接受当前补全候选。至于片段占位符之间怎么跳，并没有额外保证；真碰上了，继续用普通的移动和编辑键处理就行。

### 第三步：亲眼确认 [[Enter]] 只换行

找一行函数体，在普通模式按 [[o]] 新建临时行，然后：

1. 输入 `pri`，等 `print` 出现在候选菜单。

![print 候选及函数文档](screenshots/08-08-print-candidate-before-enter.webp)

2. 保持候选高亮，按 [[Enter]]。

![Enter 只换行而没有接受 print](screenshots/08-09-enter-only-newline.webp)

按下以后，光标会进入下一行，上一行仍然是 `pri`，`print` 并没有被接受。按 [[Esc]] 回到普通模式，再按 [[u]] 撤销这段临时练习。

![撤销 Enter 换行练习后的干净代码](screenshots/08-10-enter-practice-undone.webp)

所以，回车在这里真的只负责换行。想接受 Blink 候选，要用 [[Ctrl]]+[[y]] 或 [[Tab]]。

::: details 菜单没有出现怎么办

按下面的顺序排查，一次只做一步：

1. 确认仍在插入模式，底部应显示 `INSERT`。
2. 再输入一两个字符，让候选范围更明确。
3. 按 [[Ctrl]]+[[Space]] 手动请求补全。
4. 确认文件后缀是 `.py`，项目根目录有 `pyproject.toml`。
5. 新打开项目时给 BasedPyright 一两秒启动时间。

哪怕 LSP 还没附着，Blink 也可能从当前 Buffer、路径或片段里给出候选。只有语言级的类型补全，才必须等 LSP 成功附着；第 09 章会专门检查这一点。

:::

## 3. 工作流二：一边看签名，一边填写调用参数

接着把这一行重写一遍：

```python
    tasks = add_task(tasks, "learn nvim")
```

### 操作步骤

1. 普通模式输入 `/tasks = add_task`，按 [[Enter]]。

![搜索 add_task 调用](screenshots/08-11-search-add-task-call.webp)

2. 按 [[c]] [[c]] 进入插入模式。
3. 输入 `tasks = add_`。

![输入 add_ 后出现 add_task 候选](screenshots/08-12-blink-add-task-candidate.webp)

4. 在候选菜单中选中 `add_task`，按 [[Tab]] 接受。
5. [[Tab]] 会自动插入一对括号，光标停在括号内；停一下观察签名浮窗。

![Tab 自动插入括号并显示 add_task 签名](screenshots/08-13-signature-popup-add-task.webp)

这时附近应该会出现函数签名，内容大致是：

```text
add_task(tasks: list[Task], title: str) -> list[Task]
```

签名浮窗会告诉你，这个函数需要哪些参数。继续输入时，浮窗里的高亮通常也会跟着当前参数往后走。

1. 输入 `tasks, "learn nvim"`，再越过补全自动生成的右括号。

![输入第一个参数后签名提示仍然可见](screenshots/08-14-signature-first-argument.webp)

2. 按 [[Esc]]。

![add_task 调用恢复为完整正确代码](screenshots/08-15-add-task-call-restored.webp)

最后的代码和开始时完全一样。签名提示省去了死记参数顺序的负担，尤其碰到一串布尔参数时，可以少写不少位置错误。

::: details 签名浮窗没有出现

- 可以先继续输入，签名浮窗不会影响正常编辑；
- 确认 BasedPyright 已附着当前 Python Buffer；
- 确认光标前的函数名能够被识别，拼写错误会让语言服务器找不到对应定义；
- 函数来自动态代码或缺少类型信息时，服务器可能没有可展示的签名。

签名提示依赖 LSP。普通字符串、注释和没识别出来的符号，通常也就没有什么有用的参数信息可显示。

:::

## 4. 工作流三：用 Copilot 写回两行循环

这一轮只新增一个动作：[[Alt]]+[[l]] 接受 Copilot 行内灰字。

### 首次使用先登录 Copilot

如果当前机器还没登录：

1. 按 [[F1]]，输入 `Copilot`，选中同名命令。

![在 F1 中选择 Copilot 命令](screenshots/08-16-command-palette-copilot.webp)

2. 按 [[Enter]]，在底部的 `:Copilot` 后输入 ` auth`。

![在命令行组成 Copilot auth](screenshots/08-17-command-line-copilot-auth.webp)

3. 按 [[Enter]] 执行，复制弹窗中的一次性代码，在浏览器打开 `https://github.com/login/device` 完成授权。

![Copilot 设备授权代码与登录地址](screenshots/08-18-copilot-auth-prompt.webp)

授权成功后，弹窗会自动关闭。对当前用户环境来说，这个操作通常只需要做一次。

想确认授权是否成功，可以按 [[F1]]，选择 `Copilot`，在底部补上 ` status` 后运行。只要看到 `Online` 和 `Buffer status: attached`，当前 Python Buffer 就已经可以请求建议了。

![Copilot 已在线并附着当前 Buffer](screenshots/08-19-copilot-authenticated.webp)

### 先删掉旧循环

1. 普通模式输入 `/for title`，按 [[Enter]]。
2. 按 [[2]] [[d]] [[d]]，删掉循环及其 `print` 行。

![删除旧循环后的 CLI](screenshots/08-20-loop-lines-deleted.webp)

3. 按 [[O]]，在当前行上方新建一行并进入插入模式。
4. 输入下面这条临时提示注释，再按 [[Enter]]：

```python
    # Print every visible task title as a bullet
```

继续留在插入模式；如果空行里弹出了 Blink 候选菜单，按 [[Ctrl]]+[[e]] 把它收起来，让画面只剩提示注释和空白输入行。

![输入 Copilot 临时提示注释](screenshots/08-21-copilot-prompt-comment.webp)

### 审查灰字，再决定是否接受

默认配置下，不会每输入一点内容就自动请求建议。在空白输入行按一次 [[Alt]]+[[l]]：因为眼前还没有灰字，所以这一下只负责发起请求。稍等片刻，光标后方会出现类似下面的浅色建议：

```python
    for title in visible_titles(tasks):
        print(f"- {title}")
```

![Copilot 给出的两行灰字建议](screenshots/08-22-copilot-ghost-suggestion.webp)

先一项项看清楚：

- 调用的是 `visible_titles(tasks)`；
- 循环变量叫 `title`；
- 输出格式是 `- 标题 `；
- 没有乱动别的代码逻辑。

确认内容合适以后，再按一次 [[Alt]]+[[l]]。灰字会变成正常代码，也会进入 Buffer 的修改历史。

![用 Alt-l 接受 Copilot 建议](screenshots/08-23-copilot-suggestion-accepted.webp)

> [!WARNING] 接受 AI 建议后仍要审查和测试
> 如果建议不合要求，继续手动输入目标代码就好。只要没按 [[Alt]]+[[l]]，灰字就不会写进文件。即使已经接受 Copilot 建议，也仍然要继续审查和测试。

::: details 没有 Copilot 灰字也能完成练习

Copilot 需要登录、可用网络和正常运行的后端。没有建议时，手动输入：

```python
    for title in visible_titles(tasks):
        print(f"- {title}")
```

练习重点并不会因此改变：灰字出现后用 [[Alt]]+[[l]] 接受，Blink 菜单则继续用 [[Ctrl]]+[[y]] 或 [[Tab]]。

如果灰字已经出现，按 [[Alt]]+[[l]] 却没反应，通常是终端或桌面环境把这个快捷键截走了。可以先手动把代码写完，之后再检查终端的 Meta/Alt 键设置。

:::

### 清掉临时提示注释

1. 按 [[Esc]] 回普通模式。
2. 输入 `/# Print every`，按 [[Enter]]。

![搜索 Copilot 临时提示注释](screenshots/08-24-search-prompt-comment.webp)

3. 按 [[d]] [[d]] 删除这条临时注释。

![删除临时注释后恢复最终循环](screenshots/08-25-prompt-comment-deleted.webp)

这时 `main()` 应该已经恢复成原来的四行实现。

## 5. 两种建议同时出现时，先看显示形式

有时 Blink 菜单和 Copilot 灰字会一起出现，可以按下面的方法区分：

| 看到什么 | 怎么操作 |
| --- | --- |
| 可上下选择的候选菜单 | 用 [[Ctrl]]+[[n]] / [[Ctrl]]+[[p]] 选择，用 [[Ctrl]]+[[y]] 或 [[Tab]] 接受 |
| 光标后方整段浅色文字 | 先审查内容，确认合适后按 [[Alt]]+[[l]] 接受 |
| 只想换行 | 按 [[Enter]] |

几个容易踩到的小坑：

- 在 Blink 菜单中按 [[Enter]] 会换行，不会接受候选；
- 在 Copilot 灰字出现时按 [[Tab]] 仍优先执行 Blink 的接受或普通 Tab 回退；
- [[Alt]]+[[l]] 专门交给 Copilot 建议；
- 接受任何自动生成内容后，都要重新阅读，并通过诊断和测试验证。

## 6. 保存并核对最终文件

普通模式按 [[F1]]，输入 `write`。

![在 F1 中选择 write 命令](screenshots/08-26-write-command-picker.webp)

按第一次 [[Enter]]，让命令行形成 `:write`。

![命令行形成 write 命令](screenshots/08-27-write-command-line.webp)

再按一次 [[Enter]] 保存。

![保存后的最终 CLI](screenshots/08-28-cli-saved.webp)

`cli.py` 最后应该回到：

```python
from pocket_tasks.model import Task
from pocket_tasks.service import add_task, visible_titles

def main() -> None:
    tasks: list[Task] = []
    tasks = add_task(tasks, "learn nvim")
    for title in visible_titles(tasks):
        print(f"- {title}")

if __name__ == "__main__":
    main()
```

如果担心其他 Window 里还有没保存的修改，就按 [[F1]] → 输入 `wall` → [[Enter]] → [[Enter]]。

第 09 章会接着这些代码往下走：跳定义、找引用、读诊断，再做一次安全的跨文件改名。

## 本章肌肉记忆

| 目标 | 按键 |
| --- | --- |
| Blink 下一项 / 上一项 | [[Ctrl]]+[[n]] / [[Ctrl]]+[[p]] |
| 接受 Blink 当前项 | [[Ctrl]]+[[y]] 或 [[Tab]] |
| 手动唤出补全 | [[Ctrl]]+[[Space]] |
| 普通换行 | [[Enter]] |
| 接受 Copilot 行内灰字 | [[Alt]]+[[l]] |
| 保存当前文件 | [[F1]] → `write` → [[Enter]] → [[Enter]] |

上一章：[Buffer、Window 与 Tab](07-buffers-windows-and-tabs.md) · 下一章：[LSP、诊断与重构](09-lsp-diagnostics-and-refactor.md)
