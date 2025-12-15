# Cloudflare R2 默认域名配置详细步骤

## 重要说明

✅ **使用默认域名**：不需要自定义域名，**不需要备案**
✅ **完全免费**：10GB 存储 + 100万次读取/月
✅ **永久链接**：生成的链接长期有效
⚠️ **国内访问**：可能稍慢，但通常可以访问（不需要 VPN）

## 步骤 1：注册 Cloudflare 账户

1. **访问 Cloudflare 官网**
   - 网址：https://dash.cloudflare.com/sign-up
   - 或访问：https://www.cloudflare.com/ 然后点击 "Sign Up"

2. **注册账户**
   - 输入邮箱地址
   - 设置密码
   - 点击 "Create Account"
   - 验证邮箱（检查邮箱中的验证链接）

3. **登录账户**
   - 使用注册的邮箱和密码登录
   - 进入 Cloudflare Dashboard

## 步骤 2：启用 R2 存储服务

1. **进入 R2 页面**
   - 登录后，点击左侧菜单 **"R2"**
   - 如果是第一次使用，会看到 "Get started" 或 "Create bucket" 按钮

2. **启用 R2（如果需要）**
   - 如果提示需要启用，点击 **"Enable R2"** 或 **"Get started"**
   - 阅读并同意服务条款
   - 点击 **"Continue"** 或 **"Enable R2"**

## 步骤 3：创建 R2 存储桶（Bucket）

1. **创建存储桶**
   - 在 R2 页面，点击 **"Create bucket"** 按钮
   - 或点击右上角的 **"Create bucket"**

2. **配置存储桶信息**
   - **Bucket name**（存储桶名称）：输入 `survival-skills-pdfs`（或任意名称）
   - **Location**（位置）：选择离您最近的区域
     - 推荐选择：`Asia Pacific (APAC)` 或 `Southeast Asia`
     - 如果主要用户在中国，选择亚洲区域
   - 点击 **"Create bucket"**

3. **确认创建**
   - 存储桶创建成功后，会显示在列表中
   - 点击存储桶名称进入详情页

## 步骤 4：配置存储桶公开访问

1. **进入存储桶设置**
   - 点击您创建的存储桶名称
   - 进入存储桶详情页

2. **配置公开访问**
   - 找到 **"Public Access"** 或 **"Settings"** 标签
   - 点击 **"Allow Access"** 或 **"Edit"**
   - 选择 **"Public"** 或启用公开访问
   - 保存设置

3. **获取默认域名**
   - 在存储桶设置中，找到 **"Public URL"** 或 **"Endpoint"**
   - 格式类似：`https://账户ID.r2.cloudflarestorage.com/存储桶名`
   - **复制这个 URL**（稍后需要用到）

## 步骤 5：创建 API Token

1. **进入 API Token 管理**
   - 在 R2 页面，点击右上角的 **"Manage R2 API Tokens"**
   - 或访问：https://dash.cloudflare.com/profile/api-tokens

2. **创建 API Token**
   - 点击 **"Create API Token"** 或 **"Create Token"**
   - 选择 **"Custom token"** 或 **"R2 Token"**

3. **配置 Token 权限**
   - **Token name**（Token 名称）：输入 `survival-skills-upload`（任意名称）
   - **Permissions**（权限）：
     - 选择 **"Object Read & Write"** 或 **"R2:Edit"**
     - 或选择 **"Zone:Read"** 和 **"Account:Read"**（如果需要）
   - **Account Resources**（账户资源）：
     - 选择 **"Include - All accounts"** 或选择特定账户
   - **TTL**（有效期）：
     - 选择 **"Never expire"**（永久有效）
     - 或设置较长时间（如 1 年）

4. **创建并保存 Token**
   - 点击 **"Continue to summary"** 或 **"Create Token"**
   - **重要**：复制并保存以下信息（只显示一次）：
     - **Access Key ID**
     - **Secret Access Key**
   - 建议保存到安全的地方（如密码管理器）

## 步骤 6：获取账户 ID

1. **查找账户 ID**
   - 在 Cloudflare Dashboard 右侧，可以看到账户信息
   - 或访问：https://dash.cloudflare.com/
   - 在页面右上角，点击账户名称
   - 在账户信息中可以看到 **"Account ID"**
   - **复制这个 Account ID**（稍后需要用到）

## 步骤 7：在 Vercel 配置环境变量

1. **登录 Vercel Dashboard**
   - 访问：https://vercel.com/dashboard
   - 使用 GitHub 账户登录

2. **进入项目设置**
   - 找到您的项目：`survival-skills` 或类似名称
   - 点击项目进入详情页
   - 点击 **"Settings"** 标签
   - 点击左侧菜单 **"Environment Variables"**

