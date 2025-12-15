# 如何找到 Cloudflare R2 API Token

## 问题

在 Cloudflare R2 页面找不到 "Manage R2 API Tokens" 选项。

## 解决方法

### 方法 1：通过账户设置（推荐）

1. **点击右上角账户名称**
   - 在页面右上角，点击您的账户名称（显示 "Liyankun007@gmail.com's Account"）
   - 或点击 "Profile" 图标

2. **进入 API Tokens**
   - 在下拉菜单中，找到 **"My Profile"** 或 **"API Tokens"**
   - 或直接访问：https://dash.cloudflare.com/profile/api-tokens

3. **创建 R2 Token**
   - 在 API Tokens 页面，点击 **"Create Token"**
   - 选择 **"Custom token"** 或 **"R2 Token"**
   - 配置权限和资源

### 方法 2：直接访问 API Tokens 页面

1. **直接访问 URL**
   - 在浏览器地址栏输入：https://dash.cloudflare.com/profile/api-tokens
   - 按回车键
   - 这会直接打开 API Tokens 管理页面

2. **创建 Token**
   - 点击 **"Create Token"** 按钮
   - 选择 **"Custom token"**
   - 配置 Token

### 方法 3：在 R2 页面查找

1. **查看 R2 页面右上角**
   - 在 R2 页面，查看右上角是否有设置图标
   - 或查看是否有 "API" 或 "Tokens" 相关选项

2. **查看存储桶设置**
   - 在存储桶设置页面，查看是否有 "API" 或 "Access" 相关选项

## 详细步骤：创建 R2 API Token

### 步骤 1：访问 API Tokens 页面

**方式 A：通过账户菜单**
1. 点击页面右上角的账户名称或 "Profile" 图标
2. 选择 **"My Profile"** 或 **"API Tokens"**

**方式 B：直接访问**
1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 登录后会自动跳转到 API Tokens 页面

### 步骤 2：创建自定义 Token

1. **点击 "Create Token"**
   - 在 API Tokens 页面，点击右上角的 **"Create Token"** 按钮

2. **选择 Token 类型**
   - 选择 **"Custom token"**（自定义 Token）
   - 或查找 **"R2 Token"** 选项（如果有）

3. **配置 Token 权限**
   - **Token name**（Token 名称）：输入 `survival-skills-upload`（任意名称）
   - **Permissions**（权限）：
     - 点击 **"Add"** 或 **"Edit"**
     - 在权限列表中找到 **"R2"** 或 **"Object Storage"**
     - 选择 **"Edit"** 或 **"Read & Write"**
   - **Account Resources**（账户资源）：
     - 选择 **"Include - All accounts"** 或选择您的账户
   - **Zone Resources**（区域资源）：
     - 选择 **"Include - All zones"** 或留空（R2 不需要 Zone）

4. **设置有效期**
   - **TTL**（有效期）：
     - 选择 **"Never expire"**（永久有效）
     - 或设置较长时间（如 1 年）

5. **创建 Token**
   - 点击 **"Continue to summary"** 或 **"Create Token"**
   - 查看 Token 摘要
   - 点击 **"Create Token"** 确认

### 步骤 3：保存 Token 信息

**重要**：Token 只显示一次，请立即保存！

1. **复制 Access Key ID**
   - 在 Token 创建成功后，会显示 **"Access Key ID"**
   - 点击复制按钮或手动复制

2. **复制 Secret Access Key**
   - 会显示 **"Secret Access Key"**
   - 点击复制按钮或手动复制
   - **注意**：这个值只显示一次，请妥善保存

3. **保存到安全的地方**
   - 建议保存到密码管理器
   - 或保存到本地文件（注意安全）

## 配置 Token 权限详解

### 权限配置示例

在创建 Custom Token 时，需要配置以下权限：

```
Permissions:
├─ R2:Edit (或 Object Storage:Edit)
│   └─ Account Resources: Include - All accounts
└─ Account:Read (可选，但建议添加)
    └─ Account Resources: Include - All accounts
```

### 如果找不到 R2 权限

1. **搜索权限**
   - 在权限列表中，使用搜索框搜索 "R2" 或 "Object Storage"
   - 或搜索 "Storage"

2. **查看所有权限**
   - 展开权限列表
   - 查找与存储相关的权限

3. **使用 Account:Edit**
   - 如果找不到 R2 特定权限，可以尝试使用 **"Account:Edit"**
   - 这个权限通常包含 R2 访问权限

## 快速链接

- **API Tokens 页面**：https://dash.cloudflare.com/profile/api-tokens
- **账户设置**：https://dash.cloudflare.com/profile
- **R2 页面**：https://dash.cloudflare.com/r2

## 从您当前的页面操作

根据您的截图，您当前在 R2 存储桶设置页面。要创建 API Token：

1. **点击右上角的 "Profile" 图标**（人形图标）
2. 选择 **"My Profile"** 或 **"API Tokens"**
3. 或直接访问：https://dash.cloudflare.com/profile/api-tokens

## 验证 Token

创建 Token 后，您应该获得：
- ✅ **Access Key ID**：类似 `abc123def456...`
- ✅ **Secret Access Key**：类似 `xyz789uvw012...`

这两个值都需要保存，稍后在 Vercel 环境变量中会用到。

## 下一步

获得 API Token 后，您还需要：

1. ✅ **Account ID**：从账户信息中获取
2. ✅ **Access Key ID**：从 API Token 获取
3. ✅ **Secret Access Key**：从 API Token 获取
4. ✅ **Bucket Name**：`survival-skills-pdfs`（您已经有了）
5. ✅ **Public URL**：`https://pub-dc03e8433ab84e548020e05cfa782b93.r2.dev`（您已经有了）

## 总结

- **API Tokens 位置**：右上角 Profile → API Tokens
- **直接访问**：https://dash.cloudflare.com/profile/api-tokens
- **创建 Token**：选择 Custom token，配置 R2 权限

如果还是找不到，告诉我您看到了什么，我会继续帮您。


