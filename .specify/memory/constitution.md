<!--
Sync Impact Report

- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - 代码质量优先（Code Quality First）→ 代码质量与可验证性（Code Quality + Verifiability）
  - 表达一致性（Consistent UX in Communication）→ 用户体验一致性（User Experience Consistency）
  - 性能即责任（Performance as a Responsibility）→ 性能要求与预算（Performance Requirements & Budgets）
- Added sections: N/A (expanded existing principles + gates)
- Removed sections: N/A
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

### 代码质量与可验证性（Code Quality + Verifiability）

- 所有产出 MUST 基于**真实上下文**（简历项目/明确的业务与团队约束）；不允许“脱离约束的模板化答案”。
- 所有实现（含伪代码）MUST 具备：清晰输入/输出、边界条件、失败路径（错误处理/兜底策略/可观测性点位）。
- TypeScript 类型安全/边界防御/回归风险控制 MUST 贯穿关键逻辑与关键接口（尤其是跨模块边界、I/O 边界）。
- **测试/验证标准**（二选一且必须可自动化执行）：
  - **自动化测试**：为关键逻辑提供 unit/integration/contract/e2e 中合适的组合；测试 MUST 可重复、可确定。
  - **替代验证**：当不引入测试框架（或不适用）时，MUST 提供可一键执行的验证（如无依赖脚本、可运行示例、
    或可复现的验收脚本），并明确验证口径与失败信号。
- 任何“完成/优化”声明 MUST 附带可验证证据：命令、输出、对比数据或可复现步骤。

### 原理驱动的理解标准（Principle-Driven Understanding）

- 每个技术点 MUST 拆解为：**是什么 → 为什么用 → 替代方案 → 性能/体验权衡 → 项目中的定制/优化**。
- 涉及关键决策题（例如“为何选 Webpack 而非 Vite”等）MUST 给出：
  - 背景约束（业务/团队/遗留/生态/合规）
  - 评估维度（开发体验、产物体积、构建速度、生态插件、迁移成本、风险）
  - 结论与边界（什么条件下会改选）
- 本体系 MUST 至少维护 2 个“技术选型对比表”（构建工具、状态管理、表单方案等），并随复盘迭代。

### 用户体验一致性（User Experience Consistency）

- 所有对外输出（文档/页面/示例/口述稿）MUST 遵循一致的信息架构与命名规范（标题、术语、文件命名、目录结构、
  链接方式、模板字段），避免同义混用与风格漂移。
- 关键内容 MUST 结构化：**Context → Problem → Solution → Outcome → Learnings**；并对不确定内容明确声明前提与
  边界（“在 X 约束下选择 Y；若约束改变则可能改选 Z，并说明原因”）。
- 涉及 UI/交互的变更 MUST 对齐统一的体验准则：视觉与交互一致性、可访问性（a11y）基础、错误态与空状态一致、
  文案风格一致（如适用）。
- 架构/流程类内容 SHOULD 使用图示/伪代码表达，并明确关键接口、依赖方向与职责边界。

### 性能要求与预算（Performance Requirements & Budgets）

- 所有涉及性能的方案 MUST 给出：**指标口径**（测什么）、**基线**（当前值）、**目标/预算**（期望阈值）与
  **验证方式**（如何测、在何处测、失败信号）。
- 性能优化 MUST 分层描述：加载性能、运行时性能、感知性能、可访问性；并明确权衡、回归风险与回滚策略。
- 任何“性能收益”叙述 MUST 给出：基线、手段、对比结果、潜在副作用与兜底方案（含监控/验证入口）。

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
  - 1 份可自动化执行的验证方式（测试或替代验证脚本/可运行示例）
  - 1 组性能/体验指标与验证方式（若主题涉及性能或 UX）

## Workflow & Quality Gates（流程与质量门禁）

- 产出流程 SHOULD 遵循：
  - 选题（来自简历/目标 JD/高频题库）→ 建模（拆解 + 选型矩阵）→ 实现（伪代码/核心片段）→ 验证
    （自测问答 + 反例/边界）→ 复盘迭代（补齐盲区）
- 质量门禁（提交前 MUST 自检）：
  - 是否绑定真实上下文与约束（不能“空中楼阁”）
  - 是否覆盖“是什么/为什么/替代/权衡/项目实践”
  - 是否提供可手写的核心实现（含边界与错误处理）
  - 是否提供可自动化执行的验证（测试或替代验证）并明确口径
  - 如涉及 UX，是否对齐一致性要求（结构/命名/交互/a11y/错误态）
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

**Version**: 1.1.0 | **Ratified**: 2025-12-20 | **Last Amended**: 2025-12-21
