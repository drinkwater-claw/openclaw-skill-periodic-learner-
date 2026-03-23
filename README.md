# fragmented-learning Skill

**版本:** 1.0.0  
**作者:** drinkwater (CTO)  
**描述:** 定时从 GitHub 等平台挑选优秀项目进行拆解学习

---

## 功能特点

- ✅ 定时自动执行 (可配置间隔)
- ✅ 多平台支持 (GitHub/GitLab/Gitee)
- ✅ 智能项目筛选 (按 stars/forks/language)
- ✅ 自动去重 (避免重复学习)
- ✅ 多种交付形式 (MD 文档/飞书云文档)
- ✅ 待机状态检测 (不干扰正常工作)

---

## 安装

### 方式一：ClawHub 安装 (推荐)

```bash
openclaw skills install fragmented-learning
```

### 方式二：手动安装

```bash
git clone https://github.com/drinkwater-claw/fragmented-learning.git ~/.openclaw/skills/fragmented-learning
```

---

## 配置

在 `~/.openclaw/openclaw.json` 中添加：

```json5
{
  "skills": {
    "entries": {
      "fragmented-learning": {
        "enabled": true,
        "env": {
          "GITHUB_TOKEN": "your_github_token"  // 可选，提高 API 限流
        },
        "config": {
          "interval": 15,  // 分钟
          "checkIdle": true,
          "sources": {
            "github": {
              "enabled": true,
              "minStars": 100,
              "language": "any"
            }
          },
          "delivery": {
            "markdown": true,
            "feishu": false,
            "outputPath": "~/.openclaw/workspace/碎片化学习-github.md"
          }
        }
      }
    }
  }
}
```

---

## 使用方法

### 自动执行

Skill 会每 15 分钟自动检查并执行 (如果处于待机状态)。

### 手动触发

```bash
# 开始学习
/fragmented-learning start

# 查看状态
/fragmented-learning status

# 查看配置
/fragmented-learning config

# 更新配置
/fragmented-learning config set interval=30
/fragmented-learning config set source=github

# 查看学习历史
/fragmented-learning history
```

---

## 输出示例

学习完成后，会在 `碎片化学习-github.md` 中生成如下内容：

```markdown
# 项目学习：awesome-project

**URL:** https://github.com/owner/awesome-project
**Stars:** 15000 | **Forks:** 2000
**语言:** TypeScript
**学习日期:** 2026-03-24T02:00:00Z

## 项目描述
一个很棒的开源项目...

## 核心功能
- 功能 1
- 功能 2

## 技术栈
- 前端：React
- 后端：Node.js
- 数据库：PostgreSQL

## 学习收获
- 收获 1
- 收获 2
```

---

## 配置选项详解

### 学习资料来源

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `sources.github.enabled` | 启用 GitHub | true |
| `sources.github.minStars` | 最小 stars 数 | 100 |
| `sources.github.language` | 编程语言过滤 | any |
| `sources.gitlab.enabled` | 启用 GitLab | false |
| `sources.gitee.enabled` | 启用 Gitee | false |

### 定时任务间隔

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `interval` | 间隔分钟数 | 15 |
| `checkIdle` | 检查待机状态 | true |

### 交付形式

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `delivery.markdown` | 输出 MD 文档 | true |
| `delivery.feishu` | 输出飞书文档 | false |
| `delivery.outputPath` | MD 文档路径 | ~/.openclaw/workspace/碎片化学习-github.md |

---

## 环境变量

| 变量 | 说明 | 必需 |
|------|------|------|
| `GITHUB_TOKEN` | GitHub API Token | 否 (推荐设置) |

设置 Token 可提高 API 限流 (未认证：60 次/小时，认证：5000 次/小时)

---

## 注意事项

1. **GitHub API 限流**: 建议设置 GITHUB_TOKEN
2. **避免重复学习**: Skill 会自动记录学习历史
3. **待机状态**: 只在无其他任务时执行
4. **文档大小**: 定期归档旧学习笔记

---

## 开发

### 目录结构

```
fragmented-learning/
├── SKILL.md                          # Skill 核心定义
├── README.md                         # 使用说明
├── package.json                      # 依赖配置
├── scripts/
│   └── fetch-github-trending.js      # GitHub 项目获取脚本
├── templates/
│   └── note-template.md              # 学习笔记模板
└── references/
    ├── github-api.md                 # GitHub API 参考
    └── project-analysis.md           # 项目分析方法
```

### 本地测试

```bash
# 测试 GitHub 项目获取
node scripts/fetch-github-trending.js

# 测试指定语言
node scripts/fetch-github-trending.js javascript

# 测试 Skill
openclaw skills check fragmented-learning
```

---

## 更新日志

### v1.0.0 (2026-03-24)

- ✅ 初始版本发布
- ✅ GitHub trending 项目获取
- ✅ 项目分析功能
- ✅ MD 文档输出
- ✅ 飞书文档输出 (可选)
- ✅ 学习历史记录
- ✅ 待机状态检测

---

## 许可证

MIT License

---

## 反馈与支持

- GitHub Issues: https://github.com/drinkwater-claw/fragmented-learning/issues
- ClawHub: https://clawhub.com/skills/fragmented-learning
