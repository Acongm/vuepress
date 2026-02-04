# AI 提炼功能增强方案

## 📋 增强目标

基于当前实现，提供三个层次的增强：

### 1. 🌟 更丰富的提炼内容

**当前状态**：2-3 句话，50-80 字的简短摘要

**增强目标**：提供更全面、更有价值的文档提炼

#### 增强内容包括：

##### a) 📝 扩展摘要
- **长度**：从 50-80 字扩展到 150-200 字
- **内容**：不仅概括"是什么"，还说明"为什么重要"和"如何应用"
- **结构**：
  - 核心概念介绍（1-2 句）
  - 关键特性列举（2-3 点）
  - 应用场景说明（1-2 句）

##### b) 🏷️ 智能标签
- **技术栈识别**：自动识别涉及的技术（React、Vue、TypeScript 等）
- **难度评级**：入门/进阶/高级
- **知识类型**：概念/实践/原理/工具

##### c) 🔑 关键词提取
- **核心概念**：3-5 个关键技术词
- **相关技术**：关联的技术栈
- **使用场景**：典型应用场景标签

##### d) 📊 内容分析
- **预计阅读时间**：基于文档长度估算
- **代码示例数量**：文档中包含的代码块数
- **参考资源**：外部链接和参考文献数量

##### e) 💡 核心要点
- **3-5 个要点**：快速了解文档重点
- **结构化展示**：清晰的列表形式

#### 实现示例

**增强前（当前）**：
```json
{
  "summary": "React 16 引入了 Fiber 架构，实现了异步渲染和增量更新。新增 Hooks API 让函数组件拥有状态管理能力，简化了组件逻辑。"
}
```

**增强后**：
```json
{
  "summary": "React 16 是 React 框架的重大版本更新，引入了革命性的 Fiber 架构，从根本上改变了组件的渲染机制。通过时间切片和优先级调度，实现了可中断的异步渲染，显著提升了大型应用的用户体验。新增的 Hooks API 让函数组件拥有了状态管理和生命周期能力，使组件逻辑更加简洁和可复用。这些特性特别适用于需要高性能和复杂状态管理的现代 Web 应用。",
  "keyPoints": [
    "Fiber 架构实现可中断渲染，提升性能",
    "Hooks API 简化函数组件状态管理",
    "异步渲染支持优先级调度",
    "向后兼容，渐进式升级",
    "改善了大型应用的用户体验"
  ],
  "keywords": ["React", "Fiber", "Hooks", "异步渲染", "性能优化"],
  "techStack": ["React", "JavaScript", "前端框架"],
  "difficulty": "进阶",
  "contentType": "原理 + 实践",
  "readingTime": "8 分钟",
  "codeExamples": 5,
  "relatedTopics": ["React Hooks", "虚拟 DOM", "性能优化"]
}
```

### 2. 🔐 支持用户自定义 API Key（安全方案）

**需求背景**：允许用户使用自己的 GLM-4 API Key，获得更个性化的提炼服务

#### 方案设计

##### 架构：混合模式
```
优先级 1：用户自定义 Key（实时生成）
    ↓（如果用户提供了 Key）
通过安全代理调用 GLM-4 API
    ↓
返回个性化的详细摘要

优先级 2：预生成摘要（默认）
    ↓（如果用户未提供 Key）
读取构建时生成的 JSON 文件
    ↓
显示标准摘要
```

#### 安全措施

##### a) API 代理服务
创建服务端代理，确保 Key 安全：

**文件**：`api/ai-summary.js`（Vercel Edge Function 或类似服务）

```javascript
export default async function handler(request) {
  // 1. 验证请求来源
  const origin = request.headers.get('origin')
  if (!origin?.includes('yourdomain.com')) {
    return new Response('Forbidden', { status: 403 })
  }
  
  // 2. 速率限制（每个用户）
  const userKey = request.headers.get('x-user-key-hash')
  if (!checkRateLimit(userKey)) {
    return new Response('Too Many Requests', { status: 429 })
  }
  
  // 3. 验证用户提供的 Key（签名验证）
  const { content, userApiKey, signature } = await request.json()
  if (!verifySignature(userApiKey, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }
  
  // 4. 调用 GLM-4（使用用户的 Key）
  const summary = await generateEnhancedSummary(content, userApiKey)
  
  // 5. 返回结果
  return new Response(JSON.stringify(summary), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**安全特性**：
- ✅ 用户 Key 在前端加密后传输
- ✅ 代理服务器验证签名，防止伪造
- ✅ 速率限制防止滥用
- ✅ Key 不存储在服务器
- ✅ 仅用于本次请求，用后即弃

##### b) 前端 Key 管理

**本地存储**（加密）：
```javascript
// 使用 Web Crypto API 加密存储
async function saveUserApiKey(key) {
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: generateIV() },
    await deriveKey(getDeviceId()),
    new TextEncoder().encode(key)
  )
  localStorage.setItem('user_glm_key', btoa(encrypted))
}

