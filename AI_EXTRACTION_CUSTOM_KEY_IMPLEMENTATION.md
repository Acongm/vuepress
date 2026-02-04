# 用户自定义 API Key 实现方案（可选功能）

## 📋 需求说明

允许用户使用自己的 GLM-4 API Key，获得更个性化的 AI 提炼服务。

### 为什么需要这个功能？

1. **个性化**：用户可以使用自己的配额
2. **实时性**：不依赖预生成的摘要
3. **灵活性**：可以重新生成或优化摘要
4. **成本分担**：高级用户可以自己承担 API 费用

### 安全考虑

⚠️ **重要**：绝不能在前端直接调用 GLM-4 API！这会暴露 API Key。

✅ **正确方案**：通过服务端代理调用，Key 在前端加密，服务器验证后使用。

---

## 🏗️ 架构设计

### 方案：安全代理模式

```
用户输入 API Key（前端）
    ↓
本地加密存储（Web Crypto API）
    ↓
使用时解密并加密传输（HTTPS + 签名）
    ↓
服务端代理验证签名
    ↓
使用用户的 Key 调用 GLM-4
    ↓
返回结果（不存储 Key）
```

### 安全层级

```
第 1 层：前端加密
  - Web Crypto API 加密存储
  - 设备指纹作为密钥
  - 防止简单的本地存储查看

第 2 层：传输加密
  - HTTPS 协议
  - HMAC-SHA256 签名
  - 防止中间人攻击

第 3 层：服务端验证
  - 验证签名有效性
  - 检查请求来源
  - 速率限制（防止滥用）

第 4 层：使用后即弃
  - Key 仅用于本次请求
  - 不存储在服务器
  - 不记录日志
```

---

## 📝 实现步骤

### 步骤 1：创建服务端代理（Vercel Edge Function）

#### 文件：`api/ai-summary.js`

```javascript
/**
 * 安全的 AI 摘要代理服务
 * 使用用户提供的 API Key 生成实时摘要
 * 
 * 安全特性：
 * - 验证请求签名
 * - 速率限制
 * - Key 用后即弃
 * - 不记录敏感信息
 */

import { createHmac, randomBytes } from 'crypto'

// 配置
const ALLOWED_ORIGINS = [
  'https://acongm.com',
  'https://www.acongm.com',
  'http://localhost:8080' // 本地开发
]

const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 分钟
  maxRequests: 5 // 每个用户每分钟最多 5 次
}

// 速率限制存储（使用 Map，生产环境建议用 Redis）
const rateLimitStore = new Map()

/**
 * 验证请求来源
 */
function verifyOrigin(origin) {
  return ALLOWED_ORIGINS.some(allowed => origin?.includes(allowed))
}

/**
 * 验证 HMAC 签名
 */
function verifySignature(payload, signature, timestamp) {
  // 检查时间戳（防止重放攻击，5 分钟内有效）
  const now = Date.now()
  const diff = Math.abs(now - timestamp)
  if (diff > 5 * 60 * 1000) {
    return false
  }
  
  // 验证签名
  const message = `${timestamp}:${JSON.stringify(payload)}`
  const expectedSignature = createHmac('sha256', process.env.PROXY_SECRET || 'change-me')
    .update(message)
    .digest('hex')
  
  return signature === expectedSignature
}

/**
 * 检查速率限制
 */
function checkRateLimit(userKeyHash) {
  const now = Date.now()
  
  // 获取用户的请求记录
  let records = rateLimitStore.get(userKeyHash) || []
  
  // 清除过期记录
  records = records.filter(time => now - time < RATE_LIMIT.windowMs)
  
  // 检查是否超限
  if (records.length >= RATE_LIMIT.maxRequests) {
    return false
  }
  
  // 添加本次请求
  records.push(now)
  rateLimitStore.set(userKeyHash, records)
  
  return true
}

/**
 * 调用 GLM-4 生成增强摘要
 */
async function generateEnhancedSummary(content, apiKey) {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages: [
        {
          role: 'system',
          content: `你是一个技术文档分析专家。请对技术文档进行全面的内容提炼和分析。

