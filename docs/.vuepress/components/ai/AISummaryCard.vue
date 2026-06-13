<template>
  <div class="ai-summary-card">
    <div v-if="loading" class="ai-summary-card__state">
      <div class="ai-summary-card__spinner" />
      <p>{{ loadingMessage }}</p>
    </div>

    <div v-else-if="error" class="ai-summary-card__state">
      <p>{{ error }}</p>
      <button class="ai-summary-card__retry" type="button" @click="loadSummary">
        重试
      </button>
    </div>

    <template v-else-if="summaryData">
      <div class="ai-summary-card__meta">
        <span class="ai-summary-card__badge">{{ sourceLabel }}</span>
      </div>

      <section class="ai-summary-card__section">
        <h4>内容摘要</h4>
        <p>{{ summaryData.summary }}</p>
      </section>

      <section
        v-if="summaryData.keyPoints?.length"
        class="ai-summary-card__section"
      >
        <h4>核心要点</h4>
        <ul>
          <li v-for="point in summaryData.keyPoints" :key="point">
            {{ point }}
          </li>
        </ul>
      </section>

      <section class="ai-summary-card__section">
        <h4>标签</h4>
        <AITagChips
          :keywords="summaryData.keywords"
          :tech-stack="summaryData.techStack"
          :tags="pageTags"
          :difficulty="summaryData.difficulty"
          :content-type="summaryData.contentType"
        />
      </section>
    </template>
  </div>
</template>

<script>
import AITagChips from './AITagChips.vue'
import { extractPageContent } from '../../utils/ai-context.js'
import {
  getCachedSummary,
  getPagePath,
  loadLiveSummary,
  loadStaticSummary,
  setCachedSummary,
  sourceLabel as formatSourceLabel
} from '../../utils/summary-service.js'

export default {
  name: 'AISummaryCard',

  components: {
    AITagChips
  },

  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      loadingMessage: '正在加载提炼内容…',
      error: null,
      summaryData: null,
      summarySource: 'static'
    }
  },

  computed: {
    pageTags() {
      const tags = this.$page?.frontmatter?.tags
      return Array.isArray(tags) ? tags : []
    },

    sourceLabel() {
      return formatSourceLabel(this.summarySource)
    }
  },

  watch: {
    active: {
      immediate: true,
      handler(isActive) {
        if (isActive && !this.summaryData && !this.loading && !this.error) {
          this.loadSummary()
        }
      }
    },

    '$page.path'() {
      this.summaryData = null
      this.error = null
      if (this.active) {
        this.loadSummary()
      }
    }
  },

  methods: {
    async loadSummary() {
      this.loading = true
      this.loadingMessage = '正在加载提炼内容…'
      this.error = null

      try {
        const pagePath = getPagePath(this.$page.path, this.$site.base || '/')

        const cached = getCachedSummary(pagePath)
        if (cached) {
          this.presentSummary(cached.summary, pagePath, cached.source)
          return
        }

        const staticSummary = await loadStaticSummary(this.$withBase, pagePath)
        if (staticSummary) {
          this.presentSummary(staticSummary, pagePath, 'static')
          return
        }

        this.loadingMessage = '正在实时分析页面…'
        const content = extractPageContent()
        if (!content || content.length < 50) {
          throw new Error('页面内容太短，无法生成摘要')
        }

        const liveSummary = await loadLiveSummary({
          pagePath,
          title: this.$page.title,
          content
        })
        this.presentSummary(liveSummary, pagePath, 'live')
      } catch (err) {
        console.error('加载摘要失败:', err)
        this.error = err.message || '加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },

    presentSummary(summaryData, pagePath, source) {
      this.summaryData = summaryData
      this.summarySource = source
      setCachedSummary(pagePath, summaryData, source)
    }
  }
}
</script>

<style scoped>
.ai-summary-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-summary-card__state {
  text-align: center;
  padding: 32px 12px;
  color: #666;
}

.ai-summary-card__spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px;
  border: 3px solid #eef0f5;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: ai-spin 1s linear infinite;
}

.ai-summary-card__retry {
  margin-top: 12px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: #fff;
  cursor: pointer;
}

.ai-summary-card__meta {
  display: flex;
  justify-content: flex-start;
}

.ai-summary-card__badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef1ff;
  color: #4a56a6;
  font-size: 12px;
}

.ai-summary-card__section h4 {
  margin: 0 0 8px;
  font-size: 13px;
  color: #5f6368;
  font-weight: 600;
}

.ai-summary-card__section p,
.ai-summary-card__section li {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #2f3542;
}

.ai-summary-card__section ul {
  margin: 0;
  padding-left: 18px;
}

@keyframes ai-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
