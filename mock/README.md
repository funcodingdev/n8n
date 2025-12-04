# n8n 企业版解锁编译指南

如果你需要重新编译并应用修改后的 `base-command.js`，请按照以下步骤操作：

## 1. 准备工作
确保你已经安装了 `pnpm`。如果没有，请运行：
```bash
npm install -g pnpm
```

## 2. 安装依赖
在项目根目录下运行：
```bash
pnpm install
```

## 3. 编译项目
我们只需要编译 `n8n` 包。运行以下命令（使用 `npx` 调用 `turbo`）：
```bash
npx turbo run build --filter=n8n
```
*注意：编译过程可能需要几分钟。*

## 4. 拷贝产物
编译完成后，将生成的 `base-command.js` 拷贝到 `tmp` 目录供 Docker 使用。

**Mac/Linux:**
```bash
cp packages/cli/dist/commands/base-command.js mock/base-command.js
```

**Windows (PowerShell):**
```powershell
copy packages\cli\dist\commands\base-command.js mock\base-command.js
```

## 5. Docker添加挂载路径
使用新的产物启动服务：
**Mac/Linux:**
```bash
docker volume create n8n_data
docker run -it --rm --name n8n \
	-p 5678:5678 \
	-v n8n_data:/home/node/.n8n \
	-v $(pwd)/mock/base-command.js:/usr/local/lib/node_modules/n8n/dist/commands/base-command.js \
	docker.n8n.io/n8nio/n8n
```

**Windows (PowerShell):**
```bash
docker volume create n8n_data
docker run -it --rm --name n8n \
	-p 5678:5678 \
	-v n8n_data:/home/node/.n8n \
	-v ${PWD}\mock\base-command.js:/usr/local/lib/node_modules/n8n/dist/commands/base-command.js \
	docker.n8n.io/n8nio/n8n
```
