# GitHub 发布操作指南

**目标:** 将 fragmented-learning Skill 发布到 GitHub

---

## 方式一：用户手动创建仓库 (推荐，最快)

### 步骤 1: 打开 GitHub 新建仓库页面

访问：https://github.com/new

### 步骤 2: 填写仓库信息

| 字段 | 填写内容 |
|------|----------|
| **Repository name** | `fragmented-learning` |
| **Description** | `定时从 GitHub 挑选优秀项目进行拆解学习的 OpenClaw Skill` |
| **Visibility** | ✅ Public (公开) |
| **Initialize this repository with** | ❌ 不要勾选任何选项 |

### 步骤 3: 点击创建

点击 **"Create repository"** 按钮

### 步骤 4: 复制推送命令

创建成功后，页面会显示推送命令，类似：

```bash
git remote add origin https://github.com/drinkwater-claw/fragmented-learning.git
git branch -M main
git push -u origin main
```

### 步骤 5: 执行推送命令

复制上面的命令，在终端执行：

```bash
cd ~/.openclaw/skills/fragmented-learning
# 然后粘贴并执行 GitHub 提供的命令
```

---

## 方式二：完全手动 (如果方式一有问题)

### 步骤 1: 创建空仓库

1. 访问 https://github.com/new
2. 填写仓库名：`fragmented-learning`
3. 设置为 Public
4. 不要初始化 (不要勾选 README/.gitignore/license)
5. 点击 Create repository

### 步骤 2: 本地执行推送

```bash
cd ~/.openclaw/skills/fragmented-learning
git remote add origin https://github.com/drinkwater-claw/fragmented-learning.git
git branch -M main
git push -u origin main
```

如果提示输入密码，使用：
- 用户名：`drinkwater-claw`
- 密码：`xz1122334`

---

## 验证发布成功

### 检查 GitHub 仓库

访问：https://github.com/drinkwater-claw/fragmented-learning

应该看到以下文件：
- ✅ README.md
- ✅ SKILL.md
- ✅ package.json
- ✅ scripts/fetch-github-trending.js
- ✅ templates/note-template.md

### 检查 ClawHub

访问：https://clawhub.com/skills/fragmented-learning

---

## 下一步：发布到 ClawHub

GitHub 发布成功后，执行：

```bash
# 发布到 ClawHub
clawhub publish ~/.openclaw/skills/fragmented-learning
```

或

```bash
openclaw skills publish fragmented-learning
```

---

## 常见问题

### 问题 1: 认证失败

**错误:** `Authentication failed`

**解决:**
1. GitHub 需要 Personal Access Token，不是密码
2. 获取 Token: https://github.com/settings/tokens
3. 使用 Token 代替密码

### 问题 2: 仓库已存在

**错误:** `repository already exists`

**解决:**
- 使用不同的仓库名
- 或删除已存在的仓库后重试

### 问题 3: 权限不足

**错误:** `Permission denied`

**解决:**
- 确认已登录正确的 GitHub 账号
- 检查仓库是否为 Public

---

## 完成检查清单

- [ ] GitHub 仓库创建成功
- [ ] 代码推送成功
- [ ] 验证文件完整 (5 个文件)
- [ ] 访问 GitHub 仓库页面确认
- [ ] 准备发布到 ClawHub

---

*创建时间：2026-03-24 02:21*
*作者：drinkwater (CTO)*