async function getUserApiKey() {
  const encrypted = localStorage.getItem('user_glm_key')
  if (!encrypted) return null
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: getStoredIV() },
    await deriveKey(getDeviceId()),
    atob(encrypted)
  )
  return new TextDecoder().decode(decrypted)
}
```

**设置界面**：
```vue
<template>
  <div class="api-key-settings">
    <h4>🔑 自定义 API Key</h4>
    <p class="description">
      使用您自己的 GLM-4 API Key，获得更详细、更个性化的内容提炼。
      您的 Key 仅存储在本地，通过加密传输到代理服务器使用。
    </p>
    
    <div class="input-group">
      <input 
        type="password" 
        v-model="apiKey" 
        placeholder="输入您的 GLM-4 API Key"
        @blur="validateKey"
      />
      <button @click="saveKey" :disabled="!isValidKey">
        保存
      </button>
    </div>
    
    <div class="info">
      <svg><!-- Info icon --></svg>
      <span>如何获取 API Key？访问 <a href="https://open.bigmodel.cn" target="_blank">智谱 AI 开放平台</a></span>
    </div>
    
    <div v-if="hasUserKey" class="status">
      <svg><!-- Check icon --></svg>
      <span>已配置自定义 API Key</span>
      <button @click="clearKey" class="btn-secondary">清除</button>
    </div>
  </div>
</template>
```

#### 功能特性

##### 1. 双模式切换
- **标准模式**（默认）：使用预生成摘要，快速显示
- **增强模式**（用户 Key）：实时生成详细摘要

##### 2. 渐进增强
- 未配置 Key：显示基础摘要
- 已配置 Key：显示增强摘要 + 额外信息

##### 3. 用户体验
```
首次访问 → 显示标准摘要 → 提示"配置 API Key 获取更多信息"
    ↓
用户配置 Key → 验证 Key 有效性 → 加密存储
    ↓
