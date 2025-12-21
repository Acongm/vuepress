# Implementation Plan: 技术画像与能力提升路线图（可迭代）

**Branch**: `002-tech-stack-principles` | **Date**: 2025-12-21 | **Spec**: `specs/002-tech-stack-principles/spec.md`
**Input**: Feature specification from `/specs/002-tech-stack-principles/spec.md` + user input “Create a roadmap…”

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

目标：把“我擅长什么、我怎么做决策、我如何验证”沉淀为可复用的**技术画像**，并配套一份可持续迭代的
**能力提升路线图**（聚焦不自信领域 / 新趋势 / 既有工具的深水区），用于面试与日常架构决策表达。

交付物（本 feature 的设计产物，不含实现任务拆分）：

- 一套条目化信息结构（TechnologyEntry / Evidence / ComparisonMatrix / RoadmapItem）
- 一套“验证必需”的口径：每个条目必须有自动化测试或可一键执行的替代验证
- 一份可滚动迭代的 roadmap：按季度/月份主题推进，明确目标、练习方式、产出物与验收口径

路线图初版（高层）：

- **T+0~2 周（打底）**：建立条目模板 + 目录 + 2 张对比矩阵；产出 Top 5 条目并完成可验证证据
- **T+1~2 月（深水区）**：补齐性能、可访问性、工程化、测试体系的“可落地证据”；建立复盘节奏
- **T+1 季度（趋势追踪）**：围绕新范式（如 RSC/SSR、构建工具演进、微前端治理等）形成对比矩阵与边界结论

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Markdown + Node.js (>= 18)  
**Primary Dependencies**: 无外部依赖（仅 Node 标准库；如需校验以脚本/规则实现）  
**Storage**: 本地文件系统（Markdown/JSON/Schema 文件）  
**Testing**: 不强制引入测试框架；但“验证必需”（自动化测试或可一键执行的替代验证）  
**Target Platform**: 本地开发机（macOS/Windows/Linux）  
**Project Type**: 单仓库文档化项目（VuePress 内容仓库 + tools 脚本）  
**Performance Goals**: 60 秒内定位任意条目与其证据；条目规模增长后仍可快速检索/审阅  
**Constraints**: 内容必须结构一致、可复述、可验证；不引入复杂服务端/数据库  
**Scale/Scope**: 初版至少 12 个条目 + 2 张对比矩阵 + 1 份季度滚动 roadmap（可持续扩展）

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

将以下门禁逐条写成“可检查”的结论（通过/不通过 + 证据链接/段落引用）：

- **上下文绑定**：通过。条目必须绑定“真实项目/明确约束”，并在条目结构中显式记录（见 `spec.md` FR-001/FR-002）。
- **原理拆解**：通过。每条目强制覆盖是什么/为什么/替代/权衡/项目实践（见 `spec.md` “技术点拆解”与 FR-002）。
- **可手写实现**：通过。条目要求给出可手写核心逻辑/关键流程（见 `spec.md` “可手写核心实现”），并在本计划中以
  schema/契约形式固化（见 `contracts/` 设计）。
- **可验证性（必需）**：通过。每条目必须提供自动化测试或替代验证，并写清口径与失败信号（见 `spec.md` FR-003、
  `quickstart.md` 验证流程）。
- **表达结构**：通过。条目包含 CP-SO-L 可复述稿并要求边界声明（见 `spec.md` FR-004）。
- **用户体验一致性**：通过。涉及 UX 的条目必须记录一致性要求（术语/命名/结构/a11y/错误态/空状态）（见 `spec.md` FR-005）。
- **性能要求与预算**：通过。涉及性能的条目必须记录指标口径/基线/目标(预算)/验证/兜底（见 `spec.md` FR-006）。

## Project Structure

### Documentation (this feature)

```text
specs/002-tech-stack-principles/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── technology-entry.schema.json
│   └── roadmap-item.schema.json
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
interview-prep/
├── tech-profile__index.md        # 技术画像目录（条目清单 + 熟练度分层 + 快速导航）
├── roadmap__skill-growth.md      # 能力提升路线图（滚动迭代：季度主题/周计划/复盘机制）
└── matrix__tech-compare-*.md     # 至少 2 张对比矩阵（选型口径统一）

tools/
└── validate-tech-profile.mjs     # 可一键执行的替代验证：结构完整性/字段缺失/命名一致性检查（无外部依赖）
```

**Structure Decision**: 以“文档即产品”的方式落地：核心产出在 `interview-prep/`，并配套 `tools/` 的无依赖校验脚本。
本 feature 的 specs 目录仅承载设计与契约（plan/research/data-model/contracts/quickstart）。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

本计划无门禁违规项，无需复杂度豁免表。
