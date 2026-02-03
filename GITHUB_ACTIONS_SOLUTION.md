# GitHub Actions 集成方案 - 完整说明

## 📋 问题回顾

您提出的三个关键问题：

1. ❓ **如何在 GitHub Actions 中调用这些脚本？**
2. ❓ **GitHub Actions 部署的 SSG 项目，可以调用 GLM-4 API Key 吗？**
3. ❓ **如何避免调用接口泄露 token？**

## ✅ 解决方案总结

### 问题 1：如何在 GitHub Actions 中调用脚本？

**答案**：非常简单，直接在工作流中调用即可。

#### 方式 A：在现有部署工作流中调用

编辑 `.github/workflows/blank.yml`：

```yaml
- name: Install and Build
  run: |
    npm install
    npm run build

# 添加这些步骤来调用知识库工具
- name: 生成文档索引
  run: |
    node .agents/skills/ai-doc/scripts/generate-doc-index.mjs
    
- name: 查看知识库统计
  run: |
    npm run kb:stats
```

#### 方式 B：使用新的 AI 文档生成工作流

项目已包含完整的 AI 文档生成工作流（`.github/workflows/ai-doc-generation.yml`）：

**触发方式**：
- 创建 Issue 并添加 `ai-doc` 标签
- 在 Issue 评论 `/ai-doc 主题`
- 手动在 Actions 页面触发

**自动完成**：
1. 使用 GLM-4 生成文档
2. 智能推荐分类
3. 验证文档质量
4. 添加到知识库
5. 创建 Pull Request

---

### 问题 2：SSG 项目能否调用 GLM-4 API？

**答案**：可以！GitHub Actions 完美支持。

#### 实现方式

**步骤 1：获取 GLM API Key**

1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入「API Keys」页面
4. 创建新的 API Key
5. **立即保存**（仅显示一次）

**步骤 2：添加到 GitHub Secrets**

1. 打开仓库：https://github.com/Acongm/vuepress
2. 进入 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`
4. 填写：
   - **Name**: `GLM_API_KEY`
   - **Value**: 粘贴你的 API Key
5. 点击 `Add secret`

**步骤 3：在工作流中使用**

```yaml
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
          node lib/glm-api.mjs generate "React Hooks 最佳实践"
```

#### 为什么 SSG 可以调用 API？

- ✅ GitHub Actions 运行在云端服务器
- ✅ 有网络访问权限
- ✅ 可以调用任何 HTTP API
- ✅ 独立于静态站点生成过程
- ✅ 生成的文档作为源文件提交

**工作流程**：

```
GitHub Actions 运行
  ↓
调用 GLM-4 API（云端）
  ↓
生成 Markdown 文档
  ↓
提交到 Git 仓库
  ↓
VuePress 构建静态站点
  ↓
部署到 GitHub Pages
```

---

### 问题 3：如何避免 Token 泄露？

**答案**：多重安全机制保护。

#### 🔒 安全措施 1：GitHub Secrets

**原理**：
- GitHub 加密存储 Secret
- 仅在工作流运行时可访问
- 无法通过 API 或界面读取
- 仓库协作者也看不到

**使用方式**：
```yaml
env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY }}
```

#### 🔒 安全措施 2：日志自动脱敏

工具已实现日志脱敏：

```javascript
// lib/glm-api.mjs 中的实现
function maskApiKey(key) {
  if (!key || key.length < 12) return '***'
  return `${key.slice(0, 4)}...${key.slice(-4)}`
}

// 日志输出示例
[2026-02-03] ℹ️  调用 GLM-4 API (model: glm-4-flash, key: sk-1234...abcd)
```

**效果**：
- ✅ 仅显示前 4 位和后 4 位
- ✅ 中间用 `...` 代替
- ✅ 即使日志泄露也无法还原完整密钥

#### 🔒 安全措施 3：环境变量隔离

```yaml
jobs:
  job1:
    env:
      GLM_API_KEY: ${{ secrets.GLM_API_KEY }}
    # 仅此 job 可访问
  
  job2:
    # 此 job 无法访问 GLM_API_KEY
