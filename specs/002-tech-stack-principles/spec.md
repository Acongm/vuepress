# Feature Specification: 核心技术与方法论画像

**Feature Branch**: `002-tech-stack-principles`  
**Created**: 2025-12-21  
**Status**: Draft  
**Input**: User description: "Identify the core technologies and tools that you’re proficient in. For each, specify the principles, patterns, and best practices that guide your use of them in development. This will help you articulate how you approach front-end development with clear reasoning and a structured methodology."

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - 生成“技术画像”目录 (Priority: P1)

作为一名前端工程师，我可以把自己熟练的核心技术与工具整理为一份“技术画像目录”，并为每一项提供
可复述的结构化说明（原则/模式/最佳实践/权衡/验证方式），从而在面试或设计评审中用一致方法论表达。

**Why this priority**: 这是该需求的最小可用交付物；没有目录与结构化条目，后续无法扩展与复用。

**Independent Test**: 打开输出的“技术画像目录”，随机抽取任意 1 个条目，检查其是否包含必填字段并能独立复述。

**Acceptance Scenarios**:

1. **Given** 我尚未整理任何技术画像条目，**When** 我创建技术画像目录并新增至少 1 个条目，**Then** 目录能列出该条目，
   且条目包含所有必填字段（见 FR 列表）。
2. **Given** 我已有至少 1 个条目，**When** 我阅读该条目并按结构复述，**Then** 我能在 2 分钟内完整覆盖“原则/模式/最佳实践/
   替代方案/权衡/验证方式”，且不依赖隐含上下文。

---

### User Story 2 - 条目可验证与可审阅 (Priority: P2)

作为条目作者/审阅者，我可以为每个条目提供“可自动化执行的验证方式”（测试或替代验证），并能快速检查条目是否满足
宪章门禁（可验证性、UX 一致性、性能预算等）以降低“只会讲但不可落地”的风险。

**Why this priority**: 让内容从“主观看法”升级为“可复现证据”，提升可信度与可迁移性。

**Independent Test**: 随机抽取任意 1 个条目，执行其验证方式，能得到明确的通过/失败信号。

**Acceptance Scenarios**:

1. **Given** 条目已编写完成，**When** 我补充验证方式（测试或替代验证）并写清口径与失败信号，**Then** 审阅者可以复现验证过程。
2. **Given** 条目涉及 UX 或性能，**When** 我完成条目，**Then** 条目中明确包含一致性要求/指标口径 + 基线 + 目标(预算) + 验证方式。

---

### User Story 3 - 工具/方案对比与选型口径统一 (Priority: P3)

作为一名前端工程师，我可以把相似技术/工具/方案按统一维度产出对比结论（含边界与约束），从而在“选型题/替代方案题”
中给出一致且可解释的答案。

**Why this priority**: 面试高频出现“为什么选 A 不选 B”；统一口径能显著提升表达质量与决策可信度。

**Independent Test**: 查看任意一张对比矩阵，能从维度与结论推导出选型建议与边界条件。

**Acceptance Scenarios**:

1. **Given** 我选择一组相似方案进行对比，**When** 我按统一维度填写评估矩阵并给出结论，**Then** 结论包含约束前提、
   适用边界、风险与回滚策略。

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- 目标技术/工具数量过多导致信息噪音：如何分组、如何定义“核心”边界、如何逐步收敛范围？
- 条目之间出现术语冲突/同义不同名：如何保证命名与信息架构一致，避免“同一概念多种写法”？
- 条目缺少可验证证据（只有观点）：如何标记为不合规并提示补齐（测试/替代验证/可复现步骤）？
- 条目涉及性能/UX 但缺少指标口径/预算：如何阻止进入“完成态”，避免无法验收？
- 条目随时间过期（最佳实践变化/工具演进）：如何记录更新时间与影响范围，避免误导？

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: 系统 MUST 支持维护一份“核心技术与工具清单”（每项为一个条目），并能清晰区分“核心/熟悉/了解”等熟练度标记。
- **FR-002**: 每个条目 MUST 以统一结构描述：原则（Principles）、模式（Patterns）、最佳实践（Best Practices）、
  替代方案（Alternatives）、权衡（Trade-offs）与适用边界（Boundaries）。
- **FR-003**: 每个条目 MUST 包含“可自动化执行的验证方式”，二选一：
  - 自动化测试（任意合适层级）；或
  - 替代验证（可一键执行脚本/可运行示例/可复现验收步骤），并明确通过/失败信号。
- **FR-004**: 条目 MUST 提供“可复述稿”结构（CP-SO-L），确保在面试/评审中可在限定时间内完整表达。
- **FR-005**: 当条目涉及 UX/UI/交互时，条目 MUST 说明一致性要求（术语/命名/结构/a11y/错误态/空状态等）。
- **FR-006**: 当条目涉及性能时，条目 MUST 提供指标口径 + 基线 + 目标/预算 + 验证方式 + 副作用与回滚策略。
- **FR-007**: 系统 MUST 支持至少 2 张“选型评估矩阵”，用于统一回答相似方案对比与决策边界。

### Key Entities _(include if feature involves data)_

- **TechnologyEntry**: 一项技术/工具/方案的“能力条目”，包含：名称、类别、熟练度、原则、模式、最佳实践、替代方案、
  权衡与边界、验证方式、参考资料、最后更新时间。
- **Evidence**: 条目可验证证据的引用，包含：验证类型（测试/替代验证）、执行入口、口径说明、失败信号、产出物链接。
- **ComparisonMatrix**: 针对相似方案的对比条目集合，包含：对比维度、约束前提、结论与边界、风险与回滚建议。

## 技术点拆解与选型对比 _(mandatory)_

<!--
  本区块用于对齐项目宪章（constitution）中的“原理驱动理解 + 用户体验一致性 + 性能要求与预算 + 代码质量与可验证性”。
  输出必须可用于口述面试，并可被他人复述/验证。
-->

### 技术点拆解（必须覆盖）

- **是什么**：[一句话定义 + 核心机制/关键术语]
- **为什么用**：[解决的具体问题/约束]
- **替代方案**：[至少 2 个可选方案 + 适用边界]
- **性能/体验权衡**：[收益/成本/风险/回滚策略]
- **项目中的定制/优化**：[与简历项目绑定的真实实践]

### 选型评估矩阵（至少 2 张表）

示例维度（按题目增删）：开发体验、构建速度、产物体积、生态成熟度、迁移成本、团队掌握度、风险与回滚。

### 可手写核心实现（至少 1 段）

要求：明确输入/输出、边界条件、错误处理与兜底策略；允许伪代码，但必须可落地。
并且 MUST 提供可自动化执行的验证（自动化测试 或 可一键执行的替代验证脚本/可运行示例），写清验证口径与失败信号。

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 清单中 100% 的条目包含 FR-002~FR-004 的必填结构（可通过清单检查验证）。
- **SC-002**: 清单中 100% 的条目包含 FR-003 的“可自动化执行验证方式”，且具备明确的通过/失败信号。
- **SC-003**: 至少产出 12 个 TechnologyEntry 条目与至少 2 张 ComparisonMatrix。
- **SC-004**: 对清单 Top 5 条目，作者可在 2 分钟内按 CP-SO-L 结构完成一次完整复述（可通过录音/演练记录验证）。
