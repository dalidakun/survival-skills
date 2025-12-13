# GitHub Desktop 详细使用指南

## 第一步：安装 GitHub Desktop

1. 访问：https://desktop.github.com/
2. 点击 "Download for Windows"
3. 下载并运行安装程序
4. 按照提示完成安装

## 第二步：登录 GitHub 账号

1. 打开 GitHub Desktop
2. 点击 "Sign in to GitHub.com"
3. 在浏览器中登录您的 GitHub 账号
4. 授权 GitHub Desktop 访问您的账号

## 第三步：添加本地仓库

### 方法 1：从现有文件夹添加（推荐）

1. 在 GitHub Desktop 中，点击菜单：
   - **File** → **Add Local Repository**
   - 或者点击左上角的 "+" → **Add Existing Repository**

2. 选择您的项目文件夹：
   - 点击 "Choose..." 按钮
   - 浏览到：`C:\Users\Administrator\Desktop\生存技能`
   - 选择这个文件夹，点击 "选择文件夹"

3. 如果提示 "This directory does not appear to be a Git repository"
   - 点击 "create a repository" 链接
   - Repository name: `survival-skills`
   - 选择 "Initialize this repository with a README"（可选）
   - 点击 "Create Repository"

### 方法 2：先创建仓库，再克隆

1. 在 GitHub Desktop 中：
   - 点击 "File" → "New Repository"
   - 或者点击 "+" → "Create New Repository"

2. 填写信息：
   - Name: `survival-skills`
   - Local path: `C:\Users\Administrator\Desktop\生存技能`
   - 勾选 "Initialize this repository with a README"（可选）
   - 点击 "Create Repository"

## 第四步：准备提交（重要！）

添加仓库后，GitHub Desktop 会显示所有更改的文件。

### 1. 查看更改
- 左侧会列出所有文件
- 绿色 "+" 表示新文件
- 黄色 "M" 表示修改的文件

### 2. 选择要提交的文件
- 默认会选中所有文件
- 如果不想提交某些文件（如 `node_modules`），可以取消勾选

### 3. 填写提交信息（在左下角）
- 在左下角的文本框中输入提交信息
- **第一行**（Summary）：`Initial commit: 蒙谦自然教育`
- **第二行**（Description，可选）：可以留空或添加描述

**注意**：提交信息框在左下角，可能不太明显，仔细找一下！

## 第五步：提交到本地仓库

1. 填写完提交信息后
2. 点击左下角的 **"Commit to main"** 按钮（或 "Commit to master"）
3. 等待提交完成

## 第六步：发布到 GitHub

### 如果仓库还没有发布到 GitHub：

1. 提交后，会看到提示 "Publish repository"
2. 点击 **"Publish repository"** 按钮
3. 在弹出的窗口中：
   - Repository name: `survival-skills`（应该已经填好了）
   - Description: 可选，填写描述
   - **取消勾选** "Keep this code private"（确保是公开的）
4. 点击 **"Publish Repository"**

### 如果仓库已经存在（您之前创建过）：

1. 提交后，点击右上角的 **"Publish branch"** 或 **"Push origin"**
2. 或者点击菜单：**Repository** → **Push**

## 第七步：确认上传成功

### 方法 1：在 GitHub Desktop 中查看

1. 发布成功后，GitHub Desktop 会显示：
   - "Published repository" 或 "Pushed to origin"
   - 左侧不再显示 "Uncommitted changes"

2. 点击 **"View on GitHub"** 按钮
   - 会在浏览器中打开您的 GitHub 仓库页面

### 方法 2：在 GitHub 网页上查看

1. 访问：https://github.com/dalidakun/survival-skills
2. 应该能看到：
   - 所有文件都已上传
   - 有提交记录（显示 "Initial commit: 蒙谦自然教育"）
   - 文件列表完整

### 方法 3：检查文件

在 GitHub 网页上，点击几个文件查看：
- `package.json` 应该存在
- `src` 文件夹应该存在
- `content` 文件夹应该存在

## 常见问题

### Q: 找不到提交信息框？

A: 提交信息框在 GitHub Desktop 的左下角，可能被折叠了。尝试：
- 调整窗口大小
- 查看左下角，应该有一个文本框
- 如果看不到，点击 "Show diff" 或调整视图

### Q: 提示 "This directory does not appear to be a Git repository"？

A: 
1. 点击 "create a repository" 链接
2. 或者先关闭，然后在 GitHub Desktop 中：
   - File → New Repository
   - 选择您的项目文件夹

### Q: 文件太多，上传很慢？

A: 
1. 确保 `.gitignore` 文件存在（应该已经存在）
2. 检查是否排除了 `node_modules` 文件夹
3. 如果 `node_modules` 被包含，可以取消勾选它

### Q: 如何确认哪些文件会被上传？

A: 
- 在 GitHub Desktop 左侧的文件列表中
- 勾选的文件会被提交
- 取消勾选的文件不会被提交

## 下一步

上传成功后，就可以在 Vercel 部署了！

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 导入您的仓库 `survival-skills`
4. 点击 Deploy

