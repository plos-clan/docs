# 07｜Buffer、Window 与 Tab：组织开发布局

这一章要把 `model.py`、`service.py`、测试和 CLI 同时摆到屏幕上。最后会得到这样的布局：左上写服务，左下看测试，右侧对照数据模型，再用另一个 Tab 单独编辑 CLI。

先复习三个名词：

| 名词 | 它保存什么 | 说明 |
| --- | --- | --- |
| Buffer | 已读入内存的文件内容，也可能还没有磁盘文件 | 内容本身 |
| Window | 某个 Buffer 的可见视口 | 显示内容的区域 |
| Tab | 一整套 Window 布局 | 一组窗口布局 |

同一个 Buffer 可以同时出现在多个 Window 里。关掉 Window，只是少了一个显示区域，通常不会把 Buffer 从内存里卸载。Tab 也不等于单个文件，它记住的是一整组分屏布局。

## 1. 开始前：补全可以运行的项目结构

第 06 章结束后，`model.py` 应为：

```python
from dataclasses import dataclass

@dataclass(slots=True)
class Task:
    title: str
    done: bool = False
```

我们先把它改成不可变的数据类，再建好服务、测试和 CLI 文件。这一节只用前面学过的按键，先把分屏练习要用的文件准备好。

### 更新 `model.py`

1. 按 [[Space]] [[/]]，输入 `@dataclass`。

![搜索 dataclass 定义](screenshots/07-01-search-dataclass.webp)

2. 选中 `model.py` 的结果，按 [[Enter]]。

3. 输入 `/slots`，按 [[Enter]]。
4. 按 [[c]] [[i]] [[a]]，输入 `frozen=True`，按 [[Esc]]。

![把模型改为 frozen dataclass](screenshots/07-02-model-frozen-edit.webp)

5. 按 [[F1]]，输入 `write`。

6. 连按两次 [[Enter]] 保存。

![model.py 保存完成](screenshots/07-03-model-frozen-written.webp)

[[c]] [[i]] [[a]] 会修改 `dataclass(...)` 里光标所在的参数。改完应该是 `@dataclass(frozen=True)`。

### 用 Explorer 创建三个文件

1. 按 [[Space]] [[e]] 打开 Explorer。

![打开并缩窄 Explorer](screenshots/07-04-explorer-open.webp)

2. 它会跟随当前的 `model.py`。高亮 `model.py`，按 [[a]]，输入 `service.py`，按 [[Enter]]。

![在 pocket_tasks 包中创建 service.py](screenshots/07-05-service-file-created.webp)

3. 新文件与 `model.py` 同级。继续按 [[a]]，输入 `cli.py`，按 [[Enter]]。

4. 用 [[h]] / [[l]] 折叠或展开目录，用 [[j]] / [[k]] 移到 `tests/`。
5. 展开 `tests/`，高亮 `__init__.py`，按 [[a]]，输入 `test_service.py`，按 [[Enter]]。

![创建 tests/test_service.py](screenshots/07-06-test-service-file-created.webp)

到这里，服务、CLI 和测试文件就都建好了。

![项目骨架文件已经齐全](screenshots/07-07-project-files-ready.webp)

如果某个文件已经存在，就跳过对应的 [[a]]，直接打开它。Explorer 的 [[a]] 会立刻在磁盘上创建文件，所以输入名字前，先看一眼当前高亮项究竟在哪个目录里。

### 填写 `service.py`

在 Explorer 中打开 `src/pocket_tasks/service.py`，按 [[i]] 输入：

```python
from pocket_tasks.model import Task

def add_task(tasks: list[Task], title: str) -> list[Task]:
    return [*tasks, Task(title=title)]

def complete_task(tasks: list[Task], index: int) -> list[Task]:
    updated = list(tasks)
    task = updated[index]
    updated[index] = Task(title=task.title, done=True)
    return updated

def visible_titles(tasks: list[Task]) -> list[str]:
    return [task.title for task in tasks if not task.done]
```

按 [[Esc]]，再按 [[F1]]，输入 `write`。

连按两次 [[Enter]] 保存。第一下只是把命令送到底部命令行，第二下才会真正运行。

![service.py 保存完成且无诊断](screenshots/07-08-service-written.webp)

### 填写 `tests/test_service.py`

文件打开后，Explorer 通常还留在左边。按 [[Ctrl]]+[[w]] [[h]] 回到 Explorer；如果左侧已经关了，就按 [[Space]] [[e]] 重新打开。找到 `tests/test_service.py`，按 [[Enter]] 打开，再按 [[i]] 输入：

