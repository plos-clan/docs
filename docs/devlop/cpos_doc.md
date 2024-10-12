# CoolPotOS 开发接口文档

## stdio.h

CPOS已实现C语言标准库 `stdio` 中的函数, 其用法与功能和原标准库基本相同

```C
int getc(); //获取可显示字符
int getch(); //获取键盘输入的所有字符
void ungetc(char c,FILE *stream); //向缓冲区返还一个字符

int puts(const char *s); //打印字符串
void put_char(char a); //打印一个字符
int printf(const char* fmt, ...); //格式化输出
void print(const char* msg); //与puts作用相同

int scanf(const char *format, ...); //获取控制台输入 (只实现了 %s %c %d 三种格式化, 以下scanf同理)
int vsscanf(const char *restrict s, const char *restrict fmt, va_list ap); 
int sscanf(const char *restrict s, const char *restrict fmt, ...); //根据字符串提取数据
int vfscanf(FILE * f, const char * fmt, va_list ap); //获取指定流中的输入

int vsprintf(char *buf, const char *fmt, va_list args); 
int vsnprintf(char *buf, size_t n, const char *fmt, va_list ap);
int sprintf(char *buf, const char *fmt, ...); //格式化字符串拼接
int snprintf(char *s, size_t n, const char *fmt, ...); //格式化指定大小的字符串拼接

int fgetc(FILE *stream); //从指定流中读取字符
FILE *fopen(char *filename, char *mode); // 打开一个文件
unsigned int fread(void *buffer, unsigned int size, unsigned int count, FILE *stream); //从指定流中读取指定大小的字符串至buffer
int fclose(FILE *fp); //关闭一个流
char *fgets(char *str, int n, FILE *stream); //从指定流中读取一行字符串
int fputs(const char *str, FILE *stream); //向流写入字符串
int fprintf(FILE *stream, const char *format, ...); //向流写入格式化字符串
int fputc(int ch, FILE *stream); //向流写入一个字符
int fflush(FILE *stream); //刷新流缓冲区
unsigned int fwrite(const void *ptr, unsigned int size, unsigned int nmemb,FILE *stream); // 向流从ptr写入指定大小的数据
int fseek(FILE *fp, int offset, int whence); //设置流 stream 的文件位置为给定的偏移 offset
long ftell(FILE *stream);//返回给定流的当前文件位置
int feof(FILE *stream); //判断文件读取是否结束
int ferror(FILE *stream);//测试文件流是否发生错误
```

## stdlib.h

CPOS已实现C语言标准库 `stdlib` 中的函数, 其用法与功能和原标准库基本相同

```C
long long atoi(const char* s); //将字符串转换为数字
void *malloc(size_t size); //向OS申请一块指定大小的可用内存
void free(void *ptr); //释放一块已申请的内存
void exit(int code); //退出程序
void *realloc(void *ptr, uint32_t size); //重新分配一块内存
void *calloc(size_t n, size_t size); //向OS申请一块 n * size 大小并经过初始化的内存
void abort(); //立即终止程序, 并返回异常状态码, 和 exit(-1) 作用相同 
long strtol(const char *cp, char **endp, unsigned int base); //将字符串转换为长整数
int system(char *command); //执行命令
```

## string.h

CPOS已实现C语言标准库 `string` 中的函数, 其用法与功能和原标准库基本相同

```C
const char* memchr(const char* buf,char c,unsigned long long count);  //检索字符串第一次出现的指定字符,并返回指向该字符的指针
void *memmove(void *dest, const void *src, size_t num); //移动一块内存
void *memset(void *s, int c, size_t n); //设置一块内存的数据
int memcmp(const void *a_, const void *b_, uint32_t size); //比较一块内存
void* memcpy(void* s, const void* ct, size_t n); //拷贝一块内存

size_t strlen(const char *str); //获取字符串长度
int strcmp(const char *s1, const char *s2); //比较两个字符串, 如果一样返回false
char *strcpy(char *dest, const char *src); //拷贝一个字符串
char *strcat(char *dest, const char *src); //把一个字符串追加到另一个字符串末尾
const char* strstr(const char *str1,const char *str2); //在字符串str1中查找第一个字符串str2出现的位置
char *strdup(const char *str); //将字符串复制到新建立的空间
char *strchr(const char *s, const char ch);
size_t strspn(const char * string,const char * control);
char* strpbrk(const char* str, const char* strCharSet);
int strcoll(const char *str1, const char *str2);
double strtod(const char *nptr, char **endptr);

char* strncat(char* dest,const char* src,unsigned long long count);
size_t strnlen(const char *s, size_t maxlen);
char* strncpy(char* dest, const char* src,unsigned long long count);
int strncmp(const char *s1, const char *s2, size_t n);
```

