# 配置 GitHub Token 指南

## 问题
Vercel 使用只读文件系统，无法直接写入文件。需要使用 GitHub API 来提交文件。

## 解决方案：使用 GitHub API

我已经修改了代码，现在会通过 GitHub API 提交文件到仓库。

## 步骤 1：生成 GitHub Personal Access Token

1. **访问 GitHub Token 设置**：
   - https://github.com/settings/tokens
   - 或者：GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **生成新 Token**：
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写信息：
     - **Note**: `Vercel Deployment`（描述用途）
     - **Expiration**: 选择过期时间（建议选择较长时间，如 90 天或 1 年）
     - **权限**：勾选 `repo`（这会自动勾选所有 repo 相关权限）
   - 点击 "Generate token"

3. **复制 Token**：
   - **重要**：Token 只显示一次，请立即复制并保存
   - 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 步骤 2：在 Vercel 中添加环境变量

1. **进入 Vercel 项目设置**：
   - 登录 Vercel
   - 选择您的项目
   - 点击 "Settings"

2. **添加环境变量**：
   - 在左侧菜单选择 "Environment Variables"
   - 添加以下变量：

   **变量 1：GITHUB_TOKEN**
   - Key: `GITHUB_TOKEN`
   - Value: 粘贴刚才复制的 Token
   - 环境：全部勾选（Production, Preview, Development）

   **变量 2：GITHUB_OWNER**（可选，如果仓库所有者不是 dalidakun）
   - Key: `GITHUB_OWNER`
   - Value: `dalidakun`（或您的 GitHub 用户名）
   - 环境：全部勾选

   **变量 3：GITHUB_REPO**（可选，如果仓库名不是 survival-skills）
   - Key: `GITHUB_REPO`
   - Value: `survival-skills`（或您的仓库名）
   - 环境：全部勾选

3. **保存并重新部署**：
   - 点击 "Save"
   - 进入 "Deployments" 标签
   - 找到最新的部署，点击 "..." → "Redeploy"

## 步骤 3：验证配置

1. **等待重新部署完成**（约 1-2 分钟）

2. **测试管理功能**：
   - 访问您的网站
   - 点击 "管理" 菜单
   - 输入管理员密码登录
   - 尝试添加一篇文章

3. **检查 GitHub 仓库**：
   - 访问：https://github.com/dalidakun/survival-skills
   - 应该能看到新提交的文件

## 工作原理

1. 您在网站管理后台添加文章
2. 系统通过 GitHub API 提交文件到仓库
3. GitHub 触发 webhook
4. Vercel 检测到仓库更新
5. Vercel 自动重新部署（约 1-2 分钟）
6. 新文章在网站上可见

## 注意事项

1. **Token 安全**：
   - 不要将 Token 提交到 Git
   - 只在 Vercel 环境变量中保存
   - 如果泄露，立即撤销并重新生成

2. **部署时间**：
   - 添加文章后，需要等待 Vercel 重新部署
   - 通常需要 1-2 分钟
   - 可以在 Vercel 控制台查看部署状态

3. **文件更新**：
   - 如果文章已存在，会更新而不是创建新文件
   - 使用相同的 slug（标题生成的）会更新原文件

## 故障排除

### 问题：提示 "GitHub Token 未配置"
- 检查 Vercel 环境变量中是否添加了 `GITHUB_TOKEN`
- 确保已重新部署

### 问题：提示 "提交到 GitHub 失败"
- 检查 Token 是否有 `repo` 权限
- 检查仓库名和所有者是否正确
- 查看 Vercel 日志获取详细错误信息

### 问题：文件提交成功但网站没有更新
- 等待 1-2 分钟让 Vercel 自动部署
- 检查 Vercel 控制台的部署状态
- 确认 GitHub 仓库中有新提交

