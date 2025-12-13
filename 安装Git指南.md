# 安装 Git 指南

## 问题
系统提示：'git' 不是内部或外部命令

## 解决方案：安装 Git

### 方法 1：使用安装程序（推荐）

1. **下载 Git**
   - 访问：https://git-scm.com/download/win
   - 或者直接下载：https://github.com/git-for-windows/git/releases/latest
   - 下载 Windows 版本的安装程序（通常是 `.exe` 文件）

2. **安装 Git**
   - 双击下载的安装程序
   - 一路点击 "Next"（使用默认设置即可）
   - **重要**：在 "Adjusting your PATH environment" 这一步，选择：
     - ✅ "Git from the command line and also from 3rd-party software"（推荐）
   - 其他选项保持默认
   - 点击 "Install" 完成安装

3. **验证安装**
   - **关闭当前的 CMD 窗口**
   - **重新打开 CMD**（重要！）
   - 输入命令：`git --version`
   - 如果显示版本号（如 `git version 2.xx.x`），说明安装成功

4. **配置 Git**（首次使用需要）
   ```bash
   git config --global user.name "您的名字"
   git config --global user.email "您的邮箱"
   ```

### 方法 2：使用 GitHub Desktop（图形界面，更简单）

如果您不想使用命令行，可以使用 GitHub Desktop：

1. **下载 GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 下载并安装

2. **使用 GitHub Desktop 推送代码**
   - 打开 GitHub Desktop
   - File → Add Local Repository
   - 选择您的项目文件夹
   - 填写提交信息
   - 点击 "Publish repository" 推送到 GitHub

---

## 安装完成后

重新执行之前的命令：

```bash
git init
git add .
git commit -m "Initial commit: 蒙谦自然教育"
git branch -M main
git remote add origin https://github.com/dalidakun/survival-skills.git
git push -u origin main
```

**注意**：`git push` 时可能会要求输入 GitHub 用户名和密码。如果使用密码，需要使用 Personal Access Token（不是账户密码）。

---

## 如果不想安装 Git（替代方案）

您也可以：
1. 直接在 GitHub 网页上创建仓库
2. 使用 GitHub Desktop（图形界面，不需要命令行）
3. 或者我可以帮您准备一个压缩包，您手动上传到 GitHub


