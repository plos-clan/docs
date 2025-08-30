# 自制OS教程#1 : 步入bootloader的大门

~~这里什么也没有~~<br>

什么，你问我怎么写引导？<br>
手写MBR？<br>
借助GNU-EFI或者EDK2这样的强大工具编写UEFI引导？<br>
或者是GRUB？<br>
今天让我帮你脱离苦海😋<br>
LIMINE！永远真神！<br>
放弃困难，选择limine！<br>
阿门！<br>


~~首先，在你自己的os源码文件夹下面从github拉取limine~~<br>
你可以用我们社区提供的**[Limine C Xmake Template](https://github.com/plos-clan/limine-xmake-template)**引导模板即可<br>

直接像这样操作:<br>
```bash
git clone https://github.com/plos-clan/limine-xmake-template.git
```

你可能会问：什么，如此简单？<br>
是的是的你说的对，确实如此简单<br>

接下来要干什么？<br>
~~特么仓库readme.md不看么~~<br>
嗯，你就可以在src/main.c开始你的旅程辣！<br>
