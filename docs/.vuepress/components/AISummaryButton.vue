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
              <p>AI 正在分析文档内容...</p>
            </div>
            
            <!-- 摘要内容 -->
            <div v-else-if="summary" class="summary-content">
              <div class="summary-text">
                <svg class="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
                <p>{{ summary }}</p>
              </div>
              
              <div class="panel-footer">
                <span class="badge">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                  GLM-4 生成
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
              <p>AI 摘要功能未启用</p>
              <small>需要配置 GLM_API_KEY 环境变量</small>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'AISummaryButton',
  
  data() {
    return {
      showPanel: false,
      loading: false,
      summary: '',
      error: null,
      enabled: true
    }
  },
  
  computed: {
    shouldShow() {
      // 仅在文档页面显示
      return this.$page && this.$page.path && this.$page.path.endsWith('.html')
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
      
      if (this.showPanel && !this.summary && !this.loading && !this.error) {
        this.loadSummary()
      }
    },
    
    async loadSummary() {
      this.loading = true
      this.error = null
      this.summary = ''
      
      try {
        // 获取当前页面路径
        const pagePath = this.getPagePath()
        
        // 检查 localStorage 缓存
        const cached = this.getCachedSummary(pagePath)
        if (cached) {
          this.summary = cached
          this.loading = false
          return
        }
        
        // 加载预生成的摘要
        const response = await fetch('/summaries.json')
        if (!response.ok) {
          throw new Error('无法加载摘要数据')
        }
        
        const data = await response.json()
        
        // 检查是否启用
        if (!data._meta || !data._meta.enabled) {
          this.enabled = false
          this.loading = false
          return
        }
        
        // 获取摘要
        const summary = data.summaries[pagePath]
        
        if (!summary) {
          throw new Error('当前文档暂无摘要')
        }
        
        this.summary = summary
        
        // 缓存到 localStorage
        this.setCachedSummary(pagePath, summary)
        
      } catch (error) {
        console.error('加载摘要失败:', error)
        this.error = error.message || '加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    getPagePath() {
      // 将 .html 路径转换为 .md 路径
      let path = this.$page.path
      if (path.endsWith('.html')) {
        path = path.replace(/\.html$/, '.md')
      }
      return path
    },
    
    getCachedSummary(path) {
      const key = `ai-summary:${path}`
      const cached = localStorage.getItem(key)
      
      if (cached) {
        try {
          const data = JSON.parse(cached)
          // 检查缓存是否过期（7天）
          const age = Date.now() - data.timestamp
          if (age < 7 * 24 * 60 * 60 * 1000) {
            return data.summary
          }
        } catch (e) {
          // 缓存数据无效
        }
      }
      
      return null
    },
    
    setCachedSummary(path, summary) {
      const key = `ai-summary:${path}`
      const data = {
        summary,
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
