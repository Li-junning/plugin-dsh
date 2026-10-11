# 在另一台电脑安装拜仁启动插件

版本：0.1.8。只迁移插件，不包含模型配置、API Key、会话或原电脑设置。

## Windows 桌面版

1. 在目标电脑安装并正常运行一次 DeepSeek Harness，然后完整退出应用。
2. 解压“01-其他电脑安装-v0.1.8.zip”。在包含 dsh-bayern-boot-0.1.8.tgz 的文件夹打开 PowerShell。
3. 找到目标电脑的 DeepSeek Harness.exe，记下它所在的文件夹。执行：

```powershell
$harnessFolder = Read-Host "请输入 DeepSeek Harness.exe 所在文件夹"
$dsh = Join-Path $harnessFolder "resources\runtime\cli\bin\dsh.cmd"
if (-not (Test-Path -LiteralPath $dsh)) { throw "未找到随附 CLI，请核对安装目录" }
& $dsh plugin --profile desktop add ".\dsh-bayern-boot-0.1.8.tgz" --ignore-scripts
```

4. 安装成功后重新打开 DeepSeek Harness。动画播放 9 秒，停留 1 秒后自动进入。

如果 dsh 已在 PATH 中，可以直接使用：

```powershell
dsh plugin --profile desktop add ".\dsh-bayern-boot-0.1.8.tgz" --ignore-scripts
```

这里的 desktop 是默认桌面 profile。若当前使用其他 profile，替换为实际名称；Web 版通常使用 web。不要把插件的 package.json 覆盖到用户的 profile 目录，安装命令会维护启用清单。

本插件没有 npm 运行依赖，tgz 包内已包含正式客户端、样式和队徽。无需 npm install、源码编译或手动复制用户配置。已经准备好宿主与包管理器缓存时，可在安装命令末尾添加 --offline；首次安装宿主组件是否需要联网由宿主决定。

## 从 GitHub 安装

仓库地址：https://github.com/Li-junning/plugin-dsh。使用下面的命令安装：

```powershell
dsh plugin --profile desktop add "github:Li-junning/plugin-dsh" --ignore-scripts
```

若 dsh 不在 PATH，先像上面那样设置 $dsh，再执行：

```powershell
& $dsh plugin --profile desktop add "github:Li-junning/plugin-dsh" --ignore-scripts
```

仓库创建 v0.1.8 标签后，可使用 `github:Li-junning/plugin-dsh#v0.1.8`。GitHub 安装拉取仓库内容；仅上传一个 ZIP 文件到仓库，不能代替仓库根目录的 package.json 和 lib/。如果只上传 tgz 到 GitHub Releases，先下载 tgz 再按本地方式安装。

## 卸载

```powershell
& $dsh plugin --profile desktop remove dsh-bayern-boot
```

若直接使用 PATH 中的 dsh，去掉命令开头的 `& $dsh`，换成 `dsh`。卸载后完整退出并重新打开 Harness。

## 验证范围

已核对 Desktop 0.2.0-rc.2 的本机安装声明和客户端链接；正式客户端通过本地 Edge 播放、跳过、缩减动画、自动进入及多窗口布局验证。其他电脑仍需使用其实际安装目录和 profile；尚未在第二台实体电脑运行。

参考：[DSH 官方打包与安装文档](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)。
