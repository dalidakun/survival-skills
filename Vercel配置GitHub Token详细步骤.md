# Vercel 配置 GitHub Token 详细步骤

## 当前状态
代码已更新，但需要在 Vercel 中添加 `GITHUB_TOKEN` 环境变量。

## 步骤 1：确认已生成 GitHub Token

如果您还没有生成 Token，请先完成：

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写：
   - **Note**: `Survival Skills Vercel`（或任何名称）
   - **Expiration**: 选择过期时间（建议 90 天或 1 年）
   - **权限**: 勾选 `repo`（会自动勾选所有 repo 权限）
4. 点击 "Generate token"
5. **立即复制 Token**（格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

## 步骤 2：在 Vercel 中添加环境变量

### 2.1 进入 Vercel 项目设置

1. 访问：https://vercel.com
2. 登录您的账号
3. 在项目列表中找到您的项目（survival-skills）
4. 点击项目进入项目页面

### 2.2 打开环境变量设置

1. 点击顶部菜单的 **"Settings"**（设置）
2. 在左侧菜单中找到 **"Environment Variables"**（环境变量）
3. 点击进入

### 2.3 添加 GITHUB_TOKEN

1. 在环境变量页面，您会看到三个输入框：
   - **Key**（键名）
   - **Value**（值）
   - **Environment**（环境）

2. 填写信息：
   - **Key**: 输入 `GITHUB_TOKEN`（注意大小写）
   - **Value**: 粘贴刚才复制的 GitHub Token
   - **Environment**: 勾选所有三个选项：
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. 点击 **"Save"**（保存）按钮

### 2.4 添加其他环境变量（可选）

如果您的仓库信息不是默认值，可以添加：

**GITHUB_OWNER**（如果仓库所有者不是 dalidakun）：
- Key: `GITHUB_OWNER`
- Value: `dalidakun`（或您的 GitHub 用户名）
- Environment: 全部勾选

**GITHUB_REPO**（如果仓库名不是 survival-skills）：
- Key: `GITHUB_REPO`
- Value: `survival-skills`（或您的仓库名）
- Environment: 全部勾选

## 步骤 3：重新部署项目

**重要**：添加环境变量后，必须重新部署才能生效！

### 方法 1：通过 Deployments 重新部署

1. 点击顶部菜单的 **"Deployments"**（部署）
2. 找到最新的部署记录（最上面的）
3. 点击右侧的 **"..."**（三个点）菜单
4. 选择 **"Redeploy"**（重新部署）
5. 确认重新部署

### 方法 2：通过 Settings 重新部署

1. 在 Settings 页面
2. 添加环境变量后，页面可能会提示重新部署
3. 点击提示中的重新部署链接

## 步骤 4：验证配置

1. **等待部署完成**（约 1-2 分钟）
   - 在 Deployments 页面可以看到部署进度
   - 状态变为 "Ready" 表示部署完成

2. **测试管理功能**：
   - 访问您的网站
   - 点击 "管理" 菜单
   - 输入管理员密码登录
   - 尝试添加一篇文章
   - 应该不再提示 Token 未配置的错误

3. **检查 GitHub 仓库**：
   - 访问：https://github.com/dalidakun/survival-skills
   - 应该能看到新提交的文件

## 常见问题

### Q: 添加环境变量后还是提示未配置？

A: 
1. 确保已重新部署项目
2. 检查环境变量名称是否正确：`GITHUB_TOKEN`（注意大小写）
3. 检查是否勾选了所有环境（Production, Preview, Development）
4. 等待 1-2 分钟让部署完成

### Q: 如何确认环境变量已添加？

A:
1. 在 Vercel Settings → Environment Variables 页面
2. 应该能看到 `GITHUB_TOKEN` 在列表中
3. 注意：Value 会显示为 `••••••••`（隐藏保护）

### Q: Token 权限不足怎么办？

A:
1. 确保 Token 有 `repo` 权限
2. 如果权限不足，删除旧 Token，重新创建并勾选 `repo` 权限

## 完成后的效果

配置完成后：
- ✅ 可以正常添加文章
- ✅ 文件会自动提交到 GitHub
- ✅ Vercel 会自动重新部署（约 1-2 分钟）
- ✅ 新文章在网站上可见

