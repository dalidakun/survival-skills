# 网站部署指南

## 免费部署到 Vercel（推荐）

Vercel 是 Next.js 的官方推荐平台，提供完全免费的部署服务。

### 步骤 1：准备 GitHub 仓库

1. 在 GitHub 上创建一个新仓库（如果还没有）
2. 将本地代码推送到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

### 步骤 2：部署到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择你的仓库
5. 配置项目：
   - Framework Preset: Next.js（会自动检测）
   - Root Directory: `./`（默认）
   - Build Command: `npm run build`（默认）
   - Output Directory: `.next`（默认）
6. 点击 "Deploy"

### 步骤 3：配置环境变量（如需要）

如果使用了环境变量（如管理员密码），在 Vercel 项目设置中添加：
- Settings → Environment Variables
- 添加 `ADMIN_PASSWORD` 等变量

### 步骤 4：访问网站

部署完成后，Vercel 会提供一个免费的域名，格式如：`你的项目名.vercel.app`

你也可以绑定自定义域名（免费）。

## PDF 文件存储方案

### 方案 1：使用 GitHub 仓库存储（完全免费）

1. 在仓库中创建 `public/pdfs` 文件夹
2. 上传 PDF 文件到该文件夹
3. 通过 GitHub Pages 或直接链接访问：
   - 如果使用 GitHub Pages: `https://你的用户名.github.io/你的仓库名/pdfs/文件名.pdf`
   - 直接链接: `https://raw.githubusercontent.com/你的用户名/你的仓库名/main/public/pdfs/文件名.pdf`

### 方案 2：使用 Vercel Blob Storage（有免费额度）

1. 在 Vercel 项目中启用 Blob Storage
2. 通过 API 上传文件
3. 获得永久链接

### 方案 3：使用其他免费云存储

- **Cloudflare R2**：有免费额度
- **Backblaze B2**：有免费额度
- **Google Drive**：可以生成分享链接

## 注意事项

1. **静态文件限制**：Vercel 免费版对静态文件大小有限制，大文件建议使用外部存储
2. **构建时间**：免费版有构建时间限制，通常足够使用
3. **带宽限制**：免费版有带宽限制，但对于个人网站通常足够

## 更新网站内容

每次更新内容后：
1. 提交代码到 GitHub
2. Vercel 会自动检测并重新部署（如果启用了自动部署）
3. 或者手动在 Vercel 控制台触发部署