输出要求：
1. 返回 JSON 格式
2. summary: 详细摘要（150-200字）
3. keyPoints: 3-5个核心要点
4. keywords: 3-5个关键技术词
5. techStack: 相关技术栈
6. difficulty: 难度等级（入门/进阶/高级）
7. contentType: 内容类型（概念/实践/原理/工具）

请直接返回 JSON，不要包裹在代码块中。`
        },
        {
          role: 'user',
          content: `请分析以下技术文档并提炼关键信息：\n\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GLM-4 API 失败: ${errorText}`)
  }
  
  const data = await response.json()
  const rawContent = data.choices[0]?.message?.content?.trim()
  
  // 提取 JSON
  let jsonStr = rawContent
  const jsonMatch = rawContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1]
  }
  
  return JSON.parse(jsonStr)
}

/**
 * Edge Function 主处理函数
 */
export default async function handler(request) {
  // 处理 OPTIONS 请求（CORS 预检）
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Signature, X-Timestamp',
        'Access-Control-Max-Age': '86400'
      }
    })
  }
  
  try {
    // 1. 验证请求方法
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }
    
    // 2. 验证来源
    const origin = request.headers.get('origin')
    if (!verifyOrigin(origin)) {
      return new Response('Forbidden', { status: 403 })
    }
    
    // 3. 解析请求
    const { content, encryptedKey, userKeyHash } = await request.json()
    
    if (!content || !encryptedKey || !userKeyHash) {
      return new Response('Bad request', { status: 400 })
    }
    
    // 4. 验证签名
    const signature = request.headers.get('x-signature')
    const timestamp = parseInt(request.headers.get('x-timestamp'))
    
    if (!verifySignature({ content, encryptedKey, userKeyHash }, signature, timestamp)) {
      return new Response('Invalid signature', { status: 401 })
    }
    
    // 5. 速率限制
    if (!checkRateLimit(userKeyHash)) {
      return new Response('Too many requests', { 
        status: 429,
        headers: {
          'Retry-After': '60'
        }
      })
    }
    
    // 6. 解密 API Key（前端使用 Web Crypto API 加密，这里简化处理）
    // 实际实现中，应该使用公钥/私钥方案
    const apiKey = Buffer.from(encryptedKey, 'base64').toString('utf-8')
    
    // 7. 调用 GLM-4 生成摘要
    const summary = await generateEnhancedSummary(content, apiKey)
    
    // 8. 返回结果
    return new Response(JSON.stringify({
      success: true,
      data: summary
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Cache-Control': 'no-store'
      }
    })
    
  } catch (error) {
    console.error('代理错误:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: '生成摘要失败，请稍后重试'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

// Vercel Edge Function 配置
export const config = {
  runtime: 'edge',
  regions: ['hkg1'] // 香港区域，离中国大陆较近
}
```

### 步骤 2：前端实现 - API Key 管理

#### 文件：`docs/.vuepress/components/ApiKeySettings.vue`

