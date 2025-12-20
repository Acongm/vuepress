# Feature Specification: 高级前端面试准备中枢

**Feature Branch**: `001-interview-prep-hub`  
**Created**: 2025-12-20  
**Status**: Draft  
**Input**: 用户描述：通过简历自动提取关键技术栈与项目经历，生成结构化知识卡片与选型对比矩阵，支持
项目深度还原与“面试官视角”自测，并提供可拖拽排序的演练主界面；所有知识单元为非嵌套扁平结构，
支持拆分为一个文件夹内的多个 Markdown 文件以便逐步细化与查漏补缺。

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

### User Story 1 - 简历驱动的知识单元生成 (Priority: P1)

作为候选人，我希望把简历（Markdown）导入/引用为输入源，系统能自动提取“项目经历 + 技术栈 + 关键指标/
业务价值”，并按“扁平知识单元”生成一组可检索、可演练、可持续迭代的 Markdown 产物。

**Why this priority**: 没有“结构化可持续维护的知识底座”，后续演练界面/自测都无法落地；该故事单独实现
即可形成 MVP（从项目梳理知识体系并能快速查漏补缺）。

**Independent Test**: 在仓库内指定简历文件作为输入源，触发一次“生成/更新知识单元”，验证目标文件夹内
产生/更新一组 Markdown 文件，且内容覆盖简历中的项目与技术点，结构可被独立浏览与检索。

**Acceptance Scenarios**:

1. **Given** 存在 `docs/job-description/web前端开发工程师-彭聪.md`，**When** 触发一次知识单元生成，
   **Then** 输出目录中生成“项目单元 + 技术单元 + 对比矩阵单元”，并包含可追溯到简历段落的引用/摘要。
2. **Given** 简历内容发生变更（新增项目/调整技术栈），**When** 再次触发生成，**Then** 既有单元被增量
   更新（不丢失人工补充内容），新增内容被识别并补齐占位结构。

---

### User Story 2 - 可拖拽的演练主界面与卡片详情 (Priority: P2)

作为候选人，我希望在一个主界面通过“时间线/项目卡片”浏览准备内容，并能通过拖拽调整优先级；每张卡片
展开后都提供统一的四区块：原理简述、对比表格、模拟问答、手写代码区，从而形成一致的演练体验。

**Why this priority**: 这决定了复习的效率与节奏控制；但在没有知识单元产物的前提下无法验证，因此排 P2。

**Independent Test**: 在已有知识单元文件的基础上，打开主界面即可看到项目/技术卡片；拖拽后优先级发生
变化并可在下次打开时保持；展开任意卡片可看到四个模块均有内容占位或实际内容。

**Acceptance Scenarios**:

1. **Given** 已存在若干项目卡片，**When** 拖拽调整顺序并刷新/重新进入，**Then** 顺序保持一致。
2. **Given** 用户打开任一项目卡片，**When** 展开详情，**Then** 固定出现四个模块且可跳转到对应
   Markdown 内容来源（或提示待补全）。

---

### User Story 3 - 面试官视角自测与盲区闭环 (Priority: P3)

作为候选人，我希望针对每个项目/技术点获得“面试官视角”的追问清单，并能自测记录（标记已掌握/待补齐/
高风险盲区）；系统应能把盲区回链到对应知识单元，驱动我继续补完并形成闭环。

**Why this priority**: 自测闭环能显著提升准备质量，但需要在内容与界面存在后才能形成有效数据，因此排 P3。

**Independent Test**: 选中一个项目或技术点，能看到一组结构化问题；对问题进行标记后能生成“待补齐清单”，
并可跳回对应知识卡片的位置继续补充。

**Acceptance Scenarios**:

1. **Given** 用户进入某个技术点的模拟问答模块，**When** 标记 2 个问题为“待补齐”，**Then** 系统生成
   一条可检索的“盲区清单”，并能一键定位到该技术点知识卡片。
2. **Given** 用户完成补齐并将问题标记为“已掌握”，**When** 再次查看盲区清单，**Then** 该问题从清单中
   移除或变为已完成状态。

---

如需扩展更多用户故事，请按优先级（P1/P2/P3...）追加，并保证每个故事可独立验收。

### Edge Cases

- 简历文件缺失/路径错误时如何提示与回退？
- 简历格式不规范（缺失标题/时间/技术栈字段）时是否仍能生成可用占位卡片？
- 同一技术在多个项目重复出现：如何去重/聚合，同时保留项目上下文差异？
- 输出文件存在人工补充内容时，二次生成如何避免覆盖或冲突？
- 卡片数量过多时，如何保证检索/渲染可用（例如分页、过滤、按优先级视图）？
- 拖拽排序存在并发/多端差异时，如何保证最终一致性与冲突提示？
- “面试官追问”生成内容质量不足时，如何允许人工编辑与版本演进？

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: 系统 MUST 支持以“简历 Markdown 文件”为输入源，并能从中提取项目列表、时间范围、角色、技术栈、
  规模指标、业务价值与技术亮点。
- **FR-002**: 系统 MUST 支持从“候选人关注清单”补充额外技术主题（例如 Backstage 插件体系、TSDX、远程模块加载等），
  即使简历中未直接出现，也必须能生成对应知识单元占位结构。
- **FR-003**: 系统 MUST 将所有知识单元组织为**非嵌套扁平结构**（一级分类），并为每个单元分配稳定唯一标识，
  便于检索、引用与跨文件跳转。
