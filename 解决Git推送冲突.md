# 解决 Git 推送冲突

## 问题
Git push 被拒绝，因为远程仓库有本地没有的更改。

## 原因
通过 GitHub API 提交的新文章已经在远程仓库中，但本地仓库还没有这些更改。

## 解决方案

### 方法 1：先拉取再推送（推荐）

```bash
# 1. 先拉取远程更改
git pull origin main

# 2. 如果有冲突，解决冲突后再次提交
# 3. 然后推送
git push origin main
```

### 方法 2：使用 rebase（保持提交历史整洁）

```bash
# 1. 拉取并 rebase
git pull --rebase origin main

# 2. 如果有冲突，解决后继续
# git rebase --continue

# 3. 然后推送
git push origin main
```

### 方法 3：强制推送（不推荐，除非确定）

**警告**：这会覆盖远程的更改，可能导致数据丢失！

```bash
git push --force origin main
```

## 推荐操作步骤

1. **先拉取远程更改**：
   ```bash
   git pull origin main
   ```

2. **如果有冲突**：
   - Git 会提示哪些文件有冲突
   - 打开冲突文件，解决冲突
   - 然后执行：`git add .` 和 `git commit`

3. **然后推送**：
   ```bash
   git push origin main
   ```

## 注意事项

- 如果通过 GitHub API 添加了文章，这些文件会在远程仓库中
- 拉取后，这些文件会合并到本地
- 然后可以正常推送您的更改

