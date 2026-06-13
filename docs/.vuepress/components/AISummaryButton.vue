<template>
  <Transition name="fade">
    <div v-if="shouldShow" class="ai-summary-wrapper">
      <!-- 悬浮按钮 -->
      <Transition name="scale">
        <button 
          v-if="!showPanel"
          class="ai-summary-btn"
          @click="togglePanel"
          :title="'AI 内容提炼'"
        >
          <svg class="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span class="btn-text">AI 提炼</span>
        </button>
      </Transition>
      
      <!-- 摘要面板 -->
      <Transition name="slide">
        <div v-if="showPanel" class="summary-panel">
          <div class="panel-header">
            <h3>
              <svg class="header-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              AI 内容提炼
            </h3>
            <button class="close-btn" @click="togglePanel" title="关闭">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="panel-body">
            <!-- 加载中 -->
            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>{{ loadingMessage }}</p>
            </div>
            
            <!-- 增强摘要内容 -->
            <div v-else-if="summaryData" class="summary-content">
              <!-- 标签页导航 -->
              <div v-if="isEnhanced" class="tabs">
                <button 
                  :class="['tab', { active: activeTab === 'summary' }]" 
                  @click="activeTab = 'summary'"
                >
                  📝 摘要
                </button>
                <button 
                  :class="['tab', { active: activeTab === 'details' }]" 
                  @click="activeTab = 'details'"
                >
                  💡 详情
                </button>
              </div>
              
              <!-- 摘要标签页 -->
              <div v-show="activeTab === 'summary'" class="tab-content">
                <div class="summary-text">
                  <svg class="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                  </svg>
                  <p>{{ getSummaryText }}</p>
                </div>
                
                <!-- 元标签 -->
                <div v-if="isEnhanced && (summaryData.difficulty || summaryData.contentType)" class="meta-tags">
                  <span v-if="summaryData.difficulty" class="tag difficulty">
                    {{ getDifficultyIcon }} {{ summaryData.difficulty }}
                  </span>
                  <span v-if="summaryData.contentType" class="tag type">
                    📚 {{ summaryData.contentType }}
                  </span>
                </div>
              </div>
              
              <!-- 详情标签页（仅增强模式） -->
              <div v-if="isEnhanced" v-show="activeTab === 'details'" class="tab-content details-content">
                <!-- 核心要点 -->
                <div v-if="summaryData.keyPoints && summaryData.keyPoints.length > 0" class="section">
                  <h4>💡 核心要点</h4>
                  <ul class="key-points">
                    <li v-for="(point, index) in summaryData.keyPoints" :key="index">
                      <svg class="check-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      {{ point }}
                    </li>
                  </ul>
                </div>
                
                <!-- 关键词 -->
                <div v-if="summaryData.keywords && summaryData.keywords.length > 0" class="section">
                  <h4>🔑 关键词</h4>
                  <div class="keyword-tags">
                    <span v-for="keyword in summaryData.keywords" :key="keyword" class="keyword-tag">
                      {{ keyword }}
                    </span>
                  </div>
                </div>
                
                <!-- 技术栈 -->
                <div v-if="summaryData.techStack && summaryData.techStack.length > 0" class="section">
                  <h4>🛠️ 技术栈</h4>
                  <div class="tech-tags">
                    <span v-for="tech in summaryData.techStack" :key="tech" class="tech-tag">
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="panel-footer">
                <span class="badge">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                  {{ isEnhanced ? 'GLM-4 增强' : 'GLM-4 生成' }}
                </span>
              </div>
            </div>
            
            <!-- 错误状态 -->
            <div v-else-if="error" class="error-state">
              <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>{{ error }}</p>
              <button @click="loadSummary" class="retry-btn">重试</button>
            </div>
            
            <!-- 未启用 -->
            <div v-else-if="!enabled" class="disabled-state">
              <svg class="info-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p>AI 摘要暂时不可用</p>
              <small>请稍后重试，或检查 API 服务配置</small>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
/* global __AI_SUMMARY_API__ */

const DEFAULT_AI_SUMMARY_API = 'https://api.acongm.com/api/ai/summary'
const LIVE_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const STATIC_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getAiSummaryApiUrl() {
  if (typeof __AI_SUMMARY_API__ !== 'undefined' && __AI_SUMMARY_API__) {
    return __AI_SUMMARY_API__
  }
  return DEFAULT_AI_SUMMARY_API
}

