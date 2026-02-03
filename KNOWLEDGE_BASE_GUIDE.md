# VuePress 知识库系统 - 项目分析与功能说明

## 📋 项目概览

这是一个基于 VuePress 2 的个人前端知识库系统，已经具备完整的 AI 辅助文档管理功能。本系统支持：

- ✅ **前端搜索**：VuePress 内置搜索插件
- ✅ **AI 快速检索**：程序化查询 API
- ✅ **AI 文档生成**：自动化文档整理工作流
- ✅ **动态菜单管理**：自动更新导航和侧边栏

## 🎯 核心功能

### 1. 前端搜索功能 ✅

**已实现：**
- VuePress 官方搜索插件 `@vuepress/plugin-search`
- 支持全站文档搜索
- 中文搜索界面

**配置位置：**
`docs/.vuepress/config.ts` (line 492-498)

```javascript
[
  '@vuepress/plugin-search',
  {
    locales: {
      '/': {
        placeholder: '搜索'
      }
    }
  }
]
```

### 2. AI 快速检索 ✅✅✅

**新增功能：** `lib/kb-query.mjs`

提供 9 种强大的查询接口：

| API | 功能 | 示例 |
|-----|------|------|
| `categories` | 列出所有可归档分类 | `node lib/kb-query.mjs categories` |
| `query` | 按分类查询文档 | `node lib/kb-query.mjs query react --limit 10` |
| `search` | 按关键词搜索 | `node lib/kb-query.mjs search "hooks state"` |
| `tags` | 按标签搜索 | `node lib/kb-query.mjs tags react,hooks` |
| `fulltext` | 全文搜索 | `node lib/kb-query.mjs fulltext "useState"` |
| `stats` | 获取统计信息 | `node lib/kb-query.mjs stats` |
| `suggest` | 智能分类推荐 | `node lib/kb-query.mjs suggest "react hooks"` |
| `similar` | 查找相似文档 | `node lib/kb-query.mjs similar /react/hooks.md` |

**使用示例：**

```bash
# 智能推荐分类
$ node lib/kb-query.mjs suggest "react hooks useState"
[
  {
    "category": "react",
    "score": 60,
    "confidence": 1,
    "description": "React 框架、Hooks、状态管理、性能优化等"
  }
]

# 按关键词搜索（包含内容）
$ node lib/kb-query.mjs search "hooks" --content --limit 5

# 获取知识库统计
$ node lib/kb-query.mjs stats
{
  "totalDocuments": 174,
  "archivableCategories": 15,
  "categories": { ... }
}
```

**程序化使用：**

```javascript
import { suggestCategory, searchByKeywords } from './lib/kb-query.mjs'

// AI 智能推荐分类
const suggestions = suggestCategory('react hooks 状态管理')
console.log(suggestions[0].category) // "react"

// 搜索相关文档
const docs = searchByKeywords(['hooks', 'state'], {
  includeContent: true,
  limit: 10
})
```

### 3. AI 文档生成与整理 ✅✅

**现有工具：** `tools/ai-doc.mjs`

完整的 AI 文档整理工作流：

```bash
# 完整工作流（一键完成）
node tools/ai-doc.mjs full \
  --category react \
  --file /react/hooks-best-practices.md \
  --title "React Hooks 最佳实践" \
  --questions "useState如何优化,useEffect依赖管理" \
  --model "Claude Opus 4.5"
```

**工作流程：**

1. **创建文档** → `docs/react/hooks-best-practices.md`
2. **更新配置** → 自动修改 `config.ts` (navbar + sidebar)
3. **记录日志** → 追加到 `AI_CHANGELOG.md`
4. **Git 提交** → 自动 add + commit + push

**新增功能：** `lib/doc-validator.mjs`

在提交前验证文档质量：

```bash
# 验证文档
$ node lib/doc-validator.mjs docs/react/hooks.md --category react

=== 文档验证结果 ===
状态: ✓ 通过

ℹ️  信息:
   ✓ frontmatter 存在
   ✓ 包含必需字段: title, date
   ✓ 标题长度合适
   ✓ 内容长度合适 (1166 字符)
   ✓ 未发现重复内容
```

**验证项：**
- ✅ Frontmatter 完整性
- ✅ 标题/日期格式
- ✅ 内容长度（100-50000字符）
- ✅ 标签合理性
- ✅ 重复内容检测（>80%相似度）
- ✅ AI 生成标记

### 4. 动态菜单管理 ✅

**已实现：** `tools/ai-doc.mjs` 自动更新功能

每次添加文档时，自动更新：

- **Navbar**：顶部导航菜单
- **Sidebar**：侧边栏菜单

**配置文件：** `docs/.vuepress/config.ts`

**知识图谱：** `tools/knowledge-map.json`
- 定义 18 个分类（15 个可归档）
- 每个分类包含关键词、描述、路径
- AI 根据关键词自动匹配分类

## 🔧 完整 AI 文档工作流

### 推荐流程

```bash
# 1. AI 对话生成文档（保存到临时文件）
cat > /tmp/new-doc.md << 'EOF'
---
title: React Hooks 最佳实践
date: 2026-02-03
ai_generated: true
ai_model: Claude Opus 4.5
tags: [react, hooks]
---

# React Hooks 最佳实践
...
EOF

# 2. 智能推荐分类
node lib/kb-query.mjs suggest "react hooks useState useEffect"
# 输出: react (confidence: 1.0)

# 3. 验证文档质量
node lib/doc-validator.mjs /tmp/new-doc.md --category react
# 检查：frontmatter、内容长度、重复检测

# 4. 提交到知识库（一键完成）
node tools/ai-doc.mjs full \
  --category react \
  --file /react/hooks-best-practices.md \
  --title "React Hooks 最佳实践" \
  --questions "useState优化,useEffect依赖" \
  --model "Claude Opus 4.5"

# 5. 验证搜索功能
node lib/kb-query.mjs search "hooks" --limit 5
```

