# 文档页面 AI 内容提炼功能 - 实现方案

## 📋 需求分析

### 用户需求
> 在每个文档右下角增加 AI 内容提炼的功能

### 核心问题
> 会不会暴露 AI Token？

## ✅ 可行性分析

### 答案：可以实现，且不会暴露 Token

**原因**：
1. ✅ 使用**服务端代理**架构
2. ✅ API Key 存储在服务器端
3. ✅ 前端仅调用代理接口
4. ✅ Token 永不发送到客户端

## 🏗️ 架构设计

### 方案对比

#### ❌ 方案 A：前端直接调用（不安全）

```
浏览器
  ↓ (包含 API Key)
GLM-4 API
```

**缺点**：
- ❌ API Key 暴露在前端代码
- ❌ 用户可以从浏览器控制台获取
- ❌ 可能被滥用
- ❌ **绝对不可行**

#### ✅ 方案 B：服务端代理（安全）

```
浏览器
  ↓ (不包含 API Key)
代理服务器 (Node.js/Vercel Edge Function)
  ↓ (包含 API Key，服务端存储)
GLM-4 API
```

**优点**：
- ✅ API Key 存储在服务器端
- ✅ 前端无法获取 Token
- ✅ 可以添加请求限流
- ✅ 可以记录审计日志
- ✅ **推荐方案**

#### ✅ 方案 C：构建时生成（最安全，但不实时）

```
构建时
  ↓ (GitHub Actions 中调用 GLM-4)
生成所有文档的摘要
  ↓
存储为静态 JSON 文件
  ↓
部署到静态站点
```

**优点**：
- ✅ 完全不暴露 Token
- ✅ 访问速度最快
- ✅ 无运行时成本

**缺点**：
- ❌ 不实时（需要重新构建）
- ❌ 增加构建时间

## 🎯 推荐实现方案

### 方案选择：混合方案

**基础版（方案 C）**：构建时预生成
- 对所有现有文档生成摘要
- 存储为静态 JSON
- 构建时自动更新

**增强版（方案 B）**：实时生成
- 对新文档或用户请求实时生成
- 通过服务端代理调用
- 可选功能（需要部署服务）

## 📝 实现步骤

### 第 1 步：构建时预生成（基础版）

#### 1.1 创建摘要生成脚本

**文件**：`tools/generate-summaries.mjs`

```javascript
#!/usr/bin/env node
/**
 * 为所有文档生成 AI 摘要
 * 在构建时运行，存储为静态 JSON
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

async function generateSummary(content, filePath) {
  // 提取前 1000 字符
  const excerpt = content.slice(0, 1000)
  
  // 调用 GLM-4 生成摘要
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GLM_API_KEY}`
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages: [
        {
          role: 'system',
          content: '你是一个技术文档摘要助手。请用 2-3 句话概括文档的核心内容。'
        },
        {
          role: 'user',
          content: `请概括以下文档的核心内容：\n\n${excerpt}`
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    })
  })
  
  const data = await response.json()
  return data.choices[0]?.message?.content || '暂无摘要'
}

async function generateAllSummaries() {
  const summaries = {}
  
  // 扫描所有 Markdown 文件
  const docsDir = resolve(process.cwd(), 'docs')
  // ... 遍历文件生成摘要
  
  // 保存到 JSON 文件
  writeFileSync(
    resolve(process.cwd(), 'docs/.vuepress/public/summaries.json'),
    JSON.stringify(summaries, null, 2)
  )
}

generateAllSummaries()
```

#### 1.2 在 GitHub Actions 中调用

**文件**：`.github/workflows/blank.yml`

```yaml
- name: Install and Build
  run: |
    npm install
    
    # 生成 AI 摘要（使用 GitHub Secret）
    node tools/generate-summaries.mjs
    
    npm run build