export default {
  name: 'AISummaryButton',
  
  data() {
    return {
      showPanel: false,
      loading: false,
      loadingMessage: '加载预生成摘要…',
      summaryData: null,
      error: null,
      enabled: true,
      activeTab: 'summary',
      isEnhanced: false
    }
  },
  
  computed: {
    shouldShow() {
      // 仅在文档页面显示
      return this.$page && this.$page.path && this.$page.path.endsWith('.html')
    },
    
    getSummaryText() {
      if (!this.summaryData) return ''
      // 兼容旧格式（字符串）和新格式（对象）
      return typeof this.summaryData === 'string' 
        ? this.summaryData 
        : this.summaryData.summary || ''
    },
    
    getDifficultyIcon() {
      const icons = {
        '入门': '🟢',
        '进阶': '🟡',
        '高级': '🔴',
        '未分级': '⚪'
      }
      return icons[this.summaryData?.difficulty] || '⚪'
    }
  },
  
  mounted() {
    // 从 sessionStorage 恢复面板状态
    const panelState = sessionStorage.getItem('aiSummaryPanelOpen')
    if (panelState === 'true') {
      this.showPanel = true
      this.loadSummary()
    }
  },
  
  methods: {
    togglePanel() {
      this.showPanel = !this.showPanel
      
      // 保存面板状态
      sessionStorage.setItem('aiSummaryPanelOpen', this.showPanel)
      
      if (this.showPanel && !this.summaryData && !this.loading && !this.error) {
        this.loadSummary()
      }
    },
    
    async loadSummary() {
      this.loading = true
      this.loadingMessage = '加载预生成摘要…'
      this.error = null
      this.summaryData = null
      this.enabled = true
      
      try {
        const pagePath = this.getPagePath()
        
        const cached = this.getCachedSummary(pagePath)
        if (cached) {
          this.summaryData = cached
          this.checkIfEnhanced()
          return
        }
        
        const staticSummary = await this.loadStaticSummary(pagePath)
        if (staticSummary) {
          this.applySummary(pagePath, staticSummary, 'static')
          return
        }
        
        this.loadingMessage = '正在实时分析…'
        const liveSummary = await this.loadLiveSummary(pagePath)
        this.applySummary(pagePath, liveSummary, 'live')
        
      } catch (error) {
        console.error('加载摘要失败:', error)
        this.error = error.message || '加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    extractPageContent() {
      const selectors = ['.theme-default-content', '.page-content', '.page']
      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element && element.innerText) {
          return element.innerText.replace(/\s+/g, ' ').trim().slice(0, 8000)
        }
      }
      return ''
    },
    
    async loadStaticSummary(pagePath) {
      const summariesUrl = this.$withBase('/summaries.json')
      const response = await fetch(summariesUrl)
      if (!response.ok) {
        return null
      }
      
      const data = await response.json()
      this.isEnhanced = Boolean(data._meta?.enhanced)
      return this.findSummaryByPath(data.summaries || {}, pagePath)
    },
    
    async loadLiveSummary(pagePath) {
      const content = this.extractPageContent()
      if (!content || content.length < 50) {
        throw new Error('页面内容太短，无法生成摘要')
      }
      
      const response = await fetch(getAiSummaryApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pagePath,
          title: this.$page.title,
          content
        })
      })
      
      if (!response.ok) {
        let message = '实时摘要请求失败'
        try {
          const errorBody = await response.json()
          if (errorBody?.message) {
            message = Array.isArray(errorBody.message)
              ? errorBody.message.join(', ')
              : errorBody.message
          }
        } catch (e) {
          // ignore parse errors
        }
        throw new Error(message)
      }
      
      return response.json()
    },
    
    applySummary(pagePath, summaryData, source) {
      this.summaryData = summaryData
      this.checkIfEnhanced()
      this.setCachedSummary(pagePath, summaryData, source)
    },
    
    checkIfEnhanced() {
      // 检查数据是否为增强格式
      if (typeof this.summaryData === 'object' && this.summaryData.summary) {
        this.isEnhanced = true
      } else {
        this.isEnhanced = false
      }
    },
    
    getPagePath() {
      // 获取页面路径并转换为 .md 格式
      let path = this.$page.path
      
      // 移除 base 前缀（如果有）
      const base = this.$site.base || '/'
      if (base !== '/' && path.startsWith(base)) {
        path = path.slice(base.length - 1) // 保留开头的 /
      }
      
      // 将 .html 转换为 .md
      if (path.endsWith('.html')) {
        path = path.replace(/\.html$/, '.md')
      }
      
      // 处理 index.html -> README.md 的情况
      if (path.endsWith('/index.md') || path === '/index.md') {
        // 不处理 README，因为 generate-summaries.mjs 跳过了 README.md
      }
      
      return path
    },
    
    findSummaryByPath(summaries, pagePath) {
      // 尝试多种路径变体来匹配摘要
      const variations = [
        pagePath,                                    // 原始路径：/react/react16.md
        pagePath.replace(/\.md$/, '.html'),          // HTML 版本：/react/react16.html
        pagePath.replace(/^\//, ''),                 // 无前导斜杠：react/react16.md
        pagePath.replace(/\.md$/, ''),               // 无扩展名：/react/react16
      ]
      
      // 如果是 index 页面，尝试 README
      if (pagePath.endsWith('/index.md')) {
        const dirPath = pagePath.replace(/\/index\.md$/, '')
        variations.push(dirPath + '/README.md')
      }
      
      console.log('[AI Summary Debug] Trying path variations:', variations)
      
      // 尝试所有变体
      for (const variant of variations) {
        if (summaries[variant]) {
          console.log('[AI Summary Debug] Found match with variant:', variant)
          return summaries[variant]
        }
      }
      
      return null
    },
    
    getCachedSummary(path) {
      const key = `ai-summary:${path}`
      const cached = localStorage.getItem(key)
      
      if (cached) {
        try {
          const data = JSON.parse(cached)
          const ttl = data.source === 'live' ? LIVE_CACHE_TTL_MS : STATIC_CACHE_TTL_MS
          const age = Date.now() - data.timestamp
          if (age < ttl) {
            return data.summary
          }
        } catch (e) {
          // 缓存数据无效
        }
      }
      
      return null
    },
    
    setCachedSummary(path, summary, source = 'static') {
      const key = `ai-summary:${path}`
      const data = {
        summary,
        source,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(data))
    }
  }
}
</script>

