# MIA SAN MIA · 拜仁启动插件

DeepSeek Harness 的非官方拜仁球迷开场插件，版本 **0.1.9**。

安联球场风格的红色气枕外墙、拜仁队徽与 MIA SAN MIA 标题。开场播放 9 秒，定格停留 1 秒后自动淡出进入 DSH；任意普通按键、Esc 或右下角按钮可随时跳过。默认无声，资源全部内联，播放不请求网络。底部不显示进度条和阶段标签。

支持带有 Web 客户端界面的 Harness；本机安装核对基于 Desktop 0.2.0-rc.2。宿主等待页与动画之间使用约 1 秒的渐变衔接。系统开启缩减动画时，显示静态终态 1 秒后自动进入。

深浅色自动跟随系统：深色保留夜场氛围；浅色使用暖白背景、深红标题、银白屋顶和白天球场配色。系统配色变化时无需重播，动画继续当前进度。预览页与正式插件一致，直接跟随系统，不提供手动配色切换。

## 安装

目标电脑先安装 DeepSeek Harness。详情见 [安装说明](INSTALL.md)。

从本地安装包安装（在 tgz 所在目录运行）：

```powershell
dsh plugin --profile desktop add ".\dsh-bayern-boot-0.1.9.tgz" --ignore-scripts
```

若桌面版没有把 dsh 加入 PATH，在 PowerShell 指定 **DeepSeek Harness.exe 所在目录**，使用应用随附的 CLI：

```powershell
$harnessFolder = Read-Host "请输入 DeepSeek Harness.exe 所在文件夹"
$dsh = Join-Path $harnessFolder "resources\runtime\cli\bin\dsh.cmd"
& $dsh plugin --profile desktop add ".\dsh-bayern-boot-0.1.9.tgz" --ignore-scripts
```

从 GitHub 仓库安装：

```powershell
dsh plugin --profile desktop add "github:Li-junning/plugin-dsh" --ignore-scripts
```

创建了 v0.1.9 标签后，可在地址末尾加 `#v0.1.9` 固定版本。仓库根目录必须包含 package.json、cordis.patch.yml 和完整 lib/。本项目直接提交编译好的 lib/，安装无需执行 build 或 prepare。GitHub 安装需要能访问 GitHub；本地 tgz 不需要下载插件代码。

`desktop` 是默认桌面配置名；若使用其他配置，请替换成实际名称。安装后完整退出并重新打开 Harness。卸载命令：

```powershell
dsh plugin --profile desktop remove dsh-bayern-boot
```

## 预览与修改

直接打开 tools/preview.html，或在 Windows 双击“打开拜仁启动预览.cmd”。无需安装依赖或联网。预览页底部的播放控制仅用于预览，不出现在正式插件中；退出后的欢迎页是宿主占位。

src/ 保存动画源码，assets/ 保存原始队徽，lib/ 保存正式客户端和宿主入口。构建和基础验证只使用 Node.js 标准库：

```sh
node scripts/build.mjs
node scripts/verify.mjs
```

修改源码后重新构建，并将更新后的 lib/ 一并提交。发布步骤见 [GitHub 发布说明](PUBLISH.md)。

## 来源

非官方球迷作品，代码采用 MIT 许可；俱乐部名称与队徽权利归原权利人，详情见 NOTICE.md。节奏参考 [dsh-550w-boot](https://github.com/kalashinnikov/dsh-550w-boot)，保留其许可说明。

安装机制参考 [DSH 官方打包与安装文档](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)。