```python
import unittest

from pocket_tasks.model import Task
from pocket_tasks.service import add_task, complete_task, visible_titles

class ServiceTests(unittest.TestCase):
    def test_add_task(self) -> None:
        tasks = add_task([], "learn nvim")
        self.assertEqual(tasks, [Task(title="learn nvim")])

    def test_complete_task(self) -> None:
        tasks = complete_task([Task(title="learn nvim")], 0)
        self.assertTrue(tasks[0].done)

    def test_visible_titles_hides_completed(self) -> None:
        tasks = [
            Task(title="write code"),
            Task(title="take a walk", done=True),
        ]
        self.assertEqual(visible_titles(tasks), ["write code"])

if __name__ == "__main__":
    unittest.main()
```

按 [[Esc]]，再按 [[F1]]，输入 `write`。

连按两次 [[Enter]] 保存测试。

![test_service.py 保存完成](screenshots/07-09-tests-written.webp)

再按 [[Ctrl]]+[[w]] [[h]] 回到 Explorer；如果 Explorer 已经关了，就用 [[Space]] [[e]] 打开。找到空的 `src/pocket_tasks/cli.py`，按 [[Enter]]。先不用输入，只要打开一次，它就会进入 Buffer 列表。

焦点现在落在 `cli.py`。按 [[Space]] [[e]] 关掉左侧的 Explorer，让屏幕上只剩一个普通的编辑 Window。

![关闭 Explorer 后只保留一个 Window](screenshots/07-10-explorer-closed-single-window.webp)

现在内存里至少已经载入了 `model.py`、`service.py`、`test_service.py` 和 `cli.py`。接下来开始安排窗口布局。

## 2. 工作流一：用 Buffer Picker 在已打开文件间切换

这一节只增加一个入口：

| 按键 | 效果 |
| --- | --- |
| [[Space]] [[,]] | 打开 Buffer Picker |

Picker 里的操作和上一章一样：直接打字筛选，用 [[Ctrl]]+[[n]] / [[Ctrl]]+[[p]] 移动，[[Enter]] 确认，[[Esc]] 关闭。

### 从 CLI 切回服务文件

1. 当前光标在空的 `cli.py`。按 [[Space]] [[,]]。
2. 输入 `service`。

![在 Buffer Picker 中筛选 service.py](screenshots/07-11-buffer-picker-service.webp)

3. 选中 `src/pocket_tasks/service.py`，按 [[Enter]]。

![在当前 Window 打开 service.py](screenshots/07-12-service-buffer-opened.webp)

当前 Window 会改为显示 `service.py`。`cli.py` 并没有被关闭，它还在 Buffer 列表里。再按 [[Space]] [[,]]，输入 `cli`，照样能找到它。按 [[Esc]] 关闭 Picker，继续留在 `service.py`。

### 文件、Buffer 和 Window 在这一刻的关系

```text
磁盘：src/pocket_tasks/cli.py
          ↑ 打开后读入
Buffer：cli.py 的内存内容
          ↑ 可以被某个窗口显示
Window：当前屏幕上的一块编辑区
```

在 Buffer Picker 里按 [[Enter]]，只是让当前 Window 换成选中的 Buffer。Window 本身没变，变的只是里面显示的内容。

## 3. 从 Buffer Picker 卸载 Buffer

打开的文件一多，Buffer Picker 也会越拉越长。暂时用不到的 Buffer 可以卸载掉，不会影响磁盘上的文件。

这一轮新增：

| 按键 | 使用位置 | 效果 |
| --- | --- | --- |
| [[Ctrl]]+[[x]] | Buffer Picker 的输入区或结果列表 | 删除当前候选 Buffer |
| [[d]] [[d]] | Buffer Picker 的结果列表 | 删除高亮 Buffer |

### 用干净的 README 练 [[Ctrl]]+[[x]]

先确保 README 在 Buffer 列表里：

1. 按 [[Space]] [[/]]，输入 `# Pocket Tasks`，按 [[Enter]] 打开 README。
2. 不修改它。按 [[Space]] [[,]]，输入 `service`，按 [[Enter]] 切回 `service.py`。
3. 再按 [[Space]] [[,]]，输入 `README`。

![在 Buffer Picker 中找到 README](screenshots/07-13-buffer-picker-readme.webp)

4. 高亮 README 后按 [[Ctrl]]+[[x]]。

![用 Ctrl-x 卸载 README Buffer](screenshots/07-14-readme-buffer-unloaded.webp)

