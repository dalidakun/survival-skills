# Git 命令行上传完整步骤

## 第一步：配置 Git（只需要做一次）

在 CMD 中执行（替换为您的信息）：

```bash
git config --global user.name "dalidakun"
git config --global user.email "您的GitHub邮箱"
```

**示例**：
```bash
git config --global user.name "dalidakun"
git config --global user.email "your-email@example.com"
```

## 第二步：初始化仓库并添加文件

在项目文件夹中打开 CMD，执行：

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件（.gitignore 会自动排除大文件）
git add .

# 3. 提交代码
git commit -m "Initial commit: 蒙谦自然教育"
```

## 第三步：连接到 GitHub 并推送

```bash
# 1. 添加远程仓库
git remote add origin https://github.com/dalidakun/survival-skills.git

# 2. 重命名分支为 main
git branch -M main

# 3. 推送到 GitHub
git push -u origin main
```

## 如果推送时要求输入密码

GitHub 不再支持密码登录，需要使用 Personal Access Token：

1. **生成 Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写 Note：`Git Push`
   - 勾选 `repo` 权限
   - 点击 "Generate token"
   - **复制生成的 token**（只显示一次！）

2. **推送时使用 Token**：
   - Username: 输入您的 GitHub 用户名 `dalidakun`
   - Password: 输入刚才复制的 token（不是密码！）

## 完整命令序列（复制粘贴）

```bash
# 配置 Git（替换邮箱）
git config --global user.name "dalidakun"
git config --global user.email "您的GitHub邮箱"

# 初始化并提交
git init
git add .
git commit -m "Initial commit: 蒙谦自然教育"

# 连接到 GitHub
git remote add origin https://github.com/dalidakun/survival-skills.git
git branch -M main

# 推送到 GitHub
git push -u origin main
```

## 验证上传成功

访问：https://github.com/dalidakun/survival-skills

应该能看到所有文件都已上传。

