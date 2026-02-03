# GitHub Actions 集成指南

本指南详细说明如何在 GitHub Actions 中安全使用知识库管理工具和 GLM-4 API。

## 📋 目录

- [快速开始](#快速开始)
- [API 密钥配置](#api-密钥配置)
- [工作流使用](#工作流使用)
- [安全最佳实践](#安全最佳实践)
- [故障排查](#故障排查)

## 🚀 快速开始

### 1. 配置 GLM API Key

#### 获取 API Key

1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入「API Keys」页面
4. 创建新的 API Key
5. **立即保存**（仅显示一次）

#### 添加到 GitHub Secrets

1. 打开仓库设置：`Settings` → `Secrets and variables` → `Actions`
2. 点击 `New repository secret`
3. 名称：`GLM_API_KEY`
4. 值：粘贴你的 API Key
5. 点击 `Add secret`

![GitHub Secrets 配置](https://docs.github.com/assets/images/help/actions/actions-secrets-add.png)

### 2. 使用预置工作流

项目已包含两个 GitHub Actions 工作流：

#### 工作流 1：自动部署（已有）
**文件**：`.github/workflows/blank.yml`

**功能**：
- 监听 `master` 分支推送
- 自动构建 VuePress
- 部署到 GitHub Pages

**无需额外配置**，推送代码即可自动部署。

#### 工作流 2：AI 文档生成（新增）
**文件**：`.github/workflows/ai-doc-generation.yml`

**功能**：
- 通过 Issues 触发文档生成
- 使用 GLM-4 AI 生成内容
- 自动分类和验证
- 创建 Pull Request

**配置后即可使用**（见下文）。

## 🔐 API 密钥配置

### 环境变量优先级

GLM API 工具按以下优先级读取密钥：

1. **命令行参数**：`--api-key <key>`
2. **环境变量**：`GLM_API_KEY`
3. **错误退出**：如果都未配置

### 在 GitHub Actions 中使用

```yaml
# .github/workflows/your-workflow.yml
jobs:
  your-job:
    runs-on: ubuntu-latest
    env:
      # 从 Secrets 读取 API Key
      GLM_API_KEY: ${{ secrets.GLM_API_KEY }}
    
    steps:
      - name: 调用 GLM API
        run: |
          # 环境变量已设置，直接调用
          node lib/glm-api.mjs generate "主题"
```

### 本地开发使用

```bash
# 方式 1：设置环境变量（推荐）
export GLM_API_KEY="your-api-key-here"
node lib/glm-api.mjs generate "React Hooks"

# 方式 2：使用 .env 文件（需安装 dotenv）
echo "GLM_API_KEY=your-api-key-here" > .env
# 注意：.env 已在 .gitignore 中，不会提交

# 方式 3：命令行参数（不推荐）
node lib/glm-api.mjs generate "主题" --api-key "your-key"
```

## 📝 工作流使用

### 方式 1：通过 Issues 触发

#### 步骤：

1. **创建新 Issue**
   - 标题：文档主题（如："React Hooks 最佳实践"）
   - 标签：添加 `ai-doc` 标签
   - 内容：可选的额外说明

2. **自动触发工作流**
   - GitHub Actions 自动检测到 `ai-doc` 标签
   - 使用 GLM-4 生成文档
   - 创建 Pull Request

3. **审查和合并**
   - 查看生成的 Pull Request
   - 检查文档内容
   - 合并到主分支

#### 示例 Issue：

```
标题：Vue 3 Composition API 详解

标签：ai-doc, documentation

内容：
请生成一篇关于 Vue 3 Composition API 的详细文档，包括：
- setup 函数的使用
- ref 和 reactive 的区别
- computed 和 watch 的用法
- 代码示例
```

### 方式 2：Issue 评论触发

在任何 Issue 中评论：

```
/ai-doc React Hooks 使用技巧
```

工作流会自动：
1. 提取主题："React Hooks 使用技巧"
2. 生成文档
3. 创建 Pull Request

### 方式 3：手动触发

1. 进入 `Actions` 标签
2. 选择 `AI 文档生成工作流`
3. 点击 `Run workflow`
4. 填写表单：
   - **文档主题**：必填
   - **分类**：可选（留空自动推荐）
   - **模型**：选择 GLM 模型
5. 点击 `Run workflow`

### 方式 4：在其他工作流中调用

```yaml
# .github/workflows/custom-workflow.yml
name: 自定义文档工作流

on:
  schedule:
    - cron: '0 0 * * 0' # 每周日运行

env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY }}

jobs:
  weekly-summary:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: 生成本周总结
        run: |
          npm install
          
          # 生成文档
          node lib/glm-api.mjs generate "本周前端技术总结" \
            --model glm-4-flash \
            --output /tmp/weekly-summary.md
          
          # 添加到知识库
          npm run kb:add /tmp/weekly-summary.md
```

## 🔒 安全最佳实践

### 1. 密钥存储

✅ **正确做法**：
- 使用 GitHub Secrets 存储 API Key
- 本地使用环境变量或 `.env` 文件
- 永远不要在代码中硬编码密钥

❌ **错误做法**：
```javascript
// 千万不要这样做！
const apiKey = "sk-12345..." // 会被提交到 Git
```

### 2. 密钥轮换

定期更换 API Key（建议每 90 天）：

1. 在 GLM 平台生成新密钥
2. 更新 GitHub Secret
3. 删除旧密钥

### 3. 权限最小化

为 GitHub Actions 配置最小必要权限：

```yaml
permissions:
  contents: write      # 提交代码
  pull-requests: write # 创建 PR
  issues: write        # 评论 Issue
  # 不要给予其他不必要的权限
```

### 4. 日志脱敏

工具已自动脱敏 API Key：

```bash
# 日志输出示例
[2026-02-03] ℹ️  调用 GLM-4 API (model: glm-4-flash, key: sk-1...f8a2)
```

仅显示前 4 位和后 4 位，中间用 `...` 代替。

### 5. 环境隔离

区分不同环境的密钥：

```yaml
# 生产环境
env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY_PROD }}

# 测试环境
env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY_TEST }}
```

### 6. 访问控制

限制谁可以触发工作流：

```yaml
on:
  issues:
    types: [labeled]
  
jobs:
  generate:
    # 仅允许仓库协作者触发
    if: github.event.sender.permissions.push == true
```

### 7. 审计日志

定期检查 GitHub Actions 运行记录：
- `Actions` → `All workflows`
- 查看 API 调用频率
- 检测异常活动

## 🛠️ 命令行工具

### GLM API 工具

```bash
# 生成文档
node lib/glm-api.mjs generate "主题" --output /tmp/doc.md

# AI 智能分类
node lib/glm-api.mjs suggest /tmp/doc.md

# 优化文档
node lib/glm-api.mjs improve /tmp/doc.md --output /tmp/improved.md

# 直接对话
node lib/glm-api.mjs chat "解释 JavaScript 闭包"
```

### 知识库工具

```bash
# 查询统计
npm run kb:stats

# 搜索文档
npm run kb:query search "hooks"

# 验证文档
npm run kb:validate /tmp/doc.md

# 添加文档（一键完成）
npm run kb:add /tmp/doc.md
```

## 📊 使用统计

### API 调用成本

GLM-4 模型定价（参考）：

| 模型 | 速度 | 质量 | 成本 | 推荐场景 |
|------|------|------|------|----------|
| glm-4-flash | ⚡️⚡️⚡️ | ⭐️⭐️⭐️ | 💰 | CI/CD 自动化 |
| glm-4-air | ⚡️⚡️ | ⭐️⭐️⭐️⭐️ | 💰💰 | 日常使用 |
| glm-4-airx | ⚡️ | ⭐️⭐️⭐️⭐️⭐️ | 💰💰💰 | 重要文档 |
| glm-4 | ⚡️ | ⭐️⭐️⭐️⭐️ | 💰💰 | 标准文档 |
| glm-4-plus | ⚡️ | ⭐️⭐️⭐️⭐️⭐️ | 💰💰💰 | 专业内容 |

### 优化建议

1. **CI/CD 使用 glm-4-flash**：速度快，成本低
2. **手动生成使用 glm-4-air**：平衡质量和成本
3. **重要文档使用 glm-4-plus**：最高质量

## 🔧 故障排查

### 问题 1：API Key 未配置

**错误信息**：
```
❌ 错误：GLM_API_KEY 未配置
```

**解决方法**：
1. 检查 GitHub Secret 是否添加
2. Secret 名称是否正确（区分大小写）
3. 工作流中是否设置了环境变量

### 问题 2：API 调用失败

**错误信息**：
```
API 请求失败 (401): Unauthorized
```

**解决方法**：
1. 验证 API Key 是否有效
2. 检查 API Key 是否过期
3. 确认账户余额充足

### 问题 3：工作流未触发

**检查清单**：
- [ ] Issue 是否有 `ai-doc` 标签
- [ ] 工作流文件语法是否正确
- [ ] 仓库 Actions 是否启用
- [ ] 权限是否足够

### 问题 4：文档生成质量不佳

**优化方法**：
1. 使用更强大的模型（glm-4-plus）
2. 在 Issue 中提供更详细的说明
3. 调整温度参数（`--temperature 0.3`）

### 问题 5：分类推荐不准确

**解决方法**：
1. 手动指定分类（`--category react`）
2. 在 Issue 中说明期望分类
3. 使用 AI 分类（`node lib/glm-api.mjs suggest`）

## 📚 完整示例

### 示例 1：每日技术文章

```yaml
name: 每日技术文章

on:
  schedule:
    - cron: '0 2 * * *' # 每天凌晨 2 点

env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY }}

jobs:
  daily-article:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: 安装依赖
        run: npm install
      
      - name: 生成今日文章
        run: |
          TODAY=$(date +%Y-%m-%d)
          TOPIC="前端技术日报 ${TODAY}"
          
          node lib/glm-api.mjs generate "${TOPIC}" \
            --model glm-4-flash \
            --output /tmp/daily.md
          
          npm run kb:add /tmp/daily.md
```

### 示例 2：Issue 转文档

```yaml
name: Issue 转文档

on:
  issues:
    types: [closed]

env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY }}

jobs:
  issue-to-doc:
    if: contains(github.event.issue.labels.*.name, 'convert-to-doc')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: 转换 Issue 为文档
        run: |
          npm install
          
          # 提取 Issue 内容
          TITLE="${{ github.event.issue.title }}"
          BODY="${{ github.event.issue.body }}"
          
          # 生成文档
          node lib/glm-api.mjs generate "${TITLE}" \
            --output /tmp/issue-doc.md
          
          # 添加到知识库
          npm run kb:add /tmp/issue-doc.md
```

## 🎯 最佳实践总结

### ✅ 推荐做法

1. **使用 GitHub Secrets** 存储 API Key
2. **设置环境变量** 而不是命令行参数
3. **使用 glm-4-flash** 在 CI/CD 中
4. **定期轮换密钥** 提高安全性
5. **启用日志脱敏** 避免泄露
6. **限制工作流权限** 最小化风险
7. **审查 AI 生成内容** 确保质量

### ❌ 避免做法

1. ❌ 在代码中硬编码 API Key
2. ❌ 在日志中输出完整密钥
3. ❌ 使用个人密钥在公共仓库
4. ❌ 不审查就合并 AI 生成的内容
5. ❌ 过度使用高成本模型
6. ❌ 忽略安全更新和漏洞

## 📞 获取帮助

- **GitHub Issues**：报告问题和建议
- **GitHub Discussions**：讨论和交流
- **文档**：查看其他指南
  - [QUICK_START.md](../QUICK_START.md)
  - [KNOWLEDGE_BASE_GUIDE.md](../KNOWLEDGE_BASE_GUIDE.md)
  - [lib/README.md](../lib/README.md)

---

**安全提示**：请妥善保管你的 API Key，不要分享给他人。如果密钥泄露，立即在 GLM 平台撤销并生成新密钥。