```

#### 🔒 安全措施 4：.gitignore 排除敏感文件

已更新 `.gitignore`：

```
# Environment variables and secrets
.env
.env.local
.env.*.local
*.key
*.pem
```

**确保**：
- ✅ .env 文件不会被提交
- ✅ API Key 文件不会泄露
- ✅ 本地开发安全

#### 🔒 安全措施 5：最小权限原则

工作流仅请求必要权限：

```yaml
permissions:
  contents: write      # 提交代码
  pull-requests: write # 创建 PR
  issues: write        # 评论 Issue
  # 不要给予其他权限
```

#### 🔒 安全措施 6：审计日志

GitHub Actions 记录所有运行：
- ✅ 谁触发了工作流
- ✅ 何时运行
- ✅ 运行了哪些命令
- ✅ 是否成功

**查看方式**：
1. 进入 `Actions` 标签
2. 选择工作流运行
3. 查看详细日志

#### 🔒 安全措施 7：定期轮换密钥

**建议**：每 90 天更换一次 API Key

**步骤**：
1. 在 GLM 平台生成新密钥
2. 更新 GitHub Secret
3. 删除旧密钥
4. 测试工作流

---

## 🎯 快速开始指南

### 第 1 步：配置 API Key

```bash
# 1. 获取 GLM API Key
# 访问：https://open.bigmodel.cn/

# 2. 添加到 GitHub Secrets
# 仓库 Settings → Secrets → New secret
# Name: GLM_API_KEY
# Value: 你的密钥
```

### 第 2 步：测试工作流

**方式 A：通过 Issue（推荐）**

1. 创建新 Issue
   - 标题：`Vue 3 Composition API 详解`
   - 标签：`ai-doc`
2. 等待 GitHub Actions 运行
3. 查看生成的 Pull Request
4. 审查并合并

**方式 B：Issue 评论**

在任意 Issue 评论：
```
/ai-doc React Hooks 最佳实践
```

**方式 C：手动触发**

1. 进入 `Actions` 标签
2. 选择 `AI 文档生成工作流`
3. 点击 `Run workflow`
4. 填写主题和参数
5. 运行

### 第 3 步：查看结果

1. **Actions 日志**：查看运行过程
2. **Pull Request**：查看生成的文档
3. **合并**：审查后合并到主分支
4. **部署**：自动部署到 GitHub Pages

---

## 🛠️ 本地开发使用

### 设置环境变量

```bash
# 方式 1：直接设置（推荐）
export GLM_API_KEY="your-api-key-here"

# 方式 2：使用 .env 文件
cp .env.example .env
# 编辑 .env 文件，填入 API Key

# 测试
node lib/glm-api.mjs chat "你好"
```

### 命令行使用

```bash
# 生成文档
node lib/glm-api.mjs generate "JavaScript 闭包详解"

# AI 智能分类推荐
node lib/glm-api.mjs suggest /tmp/my-doc.md

# 优化文档
node lib/glm-api.mjs improve /tmp/my-doc.md --output /tmp/improved.md

# 直接对话
node lib/glm-api.mjs chat "解释一下 async/await"
```

---

## 📊 API 成本说明

### GLM-4 模型对比

| 模型 | 速度 | 质量 | 成本 | 推荐场景 |
|------|------|------|------|----------|
| **glm-4-flash** | ⚡️⚡️⚡️ | ⭐️⭐️⭐️ | 💰 | CI/CD 自动化（推荐） |
| glm-4-air | ⚡️⚡️ | ⭐️⭐️⭐️⭐️ | 💰💰 | 日常文档生成 |
| glm-4-airx | ⚡️ | ⭐️⭐️⭐️⭐️⭐️ | 💰💰💰 | 重要技术文档 |
| glm-4 | ⚡️ | ⭐️⭐️⭐️⭐️ | 💰💰 | 标准文档 |
| glm-4-plus | ⚡️ | ⭐️⭐️⭐️⭐️⭐️ | 💰💰💰 | 专业内容 |

### 成本优化建议

1. **CI/CD 使用 glm-4-flash**：速度快，成本低
2. **手动生成使用 glm-4-air**：平衡质量和成本
3. **重要文档使用 glm-4-plus**：最高质量
4. **批量生成限制频率**：避免超额费用
5. **监控使用情况**：定期检查消费

---

## 🎨 完整使用示例

### 示例 1：定期生成技术总结

创建 `.github/workflows/weekly-summary.yml`：

```yaml
name: 每周技术总结

