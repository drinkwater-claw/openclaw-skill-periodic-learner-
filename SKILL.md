---
name: fragmented-learning
description: 定时从 GitHub 等平台挑选优秀项目进行拆解学习，自动整理学习笔记
version: 1.0.0
author: drinkwater (CTO)
homepage: https://github.com/drinkwater-claw/fragmented-learning
---

# fragmented-learning Skill

## 触发条件

当用户提到以下内容时自动触发：
- 开始碎片化学习
- 执行定时学习任务
- 学习 GitHub 项目
- 查看今日学习内容

或手动触发：
- `/fragmented-learning start` - 开始学习
- `/fragmented-learning status` - 查看状态
- `/fragmented-learning config` - 配置选项

---

## 用户配置选项

### 1. 学习资料来源

```json
{
  "source": "github",  // github | gitlab | gitee | all
  "github": {
    "enabled": true,
    "minStars": 100,
    "language": "any"  // any | javascript | python | typescript | go | rust
  },
  "gitlab": {
    "enabled": false
  },
  "gitee": {
    "enabled": false
  }
}
```

### 2. 定时任务间隔

```json
{
  "interval": 15,  // 分钟 (5 | 15 | 30 | 60)
  "enabled": true,
  "checkIdle": true  // 检查待机状态
}
```

### 3. 交付形式

```json
{
  "delivery": {
    "markdown": true,      // 本地 MD 文档
    "feishu": false,       // 飞书云文档
    "feishuFolder": ""     // 飞书文件夹 token
  },
  "outputPath": "~/.openclaw/workspace/碎片化学习-github.md"
}
```

---

## 工作流程

### 1. 待机状态检查

```javascript
// 检查是否处于任务待机状态
function checkIdleState() {
  // 检查是否有活跃会话
  const sessions = sessions_list({ activeMinutes: 30 })
  
  // 检查是否在执行其他任务
  const subagents = subagents({ action: "list" })
  
  // 检查用户是否在线 (可选)
  // 如果用户最近 5 分钟有消息，则认为在线
  
  return sessions.count === 0 && subagents.length === 0
}
```

### 2. 项目挑选

```javascript
// 从 GitHub 获取 trending 项目
async function fetchTrendingProjects() {
  // 调用 GitHub API
  const response = web_fetch({
    url: "https://api.github.com/trending"
  })
  
  // 或使用搜索 API
  const search = web_search({
    query: "github trending today stars:>100",
    freshness: "day"
  })
  
  // 过滤已学习项目
  const learned = loadLearnedHistory()
  const filtered = projects.filter(p => !learned.includes(p.fullName))
  
  // 按 stars/forks 排序
  return filtered.sort((a, b) => b.stars - a.stars).slice(0, 5)
}
```

### 3. 项目拆解分析

```javascript
// 分析项目
async function analyzeProject(project) {
  const analysis = {
    name: project.name,
    url: project.url,
    stars: project.stars,
    forks: project.forks,
    language: project.language,
    description: project.description,
    
    // 1. README 分析
    readme: await analyzeReadme(project),
    
    // 2. 目录结构
    structure: await analyzeStructure(project),
    
    // 3. 核心代码
    coreFiles: await identifyCoreFiles(project),
    
    // 4. 技术栈
    techStack: await identifyTechStack(project),
    
    // 5. 架构模式
    architecture: await identifyArchitecture(project)
  }
  
  return analysis
}
```

### 4. 文档生成

```javascript
// 生成学习笔记
function generateNote(analysis) {
  const note = `
# 项目学习：${analysis.name}

**URL:** ${analysis.url}
**Stars:** ${analysis.stars} | **Forks:** ${analysis.forks}
**语言:** ${analysis.language}
**学习日期:** ${new Date().toISOString()}

## 项目描述
${analysis.description}

## 核心功能
${analyzeReadme.coreFeatures}

## 目录结构
${formatStructure(analysis.structure)}

## 核心代码分析
${formatCoreFiles(analysis.coreFiles)}

## 技术栈
${formatTechStack(analysis.techStack)}

## 架构模式
${formatArchitecture(analysis.architecture)}

## 学习收获
- 收获 1
- 收获 2
- ...

---
`
  return note
}
```

### 5. 文档更新

```javascript
// 更新学习文档
function updateLearningDoc(note, config) {
  // 本地 MD 文档
  if (config.delivery.markdown) {
    appendToFile(config.outputPath, note)
  }
  
  // 飞书云文档
  if (config.delivery.feishu) {
    feishu_doc({
      action: "append",
      doc_token: config.delivery.feishuDocToken,
      content: note
    })
  }
  
  // 记录学习历史
  recordLearnedProject(note.name)
}
```

---

## 完整执行流程

```
1. 检查待机状态
   ↓
2. 获取 trending 项目列表
   ↓
3. 过滤已学习项目
   ↓
4. 选择最优项目 (stars 最高)
   ↓
5. 抓取项目信息 (README/结构/代码)
   ↓
6. 分析项目 (技术栈/架构/核心功能)
   ↓
7. 生成学习笔记
   ↓
8. 更新文档 (MD/飞书)
   ↓
9. 记录学习历史
   ↓
10. 等待下次定时触发
```

---

## 配置示例

### 最小配置

```json
{
  "fragmentedLearning": {
    "enabled": true,
    "interval": 15
  }
}
```

### 完整配置

```json
{
  "fragmentedLearning": {
    "enabled": true,
    "interval": 15,
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
    },
    "maxLearnPerDay": 20,
    "avoidDuplicates": true
  }
}
```

---

## 命令参考

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
/fragmented-learning config set delivery=markdown

# 查看学习历史
/fragmented-learning history

# 清空学习历史
/fragmented-learning history clear
```

### 自动触发

- 每 15 分钟自动检查并执行 (如果处于待机状态)
- 可通过配置修改间隔时间

---

## 错误处理

### GitHub API 限流

```javascript
// GitHub API 限流处理
if (response.status === 403) {
  // 等待限流解除
  const resetTime = response.headers['x-ratelimit-reset']
  await sleep(resetTime - Date.now())
  
  // 或使用备用方案
  return fetchFromWebSearch()
}
```

### 项目无法访问

```javascript
// 项目无法访问处理
if (!project.readme || !project.structure) {
  // 跳过该项目，选择下一个
  return selectNextProject()
}
```

### 文档写入失败

```javascript
// 文档写入失败处理
try {
  writeToFile(config.outputPath, note)
} catch (e) {
  // 尝试创建目录
  createDirectory(path.dirname(config.outputPath))
  // 重试
  writeToFile(config.outputPath, note)
}
```

---

## 学习历史管理

### 记录格式

```json
{
  "learnedProjects": [
    {
      "name": "project-name",
      "fullName": "owner/project-name",
      "url": "https://github.com/owner/project",
      "learnedAt": "2026-03-24T02:00:00Z",
      "stars": 1500,
      "language": "JavaScript"
    }
  ],
  "lastUpdated": "2026-03-24T02:00:00Z"
}
```

### 存储位置

- `~/.openclaw/skills/fragmented-learning/.history.json`

---

## 注意事项

1. **GitHub API 限流**: 未认证 API 每小时 60 次请求，建议使用认证 token
2. **避免重复学习**: 每次学习前检查学习历史
3. **待机状态**: 只在无其他任务时执行，避免干扰正常工作
4. **文档大小**: 定期归档旧学习笔记，避免文档过大
5. **错误恢复**: 失败后自动重试，记录错误日志

---

## References

- `references/github-api.md` - GitHub API 使用参考
- `references/project-analysis.md` - 项目分析方法
- `templates/note-template.md` - 学习笔记模板
