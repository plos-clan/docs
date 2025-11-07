# Calico: 一个“能跑”的 C23 编译器玩具

由 `Karesis` 开发的轻量级、零依赖、受 LLVM 启发的编译器工具套件。

**还在被 LLVM 千万行的 C++ 代码淹没吗？** 想找个小巧、纯 C、能拿来学习和“开刀”的玩具？来看看 `Calico` 吧！

这个项目最初是 `Karesis` 在 UCAS 的“编译原理”课程作业（当时它还叫 `calir`），后来不断“缝缝补补”就成了现在的 `Calico`。~~(实际上目前来说还是算作业，作者正在被UCAS堆集如山的作业与任务量打得满地找牙...)~~

* **GitHub 仓库**: [https://github.com/Karesis/calico](https://github.com/Karesis/calico)
* **完整文档**: [https://github.com/Karesis/calico/blob/main/docs/index.md](https://github.com/Karesis/calico/blob/main/docs/index.md)

---

##  开发工具(环境)

`Calico` 使用~~先进的~~C23 开发，并且**强依赖 Clang (v20+)**。

`gcc` 对一部分 C23 语法细节不那么兼容，索性就不支持了 (实际上是懒)

> 早期开发(比如`utils/`轮子中的`hashmap`或者`bump`)的时候有过跨平台的设计，然而随着开发逐渐就不想做了...

`MSVC`？ 不是哥们，你真的会用这个~~被印度程序员到处拉史的~~编译器开发项目? 至少我被坑过所以坚决不用（

## 它有啥？

`Calico` 专为学习和原型设计而生，但“麻雀虽小，五脏俱全”：

* 一个带**行级错误报告**的 `.cir` 文本解析器 (`ir/parser.h`)
* 一个能直接跑 IR 的**树遍历解释器** (`interpreter/interpreter.h`)
* 一套完整的分析遍（CFG、支配树、支配前沿） (`analysis/`)
* 帮你自动搞定 SSA 的 **Mem2Reg** 转换 (`transforms/mem2reg.h`)
* 一个严格的 **Verifier** (校验器)，专治各种不服（和 SSA 违规）

## 状态和“下一步画饼”

目前核心 IR、分析、解释器都已稳定（v0.1.0）。

**下一步计划：** 搞定 **RISC-V** 后端！（包括指令选择、图着色寄存器分配、ELF 发射器...）

欢迎大家来围观、提 issue、揪bug、写测试！

p.s. 我真的不是很擅长写测试（