on:
  schedule:
    - cron: '0 2 * * 0' # 每周日凌晨 2 点

env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY }}

jobs:
  weekly-summary:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: 生成本周总结
        run: |
          npm install
          
          WEEK=$(date +%Y-W%U)
          
          node lib/glm-api.mjs generate "本周前端技术总结 ${WEEK}" \
            --model glm-4-flash \
            --output /tmp/weekly.md
          
          npm run kb:add /tmp/weekly.md
```

### 示例 2：Issue 转文档

创建 `.github/workflows/issue-to-doc.yml`：

```yaml
name: Issue 转文档

on:
  issues:
    types: [closed]

env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY }}

jobs:
  convert:
    if: contains(github.event.issue.labels.*.name, 'convert-to-doc')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: 转换为文档
        run: |
          npm install
          
          TITLE="${{ github.event.issue.title }}"
          
          node lib/glm-api.mjs generate "${TITLE}" \
            --output /tmp/issue-doc.md
          
          npm run kb:add /tmp/issue-doc.md
```

---

## 🔍 故障排查

### 问题 1：API Key 未配置

**错误**：
```
❌ 错误：GLM_API_KEY 未配置
```

**解决**：
1. 检查 GitHub Secret 是否添加
2. Secret 名称是否正确（区分大小写）
3. 工作流中是否设置了环境变量

### 问题 2：API 调用失败

**错误**：
```
API 请求失败 (401): Unauthorized
```

**解决**：
1. 验证 API Key 是否有效
2. 检查账户余额是否充足
3. 确认 API Key 未过期

### 问题 3：工作流未触发

**检查**：
- [ ] Issue 是否有 `ai-doc` 标签
- [ ] 工作流文件语法是否正确
- [ ] 仓库 Actions 是否启用

---

## 📚 相关文档

- **完整集成指南**：[GITHUB_ACTIONS_GUIDE.md](./GITHUB_ACTIONS_GUIDE.md)
- **快速开始**：[QUICK_START.md](./QUICK_START.md)
- **知识库指南**：[KNOWLEDGE_BASE_GUIDE.md](./KNOWLEDGE_BASE_GUIDE.md)

---

## ✅ 总结

### 回答您的三个问题

1. ✅ **如何调用脚本**：直接在工作流中 `run: npm run kb:stats`
2. ✅ **能否调用 API**：可以，使用 GitHub Secrets 存储密钥
3. ✅ **如何避免泄露**：7 重安全措施保护

### 核心优势

- 🔐 **安全**：GitHub Secrets + 日志脱敏
- 🚀 **自动化**：Issue 触发，自动生成
- ✅ **可靠**：错误重试，质量验证
- 📊 **可控**：审查 PR，手动合并
- 💰 **经济**：使用 glm-4-flash，成本低

### 立即开始

1. **获取密钥**：https://open.bigmodel.cn/
2. **添加 Secret**：仓库 Settings → Secrets
3. **创建 Issue**：添加 `ai-doc` 标签
4. **等待生成**：查看 Actions 日志
5. **审查合并**：查看 Pull Request

---

**需要帮助？** 查看 [GITHUB_ACTIONS_GUIDE.md](./GITHUB_ACTIONS_GUIDE.md) 获取更多信息。
