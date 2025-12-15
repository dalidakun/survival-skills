# 获取 R2 Access Key 并测试上传

## 重要说明

您刚才创建的是 **User API Token**，但 R2 上传需要的是 **R2 Access Key**（Access Key ID 和 Secret Access Key）。

## 步骤 1：保存当前的 User API Token

1. **复制 Token**（虽然这个不是 R2 Access Key，但先保存）
   - Token：`4uQGOpEmZgh3VBCjOK4vtuhufsTk7XcoyTy_OVpx`
   - 点击复制按钮保存

2. **这个 Token 可以用于管理 R2，但上传文件需要 R2 Access Key**

## 步骤 2：获取 R2 Access Key

### 方法 1：通过 R2 页面创建 Access Key（推荐）

1. **访问 R2 页面**
   - 访问：https://dash.cloudflare.com/r2
   - 或点击左侧菜单 "R2"

2. **进入 API Tokens 管理**
   - 在 R2 页面，查找 **"Manage R2 API Tokens"** 或 **"API Tokens"**
   - 或访问：https://dash.cloudflare.com/r2/api-tokens

3. **创建 R2 API Token**
   - 点击 **"Create API Token"** 或 **"Create R2 Token"**
   - 输入名称：`survival-skills-r2`
   - 选择权限：`Object Read & Write`
   - 点击创建

4. **保存 Access Key**
   - 会显示 **Access Key ID** 和 **Secret Access Key**
   - **重要**：这两个值只显示一次，请立即保存

### 方法 2：使用当前 Token 通过 API 创建（如果方法 1 不行）

如果找不到 R2 API Tokens 页面，可以使用当前的 User API Token 通过 API 创建 R2 Access Key。

## 步骤 3：在 Vercel 配置环境变量

获得 R2 Access Key 后，在 Vercel 配置以下环境变量：

```
CLOUDFLARE_R2_ACCOUNT_ID=6140e5e3e14967610fe12d221304b125
CLOUDFLARE_R2_ACCESS_KEY_ID=您的Access Key ID
CLOUDFLARE_R2_SECRET_ACCESS_KEY=您的Secret Access Key
CLOUDFLARE_R2_BUCKET_NAME=survival-skills-pdfs
CLOUDFLARE_R2_PUBLIC_URL=https://pub-dc03e8433ab84e548020e05cfa782b93.r2.dev
```

## 步骤 4：测试上传 PDF

1. **访问管理后台**
   - 打开：https://survival-skills-ceco.vercel.app/admin
   - 输入管理员密码登录

2. **上传测试 PDF**
   - 选择 **"上传 PDF"** 模式
   - 选择一个 PDF 文件（建议选择较小的文件测试）
   - 点击上传

3. **检查返回结果**
   - 上传成功后，会显示一个链接
   - 链接格式应该是：`https://pub-dc03e8433ab84e548020e05cfa782b93.r2.dev/文件名.pdf`
   - 复制这个链接

4. **验证链接**
   - 在新标签页打开链接
   - 确认 PDF 可以正常显示
   - 如果无法打开，检查配置

## 您已经拥有的信息

从之前的截图，您已经有了：

1. ✅ **Account ID**：`6140e5e3e14967610fe12d221304b125`（从 S3 API URL 中提取）
2. ✅ **Bucket Name**：`survival-skills-pdfs`
3. ✅ **Public URL**：`https://pub-dc03e8433ab84e548020e05cfa782b93.r2.dev`
4. ✅ **User API Token**：`4uQGOpEmZgh3VBCjOK4vtuhufsTk7XcoyTy_OVpx`（已创建）

## 还需要获取的信息

1. ❌ **Access Key ID**：需要从 R2 API Tokens 获取
2. ❌ **Secret Access Key**：需要从 R2 API Tokens 获取

## 快速操作

### 立即操作

1. **访问 R2 API Tokens 页面**
   - 尝试访问：https://dash.cloudflare.com/r2/api-tokens
   - 或在 R2 页面查找 "API Tokens" 或 "Manage R2 API Tokens"

2. **创建 R2 Access Key**
   - 点击 "Create API Token" 或 "Create R2 Token"
   - 配置权限并创建
   - 保存 Access Key ID 和 Secret Access Key

3. **在 Vercel 配置环境变量**
   - 添加上述 5 个环境变量
   - 保存并重新部署

4. **测试上传**
   - 在管理后台上传测试 PDF
   - 验证链接是否正常

## 如果找不到 R2 API Tokens 页面

如果找不到 R2 特定的 API Tokens 页面，告诉我：
1. 您在 R2 页面看到了什么
2. 是否有 "API Tokens" 或 "Access Keys" 相关选项
3. 我会帮您找到正确的方法

## 总结

- ✅ **User API Token 已创建**（用于管理）
- ❌ **需要 R2 Access Key**（用于上传文件）
- ✅ **其他信息已准备好**

下一步：获取 R2 Access Key，然后在 Vercel 配置环境变量并测试上传。


