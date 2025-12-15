# 解决 Git 推送错误步骤

## 错误信息
```
! [rejected] main -> main (fetch first)
error: failed to push some refs
```

## 原因
远程仓库有本地没有的更改（通过 GitHub API 提交的新文章）。

## 解决步骤

### 方法 1：先拉取再推送（推荐）

```bash
# 1. 先拉取远程更改
git pull origin main

# 2. 如果有冲突，Git 会自动合并（通常不会有冲突）
# 如果有冲突提示，解决后执行：
# git add .
# git commit -m "Merge remote changes"

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

## 快速解决（复制粘贴）

```bash
git pull origin main
git push origin main
```

## 注意事项

- `git pull` 会将远程的新文章文件合并到本地
- 通常不会有冲突，Git 会自动合并
- 如果有冲突，Git 会提示您解决