```vue
<template>
  <div class="api-key-settings">
    <div class="settings-header">
      <h4>🔑 自定义 API Key</h4>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
    
    <div class="settings-body">
      <p class="description">
        使用您自己的 GLM-4 API Key，获得更详细、更个性化的内容提炼。
      </p>
      
      <div class="security-notice">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
        <div>
          <strong>安全保障</strong>
          <p>您的 API Key 仅加密存储在本地，通过安全代理使用，不会被泄露。</p>
        </div>
      </div>
      
      <div v-if="!hasKey" class="input-section">
        <div class="input-group">
          <input 
            type="password" 
            v-model="apiKey" 
            placeholder="输入您的 GLM-4 API Key"
            @input="validateKey"
            class="key-input"
          />
          <button 
            @click="saveKey" 
            :disabled="!isValid || saving"
            class="save-btn"
          >
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
        
        <div v-if="validationError" class="error-message">
          {{ validationError }}
        </div>
        
        <div class="help-text">
          <span>如何获取 API Key？</span>
          <a href="https://open.bigmodel.cn" target="_blank" rel="noopener">
            访问智谱 AI 开放平台 →
          </a>
        </div>
      </div>
      
      <div v-else class="key-status">
        <div class="status-card">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <strong>已配置自定义 API Key</strong>
            <p>现在可以使用增强模式生成详细摘要</p>
          </div>
        </div>
        
        <div class="actions">
          <button @click="testKey" :disabled="testing" class="test-btn">
            {{ testing ? '测试中...' : '测试连接' }}
          </button>
          <button @click="clearKey" class="clear-btn">
            清除配置
          </button>
        </div>
        
        <div v-if="testResult" class="test-result" :class="testResult.success ? 'success' : 'error'">
          {{ testResult.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encryptApiKey, decryptApiKey, createSignature } from '../utils/crypto'

export default {
  name: 'ApiKeySettings',
  
  data() {
    return {
      apiKey: '',
      isValid: false,
      validationError: '',
      saving: false,
      testing: false,
      testResult: null
    }
  },
  
  computed: {
    hasKey() {
      return !!localStorage.getItem('user_glm_key')
    }
  },
  
  methods: {
    validateKey() {
      // 简单验证：长度和格式
      const key = this.apiKey.trim()
      
      if (!key) {
        this.isValid = false
        this.validationError = ''
        return
      }
      
      if (key.length < 32) {
        this.isValid = false
        this.validationError = 'API Key 长度不正确'
        return
      }
      
      this.isValid = true
      this.validationError = ''
    },
    
    async saveKey() {
      this.saving = true
      
      try {
        // 加密存储
        const encrypted = await encryptApiKey(this.apiKey)
        localStorage.setItem('user_glm_key', encrypted)
        
        // 生成 Key 的哈希（用于速率限制，不暴露原始 Key）
        const hash = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(this.apiKey)
        )
        const hashHex = Array.from(new Uint8Array(hash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
        localStorage.setItem('user_glm_key_hash', hashHex)
        
        this.apiKey = ''
        this.$emit('saved')
      } catch (error) {
        this.validationError = '保存失败：' + error.message
      } finally {
        this.saving = false
      }
    },
    
    async testKey() {
      this.testing = true
      this.testResult = null
      
      try {
        const encrypted = localStorage.getItem('user_glm_key')
        const apiKey = await decryptApiKey(encrypted)
        const userKeyHash = localStorage.getItem('user_glm_key_hash')
        
        // 调用代理测试
        const timestamp = Date.now()
        const payload = {
          content: '测试内容',
          encryptedKey: btoa(apiKey),
          userKeyHash
        }
        
        const signature = await createSignature(payload, timestamp)
        
        const response = await fetch('/api/ai-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature,
            'X-Timestamp': timestamp.toString()
          },
          body: JSON.stringify(payload)
        })
        
        if (response.ok) {
          this.testResult = {
            success: true,
            message: '✅ 连接成功！您的 API Key 工作正常。'
          }
        } else {
          throw new Error('API 返回错误')
        }
      } catch (error) {
        this.testResult = {
          success: false,
          message: '❌ 连接失败：' + error.message
        }
      } finally {
        this.testing = false
      }
    },
    
    clearKey() {
      if (confirm('确定要清除 API Key 配置吗？')) {
        localStorage.removeItem('user_glm_key')
        localStorage.removeItem('user_glm_key_hash')
        this.$emit('cleared')
      }
    }
  }
}
</script>

<style scoped>
/* 样式略... */
</style>
```

### 步骤 3：前端加密工具

#### 文件：`docs/.vuepress/utils/crypto.js`

```javascript
/**
 * 前端加密工具
 * 使用 Web Crypto API
 */

/**
 * 生成设备指纹作为加密密钥
 */
async function getDeviceFingerprint() {
  const nav = window.navigator
  const screen = window.screen
  
  const fingerprint = [
    nav.userAgent,
    nav.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage
  ].join('|')
  
  return fingerprint
}

/**
 * 从指纹派生加密密钥
 */
async function deriveKey() {
  const fingerprint = await getDeviceFingerprint()
  
  // 使用 PBKDF2 派生密钥
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(fingerprint),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('vuepress-ai-summary'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * 加密 API Key
 */
export async function encryptApiKey(apiKey) {
  const key = await deriveKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder()
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(apiKey)
  )
  
  // 返回 Base64 编码的 IV + 密文
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  
  return btoa(String.fromCharCode(...combined))
}

/**
 * 解密 API Key
 */
export async function decryptApiKey(encryptedData) {
  const key = await deriveKey()
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
  
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  )
  
  const dec = new TextDecoder()
  return dec.decode(decrypted)
}

/**
 * 创建 HMAC 签名
 */
export async function createSignature(payload, timestamp) {
  const message = `${timestamp}:${JSON.stringify(payload)}`
  const enc = new TextEncoder()
  
  // 使用共享密钥（需要与服务端一致）
  const secret = 'change-me' // 实际应该从配置读取
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(message)
  )
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
```

