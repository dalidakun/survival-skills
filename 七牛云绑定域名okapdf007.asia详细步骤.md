# 七牛云绑定域名 okapdf007.asia 详细步骤

## 您已完成的步骤
✅ 已购买域名：`okapdf007.asia`

## 接下来需要完成的步骤

### 步骤 1：在七牛云绑定自定义域名

1. **登录七牛云控制台**
   - 访问：https://portal.qiniu.com/
   - 使用您的账户登录

2. **进入存储空间**
   - 点击左侧菜单 **"对象存储"** → **"空间管理"**
   - 找到您创建的存储空间（如：`survival-skills-pdfs`）
   - 点击空间名称进入

3. **绑定自定义域名**
   - 点击 **"域名管理"** 标签
   - 点击 **"绑定域名"** 按钮
   - 输入子域名（建议使用：`pdfs.okapdf007.asia`）
   - 点击 **"确定"**

4. **获取 CNAME 记录值**
   - 绑定后，会显示一个 CNAME 记录值
   - 格式类似：`survival-skills-pdfs.z0.glb.clouddn.com`
   - **复制这个 CNAME 值**（稍后需要用到）

### 步骤 2：配置域名 DNS 记录

您需要在域名管理面板（购买域名的服务商）添加 CNAME 记录。

#### 如果您的域名在以下服务商：

**Namecheap**：
1. 登录 Namecheap
2. 进入域名管理 → `okapdf007.asia`
3. 点击 "Advanced DNS"
4. 添加 CNAME 记录：
   - **Type**: CNAME Record
   - **Host**: `pdfs`
   - **Value**: 七牛云提供的 CNAME 值（如：`survival-skills-pdfs.z0.glb.clouddn.com`）
   - **TTL**: Automatic
5. 点击保存

**GoDaddy**：
1. 登录 GoDaddy
2. 进入域名管理 → `okapdf007.asia`
3. 点击 "DNS"
4. 添加 CNAME 记录：
   - **Type**: CNAME
   - **Name**: `pdfs`
   - **Value**: 七牛云提供的 CNAME 值
   - **TTL**: 600
5. 点击保存

**其他服务商**：
- 找到 DNS 管理或域名解析设置
- 添加 CNAME 记录：
  - 主机记录/Name：`pdfs`
  - 记录类型/Type：`CNAME`
  - 记录值/Value：七牛云提供的 CNAME 值
  - TTL：自动或 600

### 步骤 3：等待 DNS 生效

- DNS 记录通常需要 **几分钟到几小时** 才能生效
- 可以使用以下命令检查是否生效：
  ```bash
  nslookup pdfs.okapdf007.asia
  ```
- 或者访问：https://www.whatsmydns.net/#CNAME/pdfs.okapdf007.asia

### 步骤 4：在七牛云配置 HTTPS（可选但推荐）

1. 在七牛云域名管理页面
2. 找到您绑定的域名 `pdfs.okapdf007.asia`
3. 点击 **"HTTPS 配置"** 或 **"SSL 证书"**
4. 选择 **"免费证书"** 或 **"Let's Encrypt"**
5. 点击 **"申请证书"**
6. 等待证书申请完成（通常几分钟）

### 步骤 5：在 Vercel 配置环境变量

1. **登录 Vercel Dashboard**
   - 访问：https://vercel.com/dashboard
   - 进入您的项目

2. **添加环境变量**
   - 点击 **"Settings"** → **"Environment Variables"**
   - 添加或更新以下环境变量：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `QINIU_ACCESS_KEY` | 您的 AccessKey | 从密钥管理获取 |
   | `QINIU_SECRET_KEY` | 您的 SecretKey | 从密钥管理获取 |
   | `QINIU_BUCKET_NAME` | 您的空间名称 | 例如：`survival-skills-pdfs` |
   | `QINIU_DOMAIN` | `https://pdfs.okapdf007.asia` | 使用 HTTPS（如果已配置）或 `http://pdfs.okapdf007.asia` |

   **重要**：
   - 如果已配置 HTTPS，使用：`https://pdfs.okapdf007.asia`
   - 如果未配置 HTTPS，使用：`http://pdfs.okapdf007.asia`

3. **保存并重新部署**
   - 点击 **"Save"**
   - 进入 **"Deployments"** 标签
   - 点击最新部署右侧的 **"..."** → **"Redeploy"**

### 步骤 6：测试上传功能

1. **访问管理后台**
   - 打开：https://survival-skills-ceco.vercel.app/admin
   - 输入管理员密码登录

2. **上传测试 PDF**
   - 选择 **"上传 PDF"** 模式
   - 选择一个 PDF 文件上传
   - 等待上传完成

3. **检查返回的链接**
   - 上传成功后，会显示一个链接
   - 链接格式应该是：`https://pdfs.okapdf007.asia/文件名.pdf`
   - 点击链接，看是否能正常打开 PDF

4. **验证链接**
   - 在新标签页打开链接
   - 确认 PDF 可以正常显示
   - 确认链接是永久有效的

## 配置示例

### Vercel 环境变量配置示例

```env
QINIU_ACCESS_KEY=your_access_key_here
QINIU_SECRET_KEY=your_secret_key_here
QINIU_BUCKET_NAME=survival-skills-pdfs
QINIU_DOMAIN=https://pdfs.okapdf007.asia
```

### DNS 记录配置示例

```
Type: CNAME
Name: pdfs
Value: survival-skills-pdfs.z0.glb.clouddn.com
TTL: 600
```

## 常见问题

### 问题 1：DNS 记录不生效

**解决方法**：
- 等待更长时间（最长可能需要 24 小时）
- 检查 DNS 记录是否正确
- 使用 `nslookup` 或在线工具检查

### 问题 2：无法访问 HTTPS

**解决方法**：
- 确保在七牛云配置了 SSL 证书
- 等待证书申请完成
- 如果未配置，先使用 HTTP（`http://pdfs.okapdf007.asia`）

### 问题 3：上传失败

**解决方法**：
- 检查环境变量是否正确配置
- 检查七牛云 AccessKey 和 SecretKey 是否正确
- 检查存储空间名称是否正确
- 检查域名是否已正确绑定

## 验证清单

完成配置后，请确认：

- [ ] 在七牛云已绑定域名 `pdfs.okapdf007.asia`
- [ ] 在域名 DNS 已添加 CNAME 记录
- [ ] DNS 记录已生效（可以使用 nslookup 检查）
- [ ] 在 Vercel 已配置环境变量 `QINIU_DOMAIN`
- [ ] Vercel 项目已重新部署
- [ ] 测试上传 PDF 成功
- [ ] 返回的链接可以正常访问

## 下一步

配置完成后，您就可以：
1. ✅ 在管理后台上传 PDF 文件
2. ✅ 系统自动上传到七牛云
3. ✅ 生成永久链接：`https://pdfs.okapdf007.asia/文件名.pdf`
4. ✅ 文章链接指向该永久链接
5. ✅ 用户可以直接访问 PDF 文件

## 总结

- ✅ 域名：`okapdf007.asia` 已购买
- ✅ 子域名：`pdfs.okapdf007.asia` 用于 PDF 存储
- ✅ 永久链接：`https://pdfs.okapdf007.asia/文件名.pdf`
- ✅ 完全免费：七牛云存储 + 域名绑定都是免费的

配置完成后，您的 PDF 文件将拥有永久可访问的链接！