## ctype.h

CPOS已实现C语言标准库 `ctype` 中的函数, 其用法与功能和原标准库基本相同

```C
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include <stdarg.h>

int ispunct(char ch);
char toupper(char ch);
char tolower(char ch);
int iscsymf(int ch);
int isascll(char ch);
int iscntrl(char ch);
int isxdigit(int c);
int isspace(int c);
int isdigit(int c);
int isalpha(int c);
int isupper(int c);
int isprint(int c);
int isgraph(int c);
int islower(int c);
int isalnum(int c);
```

## math.h

CPOS已实现C语言标准库 `math` 中的函数, 其用法与功能和原标准库基本相同

```C
void srandlevel(unsigned short randlevel_);
void smax(unsigned short max_b);
int32_t abs(int32_t x);
double pow(double a, long long b);
unsigned long long ull_pow(unsigned long long a, unsigned long long b);
double sqrt(double x);
float q_sqrt(float number);
double mod(double x, double y);
double sin(double x);
double cos(double x);
double tan(double x);
double asin(double x);
double acos(double x);
double atan(double x);
double atan2(double y, double x);
double floor(double x);
double modf(double x, double *iptr);
double fabs(double x);
double ceil(double x);
double frexp(double x, int *e);
double scalbln(double x, long n);
double ldexp(double x, int n);
float scalbnf(float x, int n);
double scalbn(double x, int n);
double fmod(double x, double y);
double log10(double x);
double log2(float x);
double log(double a);
double exp(double x);
float roundf(float x);
```

## cpos.h

CPOS特有的API接口

```C
struct sysinfo{
    char osname[50];
    char kenlname[50];
    char cpu_vendor[64];
    char cpu_name[64];
    unsigned int phy_mem_size;
    unsigned int pci_device;
    unsigned int frame_width;
    unsigned int frame_height;
    uint32_t year;
    uint32_t mon;
    uint32_t day;
    uint32_t hour;
    uint32_t min;
    uint32_t sec;
};

static inline void get_sysinfo(struct sysinfo *info); //获取系统信息
static inline int exec_elf(const char* filename,const char* args,int is_async); //创建一个子进程
static inline void draw_bitmap(int x,int y,int width,int height,char* bitmap); //绘制位图到屏幕
static inline void screen_clear(); //清空屏幕
```

## syscall.h

CPOS提供的系统调用函数, 非必要情况下不建议用户程序直接调用

```C
void syscall_print(char *c); //向图形帧缓冲区写入一个字符串
void syscall_putchar(char c); //向图形帧缓冲区写入一个字符
char syscall_getch();  //获取键盘输入
void *syscall_malloc(size_t size); //申请一页4K对齐的内存(供用户堆实现程序申请,且size是的单位是4K) 
void syscall_free(void *ptr); //释放一页内存(由用户堆实现程序释放)
void syscall_exit(int code); //退出程序
void syscall_g_clean(); //清空图形帧缓冲区
void syscall_get_cd(char *buffer); //获取当前VFS焦点目录的名称
int syscall_vfs_filesize(char *filename); //获取文件大小
void syscall_vfs_readfile(char *filename, char *buffer); //读取文件
void syscall_vfs_writefile(char *filename, char *buffer, unsigned int size); //写入文件
void *syscall_sysinfo(); //获取系统信息, cpos.h中get_sysinfo的底层实现
int syscall_exec(char *filename, char *args, int is_async); //开启一个子进程 is_async指定是否可以异步执行
void syscall_vfs_change_path(const char *path); //更改VFS的焦点目录
char *syscall_get_arg(); //获取程序运行实参
long syscall_clock(); //程序从运行到现在使用了多少CPU时间片
void syscall_sleep(uint32_t timer); //程序休眠指定毫秒数
int syscall_vfs_remove_file(char *filename); //删除一个文件
int syscall_vfs_rename(char *filename1, char *filename2); //重命名一个文件
uint32_t *syscall_framebuffer(); //获取程序的图形帧缓冲区
void syscall_draw_bitmap(int x,int y,int width,int height,char* bitmap); //向图形缓冲区指定位置绘制bitmap
```

## 其他

你可能还注意到`apps/include`中有其他的头文件定义, 但文档并未给出说明

这些头文件要么是未完全实现的接口,要么存在已知BUG无法使用, 要么不属于app默认的C语言库

> 还有一点原因是文档写不动了, 等后期更新罢2 3 3