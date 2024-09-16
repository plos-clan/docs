# CoolPotOS 应用程序开发文档

适用于`CoolPotOS`的应用程序API开发文档

## 环境搭建

在开发`CoolPotOS`内置应用之前, 您需要fork`plos-clan/CoolPotOS`存储库到您的github仓库下并clone下来,
然后在`apps`文件夹下新建一个文件夹, 名字是您自己的应用程序名称.

然后在`apps/Makefile`脚本中的`default`构建规则新增一条`make -r -C <您的文件夹名称>`
以及在`clean`目标加上对应的`make -r -C <您的文件夹名称> clean`

> 注意, 如果您编写的是静态库,以供其他程序调用, 您需要在您的文件夹前加上`lib`字样, 这是一个命名标准 \
> 以及在`default`构建目标上将您的构建命令加入到应用程序的构建命令之前 \
> 您将在`apps/include`文件夹中创建一个头文件以声明该库的可调用接口

最后, 在您确保您的app可以运行的情况下, 向仓库提交一个PR吧!

### 项目结构

```
> app_name
    <dir> out //用于存储目标文件
    <file> *.c // C源文件
    <file> *.cpp // CPP源文件
    <file> *.asm // 汇编文件
    <file> Makefile // Makefile构建脚本
```

### Makefile 文件

* 应用程序构建脚本

    ```Makefile
    OBJS_PACK = out/main.obj # 源文件对应的目标文件
    include ../def.mk # 在 apps/def.mk 中

    default: $(OBJS_PACK) # 默认构建目标, 用于构建出可执行文件
    	$(LINK) $(OBJS_PACK) $(BASIC_LIB_C) -o ../../isodir/apps/<你的应用程序输出名称, 如app.elf/app.bin>
    out/%.obj : %.c Makefile
    	$(C) -c $*.c -o out/$*.obj
    out/%.obj : %.cpp Makefile
    	$(CPP) -c $*.cpp -o out/$*.obj
    out/%.obj : %.asm Makefile
    	nasm -f elf_i386 $*.asm -o out/$*.obj

    clean: # 必须目标, 用于清除out目录下的目标文件
    	rm out/*    
    ```

* 静态库构建脚本

    ```Makefile
    OBJS_PACK = out/libmain.obj # 源文件对应的目标文件
    include ../def.mk # 在 apps/def.mk 中

    default: $(OBJS_PACK) # 默认构建目标, 用于构建出可执行文件
    	ar rv ../libo/lib<可以是您的库的缩写>.a $(OBJS_PACK)
    out/%.obj : %.c Makefile
    	gcc -m32 -I../include -nostdlib -fno-builtin -ffreestanding -fno-stack-protector -Qn -fno-pic -fno-pie -fno-asynchronous-unwind-tables -fomit-frame-pointer -march=pentium -O0 -w -c $*.c -o out/$*.obj
    out/%.obj : %.cpp Makefile
    	gcc -m32 -I../include -nostdinc -nostdlib -fno-builtin -ffreestanding -fno-stack-protector -Qn -fno-pic -fno-pie -fno-asynchronous-unwind-tables -fomit-frame-pointer -march=pentium -O0 -w -c $*.cpp -o out/$*.obj
    out/%.obj : %.asm Makefile
    	nasm -f elf_i386 $*.asm -o out/$*.obj

    clean: # 必须目标, 用于清除out目录下的目标文件和静态库文件
    	rm out/*
        rm ../libo/lib<库缩写>.a
    ```

## 第一个源文件

* `main.c`

```C 
#include <stdio.h>

int main(int argc,char** argv){
    printf("Hello! CoolPotOS!\n");
    return 0;
}
```

* 然后在控制台运行`python build.py`构建整个OS源码(会包括apps部分的构建), \
  等待qemu虚拟机的启动
* 然后在shell中输入你的程序完整名称(包括后缀名), 然后按下回车. \
  如果在控制台看到`Hello! CoolPotOS!`字样代表编译成功

## 开发接口

* 前往 [开发接口文档](/devlop/cpos_doc)