- **FR-004**: 系统 MUST 将整理产物输出到同一文件夹内的多个 Markdown 文件，支持按“项目/技术/对比矩阵/问答”等
  不同单元类型拆分，并允许逐步细化与持续补全。
- **FR-005**: 系统 MUST 为每个“技术知识卡片”生成结构化内容骨架：核心机制、源码关键路径（以概念层级描述，不绑定
  特定仓库）、生命周期（如适用）、常见陷阱与排查路径。
- **FR-006**: 系统 MUST 生成至少 3 张选型对比矩阵（可扩展），并且每个矩阵必须明确：候选人项目上下文中的业务驱动
  因素、技术权衡、风险与回滚/迁移策略。
- **FR-007**: 系统 MUST 提供主界面按“时间线/项目卡片”展示所有知识单元，并支持拖拽重排优先级；优先级 MUST 在
  再次打开时保持一致。
- **FR-008**: 每个卡片展开后 MUST 提供四个模块：原理简述、对比表格、模拟问答、手写代码区；并能从界面回链到对应
  Markdown 单元的内容位置（或提示待补全）。
- **FR-009**: 系统 MUST 为每个项目与关键技术点提供“面试官视角”追问清单，并支持用户对问题进行自测标记（已掌握/待补齐/
  高风险）；标记结果 MUST 可检索并能回链到知识单元。
- **FR-010**: 系统 MUST 支持快速检索/过滤（按项目、技术主题、优先级、自测状态），以保证卡片数量增长后仍可用。

### Assumptions

- 默认使用场景为单人离线准备（不包含多用户协作、登录权限与审计需求）。
- 默认“知识单元 Markdown 文件”作为主要交付物与长期维护载体（便于版本化、检索与渐进补全）。

### Key Entities _(include if feature involves data)_

- **ResumeSource**: 简历输入源（路径/版本、解析状态、最近一次生成时间）
- **Project**: 项目单元（时间范围、角色、规模/指标、技术栈、业务价值、关键决策点）
- **TechnologyTopic**: 技术主题（名称、关联项目、知识卡片结构字段、常见陷阱）
- **KnowledgeUnit**: 知识单元（稳定 ID、类型：项目/技术/对比/问答、内容文件引用、标签）
- **ComparisonMatrix**: 选型矩阵（候选方案集合、评估维度、结论、上下文约束与风险）
- **InterviewQuestion**: 追问条目（所属单元、问题、参考要点、难度、状态）
- **PracticeState**: 演练状态（优先级顺序、自测标记、完成度）

## 技术点拆解与选型对比 _(mandatory)_

<!--
  本区块用于对齐项目宪章（constitution）中的“原理驱动理解 + 表达一致性 + 性能责任 + 可手写实现”。
  输出必须可用于口述面试，并可被他人复述/验证。
-->

### 技术点拆解（必须覆盖）

- **是什么**：将“技术主题”落成标准化知识卡片与口述结构，覆盖机制/生命周期/陷阱等。
- **为什么用**：把简历项目经验转化为可检索、可演练、可复盘的知识体系，避免碎片化复习。
- **替代方案**：手工维护文档（成本高且不一致）；使用外部题库/笔记软件（缺少项目上下文与可追溯性）。
- **性能/体验权衡**：自动生成提升覆盖率但可能牺牲精确度；因此必须提供“可编辑/可补全”的演进路径与盲区闭环。
- **项目中的定制/优化**：聚焦简历项目（用户中心、RMS、公告插件、DevOps、XDR）并以指标/规模作为“追问入口”。

建议首批覆盖主题（可扩展）：

- React、TypeScript、Webpack、Ant Design
- Rollup、Vite、工程化（ESLint/CI/CD、组件复用）
- 微前端（qiankun）、插件体系（跨系统公告插件）
- 性能优化（LCP/首屏/包体积/运行时）、全栈协作（NestJS）
- 额外关注：Lerna vs Nx、表单方案对比、Backstage 插件体系、远程模块加载、TSDX（作为“关注清单”）

### 选型评估矩阵（至少 2 张表）

必须包含（至少 3 张）：

- 构建工具：Webpack vs Vite vs Rollup
- Monorepo：Lerna vs Nx
- 表单方案：Formily vs RJSF vs 自研无依赖表单方案

每张矩阵维度建议包含：开发体验、构建速度、产物体积、生态成熟度、迁移成本、团队掌握度、风险与回滚。

### 可手写核心实现（至少 1 段）

要求：明确输入/输出、边界条件、错误处理与兜底策略；允许伪代码，但必须可落地。

建议首批手写主题（示例）：

- “插件热插拔加载”的生命周期与隔离边界（基于公告插件系统经验）
- “微前端路由/资源加载”的核心流程（基于 qiankun 类场景）
- “构建产物拆分与动态加载”的关键决策点（与性能指标绑定）

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 用户可在 10 分钟内完成“从简历生成知识单元”，并在生成结果中看到至少 5 个项目单元与 15 个技术主题单元。
- **SC-002**: 用户能在 60 秒内找到任意一个目标技术点（通过检索/过滤/卡片跳转）并进入演练视图。
- **SC-003**: 每个技术主题知识卡片的结构字段完整率达到 90%（机制/关键路径/生命周期/陷阱/排查路径至少有占位或内容）。
- **SC-004**: 用户能在 30 分钟内完成一次“项目深度还原”自测（至少 10 个问题标记），并自动形成可追踪的盲区清单。
