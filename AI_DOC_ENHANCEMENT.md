# AI 文档内容增强说明

## 更新内容

本次更新大幅增强了 AI 文档生成功能，使生成的文档内容更加丰富、详尽和实用。

## 主要改进

### 1. 增强文档模板（`.agents/skills/ai-doc/SKILL.md`）

**新增章节**：
- **概述**：介绍主题背景、重要性和应用场景（100-200字）
- **详细解析**：深入剖析底层原理、技术细节、优缺点、最佳实践
- **常见问题**：列出 3-5 个常见问题及详细解答
- **扩展阅读**：相关主题、深入资源、官方文档链接

**内容要求**：
- 总字数不少于 1500 字（不含代码）
- 至少包含 3 个完整的代码示例
- 每个核心要点都要有详细说明（3-5 段），避免一笔带过
- 注重实用性，提供实际应用场景和最佳实践

### 2. 优化 AI 提示词（`lib/glm-api.mjs`）

#### `generateDocument` 函数优化：
- 明确要求内容不少于 1500 字
- 要求提供至少 3 个完整代码示例
- 强调深入解释技术原理，不只停留在表面
- 明确内容结构：概述 -> 核心要点 -> 详细解析 -> 代码示例 -> 常见问题 -> 扩展阅读

#### `improveDocument` 函数优化：
- 大幅扩充内容，目标不少于 1500 字
- 为每个知识点添加详细的背景说明和应用场景
- 深入解释"为什么"和"怎么做"
- 补充完整的代码示例，覆盖基础、进阶、实战场景
- 添加常见问题和解答（至少 3-5 个）

#### `chatCompletion` 函数优化：
- 将 `maxTokens` 从 4000 提升到 8000，支持生成更长的内容

## 使用示例

### 生成新文档

```bash
# 使用 GLM API 生成内容丰富的文档
node lib/glm-api.mjs generate "React Hooks 深入解析" \
  --model glm-4-plus \
  --max-tokens 8000 \
  --output /tmp/react-hooks.md
```

### 优化现有文档

```bash
# 使用 AI 优化并扩充文档内容
node lib/glm-api.mjs improve /tmp/my-doc.md \
  --output /tmp/my-doc-improved.md \
  --max-tokens 8000
```

### 完整工作流

```bash
# 1. 创建文档（手动或 AI 生成）
node lib/glm-api.mjs generate "主题" --output /tmp/doc.md

# 2. （可选）优化文档
node lib/glm-api.mjs improve /tmp/doc.md --output /tmp/doc-final.md

# 3. 集成到知识库
node lib/ai-doc-integration.mjs /tmp/doc-final.md \
  --category react \
  --title "React Hooks 深入解析" \
  --model "GLM-4-Plus"
```

## 新文档结构示例

生成的文档将包含以下结构：

```markdown
---
title: React Hooks 深入解析
date: 2026-02-04
ai_generated: true
ai_model: GLM-4-Plus
tags: [react, hooks, frontend]
---

# React Hooks 深入解析

> 原始问题：React Hooks 是什么？如何使用？

## 概述

React Hooks 是 React 16.8 引入的新特性，它允许在函数组件中使用状态和其他 React 特性...
（100-200 字的背景介绍）

## 核心要点

### 要点一：useState Hook 基础

详细介绍 useState 的工作原理、使用方法、应用场景...
（3-5 段详细说明）

### 要点二：useEffect Hook 详解

深入解析 useEffect 的执行时机、依赖数组、清理函数...
（3-5 段详细说明）

### 要点三：自定义 Hooks 最佳实践

如何编写可复用的自定义 Hooks...
（3-5 段详细说明）

## 详细解析

### 底层原理
深入探讨 Hooks 的实现原理、fiber 架构、闭包陷阱...

### 最佳实践
在实际项目中如何正确使用 Hooks...

## 代码示例

### 示例 1: 基础计数器
```javascript
// 完整的代码示例，包含详细注释
```

### 示例 2: 数据获取
```javascript
// 使用 useEffect 获取数据的完整示例
```

### 示例 3: 自定义 Hook
```javascript
// 创建可复用的自定义 Hook
```

## 常见问题

### Q: 为什么 Hooks 必须在顶层调用？
**A:** 详细解答...

### Q: 如何避免 useEffect 的无限循环？
**A:** 详细解答...

### Q: 什么时候应该使用 useMemo 和 useCallback？
**A:** 详细解答...

## 扩展阅读

- React 官方文档：Hooks API Reference
- 深入 React Hooks 工作原理
- React Hooks 最佳实践指南

## 参考

- [React Hooks 官方文档](https://react.dev/reference/react)
- [Dan Abramov's blog on Hooks](...)
```

## 效果对比

### 之前（简短版本）
- 内容：500-800 字
- 代码示例：0-1 个
- 结构：简单的要点罗列
- 深度：表面描述

### 现在（丰富版本）
- 内容：1500+ 字
- 代码示例：3-5 个完整示例
- 结构：概述 + 核心要点 + 详细解析 + 示例 + 问答 + 扩展
- 深度：原理解析 + 实践指导 + 问题解答

## 注意事项

1. **API Token 消耗**：由于生成更长的内容，每次调用会消耗更多的 tokens（约 2-3 倍）
2. **生成时间**：内容生成时间可能从 10-20 秒增加到 30-60 秒
3. **质量控制**：建议生成后人工审核，确保内容准确性和相关性
4. **模型选择**：建议使用 `glm-4-plus` 或 `glm-4` 以获得更好的内容质量

## 配置环境变量

确保设置了 GLM API Key：

```bash
# .env 文件或系统环境变量
export GLM_API_KEY="your-api-key-here"
```

## 反馈与改进

如果生成的内容仍然不够详细，可以：

1. 调整 `maxTokens` 参数（可以设置为 10000 或更高）
2. 在 `additionalContext` 中提供更多上下文信息
3. 修改 `lib/glm-api.mjs` 中的提示词，增加更具体的要求

---

**更新时间**：2026-02-04  
**影响范围**：`.agents/skills/ai-doc/SKILL.md`, `lib/glm-api.mjs`  
**兼容性**：向后兼容，不影响现有文档
