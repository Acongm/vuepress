---
name: ai-doc
description: 将 AI 对话整理成知识库文档。当用户说 "/ai-doc"、"整理到知识库"、"保存这次对话" 时触发。自动分析对话内容，匹配最佳分类，创建 Markdown 文档，更新 VuePress 配置（sidebar + navbar），记录 AI 更新日志，并 git commit + push。
---

# AI 文档整理工作流

将 AI 对话中的技术知识整理成结构化文档，自动归档到 VuePress 知识库。

## Skill 资源

```
.agents/skills/ai-doc/
├── SKILL.md                           # 本文件（工作流定义）
├── scripts/
│   └── ai-doc.mjs                     # 辅助脚本（更新配置、日志、git）
└── references/
    └── knowledge-map.json             # 前端知识图谱（分类定义）
```

**注意**：脚本同时存在于 `tools/` 目录供全局使用。

## 触发条件

- `/ai-doc`
- "帮我整理这次对话到知识库"
- "保存这次对话"
- "归档到文档"

## 工作流程

### 1. 分析对话，提取知识点

回顾当前对话中的所有技术问答：

- 整合多轮问答，去重、优化结构
- 提炼一个简洁的专题标题（中文）
- 记录原始问题列表（用于 changelog）

### 2. 确定分类

读取 `references/knowledge-map.json`（或 `tools/knowledge-map.json`），根据对话内容匹配最相关的 **可归档分类**（`archivable: true`）。

**可归档分类速查**：
| Category | 典型关键词 |
|----------|-----------|
| JavaScript | promise, 闭包, 原型链, async/await, 事件循环 |
| TypeScript | 泛型, 类型体操, interface, 工具类型 |
| react | hooks, fiber, 状态管理, jsx, redux |
| vue | 组合式 API, 响应式, pinia, vue router |
| webpack | loader, plugin, vite, rollup, tree shaking |
| css | flex, grid, 动画, BFC, 响应式布局 |
| node | npm, 文件系统, CLI, express, nestjs |
| performance | 首屏优化, 懒加载, 缓存, Core Web Vitals |
| Pattern | 设计模式, 发布订阅, 观察者, 状态机 |
| git | 版本控制, 分支, merge, rebase, 代理 |
| utils | 工具函数, 正则, lodash, 防抖节流 |
| issue | 踩坑, bug, 兼容性, 调试 |
| software | vscode, 终端, zsh, 浏览器插件 |
| mark | 技能提炼, 专题总结, 核心原理 |
| ai | skill, agent, copilot, claude, prompt, llm, mcp |

**不可归档**：`interview-prep`、`theory`（由专门脚本管理）

### 3. 创建文档

在 `docs/{category}/` 下创建新 .md 文件。

**文件名**：英文 kebab-case，如 `git-proxy-config.md`

**文档模板**：

```markdown
---
title: { 中文标题 }
date: { YYYY-MM-DD }
ai_generated: true
ai_model: Claude Opus 4.5
ai_conversation_summary: { 对话主题简述 }
tags:
  - ai
  - { category }
  - { 相关标签 }
---

# {中文标题}

> 原始问题：{主要问题}

## 概述

{简要介绍该主题的背景、重要性和应用场景，100-200字}

## 核心要点

{详细整理知识点，每个要点应包含：
1. 清晰的小标题
2. 详细的解释说明（不少于 3-5 句话）
3. 关键概念的定义
4. 实际应用场景
5. 需要注意的要点或易错点}

### 要点一：{具体标题}

{详细说明，包括概念定义、工作原理、使用场景等}

### 要点二：{具体标题}

{详细说明...}

### 要点三：{具体标题}

{详细说明...}

## 详细解析

{针对核心概念进行深入剖析：
- 底层原理
- 技术细节
- 优缺点分析
- 与相关技术的对比
- 最佳实践建议}

## 代码示例

{提供完整、可运行的代码示例，包括：
1. 基础用法示例
2. 进阶用法示例
3. 实际项目中的应用示例
4. 每个示例都要有注释说明}

```javascript
// 示例 1: 基础用法
// 详细的注释说明
```

```javascript
// 示例 2: 进阶用法
// 详细的注释说明
```

## 常见问题

{列出 3-5 个常见问题及详细解答}

### Q: {问题1}
**A:** {详细解答}

### Q: {问题2}
**A:** {详细解答}

## 追问记录

{如有追问，按 Q/A 格式详细记录，包括思考过程和完整回答}

## 扩展阅读

{相关主题、深入资源、官方文档链接等}

## 参考

{如有引用来源、参考文档、相关文章等}

---

**内容要求**：
- 总字数不少于 1500 字（不含代码）
- 至少包含 3 个完整的代码示例
- 每个核心要点都要有详细说明，避免一笔带过
- 注重实用性，提供实际应用场景和最佳实践
- 语言表达清晰、准确，避免模糊描述
```

### 4. 更新配置 + 日志 + 提交

使用辅助脚本完成后续操作：

```bash
node tools/ai-doc.mjs full \
  --category {category} \
  --file /{category}/{filename}.md \
  --title "{标题}" \
  --questions "{问题1},{问题2}" \
  --model "Claude Opus 4.5"
```

此命令会：

1. 更新 `docs/.vuepress/config.ts`（sidebar + navbar）
2. 追加 `AI_CHANGELOG.md`
3. `git add -A && git commit && git push`

### 5. 确认完成

向用户报告：

- ✅ 创建的文件路径
- ✅ 更新的配置项
- ✅ Git commit hash
- 🔗 可访问的线上地址（部署后）

## 辅助脚本命令

```bash
# 查看所有可用分类
node tools/ai-doc.mjs categories

# 仅更新配置（不提交）
node tools/ai-doc.mjs update-config -c {category} -f /{category}/{file}.md

# 仅记录日志
node tools/ai-doc.mjs changelog -c {category} -f /{file} -t "{title}" -q "{questions}" -m "Claude Opus 4.5"

# 仅提交
node tools/ai-doc.mjs commit -t "{title}" -c {category} -m "Claude Opus 4.5"

# 一键执行全部
node tools/ai-doc.mjs full -c {category} -f /{category}/{file}.md -t "{title}" -q "{questions}" -m "Claude Opus 4.5"
```

## 关键文件路径

| 文件                       | 作用                                  |
| -------------------------- | ------------------------------------- |
| `tools/knowledge-map.json` | 分类定义、关键词、navbar/sidebar 路径 |
| `tools/ai-doc.mjs`         | 辅助脚本（更新配置、日志、git）       |
| `docs/.vuepress/config.ts` | VuePress 配置（navbar + sidebar）     |
| `AI_CHANGELOG.md`          | AI 生成文档的更新日志                 |

## 约定

- **tools/ 目录**：无外部依赖，仅 Node.js >= 18 标准库
- **文档语言**：中文内容，技术术语可保留英文
- **Git 提交格式**：`docs(ai): {标题}`
- **构建产物**：`vuepress/` 目录勿直接编辑
