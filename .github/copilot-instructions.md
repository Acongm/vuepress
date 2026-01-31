# Copilot Instructions for vuepress 知识库

VuePress 2 个人前端知识站点，包含技术文档、面试准备、代码示例。

## 架构概览

```
docs/                    # VuePress 源文档（所有 .md）
  └── .vuepress/config.ts   # navbar + sidebar 配置（复杂，用脚本更新）
interview-prep/          # 面试准备知识单元（扁平结构，禁止子目录）
examples/                # 可运行代码示例（每个子目录独立项目）
tools/                   # 辅助脚本（零依赖，仅 Node >= 18 标准库）
vuepress/                # 构建产物（勿编辑）
```

## 关键约定

### tools/ 脚本规则

- **零外部依赖**：仅使用 `node:fs`, `node:path`, `node:child_process` 等标准库
- 文件扩展名 `.mjs`（ES Modules）
- 必须支持 `--help`

### interview-prep/ 硬约束

- **扁平结构**：不允许子目录，所有文件为一级 `.md`
- **命名规范**：`project__<slug>.md` / `tech__<slug>.md` / `matrix__<slug>.md`
- **AUTO-GENERATED 区块**：脚本只能改写 `<!-- AUTO-GENERATED:START -->...<!-- AUTO-GENERATED:END -->` 区域
- 由 `tools/generate-interview-prep.mjs` 管理，不要手动修改自动区块

### 文档 frontmatter 模板

```yaml
---
title: { 中文标题 }
date: { YYYY-MM-DD }
ai_generated: true
ai_model: Claude Opus 4.5
tags: [{ category }, ...]
---
```

## 常用命令

```bash
npm run dev              # 本地开发 (vite bundler)
npm run build            # 生产构建 (webpack bundler)
npm run deploy:build     # 构建 + 部署 gh-pages
npm run commit           # commitizen 规范提交
```

## `/ai-doc` 工作流

用户说 `/ai-doc` 或 "整理对话到知识库" 时：

1. **提取知识点**：整合对话、提炼标题、去重
2. **确定分类**：读取 `tools/knowledge-map.json` 匹配 category（仅 `archivable: true`）
3. **创建文档**：`docs/{category}/{kebab-case}.md`
4. **更新配置并提交**：

```bash
node tools/ai-doc.mjs full \
  --category {category} \
  --file /{category}/{filename}.md \
  --title "{标题}" \
  --questions "{问题}" \
  --model "Claude Opus 4.5"
```

**可归档分类**：JavaScript, TypeScript, react, vue, webpack, css, node, performance, Pattern, git, utils, issue, software, mark

**不可归档**：`interview-prep`（由专用脚本管理）、`theory`（有特定格式）

## Git 提交规范

AI 文档提交格式：

```
docs(ai): {标题}

Category: {分类}
AI-Model: {模型}
```

## 禁止事项

- ❌ 直接编辑 `vuepress/` 目录
- ❌ 手动修改 `docs/.vuepress/config.ts` 的 sidebar/navbar（用 `ai-doc.mjs`）
- ❌ 在 `interview-prep/` 创建子目录
- ❌ 给 `tools/` 脚本添加外部依赖
