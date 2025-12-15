# 如何在 Cloudflare 找到 R2

## 问题

在 Cloudflare Dashboard 中找不到 R2 选项。

## 解决方法

### 方法 1：通过左侧菜单找到 R2

1. **查看左侧菜单**
   - 找到 **"Build"** 部分（构建部分）
   - 展开 **"Storage & databases"**（存储和数据库）
   - 点击 **"R2"**

2. **如果看不到 "Storage & databases"**
   - 点击左侧菜单中的 **"Build"** 部分
   - 应该能看到 **"Storage & databases"**
   - 点击展开，然后点击 **"R2"**

### 方法 2：直接访问 R2 页面

1. **直接访问 R2 URL**
   - 访问：https://dash.cloudflare.com/r2
   - 这会直接打开 R2 页面

2. **如果提示需要启用**
   - 点击 **"Get started"** 或 **"Enable R2"**
   - 阅读并同意服务条款
   - 点击 **"Continue"** 或 **"Enable R2"**

### 方法 3：通过搜索找到 R2

1. **使用快速搜索**
   - 在左侧菜单顶部，找到搜索框："Quick search..."
   - 或按快捷键：`Ctrl + K`（Windows）或 `Cmd + K`（Mac）
   - 输入：`R2`
   - 选择 **"R2"** 选项

### 方法 4：检查账户类型

1. **确认账户类型**
   - R2 功能在免费账户中可用
   - 如果看不到，可能是：
     - 账户未完全激活
     - 需要先完成某些设置

2. **激活 R2**
   - 如果直接访问 https://dash.cloudflare.com/r2
   - 会提示启用 R2
   - 按照提示操作即可

## 详细步骤

### 步骤 1：找到 R2 入口

**方式 A：通过菜单**
1. 在左侧菜单，找到 **"Build"** 部分
2. 展开 **"Storage & databases"**
3. 点击 **"R2"**

**方式 B：直接访问**
1. 在浏览器地址栏输入：`https://dash.cloudflare.com/r2`
2. 按回车键
3. 如果提示需要启用，点击 **"Get started"**

### 步骤 2：启用 R2（如果是第一次使用）

1. **如果看到 "Get started" 按钮**
   - 点击 **"Get started"** 或 **"Enable R2"**
   - 阅读服务条款
   - 勾选同意条款
   - 点击 **"Continue"** 或 **"Enable R2"**

2. **等待启用完成**
   - 通常几秒钟即可完成
   - 启用后会自动进入 R2 页面

### 步骤 3：创建存储桶

1. **进入 R2 页面后**
   - 应该能看到 **"Create bucket"** 按钮
   - 或显示 "No buckets yet" 提示

2. **创建第一个存储桶**
   - 点击 **"Create bucket"**
   - 输入存储桶名称：`survival-skills-pdfs`
   - 选择位置
   - 点击 **"Create bucket"**

## 菜单位置说明

在 Cloudflare Dashboard 左侧菜单中：

```
Build（构建）
├─ Compute & AI
├─ Storage & databases（存储和数据库）← 点击这里
│   ├─ R2 ← R2 在这里
│   └─ D1
└─ Media
```

## 如果仍然找不到

### 检查 1：账户是否完全激活

1. 确认邮箱已验证
2. 确认账户已登录
3. 尝试刷新页面（F5）

### 检查 2：使用直接链接

1. 直接访问：https://dash.cloudflare.com/r2
2. 如果提示需要登录，先登录
3. 如果提示需要启用，按照提示操作

### 检查 3：清除浏览器缓存

1. 清除浏览器缓存
2. 重新登录 Cloudflare
3. 再次尝试访问 R2

## 快速链接

- **R2 页面**：https://dash.cloudflare.com/r2
- **API Tokens**：https://dash.cloudflare.com/profile/api-tokens
- **账户信息**：https://dash.cloudflare.com/

## 下一步

找到 R2 后，按照以下步骤操作：

1. ✅ 创建存储桶
2. ✅ 配置公开访问
3. ✅ 创建 API Token
4. ✅ 获取 Account ID
5. ✅ 在 Vercel 配置环境变量

## 总结

- **R2 位置**：左侧菜单 → Build → Storage & databases → R2
- **直接访问**：https://dash.cloudflare.com/r2
- **搜索方式**：按 `Ctrl + K`，输入 "R2"

如果还是找不到，告诉我您看到了什么，我会帮您进一步排查。


