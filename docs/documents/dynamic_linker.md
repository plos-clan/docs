# 动态链接器

动态链接库的出现大大减小了应用程序本体的大小, 并将程序拆分成多个库可以仅修改小部分文件而不是全部重新下载而实现软件自身的更新。 \
本教程是关于 ELF 格式的动态链接实现。

> 实际上改一改你也可以用在内核模块

你的 ELF 动态链接器需要完成：

* 加载 `PT_LOAD` 段
* 解析 `PT_DYNAMIC` 段
* 处理 `.rela.dyn` 和 `.rela.plt` 重定位
* 解析导出符号，并能调用动态库函数
* 修改 `.got` 进行函数替换

## ELF 文件解析

GNU 标准的 `elf.h` 可以从社区内操作系统项目内找到, 这里不再给出下载链接

### 头部校验

首先你要确保 ELF 文件头和架构是正确的, 这里我们编写一个简单的校验函数

```c
static bool test_head(Elf64_Ehdr *ehdr) {
    if (ehdr->e_ident[EI_MAG0] != ELFMAG0 ||
        ehdr->e_ident[EI_MAG1] != ELFMAG1 ||
        ehdr->e_ident[EI_MAG2] != ELFMAG2 ||
        ehdr->e_ident[EI_MAG3] != ELFMAG3 ||
        ehdr->e_version != EV_CURRENT || ehdr->e_ehsize != sizeof(Elf64_Ehdr) ||
        ehdr->e_phentsize != sizeof(Elf64_Phdr)){
        return false;
    }

/* 实际上你的项目如果支持更多架构也可以增加case条目
 * 这里我们仅用 x86 系列的架构为例子
 */
    switch (ehdr->e_machine) {
        case EM_X86_64:
        case EM_386:
            break;
        default:
            return false;
    }

    return true;
}
```

### 校验文件类型

程序头表描述了可执行文件或者共享库的 段 (Segment) 信息. \
这部分在我们初步获取 ELF 信息时是较为重点的关注对象

以下代码利用头表的信息校验了文件类型

```c
Elf64_Ehdr *ehdr = /* 我们假设你已经获取到头表了 */;

Elf64_Phdr phdr[12];
if (ehdr->e_phnum > sizeof(phdr) / sizeof(phdr[0]) || ehdr->e_phnum < 1) {
    printf("ELF file has wrong number of program headers");
    return;
}

if(ehdr->e_type != ET_DYN){
    printf("ELF file is not a dynamic library.");
    return;
}

Elf64_Phdr *phdrs = (Elf64_Phdr *)((char *)ehdr + ehdr->e_phoff);

size_t i = 0;
while (i < ehdr->e_phnum && phdrs[i].p_type != PT_LOAD){
    i++;
}
if (i == ehdr->e_phnum) {
    printf("ELF file has no loadable segments.");
    return;
}
```

## 加载ELF文件

这里与操作系统常规的加载ELF文件是一模一样的。 \
我们可以编写两个宏用于内存对齐

```c
#define PADDING_DOWN(size, to) ((size_t)(size) / (size_t)(to) * (size_t)(to))
#define PADDING_UP(size, to)   PADDING_DOWN((size_t)(size) + (size_t)(to) - (size_t)1, to)
```

接着是单个段的加载, 我们需要准备两个函数用于内存映射
> (或者在您自己的项目中用更简便的方法映射)

* `page_map_to(内核页表,虚拟地址,物理地址,页属性)` 将虚拟地址以指定的页属性映射到物理地址上
* `alloc_frames(需要分配的物理页框个数)` 分配一块物理地址

```c
// void* elf 形参就是elf文件数据区的基址
void load_segment(Elf64_Phdr *phdr, void *elf) {
    size_t hi = PADDING_UP(phdr->p_paddr + phdr->p_memsz, 0x1000);
    size_t lo = PADDING_DOWN(phdr->p_paddr, 0x1000);
    if ((phdr->p_flags & PF_R) && !(phdr->p_flags & PF_W)) {
        for (size_t i = lo; i < hi; i += 0x1000) {
            page_map_to(get_kernel_pagedir(), i, alloc_frames(1), PTE_PRESENT | PTE_WRITEABLE);
        }
    } else
        for (size_t i = lo; i < hi; i += 0x1000) {
            page_map_to(get_kernel_pagedir(), i, alloc_frames(1), PTE_PRESENT | PTE_WRITEABLE);
        }
    uint64_t p_vaddr  = (uint64_t)phdr->p_vaddr;
    uint64_t p_filesz = (uint64_t)phdr->p_filesz;
    uint64_t p_memsz  = (uint64_t)phdr->p_memsz;
    memcpy((void *)phdr->p_vaddr, elf + phdr->p_offset, phdr->p_memsz);

    if (p_memsz > p_filesz) { // 这个是bss段
        memset((void *)(p_vaddr + p_filesz), 0, p_memsz - p_filesz);
    }
}
```

然后我们用 `for` 循环遍历一遍段并调用写好的 `load_segment` 加载上去

