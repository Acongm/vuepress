# 快速开始指南

本指南帮助你快速上手使用 VuePress 知识库系统的 AI 文档管理功能。

## 🎯 5 分钟快速体验

### 1. 查看知识库统计

```bash
npm run kb:stats
```

输出示例：
```json
{
  "totalDocuments": 174,
  "archivableCategories": 15,
  "categories": {
    "react": {
      "archivable": true,
      "documentCount": 6,
      "description": "React 框架、Hooks、状态管理、性能优化等"
    }
  }
}
```

### 2. 搜索文档

```bash
# 按关键词搜索
npm run kb:query search "hooks"

# 智能推荐分类
npm run kb:query suggest "react hooks useState"

# 查询某个分类
npm run kb:query query react --limit 5
```

### 3. 创建测试文档

```bash
cat > /tmp/test-doc.md << 'EOF'
---
title: React Hooks 使用技巧
date: 2026-02-03
ai_generated: true
ai_model: Claude Opus 4.5
tags: [react, hooks]
---

# React Hooks 使用技巧

## useState 优化

使用函数式更新避免闭包问题：

```javascript
setCount(prevCount => prevCount + 1)
```

## useEffect 依赖管理

正确声明依赖数组，避免无限循环：

```javascript
useEffect(() => {
  fetchData(id)
}, [id])
```

## 总结

掌握这些技巧，让你的 React 组件更加高效。
EOF
```

### 4. 验证文档

```bash
npm run kb:validate /tmp/test-doc.md
```

输出示例：
```
=== 文档验证结果 ===
状态: ✓ 通过

ℹ️  信息:
   ✓ frontmatter 存在
   ✓ 包含必需字段: title, date
   ✓ 内容长度合适 (280 字符)
   ✓ AI 生成文档 (Claude Opus 4.5)
```

### 5. 添加到知识库（Dry-run）

```bash
npm run kb:add /tmp/test-doc.md -- --dry-run
```

输出示例：
```
ℹ️  === AI 文档集成工具 ===
✅ 智能推荐分类: react (置信度: 100%)
✅ 文档验证通过
ℹ️  Dry-run 模式，不执行提交
✅ 完成！
```

## 📝 实际使用场景

### 场景 1：AI 对话后整理文档

```bash
# 1. 与 AI 对话，提取知识点后保存
cat > /tmp/vue-composition-api.md << 'EOF'
---
title: Vue 3 Composition API 详解
date: 2026-02-03
ai_generated: true
ai_model: Claude Opus 4.5
tags: [vue, composition-api, vue3]
---

# Vue 3 Composition API 详解

## setup 函数

Composition API 的核心...
EOF

# 2. 一键添加（自动推荐分类、验证、提交）
npm run kb:add /tmp/vue-composition-api.md
```

### 场景 2：手动指定分类

```bash
# 如果自动推荐不准确，可以手动指定
npm run kb:add /tmp/my-doc.md -- --category webpack
```

### 场景 3：完整参数

```bash
npm run kb:add /tmp/performance-guide.md -- \
  --category performance \
  --title "前端性能优化指南" \
  --questions "如何优化首屏加载,webpack打包优化" \
  --model "Claude Opus 4.5"
```

### 场景 4：查找相关文档

```bash
# 添加文档前，先查找是否有相似内容
npm run kb:query search "performance optimization" --content
npm run kb:query similar /performance/web-vitals.md
```

## 🔍 常用查询命令

### 列出所有分类

```bash
npm run kb:query categories
```

### 查看某个分类信息

```bash
npm run kb:query category react
```

### 按标签搜索

```bash
npm run kb:query tags react,hooks --match-all
```

### 全文搜索

```bash
npm run kb:query fulltext "useState" --limit 10
```

## ✅ 文档规范

### Frontmatter 模板

```yaml
---
title: 文档标题（必需）
date: 2026-02-03（必需，格式：YYYY-MM-DD）
ai_generated: true（推荐）
ai_model: Claude Opus 4.5（推荐）
tags: [tag1, tag2]（推荐）
---
```

### 内容要求

- **最小长度**：100 字符（不含 frontmatter）
- **最大长度**：50000 字符
- **标题**：5-100 字符
- **标签**：建议 1-10 个
- **必含元素**：至少一个一级标题 (`#`)

### 命名规范

- 文件名：使用 kebab-case（如：`react-hooks-guide.md`）
- 分类名：大小写敏感（如：`JavaScript`, `react`, `Pattern`）
- 标签：使用小写（如：`react`, `hooks`, `state`）

## 🚀 高级用法

### 批量验证

```bash
# 验证某个分类的所有文档
for file in docs/react/*.md; do
  echo "验证: $file"
  npm run kb:validate "$file" -- --category react
done
```

### 自动化脚本

```bash
#!/bin/bash
# auto-kb-add.sh - 自动化添加文档

DOC_FILE=$1

# 1. 验证
npm run kb:validate "$DOC_FILE" || exit 1

# 2. 推荐分类
CATEGORY=$(npm run kb:query suggest "$(head -50 $DOC_FILE)" | jq -r '.[0].category')
echo "推荐分类: $CATEGORY"

# 3. 添加
npm run kb:add "$DOC_FILE" -- --category "$CATEGORY"
```

### 程序化使用

```javascript
// 在 Node.js 脚本中使用
import { suggestCategory, searchByKeywords } from './lib/kb-query.mjs'
import { validateDocument } from './lib/doc-validator.mjs'

// 推荐分类
const suggestions = suggestCategory('react hooks state management')
console.log(suggestions[0].category) // "react"

// 搜索文档
const docs = searchByKeywords(['react', 'hooks'], {
  includeContent: false,
  limit: 10
})

// 验证文档
const result = validateDocument(content, { category: 'react' })
if (!result.valid) {
  console.error(result.errors)
}
```

## 💡 最佳实践

### 1. 使用 Dry-run 测试

在实际提交前，先用 `--dry-run` 测试：

```bash
npm run kb:add /tmp/new-doc.md -- --dry-run
```

### 2. 验证后再提交

```bash
# 先验证
npm run kb:validate /tmp/new-doc.md

# 再添加
npm run kb:add /tmp/new-doc.md
```

### 3. 利用智能推荐

让系统自动推荐分类，准确率很高：

```bash
# 不指定 --category，系统会自动推荐
npm run kb:add /tmp/new-doc.md
```

### 4. 定期查看统计

```bash
npm run kb:stats
```

## 🔗 相关文档

- [KNOWLEDGE_BASE_GUIDE.md](./KNOWLEDGE_BASE_GUIDE.md) - 完整系统指南
- [lib/README.md](./lib/README.md) - 工具 API 文档
- [tools/README.md](./tools/README.md) - AI 文档工具文档

## ❓ 常见问题

### Q: 如何修改已有文档？

A: 直接编辑 `docs/` 目录下的 Markdown 文件，Git 提交即可。

### Q: 分类推荐不准确怎么办？

A: 使用 `--category` 参数手动指定分类。

### Q: 如何删除文档？

A: 手动删除文件，然后更新 `docs/.vuepress/config.ts` 中的配置。

### Q: 支持哪些分类？

A: 运行 `npm run kb:query categories` 查看所有可用分类。

### Q: 文档验证失败怎么办？

A: 根据错误提示修改文档，确保符合规范（frontmatter、内容长度、标题等）。

---

**下一步**：阅读 [KNOWLEDGE_BASE_GUIDE.md](./KNOWLEDGE_BASE_GUIDE.md) 了解系统完整功能。