README 会从 Picker 里消失，但 Picker 还开着。按 [[Esc]] 把它收起来。此时项目目录里的 `README.md` 安然无恙；以后再通过 Explorer 或项目搜索打开，它就会重新变成 Buffer。

### 在结果列表中使用 [[d]] [[d]]

Buffer Picker 刚打开时，焦点在输入区。想用 [[d]] [[d]] 的话：

1. 按 [[Space]] [[,]]，输入目标文件名。
2. 按 [[/]] 把焦点切到结果列表。这个 [[/]] 是 Picker 内的焦点开关。
3. 用 [[j]] / [[k]] 选择，按 [[d]] [[d]] 删除高亮 Buffer。
4. 按 [[Esc]] 关闭 Picker。

平时优先记 [[Ctrl]]+[[x]]，因为焦点还在输入区时就能直接用。[[d]] [[d]] 更适合焦点已经切到列表里的时候。

### 删除已修改 Buffer 时的确认框

如果目标 Buffer 里还有没保存的内容，Snacks 会问你要不要保存：

- `Yes`：先保存，再卸载 Buffer；
- `No`：关闭 Buffer，丢弃其中尚未写盘的改动；
- `Cancel`：什么都不做。

> [!CAUTION] 选择 `No` 会丢弃未保存内容
> 拿不准时就选 `Cancel`，回到文件里确认内容。卸载 Buffer 和在 Explorer 里按 [[d]] 删除文件，完全是两回事；后者真的会动磁盘上的文件。

## 4. 工作流二：竖分屏对照服务和模型

除了用 [[Enter]] 在当前 Window 里打开结果，Picker 还能直接把结果送进新的分屏。

这一轮新增：

| 按键 | 效果 |
| --- | --- |
| [[Ctrl]]+[[v]] | 在右侧竖分屏打开 Picker 当前结果 |
| [[Ctrl]]+[[w]] [[h]] / [[Ctrl]]+[[w]] [[l]] | 移到左侧 / 右侧 Window |
| [[Ctrl]]+[[w]] [[=]] | 让当前 Tab 里的 Window 重新平分可用空间 |
| [[Ctrl]]+[[w]] [[q]] | 关闭当前 Window |

[[Ctrl]]+[[w]] 这一系列都要分两段按：先按住 [[Ctrl]] 点一下 [[w]]，松开以后再按方向或命令字母。

### 创建一组对照窗口

1. 确认当前只有一个普通编辑 Window，里面显示 `service.py`。
2. 按 [[Space]] [[,]]，输入 `model`。

3. 选中 `model.py`，按 [[Ctrl]]+[[v]]。

![用 Ctrl-v 建立 service/model 竖分屏](screenshots/07-15-vertical-split-service-model.webp)

新开的竖分屏默认会放在右边，所以布局应该是：

```text
+----------------------+----------------------+
| service.py           | model.py             |
|                      |                      |
| 主要逻辑              | Task 定义             |
|                      |                      |
+----------------------+----------------------+
```

焦点落在刚打开的右侧 `model.py`。

1. 按 [[Ctrl]]+[[w]] [[h]]，光标到左侧 `service.py`。
2. 按 [[Ctrl]]+[[w]] [[l]]，光标回右侧 `model.py`。
3. 按 [[Ctrl]]+[[w]] [[=]]，两边宽度重新均分。

![在两个 Window 间移动并均分宽度](screenshots/07-16-window-focus-and-equalize.webp)

留意光标所在行、状态栏文件名和高亮边框的变化。按键只会作用在当前 Window 里的 Buffer 上，操作前看一下状态栏，可以避免修改错误的文件。

### 关窗口，保留 Buffer

1. 保持焦点在右侧 `model.py`。
2. 按 [[Ctrl]]+[[w]] [[q]]。

![关闭右侧 model.py Window](screenshots/07-17-model-window-closed.webp)

右侧 Window 消失，`service.py` 重新占满编辑区。`model.py` Buffer 仍然存在：

1. 按 [[Space]] [[,]]，输入 `model`，它还在候选列表。

![关闭 Window 后 model Buffer 仍可找到](screenshots/07-18-model-buffer-still-available.webp)

2. 按 [[Esc]] 关闭 Picker。
3. 再按 [[Space]] [[,]]，搜索 `model`，按 [[Ctrl]]+[[v]] 恢复右侧分屏。

![从 Buffer Picker 恢复 model.py Window](screenshots/07-19-model-window-restored.webp)

