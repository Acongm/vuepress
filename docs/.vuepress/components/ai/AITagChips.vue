<template>
  <div v-if="chips.length" class="ai-tag-chips">
    <span
      v-for="chip in chips"
      :key="chip.key"
      class="ai-tag-chip"
      :class="`ai-tag-chip--${chip.type}`"
    >
      {{ chip.label }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AITagChips',

  props: {
    keywords: {
      type: Array,
      default: () => []
    },
    techStack: {
      type: Array,
      default: () => []
    },
    tags: {
      type: Array,
      default: () => []
    },
    difficulty: {
      type: String,
      default: ''
    },
    contentType: {
      type: String,
      default: ''
    }
  },

  computed: {
    chips() {
      const seen = new Set()
      const result = []

      const pushChip = (label, type) => {
        const normalized = String(label).trim()
        if (!normalized) {
          return
        }
        const key = `${type}:${normalized.toLowerCase()}`
        if (seen.has(key)) {
          return
        }
        seen.add(key)
        result.push({ key, label: normalized, type })
      }

      this.tags.forEach((tag) => pushChip(tag, 'tag'))
      this.keywords.forEach((keyword) => pushChip(keyword, 'keyword'))
      this.techStack.forEach((item) => pushChip(item, 'tech'))

      if (this.difficulty && this.difficulty !== '未分级') {
        pushChip(this.difficulty, 'meta')
      }
      if (this.contentType && this.contentType !== '综合') {
        pushChip(this.contentType, 'meta')
      }

      return result
    }
  }
}
</script>

<style scoped>
.ai-tag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ai-tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1.4;
  background: #eef1ff;
  color: #4a56a6;
}

.ai-tag-chip--tag {
  background: #e8f5e9;
  color: #2e7d32;
}

.ai-tag-chip--keyword {
  background: #eef1ff;
  color: #4a56a6;
}

.ai-tag-chip--tech {
  background: #fff3e0;
  color: #ef6c00;
}

.ai-tag-chip--meta {
  background: #f3f4f6;
  color: #5f6368;
}
</style>
