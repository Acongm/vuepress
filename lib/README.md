# 知识库工具库 (Knowledge Base Library)

本目录提供程序化接口，供 AI 和脚本快速访问和管理知识库。

## 环境要求

- Node.js >= 18
- 无外部依赖（仅使用 Node.js 标准库）

## 工具列表

### 1. kb-query.mjs - 知识库查询 API

提供多种查询接口，供 AI 快速检索知识库内容。

**功能：**
- 按分类查询文档
- 按关键词搜索
- 按标签搜索
- 全文搜索
- 智能分类推荐
- 查找相似文档
- 获取统计信息

**使用示例：**

```bash
# 查看帮助
node lib/kb-query.mjs --help

# 获取统计信息
node lib/kb-query.mjs stats

# 列出所有可归档分类
node lib/kb-query.mjs categories

# 查询 React 分类的文档（仅路径）
node lib/kb-query.mjs query react --limit 10

# 查询 React 分类的文档（包含内容）
node lib/kb-query.mjs query react --content --limit 5

# 按关键词搜索
node lib/kb-query.mjs search "react hooks" --content

# 智能分类推荐
node lib/kb-query.mjs suggest "react useState useEffect 组件"

# 查找相似文档
node lib/kb-query.mjs similar /react/react-render.md
```

**程序化使用：**

```javascript
import { 
  getArchivableCategories, 
  searchByKeywords, 
  suggestCategory 
} from './lib/kb-query.mjs'

// 获取所有分类
const categories = getArchivableCategories()

// 搜索文档
const results = searchByKeywords(['react', 'hooks'], { 
  includeContent: true, 
  limit: 10 
})

// 智能分类推荐
const suggestions = suggestCategory('react hooks 状态管理')
console.log(suggestions[0].category) // "react"
```

**API 函数：**

| 函数 | 说明 | 返回值 |
|------|------|--------|
| `getArchivableCategories()` | 获取所有可归档分类 | `{ [name]: { description, keywords, path } }` |
| `getCategory(name)` | 获取指定分类信息 | `Category \| null` |
| `queryByCategory(category, options)` | 按分类查询文档 | `Document[]` |
| `searchByKeywords(keywords, options)` | 按关键词搜索 | `Document[]` |
| `searchByTags(tags, options)` | 按标签搜索 | `Document[]` |
| `searchFullText(query, options)` | 全文搜索 | `Document[]` |
| `getStats()` | 获取统计信息 | `Stats` |
| `suggestCategory(content)` | 智能分类推荐 | `Suggestion[]` |
| `findSimilarDocuments(path, options)` | 查找相似文档 | `Document[]` |

---

### 2. doc-validator.mjs - 文档验证工具

在将文档提交到知识库前，进行质量检查。

**验证项：**
- ✅ Frontmatter 完整性（title, date, tags 等）
- ✅ 标题格式和长度
- ✅ 内容长度（100-50000 字符）
- ✅ 日期格式（YYYY-MM-DD）
- ✅ 标签合理性
- ✅ 重复内容检测（相似度 > 80%）
- ✅ AI 生成标记

**使用示例：**

```bash
# 验证单个文档
node lib/doc-validator.mjs docs/JavaScript/promise.md

# 指定分类（用于重复检测）
node lib/doc-validator.mjs docs/react/hooks.md --category react

# 严格模式（警告也作为错误）
node lib/doc-validator.mjs docs/vue/computed.md --strict

# JSON 输出
node lib/doc-validator.mjs docs/css/flex.md --json

# 跳过重复检测
node lib/doc-validator.mjs docs/git/commit.md --no-duplicates
```

**程序化使用：**

```javascript
import { validateDocument, validateFile } from './lib/doc-validator.mjs'

// 验证文件
const result = validateFile('docs/react/hooks.md', {
  category: 'react',
  checkDuplicates: true
})

if (!result.valid) {
  console.error('验证失败:', result.errors)
}

// 验证文档内容
const content = `---
title: React Hooks 详解
date: 2026-02-03
tags: [react, hooks]
---

# React Hooks 详解

...
`

const result2 = validateDocument(content, {
  category: 'react'
})
```

---

## 集成到工作流

### AI 文档生成工作流

```bash
# 1. AI 对话生成文档
# (用户与 AI 对话，提取知识点)

# 2. AI 推荐分类
node lib/kb-query.mjs suggest "react hooks useState"
# 输出: { category: "react", confidence: 1.0 }

# 3. 验证文档质量
node lib/doc-validator.mjs /tmp/new-doc.md --category react

# 4. 检查重复
# (doc-validator 自动进行)

# 5. 提交到知识库
node tools/ai-doc.mjs full \
  --category react \
  --file /react/react-hooks-guide.md \
  --title "React Hooks 完全指南" \
  --questions "useState如何使用,useEffect依赖数组" \
  --model "Claude Opus 4.5"
```

### 批量文档审核

```bash
# 验证所有 React 文档
for file in docs/react/*.md; do
  echo "验证: $file"
  node lib/doc-validator.mjs "$file" --category react
done
```

---

## 数据源

这些工具依赖以下数据源：

| 文件 | 说明 | 更新方式 |
|------|------|----------|
| `tools/knowledge-map.json` | 知识图谱（分类、关键词） | 手动维护 |
| `.agents/skills/ai-doc/references/docs-index.json` | 文档索引（自动生成） | `generate-doc-index.mjs` |
| `docs/` | 文档内容 | AI 生成或手动编写 |

---

## 性能优化

- **缓存机制**：知识图谱和文档索引在首次加载后缓存
- **并行处理**：多文档验证时可并行执行
- **增量更新**：只重新索引变更的文档

---

## 未来增强

### 短期（已实现）
- ✅ 知识库查询 API
- ✅ 文档验证工具
- ✅ 智能分类推荐
- ✅ 重复内容检测

### 中期（计划中）
- [ ] 向量嵌入支持（语义搜索）
- [ ] REST API 服务（Express/Fastify）
- [ ] 文档关联图谱
- [ ] 自动标签生成

### 长期（探索中）
- [ ] RAG（检索增强生成）集成
- [ ] 知识图谱可视化
- [ ] 多语言支持
- [ ] 版本历史追踪

---

## 贡献

这些工具遵循项目的核心原则：

1. **零依赖**：仅使用 Node.js 标准库
2. **简单可靠**：单文件、无构建步骤
3. **AI 友好**：提供清晰的 CLI 和程序化接口

欢迎提交 PR 改进这些工具！