这就是关闭 Window 和卸载 Buffer 的区别。[[Ctrl]]+[[w]] [[q]] 关掉的是当前视口；Buffer Picker 里的 [[Ctrl]]+[[x]] 或 [[d]] [[d]]，才会把 Buffer 从内存列表里卸载。

## 5. 工作流三：横分屏把测试放在代码下方

左右两栏适合对照定义和调用位置。测试通常放在实现代码下面，这样输入和预期结果抬眼就能对上。

这一轮新增：

| 按键 | 效果 |
| --- | --- |
| [[Ctrl]]+[[s]] | 在下方横分屏打开 Picker 当前结果 |
| [[Ctrl]]+[[w]] [[j]] / [[Ctrl]]+[[w]] [[k]] | 移到下方 / 上方 Window |

### 创建三窗口开发布局

当前应有左侧 `service.py` 和右侧 `model.py`，焦点在右侧。

1. 按 [[Ctrl]]+[[w]] [[h]] 到左侧 `service.py`。
2. 按 [[Space]] [[,]]，输入 `test_service`。

3. 选中 `tests/test_service.py`，按 [[Ctrl]]+[[s]]。

![用 Ctrl-s 建立下方测试 Window](screenshots/07-20-horizontal-test-split.webp)

新横分屏会出现在下方，最后得到：

```text
+----------------------+----------------------+
| service.py           |                      |
|                      | model.py             |
+----------------------+                      |
| test_service.py      |                      |
|                      |                      |
+----------------------+----------------------+
```

焦点现在位于左下的 `test_service.py`。

1. 按 [[Ctrl]]+[[w]] [[k]]，去左上 `service.py`。
2. 按 [[Ctrl]]+[[w]] [[j]]，回左下 `test_service.py`。
3. 按 [[Ctrl]]+[[w]] [[l]]，去右侧 `model.py`。
4. 按 [[Ctrl]]+[[w]] [[h]]，回到左侧与当前光标位置最接近的 Window。
5. 按 [[Ctrl]]+[[w]] [[=]] 重新整理尺寸。

![在三窗口布局中按方向移动并均分](screenshots/07-21-three-window-navigation.webp)

布局不太规整时，[[h]] / [[j]] / [[k]] / [[l]] 会挑对应方向上最合适的邻居。看一眼状态栏，就知道自己落到了哪份文件。

### 在日常编码中使用这组布局

- 在 `service.py` 改 `complete_task`；
- 按 [[Ctrl]]+[[w]] [[l]] 核对 `Task` 的 `title` 和 `done` 字段；
- 回到 `service.py`，完成实现；
- 按 [[Ctrl]]+[[w]] [[j]] 对照 `test_complete_task`；
- 修改时用 [[F1]] → `write` → [[Enter]] → [[Enter]] 保存当前文件；
- 要一次保存全部，用 [[F1]] → `wall` → [[Enter]] → [[Enter]]。

一个小功能往往会同时涉及模型、实现和测试。让三个 Window 分别显示这些内容，可以减少文件切换，并保留当前工作的上下文。

## 6. 工作流四：把 CLI 放进新 Tab

眼前这套三窗口布局是拿来写服务的。CLI 暂时不用和它们挤在一起，可以单独放进一个 Tab。

这一轮新增：

| 按键 | 效果 |
| --- | --- |
| [[Ctrl]]+[[t]] | 在新 Tab 中打开 Picker 当前结果 |
| [[g]] [[t]] / [[g]] [[T]] | 去下一个 / 上一个 Tab |

### 打开 CLI Tab

1. 在三窗口布局的任意 Window 中按 [[Space]] [[,]]。
2. 输入 `cli`。

3. 选中 `src/pocket_tasks/cli.py`，按 [[Ctrl]]+[[t]]。

![用 Ctrl-t 在新 Tab 打开 cli.py](screenshots/07-22-cli-new-tab.webp)

新 Tab 会建在当前 Tab 后面，里面只有一个显示 `cli.py` 的 Window。Tab 变成两个以后，顶部的 Tabline 就会出现，告诉你自己现在在哪一页。

在空的 `cli.py` 中按 [[i]] 输入：

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

按 [[Esc]]，再按 [[F1]]，输入 `write`。

连按两次 [[Enter]] 保存。

![CLI 保存完成，Tabline 保留两个 Tab](screenshots/07-23-cli-written-tab.webp)

### 在两个 Tab 之间切换

1. 按 [[g]] [[T]]：回到前一个 Tab，三窗口布局仍然保留。

2. 按 [[g]] [[t]]：去下一个 Tab，回到 `cli.py`。