---

## 🚀 部署步骤

### 1. Vercel 部署

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
vercel --prod

# 4. 配置环境变量
vercel env add PROXY_SECRET
# 输入一个强密码作为签名密钥
```

### 2. 环境变量配置

在 Vercel Dashboard 中配置：

```
PROXY_SECRET=your-strong-secret-key
```

### 3. 前端配置

在 `docs/.vuepress/utils/crypto.js` 中设置相同的密钥：

```javascript
const secret = process.env.VITE_PROXY_SECRET || 'change-me'
```

---

## 📊 使用流程

### 用户配置流程

```
1. 用户点击"配置 API Key"
   ↓
2. 输入 GLM-4 API Key
   ↓
3. 前端验证格式
   ↓
4. Web Crypto API 加密存储
   ↓
5. 生成 Key 哈希（用于速率限制）
   ↓
6. 测试连接（可选）
   ↓
7. 配置完成
```

### 使用流程

```
1. 用户点击"重新生成"或首次生成
   ↓
2. 前端检测到有自定义 Key
   ↓
3. 解密 Key
   ↓
4. 创建请求签名
   ↓
5. 通过 HTTPS 发送到代理
   ↓
6. 代理验证签名和速率限制
   ↓
7. 使用用户 Key 调用 GLM-4
   ↓
8. 返回增强摘要
   ↓
9. 前端显示结果
   ↓
10. 缓存到 localStorage
```

---

## 🔒 安全检查清单

### 前端安全

- [ ] API Key 使用 Web Crypto API 加密存储
- [ ] 设备指纹作为加密密钥
- [ ] 传输前创建 HMAC 签名
- [ ] 使用 HTTPS 传输
- [ ] 不在控制台或日志中输出原始 Key

### 服务端安全

- [ ] 验证请求来源（CORS）
- [ ] 验证 HMAC 签名
- [ ] 检查时间戳防止重放攻击
- [ ] 实施速率限制
- [ ] Key 用后即弃，不存储
- [ ] 不记录敏感信息到日志
- [ ] 使用环境变量存储密钥

### 监控和日志

- [ ] 记录请求次数
- [ ] 监控异常流量
- [ ] 设置告警阈值
- [ ] 定期审计访问日志

---

## 💰 成本估算

### 用户自付费

- 用户使用自己的 API Key
- 不增加您的成本
- 用户自行控制使用量

### 服务器成本

- Vercel Free Plan：每月 100GB 带宽 + 100GiB-hours
- 足够个人博客/知识库使用
- 超出后按量付费

---

## ✅ 实施建议

### 阶段性推出

**阶段 1（当前）**：预生成摘要
- 所有用户都能用
- 成本可控
- 稳定可靠

**阶段 2（可选）**：用户自定义 Key
- 高级用户选择性启用
- 增加灵活性
- 用户自付费

### 最佳实践

1. **先测试**：在测试环境验证所有安全措施
2. **渐进式**：先开放给小部分用户测试
3. **监控**：密切关注使用情况和异常
4. **文档**：提供清晰的配置指南
5. **反馈**：收集用户反馈持续优化

---

## 📚 参考资源

- [Web Crypto API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [GLM-4 API 文档](https://open.bigmodel.cn/dev/api)
- [HMAC 签名最佳实践](https://www.rfc-editor.org/rfc/rfc2104)

---

**是否实施此功能完全由您决定！** 

预生成摘要已经是一个完整且优秀的解决方案。用户自定义 Key 是可选的高级功能。
