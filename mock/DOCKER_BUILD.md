# n8n Docker 镜像编译与发布指南

本文档介绍如何将当前项目编译成 Docker 镜像，并上传到自定义的 Docker 仓库。

## 1. 前置条件

确保你的开发环境已经安装了以下工具：
- **Docker**: 用于构建和运行容器。
- **Node.js**: 推荐版本 v20+。
- **pnpm**: 项目使用的包管理器。

## 2. 编译并构建 Docker 镜像

项目提供了便捷的脚本 `scripts/dockerize-n8n.mjs` 来构建 Docker 镜像。你可以通过环境变量指定镜像名称和标签。

### 基本构建命令

在项目根目录下运行以下命令：

```bash
# 默认构建出来的镜像名为 n8nio/n8n:local
pnpm build:docker
```

### 构建自定义名称的镜像

如果你想构建推送到自己的仓库（例如 `my-registry.com/my-org/n8n`），可以使用 `IMAGE_BASE_NAME` 和 `IMAGE_TAG` 环境变量：

**Mac/Linux:**
```bash
# 替换为你自己的仓库地址和标签
export IMAGE_BASE_NAME=my-registry.com/my-org/n8n
export IMAGE_TAG=custom-v1

pnpm build:docker
```

**Windows (PowerShell):**
```powershell
$env:IMAGE_BASE_NAME="my-registry.com/my-org/n8n"
$env:IMAGE_TAG="custom-v1"

pnpm build:docker
```

该命令会自动执行以下步骤：
1. 编译 n8n 前端和后端代码 (`pnpm build:n8n`)。
2. 将编译产物打包到 Docker 镜像中。

## 3. 上传镜像到仓库

构建完成后，你可以直接使用 Docker 命令将镜像推送到你的仓库。

```bash
# 登录你的 Docker 仓库（如果需要）
docker login my-registry.com

# 推送镜像
docker push my-registry.com/my-org/n8n:custom-v1
```

## 4. 运行自定义镜像

推送成功后，你可以在服务器上拉取并运行该镜像。

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  my-registry.com/my-org/n8n:custom-v1
```

## 5. 构建跨平台镜像 (例如 Linux/AMD64)

如果你在 Mac (M1/M2/M3) 上开发，默认构建的是 `linux/arm64` 架构的镜像。如果你的服务器是普通的 Linux 服务器 (Intel/AMD CPU)，你需要指定目标平台为 `linux/amd64`。

```bash
# 指定目标平台为 linux/amd64
export DOCKER_PLATFORM=linux/amd64
export IMAGE_BASE_NAME=my-registry.com/my-org/n8n
export IMAGE_TAG=custom-v1

pnpm build:docker
```

> **注意**: 跨平台构建速度可能会比原生构建慢很多，因为需要使用 QEMU 模拟。

## 常见问题

### 构建过程中内存不足
如果构建过程中出现内存溢出错误，尝试增加 Node.js 的内存限制：
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build:docker
```

### 找不到 `compiled` 目录
`build:docker` 脚本会自动调用 `build:n8n` 生成 `compiled` 目录。如果手动分步执行，请确保先运行 `pnpm build:n8n`。

## 5. 清理构建产物

构建过程会占用较多磁盘空间，包括 Docker 缓存和本地编译文件。构建完成后，可以通过以下方式清理：

### 清理 Docker 缓存
这会删除未使用的构建缓存，释放大量空间：
```bash
docker builder prune
```

### 清理本地编译文件
构建生成的 `compiled` 目录在镜像构建完成后不再需要，可以手动删除：
```bash
rm -rf compiled
```
