# 修复 Vercel 部署错误

## 已修复的问题

### 1. ESLint 配置错误
- **问题**：`next/typescript` 配置不存在
- **解决**：移除了 `next/typescript`，只保留 `next/core-web-vitals`

### 2. TypeScript 类型错误
- **问题**：缺少 `markdown-it` 的类型声明
- **解决**：添加了 `@types/markdown-it` 到 `devDependencies`

## 下一步操作

### 1. 更新本地依赖

在项目文件夹中执行：

```bash
npm install
```

这会安装新添加的 `@types/markdown-it` 包。

### 2. 提交更改到 GitHub

```bash
git add package.json .eslintrc.json
git commit -m "Fix: 修复 Vercel 部署错误 - 添加类型声明和修复 ESLint 配置"
git push
```

### 3. Vercel 会自动重新部署

- Vercel 检测到 GitHub 推送后会自动重新部署
- 或者手动在 Vercel 控制台点击 "Redeploy"

## 验证修复

部署成功后，应该不再有这些错误：
- ✅ ESLint 配置错误已修复
- ✅ TypeScript 类型错误已修复