### 自动化脚本示例

```bash
#!/bin/bash
# ai-doc-workflow.sh - 完整的 AI 文档工作流

DOC_FILE=$1
CATEGORY=$2
TITLE=$3

# 1. 验证文档
echo "📝 验证文档..."
node lib/doc-validator.mjs "$DOC_FILE" --category "$CATEGORY"

if [ $? -ne 0 ]; then
  echo "❌ 文档验证失败"
  exit 1
fi

# 2. 推荐分类（如果未指定）
if [ -z "$CATEGORY" ]; then
  echo "🤖 推荐分类..."
  CATEGORY=$(node lib/kb-query.mjs suggest "$TITLE" | jq -r '.[0].category')
  echo "推荐分类: $CATEGORY"
fi

# 3. 提交到知识库
echo "📚 提交到知识库..."
node tools/ai-doc.mjs full \
  --category "$CATEGORY" \
  --file "/$CATEGORY/$(basename $DOC_FILE)" \
  --title "$TITLE" \
  --model "Claude Opus 4.5"

echo "✅ 完成！"
```

## 📊 知识库统计

当前状态（2026-01-31）：

- **总文档数**：174 篇
- **可归档分类**：15 个
- **主要分类**：
  - JavaScript (6)
  - React (6)
  - Vue (9)
  - Webpack (12)
  - Pattern (26)
  - 其他...

## 🚀 快速开始

### 开发环境

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 部署到 GitHub Pages
npm run deploy:build
```

### AI 文档管理

```bash
# 查看可用分类
node tools/ai-doc.mjs categories

# 查询知识库
node lib/kb-query.mjs stats
node lib/kb-query.mjs search "你想搜索的内容"

# 验证文档
node lib/doc-validator.mjs docs/path/to/file.md

# 添加文档
node tools/ai-doc.mjs full \
  --category <分类> \
  --file /<分类>/<文件名>.md \
  --title "<标题>" \
  --questions "<问题>" \
  --model "<AI模型>"
```

## 📚 工具文档

详细文档请参考：

- **知识库查询 API**：`lib/README.md`
- **AI 文档工具**：`tools/README.md`
- **知识图谱**：`tools/knowledge-map.json`

## 🎨 架构设计

```
vuepress/
├── docs/                    # VuePress 文档源文件
│   ├── .vuepress/
│   │   └── config.ts        # 导航和侧边栏配置（自动更新）
│   ├── JavaScript/          # JavaScript 分类
│   ├── react/               # React 分类
│   ├── vue/                 # Vue 分类
│   └── ...                  # 其他分类
│
├── lib/                     # 新增：知识库工具库
│   ├── kb-query.mjs         # 查询 API
│   ├── doc-validator.mjs    # 文档验证器
│   └── README.md            # 工具文档
│
├── tools/                   # 辅助脚本
│   ├── ai-doc.mjs           # AI 文档整理（主入口）
│   ├── knowledge-map.json   # 知识图谱
│   └── ...
│
├── .agents/                 # AI Agent 配置
│   └── skills/
│       └── ai-doc/
│           ├── scripts/     # AI 文档脚本
│           └── references/  # 文档索引和配置
│
└── interview-prep/          # 面试准备（专门管理）
```

## 🔮 未来增强

### 已完成 ✅
- [x] 知识库查询 API
- [x] 文档验证工具
- [x] 智能分类推荐
- [x] 重复内容检测
- [x] 程序化接口

### 计划中 📋
- [ ] 向量嵌入（语义搜索）
- [ ] REST API 服务
- [ ] 文档关联图谱
- [ ] 前端搜索增强（显示分类、标签）
- [ ] 自动标签生成

### 探索中 🔬
- [ ] RAG 集成
- [ ] 知识图谱可视化
- [ ] 多语言支持
- [ ] 版本历史追踪

## 💡 最佳实践

### 文档标准

**Frontmatter 模板：**

```yaml
---
title: 文档标题
date: YYYY-MM-DD
ai_generated: true
ai_model: Claude Opus 4.5
tags: [tag1, tag2, tag3]
---
```

**命名规范：**
- 文件名使用 kebab-case：`react-hooks-guide.md`
- 分类名大小写敏感：`JavaScript`, `react`, `Pattern`
- 标签使用小写：`react`, `hooks`, `state`

### AI 对话技巧

1. **提取知识点**：整合对话、提炼标题、去重
2. **确定分类**：使用 `kb-query.mjs suggest` 智能推荐
3. **创建文档**：按模板生成 Markdown
4. **验证质量**：使用 `doc-validator.mjs` 检查
5. **提交整理**：使用 `ai-doc.mjs full` 一键完成

## 📞 支持

- **GitHub**：https://github.com/Acongm/vuepress
- **在线文档**：https://www.acongm.com

---

**总结：** 本系统已经具备完整的 AI 辅助知识库管理功能，包括前端搜索、AI 快速检索、文档生成、动态菜单管理。新增的查询 API 和文档验证器进一步增强了系统的可用性和可靠性。