![gt 切换到 CLI Tab](screenshots/07-24-next-tab-cli.webp)

Tab 记住的是 Window 布局。Buffer 列表则是整个 Neovim 共用的，所以哪怕人在 CLI Tab 里，按 [[Space]] [[,]] 仍然能看到 `service.py`、`model.py` 和测试。

只有一个 Tab 时，按 [[g]] [[t]] 或 [[g]] [[T]]，画面当然不会有变化。现在有两个，它们会首尾相接地循环切换。

## 7. Picker 三种打开方式的决策表

[[Ctrl]]+[[v]]、[[Ctrl]]+[[s]]、[[Ctrl]]+[[t]] 是 Snacks Picker 的通用操作，[[Space]] [[/]] 搜出来的项目结果也一样适用。以后找到定义或引用时，可以直接决定要把它开在哪儿。

| 你当时的目标 | Picker 中按什么 | 结果 |
| --- | --- | --- |
| 只需查看当前结果，可以替换当前内容 | [[Enter]] | 在当前 Window 打开 |
| 并排对照两份代码 | [[Ctrl]]+[[v]] | 右侧竖分屏 |
| 上下对照实现与测试 | [[Ctrl]]+[[s]] | 下方横分屏 |
| 保留现有布局，另开一组窗口 | [[Ctrl]]+[[t]] | 新 Tab |

这组按键很方便，所以最好把它练成肌肉记忆，并反复运用，避免变成脂肪记忆：

> 先搜索或筛选，再用 [[Enter]] / [[Ctrl]]+[[v]] / [[Ctrl]]+[[s]] / [[Ctrl]]+[[t]] 选择打开位置。

## 8. 最终项目检查点

按 [[g]] [[T]] 回到三窗口 Tab，然后按 [[F1]]，输入 `wall`。

连按两次 [[Enter]] 保存所有文件。

![第 07 章最终三窗口检查点](screenshots/07-25-final-three-window-checkpoint.webp)

`src/pocket_tasks/` 下的两个核心源码文件应该是：

::: code-group

```python [model.py]
from dataclasses import dataclass

@dataclass(frozen=True)
class Task:
    title: str
    done: bool = False
```

```python [service.py]
from pocket_tasks.model import Task

def add_task(tasks: list[Task], title: str) -> list[Task]:
    return [*tasks, Task(title=title)]

def complete_task(tasks: list[Task], index: int) -> list[Task]:
    updated = list(tasks)
    task = updated[index]
    updated[index] = Task(title=task.title, done=True)
    return updated

def visible_titles(tasks: list[Task]) -> list[str]:
    return [task.title for task in tasks if not task.done]
```

:::

`tests/test_service.py` 应该有三个测试：

- `test_add_task`；
- `test_complete_task`；
- `test_visible_titles_hides_completed`。

`cli.py` 应该有 `main()`，并在文件末尾调用它。

屏幕上推荐摆成这样：

```text
Tab 1：服务开发
+----------------------+----------------------+
| service.py           |                      |
|                      | model.py             |
+----------------------+                      |
| test_service.py      |                      |
|                      |                      |
+----------------------+----------------------+

Tab 2：CLI
+---------------------------------------------+
| cli.py                                      |
+---------------------------------------------+
```

第 08 章会拿这些文件练习补全和 Copilot，第 09 章则会用 LSP 在定义、引用和诊断之间来回跳。现在，项目和窗口布局都已经准备好了。

## 本章肌肉记忆

| 目标 | 按键 |
| --- | --- |
| 打开 Buffer Picker | [[Space]] [[,]] |
| 卸载 Picker 当前 Buffer | [[Ctrl]]+[[x]]；结果列表中也可按 [[d]] [[d]] |
| 在右侧 / 下方 / 新 Tab 打开 Picker 结果 | [[Ctrl]]+[[v]] / [[Ctrl]]+[[s]] / [[Ctrl]]+[[t]] |
| 在 Window 间按方向移动 | [[Ctrl]]+[[w]] [[h]]/[[j]]/[[k]]/[[l]] |
| 均分 Window 尺寸 | [[Ctrl]]+[[w]] [[=]] |
| 关闭当前 Window | [[Ctrl]]+[[w]] [[q]] |
| 前往下一个 / 上一个 Tab | [[g]] [[t]] / [[g]] [[T]] |

上一章：[项目搜索与 Quickfix](06-search-and-quickfix.md) · 下一章：[补全与 Copilot](08-completion-and-copilot.md)
