# 上传 GitHub 与分发

## 第一次发布

1. 目标仓库为 [Li-junning/plugin-dsh](https://github.com/Li-junning/plugin-dsh)。
2. 解压“02-GitHub上传-v0.1.9.zip”，上传其中 dsh-bayern-boot 文件夹里的内容。package.json 应直接位于仓库根目录，不要在 GitHub 中再多套一层目录，也不要只上传 ZIP。
3. 一并上传 lib/client.js 和 lib/index.js。本版已构建，package.json 没有 prepare、install 或 postinstall 脚本，安装不需要重新编译。
4. 提交完成后，可在其他电脑执行：

```powershell
dsh plugin --profile desktop add "github:Li-junning/plugin-dsh" --ignore-scripts
```

5. 可选：创建 v0.1.9 标签及 Release，附上 dsh-bayern-boot-0.1.9.tgz。之后用户可以使用带 #v0.1.9 的 GitHub 地址固定版本，或下载 tgz 本地安装。

无需先发布 npm 包。private: true 只用于防止误发布到 npm，不影响 GitHub 仓库与本地 tgz 分发。

## 后续更新

修改 src/ 或 assets/ 后：更新 package.json 的 version，执行以下命令，并提交新版 lib/：

```sh
node scripts/build.mjs
node scripts/verify.mjs
npm pack --ignore-scripts
```

将生成的 tgz 放到对应 GitHub Release。预览页中的版本号和客户端 URL 也应同步更新。

上传包不包含本机安装记录、宿主 profile 备份、验证输出、缓存或旧版压缩包。保留 LICENSE、NOTICE.md 及 references/550w-LICENSE.txt。

## 仓库文件

- package.json、cordis.patch.yml、lib/：安装入口与正式构建。
- src/、assets/、scripts/build.mjs：修改和构建。
- scripts/verify.mjs：可独立运行的基础验证。
- tools/preview.html、打开拜仁启动预览.cmd：离线预览。
- README.md、INSTALL.md、PUBLISH.md：使用和发布说明。
- LICENSE、NOTICE.md、references/550w-LICENSE.txt：许可与来源。

官方依据：[DSH 打包与安装](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)；[pnpm 支持的包来源](https://pnpm.io/package-sources)。
