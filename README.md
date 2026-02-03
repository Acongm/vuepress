# 前端物语

个人前端知识库，基于 VuePress 2 构建，支持 AI 辅助文档管理。

## ✨ 功能特性

- 📚 **知识库管理**：18 个分类，174+ 篇文档
- 🔍 **前端搜索**：VuePress 内置全文搜索
- 🤖 **AI 快速检索**：程序化查询 API
- ✍️ **AI 文档生成**：自动化文档整理工作流
- 🎯 **智能分类推荐**：基于内容的自动分类
- ✅ **文档质量验证**：自动检查文档规范
- 🔄 **动态菜单管理**：自动更新导航和侧边栏

## 📋 知识分类

### 基础语言
- JavaScript
- TypeScript  
- CSS

### 框架生态
- React
- Vue
- 设计模式

### 工程化
- Webpack/Vite/Rollup
- Node.js
- Git
- 性能优化

### 进阶专题
- 技能提炼
- AI 开发
- 踩坑记录

### 工具箱
- 工具函数
- 软件推荐

### 面试准备
- 面试题库
- 简历问答

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 部署到 GitHub Pages
npm run deploy:build
```

## 🤖 AI 文档管理

### 查询知识库

```bash
# 查看统计信息
npm run kb:stats

# 搜索文档
npm run kb:query search "react hooks"

# 智能推荐分类
npm run kb:query suggest "useState useEffect"

# 查询某个分类的文档
npm run kb:query query react --limit 10
```

### 添加文档

```bash
# 验证文档
npm run kb:validate docs/react/hooks.md

# 一键添加（推荐分类 + 验证 + 提交）
npm run kb:add /tmp/new-doc.md

# 指定分类添加
npm run kb:add /tmp/new-doc.md --category react
```

### 完整工作流

```bash
# 1. AI 对话生成文档
cat > /tmp/react-hooks-guide.md << 'EOF'
---
title: React Hooks 完全指南
date: 2026-02-03
ai_generated: true
ai_model: Claude Opus 4.5
tags: [react, hooks]
---

# React Hooks 完全指南
...
EOF

# 2. 一键提交到知识库
npm run kb:add /tmp/react-hooks-guide.md

# 自动完成：
# ✓ 智能推荐分类 (react)
# ✓ 验证文档质量
# ✓ 更新导航菜单
# ✓ Git 提交和推送
```

## 📚 详细文档

- **知识库系统指南**：[KNOWLEDGE_BASE_GUIDE.md](./KNOWLEDGE_BASE_GUIDE.md)
- **工具使用文档**：[lib/README.md](./lib/README.md)
- **AI 文档工具**：[tools/README.md](./tools/README.md)

## 🔧 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run deploy:build` | 构建并部署 |
| `npm run kb:stats` | 查看知识库统计 |
| `npm run kb:query <cmd>` | 查询知识库 |
| `npm run kb:validate <file>` | 验证文档 |
| `npm run kb:add <file>` | 添加文档 |

## 📊 知识库统计

- **总文档数**：174 篇
- **可归档分类**：15 个
- **主要分类**：JavaScript (6), React (6), Vue (9), Webpack (12), Pattern (26)
- **最后更新**：2026-01-31

## 🎯 核心工具

### 知识库查询 API (`lib/kb-query.mjs`)
- 按分类/关键词/标签搜索
- 智能分类推荐
- 查找相似文档
- 全文搜索

### 文档验证器 (`lib/doc-validator.mjs`)
- Frontmatter 完整性检查
- 内容质量验证
- 重复内容检测
- 标签合理性检查

### AI 文档集成 (`lib/ai-doc-integration.mjs`)
- 一键完成工作流
- 自动分类推荐
- 质量验证
- Dry-run 测试

## 访问地址

### Vercel

- <https://www.acongm.com>

### Github

- <https://github.com/Acongm/vuepress.git>

## 📝 License

MIT

---

**技术栈**：VuePress 2 + Node.js + Zero Dependencies