再次访问 → 自动使用增强模式 → 显示详细摘要
```

### 3. 🎨 UI 增强

#### 增强的摘要面板

##### 布局改进
```vue
<template>
  <div class="enhanced-summary-panel">
    <!-- 顶部标签栏 -->
    <div class="tabs">
      <button :class="{active: tab === 'summary'}" @click="tab = 'summary'">
        📝 摘要
      </button>
      <button :class="{active: tab === 'keypoints'}" @click="tab = 'keypoints'">
        💡 要点
      </button>
      <button :class="{active: tab === 'analysis'}" @click="tab = 'analysis'">
        📊 分析
      </button>
    </div>
    
    <!-- 摘要标签 -->
    <div v-show="tab === 'summary'" class="tab-content">
      <div class="summary-text">{{ summary }}</div>
      
      <div class="meta-tags">
        <span class="tag difficulty">{{ difficulty }}</span>
        <span class="tag reading-time">⏱ {{ readingTime }}</span>
        <span class="tag type">{{ contentType }}</span>
      </div>
    </div>
    
    <!-- 核心要点标签 -->
    <div v-show="tab === 'keypoints'" class="tab-content">
      <ul class="key-points">
        <li v-for="point in keyPoints" :key="point">
          <svg><!-- Check icon --></svg>
          {{ point }}
        </li>
      </ul>
      
      <div class="keywords">
        <h5>🔑 关键词</h5>
        <div class="keyword-tags">
          <span v-for="kw in keywords" :key="kw" class="keyword">
            {{ kw }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 内容分析标签 -->
    <div v-show="tab === 'analysis'" class="tab-content">
      <div class="analysis-grid">
        <div class="analysis-item">
          <div class="label">技术栈</div>
          <div class="value">{{ techStack.join(', ') }}</div>
        </div>
        <div class="analysis-item">
          <div class="label">代码示例</div>
          <div class="value">{{ codeExamples }} 个</div>
        </div>
        <div class="analysis-item">
          <div class="label">相关主题</div>
          <div class="value">
            <span v-for="topic in relatedTopics" :key="topic" class="topic-tag">
              {{ topic }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部工具栏 -->
    <div class="panel-footer">
      <div class="mode-indicator">
        <svg v-if="isEnhancedMode"><!-- Star icon --></svg>
        <span>{{ isEnhancedMode ? '增强模式' : '标准模式' }}</span>
      </div>
      
      <button v-if="!hasUserKey" @click="showSettings" class="btn-upgrade">
        🔑 配置 Key 获取更多
      </button>
      
      <button v-else @click="regenerate" class="btn-regenerate">
        🔄 重新生成
      </button>
    </div>
  </div>
</template>
```

## 🚀 实施步骤

### 阶段 1：增强摘要内容（核心功能）

#### 步骤 1.1：升级摘要生成脚本
修改 `tools/generate-summaries.mjs`：

```javascript
async function generateEnhancedSummary(content, apiKey) {
  const systemPrompt = `你是一个技术文档分析专家。请对技术文档进行全面的内容提炼。

输出格式（JSON）：
{
  "summary": "详细摘要（150-200字）",
  "keyPoints": ["要点1", "要点2", "要点3", "要点4", "要点5"],
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "techStack": ["技术1", "技术2"],
  "difficulty": "入门|进阶|高级",
  "contentType": "概念|实践|原理|工具",
  "relatedTopics": ["相关主题1", "相关主题2"]
}`

  const userPrompt = `请分析以下技术文档并提炼关键信息：

${content}

请以 JSON 格式返回分析结果。`

  // 调用 GLM-4 生成增强摘要
  const result = await chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { apiKey, temperature: 0.3, maxTokens: 800 })
  
  return JSON.parse(result.content)
}
```

#### 步骤 1.2：更新数据格式
修改输出的 `summaries.json` 结构：

```json
{
  "_meta": {
    "version": "2.0",
    "generatedAt": "2026-02-04T12:00:00.000Z",
    "totalFiles": 174,
    "model": "glm-4-flash",
    "enhanced": true
  },
  "summaries": {
    "/react/react16.md": {
      "summary": "详细摘要内容...",
      "keyPoints": [...],
      "keywords": [...],
      "techStack": [...],
      "difficulty": "进阶",
      "contentType": "原理 + 实践",
      "readingTime": "8 分钟",
      "codeExamples": 5,
      "relatedTopics": [...]
    }
  }
}
```

### 阶段 2：支持用户自定义 Key（可选功能）

#### 步骤 2.1：创建 API 代理
创建 `api/ai-summary.js`（Vercel Edge Function）

#### 步骤 2.2：前端添加设置界面
修改 `AISummaryButton.vue`，添加设置面板

#### 步骤 2.3：实现双模式切换
- 检测用户是否配置 Key
- 优先使用增强模式（如果有 Key）
- Fallback 到标准模式

### 阶段 3：UI 优化

#### 步骤 3.1：更新面板组件
实现标签页切换、展示增强内容

#### 步骤 3.2：视觉优化
- 更丰富的排版
- 更清晰的信息层级
- 更友好的交互反馈

## 📊 成本估算

### 构建时成本（阶段 1）

**增强摘要生成**：
- 每个文档消耗 tokens：约 1500（输入）+ 800（输出）= 2300
- 174 个文档 × 2300 tokens = 400,200 tokens
- 成本：约 ¥0.4 / 次构建
- 月成本（构建 12 次）：约 ¥5

### 运行时成本（阶段 2，用户自定义 Key）

**实时生成**（使用用户自己的 Key）：
- 用户自付费，不增加您的成本
- 仅需要维护代理服务器（Vercel Free Plan 可用）

## ✅ 预期效果

### 增强前 vs 增强后

| 特性 | 当前版本 | 增强版本 |
|------|---------|----------|
| 摘要长度 | 50-80 字 | 150-200 字 |
| 信息维度 | 1 维（摘要） | 6+ 维（摘要+要点+关键词+...） |
| 用户选择 | 无 | 标准/增强 双模式 |
| 个性化 | 无 | 支持自定义 API Key |
| UI 交互 | 单页显示 | 多标签页组织 |
| 成本/月 | ¥3 | ¥5（构建时）+ ¥0（用户自付） |

### 用户收益

1. **更快速理解**：通过要点和关键词快速抓住重点
2. **更精准筛选**：通过难度和类型标签找到合适内容
3. **更深入学习**：通过相关主题扩展学习路径
4. **更灵活使用**：可选择使用自己的 API Key 获得个性化服务

## 🎯 推荐实施方案

### 最小可行产品（MVP）

**阶段 1 优先**：增强摘要内容
- ✅ 成本低，月增加仅 ¥2
- ✅ 所有用户受益
- ✅ 实施简单，风险低
- ✅ 立即提升价值

**阶段 2 可选**：用户自定义 Key
- ⚠️ 需要额外服务器部署
- ⚠️ 需要更复杂的安全机制
- ✅ 仅高级用户需要
- ✅ 用户自付费，不增加成本

**建议**：
1. 先实施阶段 1，验证效果
2. 收集用户反馈
3. 根据需求决定是否实施阶段 2

---

**准备好开始实施了吗？我们从阶段 1 开始！** 🚀
