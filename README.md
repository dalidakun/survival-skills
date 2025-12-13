# 生存技能网站

一个基于 Next.js 的生存技能学习平台，支持文章管理和 PDF 文档上传。

## 功能特性

- 📚 文章列表展示
- 🔍 搜索功能
- 📄 PDF 文档上传和管理
- 🔐 管理员权限控制
- 📱 响应式设计

## 本地开发

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env.local` 并设置管理员密码：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，设置你的管理员密码：

```
ADMIN_PASSWORD=你的强密码
```

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 部署

### 使用 Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在项目设置中添加环境变量 `ADMIN_PASSWORD`
4. 部署完成

详细步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 使用说明

### 管理员登录

1. 访问 `/admin` 页面
2. 输入管理员密码（在环境变量中设置）
3. 登录后可以：
   - 添加新文章（使用外部链接）
   - 上传 PDF 文件并自动生成链接

### PDF 文件存储

上传的 PDF 文件会保存在 `public/pdfs/` 目录中，可以通过 `/pdfs/文件名.pdf` 访问。

**注意**：如果使用 Vercel 等平台部署，上传的文件在重新部署时可能会丢失。建议：
- 使用外部存储服务（如 GitHub、云存储）
- 或者使用 Vercel Blob Storage
- 或者将 PDF 文件提交到 Git 仓库

## 项目结构

```
├── content/          # Markdown 文章内容
├── public/           # 静态资源
│   └── pdfs/         # PDF 文件存储
├── src/
│   ├── app/          # Next.js 页面和 API
│   ├── components/   # React 组件
│   └── lib/          # 工具函数
└── package.json
```

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## 许可证

MIT

