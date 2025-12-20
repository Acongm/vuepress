<!--
Sync Impact Report

- Version change: (template placeholders) → 1.0.0
- Modified principles: N/A (first ratification)
- Added sections: Core Principles (formalized), Scope & Artifacts, Workflow & Quality Gates, Governance
- Removed sections: Removed unused placeholder-only principle slot (#5) to match defined 4 principles
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .specify/templates/checklist-template.md
- Follow-up TODOs:
  - None
-->

# 前端高级面试准备体系（VuePress）Constitution

## Core Principles

### 代码质量优先（Code Quality First）

- 所有复习/产出 MUST 基于**真实项目上下文**（来自简历项目或明确假设的业务约束），禁止“背模板式”
  回答。
- 技术解释 MUST 体现工程思维：可维护性、可扩展性、错误边界处理、TypeScript 类型安全与回归风险
  控制贯穿始终。
- 针对简历涉及的关键技术（React、Ant Design、Webpack、微前端等），每个主题 MUST 至少配套一段
  **可手写的简化实现/核心逻辑片段**（可为伪代码，但必须可落地、可运行路径清晰）。
- 任何实现/伪代码 MUST 明确输入/输出、边界条件与失败路径（错误处理、兜底策略、可观测性点位）。

### 原理驱动的理解标准（Principle-Driven Understanding）

- 每个技术点 MUST 拆解为：**是什么 → 为什么用 → 替代方案 → 性能/体验权衡 → 项目中的定制/优化**。
- 涉及关键决策题（例如“为何选 Webpack 而非 Vite”等）MUST 给出：
  - 背景约束（业务/团队/遗留/生态/合规）
  - 评估维度（开发体验、产物体积、构建速度、生态插件、迁移成本、风险）
  - 结论与边界（什么条件下会改选）
- 本体系 MUST 至少维护 2 个“技术选型对比表”（构建工具、状态管理、表单方案等），并随复盘迭代。

### 表达一致性（Consistent UX in Communication）

- 面试回答 MUST 结构化输出：**Context → Problem → Solution → Outcome → Learnings**。
- 术语 MUST 精准；对不确定内容 MUST 主动声明边界与前提（例如“在 RMS 项目中采用 X；若 SSR/边缘
  渲染场景则可能改选 Y，并说明原因”）。
- 架构设计类题目 SHOULD 使用图示/伪代码表达（例如打包产物 ESM/UMD 流程、插件加载机制、微前端隔离
  策略），并明确关键接口与依赖方向。

### 性能即责任（Performance as a Responsibility）

- 所有项目描述/技术方案 MUST 附带关键指标与验收口径（如 Bundle Size、FCP/LCP、TTI、Hydration Time、
  运行时 FPS、长任务、可访问性指标等）。
- 性能优化 MUST 分层描述：加载性能、运行时性能、感知性能、可访问性；并给出权衡与回归风险控制。
- 任何“性能收益”叙述 MUST 给出：基线、手段、对比结果、潜在副作用与兜底方案。

## Scope & Artifacts（范围与交付物标准）

- 本宪章适用于：
  - 面试题/技术点复习笔记
  - 项目复盘材料（基于简历项目）
  - 技术选型对比表与评估矩阵
  - 可手写的简化实现/核心代码片段（含伪代码）
- 每个主题产出 MUST 最少包含：
  - CP-SO-L 结构化答案（可用于口述）
  - 1 段简化实现/核心逻辑片段（或关键流程图）
  - 1 组边界/异常场景清单
  - 1 组性能/体验指标与验证方式（若主题涉及性能）

## Workflow & Quality Gates（流程与质量门禁）

- 产出流程 SHOULD 遵循：
  - 选题（来自简历/目标 JD/高频题库）→ 建模（拆解 + 选型矩阵）→ 实现（伪代码/核心片段）→ 验证
    （自测问答 + 反例/边界）→ 复盘迭代（补齐盲区）
- 质量门禁（提交前 MUST 自检）：
  - 是否绑定真实上下文与约束（不能“空中楼阁”）
  - 是否覆盖“是什么/为什么/替代/权衡/项目实践”
  - 是否提供可手写的核心实现（含边界与错误处理）
  - 是否包含指标、口径与验证方法（涉及性能时）
  - 是否用 CP-SO-L 结构组织表达，且边界声明清晰

## Governance

- 本宪章对 `.specify/` 生成模板与后续文档产出具有最高优先级；冲突时以本宪章为准。
- 修订流程：
  - MUST 在 `.specify/memory/constitution.md` 中记录变更，并更新顶部 Sync Impact Report。
  - MUST 说明变更动机、影响范围、迁移建议（如模板/检查项需同步更新）。
- 版本策略（Semantic Versioning）：
  - MAJOR：原则被删除/重定义导致不兼容的治理变化
  - MINOR：新增原则/新增强制门禁/显著扩展治理要求
  - PATCH：措辞澄清、示例补充、非语义性修订
- 合规检查：
  - 每次生成 plan/spec/tasks/checklist 时 MUST 显式对齐本宪章门禁点。

**Version**: 1.0.0 | **Ratified**: 2025-12-20 | **Last Amended**: 2025-12-20
