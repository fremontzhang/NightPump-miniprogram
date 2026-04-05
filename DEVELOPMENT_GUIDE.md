# 微信小程序开发指南

## 🛠️ 推荐开发工具

### 选项 1: VS Code（推荐）

**安装步骤：**
1. 下载安装 VS Code: https://code.visualstudio.com/
2. 安装微信小程序插件
3. 打开项目文件夹开始开发

**必备插件：**
- **微信小程序开发工具** - 代码提示和语法高亮
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **GitLens** - Git 增强功能
- **Material Icon Theme** - 图标主题

**VS Code 配置已包含在项目中：**
- ✅ `.vscode/extensions.json` - 推荐插件列表
- ✅ `.vscode/weapp.code-snippets` - 代码片段模板
- ✅ `.eslintrc.js` - 代码检查规则
- ✅ `.prettierrc.js` - 代码格式化配置

### 选项 2: WebStorm / IntelliJ IDEA

**配置步骤：**
1. 打开 WebStorm
2. File → Open → 选择项目目录
3. WebStorm 原生支持微信小程序语法高亮
4. 可以直接使用 Git 集成

### 选项 3: 其他编辑器

任何支持 JavaScript 和 HTML 的编辑器都可以：
- Sublime Text
- Atom
- Vim / Neovim
- 等

## 🚀 开发工作流

### 1. 日常开发流程

```bash
# 进入项目目录
cd /Users/frankzhang/Claude/NightPump/NightPump-miniprogram

# 1. 创建新分支开发新功能
git checkout -b feature/训练页面

# 2. 使用 VS Code 或其他工具编辑代码
# ...

# 3. 提交代码
git add .
git commit -m "feat: 实现训练页面"

# 4. 推送到 GitHub
git push origin feature/训练页面
```

### 2. 代码片段使用

在 VS Code 中输入以下前缀快速生成代码：

- `wpage` + Tab → 生成 Page 模板
- `wcloud` + Tab → 生成云函数调用
- `wquery` + Tab → 生成数据库查询
- `wxml` + Tab → 生成 WXML 模板
- `wfor` + Tab → 生成列表循环
- `wif` + Tab → 生成条件渲染
- `wtap` + Tab → 生成点击事件

### 3. 文件结构

```
NightPump-miniprogram/
├── pages/              # 页面文件（在这里开发新页面）
├── services/           # 服务层（云开发、API等）
├── utils/             # 工具函数
├── store/             # 状态管理
├── components/        # 组件目录
├── images/           # 图片资源
├── app.js            # 小程序入口
├── app.json          # 小程序配置
└── app.wxss          # 全局样式
```

### 4. 在编辑器中开发的优势

**相比微信开发者工具：**
✅ 更好的代码编辑体验
✅ 强大的代码补全
✅ 多文件标签页管理
✅ Git 可视化操作
✅ 丰富的插件生态
✅ 更快的文件搜索
✅ 更好的错误提示
✅ 终端集成

### 5. 实时预览和调试

虽然你在编辑器中开发，但仍然需要微信开发者工具进行预览：

**方法 A：自动编译**
1. 打开微信开发者工具
2. 导入项目
3. 开启"自动预览"
4. 在编辑器中保存文件，开发者工具会自动刷新

**方法 B：手动编译**
1. 在编辑器中修改代码并保存
2. 在微信开发者工具中点击"编译"
3. 查看修改效果

## 📋 开发检查清单

在开发每个页面时，确保：

- [ ] 创建 4 个必需文件：`.js`, `.json`, `.wxml`, `.wxss`
- [ ] 在 `app.json` 中注册页面路径
- [ ] 实现必需的生命周期函数
- [ ] 添加适当的错误处理
- [ ] 使用云开发服务时添加 loading 提示
- [ ] 测试不同场景下的功能
- [ ] 提交代码时写清楚 commit message

## 🎯 常用命令

### Git 命令
```bash
# 查看状态
git status

# 提交所有修改
git add .
git commit -m "描述"

# 推送到远程
git push

# 拉取最新代码
git pull

# 查看提交历史
git log --oneline
```