```c
for (i = 0; i < ehdr->e_phnum; i++) {
    if (phdrs[i].p_type == PT_LOAD) {
        load_segment(&phdrs[i], (void *)ehdr);
    }
}
```

此时动态链接库已经被我们加载进操作系统内存, 我们开始着手链接

## 解析动态段

我们首先要获取动态段并提取出来, 往后的符号表和重定向表都需要用这个段

```c
Elf64_Dyn *dyn_entry = NULL;
for (int i = 0; i < ehdr->e_phnum; i++) {
    if (phdrs[i].p_type == PT_DYNAMIC) {
        dyn_entry = (Elf64_Dyn *)(phdrs[i].p_vaddr);
        break;
    }
}
if(dyn_entry == NULL){
    // 没有找到动态段
    return;
}
```

然后我们需要提取以下表项留作备用

```c
Elf64_Sym *symtab = NULL; //符号表
char *strtab = NULL; //字符串表
Elf64_Rela *rel = NULL; //重定向段
Elf64_Rela *jmprel = NULL; //跳转重定向段
size_t relsz = 0, jmprelsz = 0,symtabsz = 0;

while (dyn_entry->d_tag != DT_NULL) {
    switch (dyn_entry->d_tag) {
        case DT_SYMTAB: symtab = (Elf64_Sym *) dyn_entry->d_un.d_ptr; break;
        case DT_STRTAB: strtab = (char *) dyn_entry->d_un.d_ptr; break;
        case DT_RELA: rel = (Elf64_Rela *) dyn_entry->d_un.d_ptr; break;
        case DT_RELASZ: relsz = dyn_entry->d_un.d_val; break;
        case DT_JMPREL: jmprel = (Elf64_Rela *) dyn_entry->d_un.d_ptr; break;
        case DT_SYMENT: symtabsz = dyn_entry->d_un.d_val; break;
        case DT_PLTRELSZ: jmprelsz = dyn_entry->d_un.d_val; break;
        case DT_PLTGOT: break;
    }
    dyn_entry++;
}
```

接着我们需要解析一遍重定向表

```c
void *resolve_symbol(Elf64_Sym *symtab, uint32_t sym_idx) {
    return (void *)symtab[sym_idx].st_value;
}
```

```c
for (size_t i = 0; i < relsz / sizeof(Elf64_Rela); i++) {
    Elf64_Rela *r = &rel[i];
    uint64_t *reloc_addr = (uint64_t *)r->r_offset;
    uint32_t sym_idx = ELF64_R_SYM(r->r_info);
    uint32_t type = ELF64_R_TYPE(r->r_info);

    if (type == R_X86_64_GLOB_DAT || type == R_X86_64_JUMP_SLOT) {
        *reloc_addr = (uint64_t) resolve_symbol(symtab, strtab, sym_idx);
    } else if (type == R_X86_64_RELATIVE) {
        *reloc_addr = (uint64_t)((char *)ehdr + r->r_addend);
    }
}
```

## 重定向

无论是动态链接库还是应用程序本身, 都可能存在需要动态链接器需要进行重定向的函数或全局变量等, 我们接下来使用一个名为 `handle_relocations` 的函数负责重定向这些段

```c
void handle_relocations(Elf64_Rela *rela_start, Elf64_Sym *symtab, char *strtab，size_t jmprelsz) {
    Elf64_Rela *rela_plt   = rela_start;
    size_t      rela_count = jmprel_sz / sizeof(Elf64_Rela);
    for (size_t i = 0; i < rela_count; i++) {
        Elf64_Rela *rela        = &rela_plt[i];
        Elf64_Sym  *sym         = &symtab[ELF64_R_SYM(rela->r_info)];
        char       *sym_name    = &strtab[sym->st_name];

        // sym_name : 获取到的函数名 or 全局变量名
        *(void **)rela->r_offset = /*你需要替换成相应的函数指针地址或变量地址 */;
    }
}
```

## 查找导出函数

动态链接库会导出一些函数以供应用程序或其他动态链接库调用, 我们需要找出来这些函数来主动调用 or 被动调用。

据此，我们编写一个 `find_symbol_address` 函数负责查找这些符号

```c
void *find_symbol_address(const char *symbol_name, Elf64_Sym *symtab, char *strtab,size_t symtabsz) {
    for (size_t i = 0; i < symtabsz; i++) {
        Elf64_Sym *sym = &symtab[i];
        char *sym_name = &strtab[sym->st_name];
        if (strcmp(symbol_name, sym_name) == 0) {
            void *addr = (void *)sym->st_value;
            return addr;
        }
    }
    return NULL;
}
```

## 总结

本教程只是教学您实现一个非常简单的ELF动态链接器, 其还会有很多技术细节未被提到. \
在您完善项目后需要逐步实现它们。

> 有关于其他格式的动态链接库文件，如 `PE32+` 等需要您自己查找资料

本教程代码可以从 [CoolPotOS](https://github.com/plos-clan/CoolPotOS) 项目源码 `dlinker.c` 文件中找到.
