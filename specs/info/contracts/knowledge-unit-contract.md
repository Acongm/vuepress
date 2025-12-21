# Contracts: Knowledge Unit（Markdown 文件契约）

本 contract 定义知识单元的**命名规范、frontmatter 字段、内容结构与生成标记**，用于保障可追溯、可演练与可增量更新。

## 1. 目录与扁平约束

- 知识单元目录：`/interview-prep/`
- **硬约束**：`/interview-prep/` 下不允许子目录（扁平化一级分类）
- 允许存在的“非知识单元”文件：`INDEX.md`、`*_TEMPLATE.md`

## 2. 文件命名（稳定 ID）

统一使用双下划线前缀：

- `project__<slug>.md`
- `tech__<slug>.md`
- `matrix__<slug>.md`
- `qna__<slug>.md`（可选：如将问答独立拆文件）

slug 规则：小写 + `-` 连接；避免空格与中文路径依赖。

## 3. YAML frontmatter（必须字段）

每个知识单元文件开头 MUST 包含：

```yaml
---
id: tech__react
type: tech # project | tech | matrix | qna
title: React（核心机制与工程实践）
mastery: not_started # not_started | in_progress | mastered
tags: [react, hooks, scheduler]
projects: [project__dji-rms] # 可为空
source_refs:
  - source: resume
    file: docs/job-description/web前端开发工程师-彭聪.md
    anchor: 大疆售后 RMS 系统重构
seed_refs:
  - source: outline
    file: docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md
    anchor: 3）跨平台公告插件系统：Rollup / Webpack / Vite 横向对比 + Preact 选型
updated_at: 2025-12-20
---
```

说明：

- `source_refs`：回链简历（唯一输入源），用于上下文绑定
- `seed_refs`：回链面试大纲（参考种子），用于初始覆盖与追问扩展

## 4. 增量生成标记（禁止覆盖人工区块）

生成脚本 ONLY 允许改写以下区块：

```md
<!-- AUTO-GENERATED:START -->

... 自动生成内容（摘要/占位/提取列表） ...

<!-- AUTO-GENERATED:END -->
```

其余内容视为人工区块，脚本 MUST 保留原样。

## 5. 内容结构（统一模板字段）

各类知识单元必须包含（允许为空占位，但必须存在标题）：

- **在我项目中的角色与使用场景**
- **核心原理**（可附关键代码片段/图解）
- **选型对比**（至少 2 个替代方案 + 决策依据）
- **面试高频问题 + 推荐回答结构（CP-SO-L）**
- **延伸追问**（包含“如果重做会怎么改？”）
- **可执行验证**（如适用：链接到 `examples/` 的最小运行步骤）
