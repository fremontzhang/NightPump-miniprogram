# GitHub 上传指南

## 方法一：使用 GitHub 网页创建仓库（推荐）

### 步骤 1: 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `NightPump-miniprogram`
   - **Description**: `NightPump 健身微信小程序 - 现代化的健身记录小程序`
   - 选择 **Public** 或 **Private**
   - ❌ **不要**勾选 "Add a README file"（我们已经有了）
   - ❌ **不要**勾选 "Add .gitignore"
   - ❌ **不要**勾选 "Choose a license"
3. 点击 "Create repository"

### 步骤 2: 推送代码到 GitHub

创建仓库后，GitHub 会显示推送命令。在终端执行以下命令：

```bash
git remote add origin https://github.com/你的用户名/NightPump-miniprogram.git
git branch -M main
git push -u origin main
```

将 `你的用户名` 替换为你的 GitHub 用户名。

---

## 方法二：使用 GitHub Desktop（图形界面）

1. 下载并安装 GitHub Desktop
2. 选择 "File" -> "Add local repository"
3. 选择项目目录：`/Users/frankzhang/Claude/NightPump/NightPump-miniprogram`
4. 点击 "Publish repository"
5. 填写仓库信息并发布

---

## 方法三：安装 GitHub CLI 后使用命令行

如果你安装了 GitHub CLI：

```bash
# 安装 GitHub CLI
brew install gh

# 登录 GitHub
gh auth login

# 创建仓库并推送
gh repo create NightPump-miniprogram --public --source=. --remote=origin --push
```

---

## 推送成功后

你的仓库地址将是：
```
https://github.com/你的用户名/NightPump-miniprogram
```

你可以在 GitHub 上看到：
- ✅ 完整的项目代码
- ✅ README.md 文档
- ✅ 完整的 Git 历史

## 常见问题

### Q: 推送时提示 "Permission denied"
A: 检查你的 GitHub 账户是否有权限，或使用 SSH 方式推送。

### Q: 忘记推送到哪个分支
A: 现在推荐使用 `main` 分支，而不是 `master`。

### Q: 想要修改 README
A: 可以直接在 GitHub 网页上编辑，或者修改后重新提交推送。

## 下一步

上传成功后，你可以：
1. 在 GitHub 上查看代码
2. 使用 Issues 追踪 bug
3. 邀请其他人协作
4. 设置 GitHub Pages 展示项目
