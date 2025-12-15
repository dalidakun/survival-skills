# 如何查看 GitHub 仓库大小

## 方法 1：使用 GitHub API（最准确）

### 步骤：

1. **打开浏览器**，访问以下 URL（替换为您的仓库信息）：
   ```
   https://api.github.com/repos/dalidakun/survival-skills
   ```

2. **查找 `size` 字段**：
   - 在返回的 JSON 数据中，找到 `"size"` 字段
   - 这个值以 **KB（千字节）** 为单位
   - 例如：`"size": 1024` 表示 1MB

3. **计算实际大小**：
   - 将 `size` 值除以 1024 得到 MB
   - 再除以 1024 得到 GB

### 示例：
如果 `"size": 51200`，则：
- 51200 KB = 50 MB
- 远小于 1GB 限制 ✅

## 方法 2：使用命令行（本地）

在项目文件夹打开命令行，运行：

```bash
git count-objects -vH
```

这会显示：
- `count`: 对象数量
- `size`: 打包后的大小
- `size-pack`: 实际存储大小

## 方法 3：使用在线工具

访问以下网站，输入仓库地址：
- **GitHub Repository Size**: https://github-size.vercel.app/
- 输入：`dalidakun/survival-skills`
- 点击查询即可看到大小

## 方法 4：查看 GitHub Insights 的 Network 页面

1. 访问：https://github.com/dalidakun/survival-skills/network
2. 查看分支图，可以大致了解仓库规模

## 方法 5：手动估算

### 查看主要文件大小：

1. **查看 `content/` 目录**：
   - 访问：https://github.com/dalidakun/survival-skills/tree/main/content
   - 每个 `.md` 文件通常几 KB

2. **查看 `public/pdfs/` 目录**：
   - 访问：https://github.com/dalidakun/survival-skills/tree/main/public/pdfs
   - 查看每个 PDF 文件的大小
   - 累加所有 PDF 文件大小

3. **估算总大小**：
   - 代码文件：通常 < 10MB
   - 文章文件：通常 < 1MB
   - PDF 文件：累加所有 PDF 大小

## 快速检查脚本

我可以为您创建一个简单的检查脚本，运行后显示仓库大小。

## 注意事项

- GitHub 的 `size` API 返回的是**打包后的大小**，可能比实际文件大小小
- 实际存储空间可能略大于 API 返回的值
- 如果接近 1GB，GitHub 会发送警告邮件

## 推荐方法

**最简单的方法**：使用在线工具
1. 访问：https://github-size.vercel.app/
2. 输入：`dalidakun/survival-skills`
3. 立即查看大小