<style scoped>
.ai-summary-wrapper {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 999;
}

.ai-summary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 28px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-summary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.ai-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.summary-panel {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 400px;
  max-width: calc(100vw - 48px);
  max-height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
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

.header-icon {
  width: 20px;
  height: 20px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.panel-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-text {
  position: relative;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.quote-icon {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 24px;
  height: 24px;
  opacity: 0.1;
  color: #667eea;
}

.summary-text p {
  margin: 0;
  line-height: 1.8;
  color: #333;
  font-size: 14px;
  padding-left: 12px;
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f0f0f0;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.badge svg {
  width: 14px;
  height: 14px;
}

.error-state, .disabled-state {
  text-align: center;
  padding: 40px 20px;
}

.error-icon, .info-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
}

.error-icon {
  color: #f56c6c;
}

.info-icon {
  color: #909399;
}

.retry-btn {
  padding: 8px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #5568d3;
}

/* 标签页样式 */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

.tab {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
  margin-bottom: -10px;
}

.tab:hover {
  color: #667eea;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: 500;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 元标签 */
.meta-tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.tag.difficulty {
  background: #e8f5e9;
  color: #2e7d32;
}

.tag.type {
  background: #e3f2fd;
  color: #1565c0;
}

/* 详情内容 */
.details-content {
  max-height: 350px;
  overflow-y: auto;
}

.section {
  margin-bottom: 20px;
}

.section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 核心要点 */
.key-points {
  list-style: none;
  padding: 0;
  margin: 0;
}

.key-points li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 关键词和技术栈标签 */
.keyword-tags,
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag,
.tech-tag {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.keyword-tag {
  background: #fff3e0;
  color: #e65100;
  border: 1px solid #ffe0b2;
}

.tech-tag {
  background: #e8eaf6;
  color: #3f51b5;
  border: 1px solid #c5cae9;
}

.keyword-tag:hover,
.tech-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from, .scale-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from, .slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .ai-summary-wrapper {
    bottom: 60px;
    right: 16px;
  }
  
  .summary-panel {
    width: calc(100vw - 32px);
    right: 16px;
    bottom: 16px;
  }
  
  .btn-text {
    display: none;
  }
}
</style>
