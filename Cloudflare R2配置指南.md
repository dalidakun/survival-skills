# Cloudflare R2 配置详细指南

## 为什么选择 Cloudflare R2？

✅ **完全免费**：10GB 存储 + 100万次读取/月
✅ **永久链接**：生成的链接长期有效
✅ **全球加速**：CDN 加速，访问速度快
✅ **易于集成**：提供简单 API

## 配置步骤

### 步骤 1：注册 Cloudflare 账户

1. 访问：https://dash.cloudflare.com/sign-up
2. 使用邮箱注册（完全免费，无需信用卡）
3. 验证邮箱

### 步骤 2：创建 R2 存储桶

1. 登录 Cloudflare Dashboard
2. 点击左侧菜单 **"R2"**
3. 如果是第一次使用，点击 **"Get started"** 或 **"Create bucket"**
4. 输入存储桶名称（例如：`survival-skills-pdfs`）
5. 选择位置（建议选择离您最近的区域，如 `ap-southeast-1`）
6. 点击 **"Create bucket"**

### 步骤 3：获取 API Token

1. 在 R2 页面，点击右上角 **"Manage R2 API Tokens"**
2. 点击 **"Create API Token"**
3. 配置 Token：
   - **Token name**：`survival-skills-upload`（任意名称）
   - **Permissions**：选择 **"Object Read & Write"**
   - **TTL**：选择 **"Never expire"**（永久有效）
4. 点击 **"Create API Token"**
5. **重要**：复制并保存以下信息（只显示一次）：
   - **Access Key ID**
   - **Secret Access Key**

### 步骤 4：配置公开访问

1. 在存储桶列表中，点击您创建的存储桶
2. 点击 **"Settings"** 标签
3. 找到 **"Public Access"** 部分
4. 点击 **"Allow Access"** 或 **"Edit"**
5. 选择 **"Public"** 或配置自定义域名
6. 保存设置

### 步骤 5：配置 CORS（允许网站访问）

1. 在存储桶的 **"Settings"** 页面
2. 找到 **"CORS Policy"** 部分
3. 点击 **"Edit"** 或 **"Add CORS policy"**
4. 添加以下配置：

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

5. 保存配置

### 步骤 6：获取存储桶信息

在存储桶页面，您需要记录：
- **存储桶名称**：例如 `survival-skills-pdfs`
- **账户 ID**：在 R2 页面右上角可以看到
- **公开访问 URL**：格式为 `https://<account-id>.r2.cloudflarestorage.com/<bucket-name>/`

### 步骤 7：在 Vercel 配置环境变量

1. 登录 Vercel Dashboard
2. 进入您的项目
3. 点击 **"Settings"** → **"Environment Variables"**
4. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `CLOUDFLARE_R2_ACCOUNT_ID` | 您的账户ID | 从 R2 页面获取 |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | 您的 Access Key ID | 从 API Token 获取 |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | 您的 Secret Access Key | 从 API Token 获取 |
| `CLOUDFLARE_R2_BUCKET_NAME` | 您的存储桶名称 | 例如：`survival-skills-pdfs` |
| `CLOUDFLARE_R2_PUBLIC_URL` | 公开访问URL | 格式：`https://<account-id>.r2.cloudflarestorage.com/<bucket-name>` |

5. 保存并重新部署项目

## 测试上传

配置完成后，在管理后台上传一个 PDF 文件测试：
1. 登录管理后台
2. 选择"上传 PDF"模式
3. 选择一个 PDF 文件上传
4. 如果成功，会返回一个公开的 URL

## 获取公开 URL 的方法

上传成功后，文件会有一个公开访问 URL，格式为：
```
https://<account-id>.r2.cloudflarestorage.com/<bucket-name>/<文件名>
```

或者如果您配置了自定义域名：
```
https://您的域名.com/<文件名>
```

## 注意事项

1. **API Token 安全**：
   - 不要将 Token 提交到 Git 仓库
   - 只在 Vercel 环境变量中配置
   - 如果泄露，立即删除并重新创建

2. **存储空间监控**：
   - 免费额度：10GB
   - 定期检查使用量
   - 如果接近限制，考虑压缩 PDF 或使用多个账户

3. **访问速度**：
   - R2 提供全球 CDN 加速
   - 访问速度通常很快
   - 如果慢，可以配置自定义域名

## 故障排除

### 问题 1：上传失败，提示 "Access Denied"
- 检查 API Token 权限是否为 "Object Read & Write"
- 检查环境变量是否正确配置

### 问题 2：上传成功但无法访问
- 检查存储桶是否配置了公开访问
- 检查 CORS 配置是否正确

### 问题 3：上传速度慢
- 检查文件大小（建议压缩 PDF）
- 检查网络连接

## 下一步

配置完成后，代码会自动使用 R2 存储。您只需要：
1. 在管理后台上传 PDF
2. 系统会自动上传到 R2
3. 返回公开的 URL
4. 文章链接指向该 URL