3. **添加环境变量**
   添加以下 5 个环境变量：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `CLOUDFLARE_R2_ACCOUNT_ID` | 您的 Account ID | 从账户信息获取 |
   | `CLOUDFLARE_R2_ACCESS_KEY_ID` | 您的 Access Key ID | 从 API Token 获取 |
   | `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | 您的 Secret Access Key | 从 API Token 获取 |
   | `CLOUDFLARE_R2_BUCKET_NAME` | 您的存储桶名称 | 例如：`survival-skills-pdfs` |
   | `CLOUDFLARE_R2_PUBLIC_URL` | 默认域名 URL | 格式：`https://账户ID.r2.cloudflarestorage.com/存储桶名` |

   **示例配置**：
   ```
   CLOUDFLARE_R2_ACCOUNT_ID=abc123def456
   CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
   CLOUDFLARE_R2_BUCKET_NAME=survival-skills-pdfs
   CLOUDFLARE_R2_PUBLIC_URL=https://abc123def456.r2.cloudflarestorage.com/survival-skills-pdfs
   ```

4. **保存环境变量**
   - 每个变量添加后，点击 **"Save"**
   - 确保所有变量都已添加

5. **重新部署项目**
   - 进入 **"Deployments"** 标签
   - 找到最新的部署
   - 点击右侧的 **"..."** → **"Redeploy"**
   - 或推送代码到 GitHub，Vercel 会自动部署

## 步骤 8：测试上传功能

1. **访问管理后台**
   - 打开：https://survival-skills-ceco.vercel.app/admin
   - 输入管理员密码登录

2. **上传测试 PDF**
   - 选择 **"上传 PDF"** 模式
   - 选择一个 PDF 文件（建议选择较小的文件测试）
   - 点击上传

3. **检查返回结果**
   - 上传成功后，会显示一个链接
   - 链接格式应该是：`https://账户ID.r2.cloudflarestorage.com/存储桶名/文件名.pdf`
   - 复制这个链接

4. **验证链接**
   - 在新标签页打开链接
   - 确认 PDF 可以正常显示
   - 如果无法打开，检查：
     - 存储桶是否配置了公开访问
     - 环境变量是否正确
     - DNS 是否已生效（通常不需要等待）

## 配置示例

### Vercel 环境变量完整示例

```env
# Cloudflare R2 配置
CLOUDFLARE_R2_ACCOUNT_ID=abc123def456789
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
CLOUDFLARE_R2_BUCKET_NAME=survival-skills-pdfs
CLOUDFLARE_R2_PUBLIC_URL=https://abc123def456789.r2.cloudflarestorage.com/survival-skills-pdfs
```

### 上传后的链接格式

```
https://账户ID.r2.cloudflarestorage.com/存储桶名/时间戳-文件名.pdf
```

**示例**：
```
https://abc123def456789.r2.cloudflarestorage.com/survival-skills-pdfs/1234567890-test.pdf
```

## 常见问题

### 问题 1：上传失败，提示 "Access Denied"

**解决方法**：
- 检查 API Token 权限是否为 "Object Read & Write"
- 检查 Access Key ID 和 Secret Access Key 是否正确
- 检查存储桶名称是否正确

### 问题 2：上传成功但无法访问

**解决方法**：
- 检查存储桶是否配置了公开访问
- 检查 `CLOUDFLARE_R2_PUBLIC_URL` 环境变量是否正确
- 检查链接格式是否正确

### 问题 3：国内访问慢或无法访问

**解决方法**：
- 这是正常现象，R2 默认域名在中国可能访问较慢
- 通常可以访问，但速度可能不如国内服务
- 如果无法访问，可能需要使用 VPN（但通常不需要）

### 问题 4：找不到 Account ID

**解决方法**：
- 在 Cloudflare Dashboard 右上角，点击账户名称
   - 在账户信息中可以看到 Account ID
- 或访问：https://dash.cloudflare.com/
   - 在页面右侧可以看到账户信息

## 验证清单

完成配置后，请确认：

- [ ] Cloudflare 账户已注册并登录
- [ ] R2 存储桶已创建
- [ ] 存储桶已配置公开访问
- [ ] API Token 已创建并保存
- [ ] Account ID 已获取
- [ ] Vercel 环境变量已配置（5 个变量）
- [ ] Vercel 项目已重新部署
- [ ] 测试上传 PDF 成功
- [ ] 返回的链接可以正常访问

## 优势总结

✅ **不需要备案**：使用默认域名，不需要自定义域名
✅ **完全免费**：10GB 存储 + 100万次读取/月
✅ **永久链接**：生成的链接长期有效
✅ **配置简单**：只需要配置环境变量
✅ **全球 CDN**：文件通过 CDN 加速

## 下一步

配置完成后，您就可以：
1. ✅ 在管理后台上传 PDF 文件
2. ✅ 系统自动上传到 Cloudflare R2
3. ✅ 生成永久链接：`https://账户ID.r2.cloudflarestorage.com/存储桶名/文件名.pdf`
4. ✅ 文章链接指向该永久链接
5. ✅ 用户可以直接访问 PDF 文件

## 总结

- ✅ **不需要备案**：使用默认域名
- ✅ **完全免费**：10GB 存储足够使用
- ✅ **永久链接**：链接长期有效
- ⚠️ **国内访问**：可能稍慢，但通常可以访问

配置完成后，您的 PDF 文件将拥有永久可访问的链接！