env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY }}
```

#### 1.3 前端读取摘要

```vue
<!-- docs/.vuepress/theme/components/AISummary.vue -->
<template>
  <div class="ai-summary">
    <button @click="showSummary = !showSummary">
      <svg><!-- AI 图标 --></svg>
      AI 提炼
    </button>
    
    <div v-if="showSummary" class="summary-panel">
      <h4>内容提炼</h4>
      <p>{{ summary }}</p>
      <small>由 GLM-4 自动生成</small>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSummary: false,
      summary: ''
    }
  },
  
  async mounted() {
    // 读取预生成的摘要
    const response = await fetch('/summaries.json')
    const summaries = await response.json()
    this.summary = summaries[this.$page.path] || '暂无摘要'
  }
}
</script>
```

**优点**：
- ✅ 完全不暴露 Token
- ✅ 访问速度快
- ✅ 无运行时成本

**缺点**：
- ⚠️ 每次构建都要调用 API（可缓存已生成的）
- ⚠️ 不实时

### 第 2 步：服务端代理（增强版）

#### 2.1 创建 Vercel Edge Function

**文件**：`api/summarize.js`

```javascript
// Vercel Edge Function
export const config = {
  runtime: 'edge'
}

export default async function handler(request) {
  // 验证请求来源
  const origin = request.headers.get('origin')
  if (!origin?.includes('acongm.com')) {
    return new Response('Forbidden', { status: 403 })
  }
  
  // 限流：每个 IP 每分钟最多 5 次请求
  // ... 实现限流逻辑
  
  const { content } = await request.json()
  
  // 调用 GLM-4（API Key 存储在环境变量）
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GLM_API_KEY}`
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages: [
        {
          role: 'system',
          content: '你是一个技术文档摘要助手。'
        },
        {
          role: 'user',
          content: `概括：${content.slice(0, 1000)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    })
  })
  
  const data = await response.json()
  
  return new Response(JSON.stringify({
    summary: data.choices[0]?.message?.content
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin
    }
  })
}
```

#### 2.2 前端调用代理

```vue
<script>
export default {
  methods: {
    async generateSummary() {
      this.loading = true
      
      try {
        // 调用代理接口（不包含 API Key）
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: this.$page.content
          })
        })
        
        const { summary } = await response.json()
        this.summary = summary
        
        // 缓存到 localStorage
        localStorage.setItem(
          `summary:${this.$page.path}`,
          summary
        )
      } catch (error) {
        this.summary = '生成失败，请稍后重试'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

**优点**：
- ✅ 实时生成
- ✅ Token 完全安全
- ✅ 可以添加限流

**缺点**：
- ⚠️ 需要部署服务端
- ⚠️ 有运行时成本

### 第 3 步：创建前端组件

#### 3.1 AI 提炼按钮组件

**文件**：`docs/.vuepress/components/AISummaryButton.vue`

```vue
<template>
  <div class="ai-summary-button">
    <Transition name="fade">
      <button 
        v-if="!showPanel"
        class="ai-button"
        @click="togglePanel"
        :title="title"
      >
        <svg class="ai-icon" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          <path d="M12 8v8m-4-4h8"/>
        </svg>
        <span>AI 提炼</span>
      </button>
    </Transition>
    
    <Transition name="slide">
      <div v-if="showPanel" class="summary-panel">
        <div class="panel-header">
          <h3>
            <svg class="ai-icon-small" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            AI 内容提炼
          </h3>
          <button class="close-btn" @click="togglePanel">×</button>
        </div>
        
        <div class="panel-body">
          <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>AI 正在分析文档内容...</p>
          </div>
          
          <div v-else-if="summary" class="summary-content">
            <p>{{ summary }}</p>
            <div class="meta">
              <span class="badge">GLM-4 生成</span>
              <button @click="regenerate" class="regenerate-btn">
                🔄 重新生成
              </button>
            </div>
          </div>
          
          <div v-else class="error">
            <p>⚠️ 生成失败，请稍后重试</p>
            <button @click="generateSummary">重试</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'AISummaryButton',
  
  data() {
    return {
      showPanel: false,
      loading: false,
      summary: '',
      title: 'AI 提炼文档核心内容'
    }
  },
  
  mounted() {
    // 检查是否有缓存
    const cached = this.getCachedSummary()
    if (cached) {
      this.summary = cached
    }
  },
  
  methods: {
    togglePanel() {
      this.showPanel = !this.showPanel
      
      if (this.showPanel && !this.summary && !this.loading) {
        this.generateSummary()
      }
    },
    
    getCachedSummary() {
      const key = `summary:${this.$page.path}`
      return localStorage.getItem(key)
    },
    
    setCachedSummary(summary) {
      const key = `summary:${this.$page.path}`
      localStorage.setItem(key, summary)
    },
    
    async generateSummary() {
      this.loading = true
      this.summary = ''
      
      try {
        // 优先使用预生成的摘要
        const pregenerated = await this.loadPregeneratedSummary()
        if (pregenerated) {
          this.summary = pregenerated
          this.setCachedSummary(pregenerated)
          return
        }
        
        // 如果没有预生成，调用实时 API（需要服务端代理）
        const summary = await this.callSummaryAPI()
        this.summary = summary
        this.setCachedSummary(summary)
        
      } catch (error) {
        console.error('生成摘要失败:', error)
        this.summary = null
      } finally {
        this.loading = false
      }
    },
    
    async loadPregeneratedSummary() {
      try {
        const response = await fetch('/summaries.json')
        const summaries = await response.json()
        return summaries[this.$page.path]
      } catch {
        return null
      }
    },
    
    async callSummaryAPI() {
      // 如果有服务端代理，调用代理
      if (this.hasProxyAPI()) {
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: this.$page.path,
            content: this.$page.content?.slice(0, 1000)
          })
        })
        
        const data = await response.json()
        return data.summary
      }
      
      // 否则返回默认提示
      return '实时生成功能需要服务端支持。请使用预生成摘要或联系管理员启用。'
    },
    
    hasProxyAPI() {
      // 检查是否部署了代理 API
      return false // 默认关闭，部署后可设置为 true
    },
    
    regenerate() {
      // 清除缓存，重新生成
      localStorage.removeItem(`summary:${this.$page.path}`)
      this.generateSummary()
    }
  }
}
</script>

<style scoped>
.ai-summary-button {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 1000;
}

.ai-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.ai-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.ai-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

.summary-panel {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-icon-small {
  width: 16px;
  height: 16px;
  fill: white;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.loading {
  text-align: center;
  padding: 20px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.summary-content {
  line-height: 1.8;
  color: #333;
}

.summary-content p {
  margin: 0 0 16px 0;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.regenerate-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: all 0.2s;
}

.regenerate-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.error {
  text-align: center;
  color: #f56c6c;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .summary-panel {
    width: calc(100% - 48px);
    right: 24px;
    left: 24px;
  }
}
</style>
```

#### 3.2 在布局中添加组件

**文件**：`docs/.vuepress/theme/layouts/Layout.vue`

```vue
<template>
  <ParentLayout>
    <!-- 添加 AI 提炼按钮 -->
    <template #page-bottom>
      <AISummaryButton />
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import AISummaryButton from '../components/AISummaryButton.vue'

export default {
  components: {
    ParentLayout,
    AISummaryButton
  }
}
</script>
```

## 🔒 安全保障

### Token 保护措施

#### 1. 构建时方案（推荐）

```yaml
# .github/workflows/blank.yml
env:
  GLM_API_KEY: ${{ secrets.GLM_API_KEY }}  # 仅 CI 可访问

steps:
  - name: Generate Summaries
    run: node tools/generate-summaries.mjs
    # Token 仅在服务器端使用，从不发送到客户端
```

**安全性**：
- ✅ Token 仅在 GitHub Actions 中使用
- ✅ 生成的摘要是纯文本，不含 Token
- ✅ 部署的静态文件完全安全

#### 2. 服务端代理方案

```javascript
// api/summarize.js (Vercel Edge Function)
export default async function handler(request) {
  // 1. 验证来源
  const origin = request.headers.get('origin')
  if (!isAllowedOrigin(origin)) {
    return new Response('Forbidden', { status: 403 })
  }
  
  // 2. 限流
  const ip = request.headers.get('x-forwarded-for')
  if (!checkRateLimit(ip)) {
    return new Response('Too Many Requests', { status: 429 })
  }
  
  // 3. 验证请求大小
  const { content } = await request.json()
  if (content.length > 5000) {
    return new Response('Payload Too Large', { status: 413 })
  }
  
  // 4. 调用 API（Token 存储在环境变量）
  const response = await fetch(GLM_API_URL, {
    headers: {
      'Authorization': `Bearer ${process.env.GLM_API_KEY}`
    },
    // ...
  })
  
  // 5. 返回结果（不包含 Token）
  return new Response(JSON.stringify(result))
}
```

**安全措施**：
- ✅ Token 存储在服务器环境变量
- ✅ 来源验证（仅允许自己的域名）
- ✅ 请求限流（防止滥用）
- ✅ 内容长度限制
- ✅ 审计日志

#### 3. 多层防护

```
第 1 层：环境变量存储
  ├─ GitHub Secrets (CI)
  ├─ Vercel Environment Variables (生产)
  └─ .env.local (本地开发)

第 2 层：访问控制
  ├─ 域名白名单
  ├─ IP 限流
  └─ 请求验证

第 3 层：日志审计
  ├─ 记录所有请求
  ├─ 监控异常活动
  └─ 自动告警

第 4 层：成本控制
  ├─ 每用户限额
  ├─ 总体预算限制
  └─ 超额自动停用
```

## 📊 成本估算

### GLM-4-flash 定价（参考）

假设：
- 每次提炼消耗 1500 tokens（1000 输入 + 500 输出）
- 价格：约 ¥0.001 / 1000 tokens

**构建时方案**：
- 174 个文档 × ¥0.0015 = ¥0.26 / 次构建
- 每周构建 3 次 = ¥0.78 / 周
- **月成本**：约 ¥3-5

**实时方案**：
- 每个页面访问 1 次 = ¥0.0015
- 1000 次访问 = ¥1.5
- **月成本**：根据访问量，约 ¥10-50

**推荐**：使用构建时方案 + 本地缓存，成本可控。

## 🎯 实施建议

### 阶段 1：基础版（立即可用）

1. 创建 `tools/generate-summaries.mjs`
2. 在 GitHub Actions 中调用
3. 创建前端组件 `AISummaryButton.vue`
4. 部署测试

**时间**：2-3 小时
**成本**：月成本 ¥3-5
**安全**：完全安全（Token 不暴露）

### 阶段 2：增强版（可选）

1. 创建 Vercel Edge Function
2. 添加限流和验证
3. 前端支持实时生成
4. 监控和日志

**时间**：1-2 天
**成本**：月成本 ¥10-50
**安全**：多层防护

### 阶段 3：优化（未来）

1. 智能缓存策略
2. 离线支持
3. 个性化提炼
4. A/B 测试

## 📚 总结

### 问题回答

**Q: 可以在文档右下角增加 AI 内容提炼功能吗？**
✅ **答**：可以！推荐使用构建时预生成方案。

**Q: 会不会暴露 AI Token？**
✅ **答**：不会！Token 仅在服务器端使用，前端只读取生成的结果。

### 推荐方案

**构建时预生成** + **前端展示**

**优点**：
- ✅ 完全安全
- ✅ 访问快速
- ✅ 成本低廉
- ✅ 易于实现

**实施步骤**：
1. 创建摘要生成脚本
2. 在 CI 中调用
3. 创建前端组件
4. 部署上线

**预计时间**：2-3 小时

---

**下一步**：开始实施基础版方案！