### 小程序相关
```bash
# 清除缓存
rm -rf .DS_Store

# 查看文件列表
ls -la pages/

# 搜索文件内容
grep -r "关键词" pages/
```

## 💡 开发技巧

### 1. 快速定位文件
在 VS Code 中使用 `Cmd+P` (Mac) 或 `Ctrl+P` (Windows) 快速打开文件。

### 2. 批量修改
使用 VS Code 的全局搜索替换功能 (`Cmd+Shift+F`).

### 3. 查看代码结构
使用 VS Code 的文件资源管理器树形视图。

### 4. 调试技巧
- 使用 `console.log()` 输出调试信息
- 在微信开发者工具的 Console 面板查看日志
- 使用 debugger 断点调试

### 5. 性能优化
- 避免频繁调用 setData
- 合理使用云函数
- 图片使用合适的尺寸
- 按需加载页面和组件

## 🔧 常见问题

### Q: 代码修改后没有生效？
A:
1. 确保文件已保存
2. 在微信开发者工具中点击"编译"
3. 检查是否有语法错误（Console 会显示）

### Q: 如何调试云函数？
A:
1. 在微信开发者工具的"云开发"控制台查看日志
2. 使用 console.log 在云函数中输出调试信息

### Q: 如何模拟不同设备？
A: 在微信开发者工具顶部选择不同的设备模拟器

## 📚 参考资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [VS Code 微信小程序开发指南](https://developers.weixin.qq.com/miniprogram/dev/ide/vscode.html)

## 📦 GitHub 同步规范

### 分支策略（推荐）

```
main      ← 稳定版本，可发布
  ↑
develop   ← 开发分支，日常开发
  ↑
feature/* ← 功能分支，具体功能开发
```

### Commit Message 规范

格式：`类型: 描述`

| 类型 | 用途 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加训练计划创建功能` |
| `fix` | Bug修复 | `fix: 修复页面跳转失败问题` |
| `docs` | 文档更新 | `docs: 更新README说明` |
| `style` | 代码格式 | `style: 格式化代码缩进` |
| `refactor` | 重构 | `refactor: 优化数据查询逻辑` |
| `perf` | 性能优化 | `perf: 减少云数据库调用次数` |
| `test` | 测试相关 | `test: 添加单元测试` |

### 敏感信息保护

**不要提交到 GitHub 的文件：**

- `project.private.config.json` - 包含小程序 AppID
- `.env` / `.env.local` - 环境变量
- 云开发环境 ID（虽然可以提交，但建议通过环境变量配置）

**检查清单：**
- [ ] 提交前运行 `git status` 查看要提交的文件
- [ ] 确保没有包含敏感信息的文件
- [ ] 代码中没有硬编码的密钥或密码

### 完整的开发提交流程

```bash
# 1. 确保在最新代码基础上开发
git checkout main
git pull origin main

# 2. 创建功能分支
git checkout -b feature/训练记录页面

# 3. 开发完成后，查看修改
git status
git diff

# 4. 提交代码（使用规范的 commit message）
git add .
git commit -m "feat: 实现训练记录页面

- 添加训练记录列表展示
- 实现记录详情页面
- 集成云数据库查询"

# 5. 推送到 GitHub
git push origin feature/训练记录页面

# 6. 在 GitHub 上创建 Pull Request
# - 使用 .github/PULL_REQUEST_TEMPLATE.md 模板
# - 填写变更描述
# - 请求代码审查

# 7. 合并后，本地更新
git checkout main
git pull origin main
git branch -d feature/训练记录页面  # 删除本地分支
```

### 日常同步命令

```bash
# 查看当前状态
git status

# 查看提交历史
git log --oneline -10

# 拉取最新代码（从 GitHub）
git pull origin main

# 推送本地代码（到 GitHub）
git push origin main

# 撤销上次提交（保留修改）
git reset --soft HEAD~1

# 查看分支列表
git branch -a

# 切换到其他分支
git checkout 分支名
```

## 🎉 开始开发

现在你可以：

1. 用 VS Code 或其他编辑器打开项目
2. 开始编辑代码
3. 在微信开发者工具中实时预览
4. **定期提交代码到 GitHub 备份**
5. 开发完成后上传审核

祝你开发愉快！💪
