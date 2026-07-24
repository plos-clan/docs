# 10｜右侧终端、测试循环与手动格式化

这一章会把右侧终端接进日常编辑流程，并走完一次完整的“测试失败 → 修复 → 测试通过”循环。

## 本章新按键

| 按键 | 效果 |
| --- | --- |
| [[Ctrl]]+[[&#92;]] | 打开或隐藏 Snacks 终端 |
| 快速按两次 [[Esc]] | 从终端输入状态进入终端普通模式 |
| [[Ctrl]]+[[w]]，再按 [[h]]/[[l]] | 从终端移到左侧代码 / 回到右侧终端 |
| 终端普通模式中的 [[i]] | 回到终端输入状态 |
| [[Space]] [[c]] [[f]] | 用 Conform 手动格式化当前 Buffer |

## 开始前的项目检查点

至少应该有 `src/pocket_tasks/` 下的两个源码文件，以及 `tests/test_service.py`。

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

```python [test_service.py]
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

:::

少了哪份文件，就用 [[Space]] [[e]] 打开 Explorer，按 [[a]] 创建，再把对应代码填进去。保存时按 [[F1]] → `write` → [[Enter]] → [[Enter]]。

## 第一次打开终端

1. 确认光标在普通代码 Buffer 中。

![打开终端前的 cli.py](screenshots/10-01-cli-before-terminal.webp)

2. 按 [[Ctrl]]+[[&#92;]]。
3. 屏幕右侧出现一个竖向终端。
4. 光标进入终端输入状态，可以直接敲 shell 命令。

![右侧终端打开](screenshots/10-02-right-terminal-open.webp)

这个终端会沿用 Neovim 当前的工作目录。如果你是在 `pocket-tasks` 目录里运行 `nvim .`，终端打开后自然也会落在这里。

输入：

```console
PYTHONPATH=src python -m unittest -v
```

![输入测试命令](screenshots/10-03-test-command-input.webp)

按 [[Enter]]。三条测试应该都会通过。

![三条测试通过](screenshots/10-04-initial-tests-passed.webp)

### 隐藏和再次显示

在终端输入状态下直接按 [[Ctrl]]+[[&#92;]]，右侧窗口会隐藏起来，但里面的 shell 进程还活着。

![隐藏终端后的代码窗口](screenshots/10-05-terminal-hidden.webp)

再按一次同样的组合，它会连同刚才的输出一起回来。

![再次显示并保留测试输出](screenshots/10-06-terminal-restored.webp)

平时开发时，可以不断重复这套节奏：打开终端，跑测试，隐藏终端，修代码，再把终端叫回来，用上箭头重跑。

## 先运行一次失败测试

我们给服务层增加 `pending_count`。

### 第一步：先写测试

按 [[F1]]，输入 `edit`。

![用 F1 选择 edit 命令](screenshots/10-07-edit-command-picker.webp)

选中 `edit` 后按 [[Enter]]，在底部命令后补上 ` tests/test_service.py`，再按 [[Enter]] 打开文件。把导入改成：

```python
from pocket_tasks.service import (
    add_task,
    complete_task,
    pending_count,  # [!code error]
    visible_titles,
)
```

在类中加入：

```python
    def test_pending_count(self) -> None:
        tasks = [
            Task(title="first"),
            Task(title="second", done=True),
            Task(title="third"),
        ]
        self.assertEqual(pending_count(tasks), 2)  # [!code error]
```

![加入 pending_count 测试](screenshots/10-08-pending-test-added.webp)

保存当前文件。

![测试文件已保存](screenshots/10-09-pending-test-saved.webp)

### 第二步：运行失败测试

1. 按 [[Ctrl]]+[[&#92;]] 显示终端。
2. 按 [[Up]] 找回上一条测试命令。

![召回测试命令但尚未执行](screenshots/10-10-test-command-recalled.webp)

3. 按 [[Enter]]。

这次应该会出现 ImportError，因为服务层里还没有 `pending_count`。这个失败恰好说明，新测试确实碰到了那个尚未实现的需求。

![缺少 pending_count 的 ImportError](screenshots/10-11-missing-pending-count-failure.webp)

### 第三步：回代码实现

按 [[Ctrl]]+[[&#92;]] 隐藏终端，打开 `src/pocket_tasks/service.py`，在文件末尾加入：

```python
def pending_count(tasks: list[Task]) -> int:  # [!code ++]
    return sum(not task.done for task in tasks)  # [!code ++]
```

![实现 pending_count](screenshots/10-12-pending-count-implemented.webp)

然后保存文件。

### 第四步：重新运行测试直至通过

再次显示终端，先保留刚才的失败输出。

![重新显示之前的失败输出](screenshots/10-13-failure-output-restored.webp)

按 [[Up]]、[[Enter]] 重跑。四条测试应该会全部通过。

![四条测试全部通过](screenshots/10-14-four-tests-passed.webp)

这里不用单独的测试面板或测试按钮，直接在右侧终端里跑命令。这样不挑项目类型，python、cargo、make、pnpm 等命令都可以照常用。

## 终端暂时留在屏幕上

有时想一边看测试输出，一边改代码，那就不用把终端藏起来。

1. 在终端输入状态快速按两次 [[Esc]]，两次间隔控制在约 200 毫秒内。
2. 光标样式变化，终端进入普通模式。

![终端普通模式](screenshots/10-15-terminal-normal-mode.webp)

3. 按 [[Ctrl]]+[[w]]，再按 [[h]]，焦点会移到左侧代码。

![焦点移到左侧代码](screenshots/10-16-focus-moved-to-code.webp)

4. 按 [[Ctrl]]+[[w]]，再按 [[l]]，焦点回到终端。
5. 回到终端时通常会自动进入输入状态；如果还停在普通模式，再按 [[i]]。

![焦点回到终端](screenshots/10-17-focus-returned-to-terminal.webp)

在终端普通模式里，也可以按 [[q]] 隐藏终端。不过刚开始时只记 [[Ctrl]]+[[&#92;]] 就够用了。

## 从 Explorer 的当前目录开终端

Explorer 里还可以从指定目录打开终端：

1. 按 [[Space]] [[e]] 打开 Explorer。

![打开 Explorer](screenshots/10-18-explorer-opened-for-terminal.webp)

2. 把光标放到 `tests` 目录。

![选中 tests 目录](screenshots/10-19-tests-directory-selected.webp)

3. 按 [[Ctrl]]+[[t]]。

![从 tests 目录打开终端](screenshots/10-20-terminal-opened-in-tests.webp)

Snacks 会把选中的目录当成工作目录，再打开终端。临时要去某个子目录运行命令时，这种方式很方便。不过教程后面还是以全局的 [[Ctrl]]+[[&#92;]] 为主。

## 格式化练习：格式化 Nix 代码

目前格式化 Nix 用的是 `nixfmt`。而 Python 用的 BasedPyright 不带格式化能力，所以在 Python 文件里按格式化键，画面可能什么也不会变。

### 创建一份故意拥挤的文件

用 Explorer 回到项目根目录并把光标放在根目录上。

![Explorer 选中项目根目录](screenshots/10-21-project-root-selected.webp)

按 [[a]]，输入 `scratch.nix`。

![输入 scratch.nix 文件名](screenshots/10-22-scratch-nix-name-input.webp)

按 [[Enter]] 创建文件。

![scratch.nix 创建完成](screenshots/10-23-scratch-nix-created.webp)

打开文件，输入：

```nix
{ pkgs }:{ packages=[pkgs.python3 pkgs.git]; }
```

![输入故意拥挤的 Nix 代码](screenshots/10-24-unformatted-nix-entered.webp)

先保存一次。保存不会触发格式化，文件仍保持一行：

![未格式化文件已保存](screenshots/10-25-unformatted-nix-saved.webp)

然后执行：

1. 按 [[Esc]]。
2. 按 [[Space]] [[c]]，停一下查看 Which-key 中的 `Format`。

![Space c 后显示 Format](screenshots/10-26-code-which-key-format.webp)

3. 按 [[f]]，等一小会儿。格式化是异步执行的。

文件应该会展开成清楚的多行结构。前面创建的 `.editorconfig` 会让 Nix 使用两个空格缩进。

![nixfmt 格式化后的多行结构](screenshots/10-27-nix-formatted.webp)

格式化结束后，Buffer 会变成已修改状态。再用 [[F1]] → `write` → [[Enter]] → [[Enter]] 保存。

![格式化结果已保存](screenshots/10-28-formatted-nix-saved.webp)

### 格式化键的准确语义

- 它只处理当前 Buffer。
- 它不会自动保存。
- 配置关闭了保存时自动格式化。
- 有显式 Conform 格式器时优先使用它。
- 没有显式格式器时，Conform 会尝试支持格式化的 LSP。
- Python 的 BasedPyright 没有格式化能力，建议由项目以后自行加入 Ruff 或 Black。

::: details 格式化按键毫无反应

1. 按 [[F1]]。
2. 输入 `ConformInfo`。

![选择 ConformInfo](screenshots/10-29-conform-info-picker.webp)

3. 连按两次回车，查看当前文件类型可用的格式器。

![ConformInfo 显示 nixfmt 已就绪](screenshots/10-30-conform-info-opened.webp)

:::

## 日常测试循环模板

以后可以按这个顺序完成一次测试循环：

1. 写一个失败测试。
2. 保存。
3. [[Ctrl]]+[[&#92;]] 打开终端。
4. [[Up]]、[[Enter]] 重跑。
5. [[Ctrl]]+[[&#92;]] 隐藏终端。
6. 修最少的代码。
7. 再跑测试。
8. 测试通过后按 [[Space]] [[c]] [[f]]。
9. 等格式化完成，再保存。

## 隋唐小测

- 打开和隐藏右侧终端：[[Ctrl]]+[[&#92;]]
- 保留终端可见并跳到左侧代码：双 [[Esc]]，然后 [[Ctrl]]+[[w]] [[h]]
- 回终端并继续输入：[[Ctrl]]+[[w]] [[l]]；若没有自动进入输入状态，再按 [[i]]
- 手动格式化当前 Buffer：[[Space]] [[c]] [[f]]
- 格式化后还要做什么：等待完成并保存

下一章进入 [11：Git 变更块](11-git-hunks.md)。测试通过以后，接着检查并整理本次修改。
