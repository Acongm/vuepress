---
description: 'Task list for translating resume skills into executable practice tasks'
---

# Tasks: 技术画像与实践任务（从简历到可复现经验）

**Input**: Design documents from `/specs/002-tech-stack-principles/` + `docs/job-description/web前端开发工程师-彭聪.md`  
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Tests are OPTIONAL unless explicitly requested. However, **verification is REQUIRED**: if you do not
include automated tests, you MUST include alternative verification tasks (runnable scripts/examples/check commands)
with clear pass/fail signals.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Constitution Gates**（来自 `.specify/memory/constitution.md`）：

- 每个 US 相关任务说明 SHOULD 指向真实上下文（简历项目/明确约束），本 feature 以 `docs/job-description/web前端开发工程师-彭聪.md` 为准
- 关键实现任务 MUST 包含：类型安全、错误边界、回归风险控制（必要时补充自测/验证任务）
- 关键路径 MUST 有可自动化执行的验证（测试 或 替代验证脚本/可运行示例），并在任务描述里写清口径与失败信号
- 涉及 UX/UI/交互的任务 SHOULD 写清一致性要求（术语/命名/结构/a11y/错误态/空状态）
- 涉及性能的任务 MUST 写清：指标口径、基线、验证方式、潜在副作用与兜底

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Knowledge artifacts: `interview-prep/*.md` (flat-first)
- Validation scripts: `tools/*.mjs` (Node.js standard library only)
- Feature design docs: `specs/002-tech-stack-principles/*`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 建立“技术画像 + 路线图 + 对比矩阵 + 验证入口”的最小骨架

- [x] T001 Create/confirm target docs in `interview-prep/` per plan (`interview-prep/tech-profile__index.md`, `interview-prep/roadmap__skill-growth.md`, `interview-prep/matrix__tech-compare-*.md`)
- [x] T002 [P] Create `interview-prep/tech-profile__index.md` (目录骨架：分组/熟练度分层/导航/条目清单/证据入口约定)
- [x] T003 [P] Create `interview-prep/roadmap__skill-growth.md` (周迭代模板 + 月/季度复盘机制 + 验收口径)
- [x] T004 Create `interview-prep/tech-profile__entries.json` (TechnologyEntry 数组容器，后续由脚本校验)
- [x] T005 [P] Create `interview-prep/matrix__tech-compare-bundlers.md` (Webpack/Rollup/Vite/Rspack 选型矩阵骨架)
- [x] T006 [P] Create `interview-prep/matrix__tech-compare-micro-frontend.md` (qiankun/iframe/web-component/module-federation 对比矩阵骨架)
- [x] T007 Add cross-links between `interview-prep/tech-profile__index.md` and the 2 matrix files (互相引用，避免孤岛)
- [x] T008 Create `tools/validate-tech-profile.mjs` placeholder with CLI usage comment (node >=18)
- [x] T009 Update `tools/README.md` adding a “Tech Profile Validation” section with command `node tools/validate-tech-profile.mjs`
- [x] T010 Define “pass/fail signals” in `tools/README.md` (e.g., exit code 0/1 + stdout summary)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 建立可复现的“验证闭环”，让条目/矩阵/路线图可持续迭代且不漂移

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Implement JSON loading + basic schema-like validation in `tools/validate-tech-profile.mjs` (required fields, enums, date format; no external deps)
- [x] T012 Implement link validation in `tools/validate-tech-profile.mjs` for referenced markdown files under `interview-prep/` (missing file => fail)
- [x] T013 Implement “evidence validation” in `tools/validate-tech-profile.mjs` (howToRun non-empty + success/failure signal non-empty)
- [x] T014 Implement “resume anchor validation” in `tools/validate-tech-profile.mjs` (each entry must cite a resume section id string like `resume:dji-rms` or `resume:user-center`)
- [x] T015 Add a runnable help/usage output in `tools/validate-tech-profile.mjs` (e.g., `--help`, default file paths)
- [x] T016 Add a fast smoke-check command in `tools/README.md` (e.g., `node tools/validate-tech-profile.mjs --file interview-prep/tech-profile__entries.json`)
- [x] T017 Add “non-negotiable rules” comment block at top of `interview-prep/tech-profile__entries.json` (字段含义 + 如何扩展)
- [x] T018 Add a minimal example entry in `interview-prep/tech-profile__entries.json` that references resume + matrix (用作模板)

**Checkpoint**: 运行 `node tools/validate-tech-profile.mjs` 可对空/半成品给出明确失败原因

---

## Phase 3: User Story 1 - 生成“技术画像”目录 (Priority: P1) 🎯 MVP

**Goal**: 把简历中“日常职责/技术挑战/解决方案/结果”转成可复述的技术画像条目，并在目录中可检索、可导航

**Independent Test**: 打开 `interview-prep/tech-profile__index.md`，随机抽取 1 个条目，在 `interview-prep/tech-profile__entries.json`
中能找到对应数据，且结构完整（principles/patterns/bestPractices/alternatives/tradeOffs/boundaries/verification/cpsol）。

### Implementation for User Story 1

- [x] T019 [US1] Define categories + proficiency rubric in `interview-prep/tech-profile__index.md` (core/strong/working/aware 的判定标准)
- [x] T020 [US1] Add resume anchors in `interview-prep/tech-profile__index.md` (映射：用户中心、RMS、公告插件、DevOps、XDR)

- [x] T021 [P] [US1] Add TechnologyEntry “React 18 架构与状态治理” to `interview-prep/tech-profile__entries.json` referencing `resume:dji-rms` and `resume:xdr`
- [x] T022 [P] [US1] Add TechnologyEntry “TypeScript 类型安全与边界设计” to `interview-prep/tech-profile__entries.json` referencing `resume:dji-rms`
- [x] T023 [P] [US1] Add TechnologyEntry “Webpack 构建与发布治理” to `interview-prep/tech-profile__entries.json` referencing `resume:dji-rms`
- [x] T024 [P] [US1] Add TechnologyEntry “Vite 迁移与性能体验” to `interview-prep/tech-profile__entries.json` referencing `resume:user-center`
- [x] T025 [P] [US1] Add TechnologyEntry “Rollup 打包与 Tree Shaking” to `interview-prep/tech-profile__entries.json` referencing `resume:announce-plugin`
- [x] T026 [P] [US1] Add TechnologyEntry “微前端 qiankun 治理” to `interview-prep/tech-profile__entries.json` referencing `resume:devops`
- [x] T027 [P] [US1] Add TechnologyEntry “性能优化（LCP/首屏/万级数据秒开）” to `interview-prep/tech-profile__entries.json` referencing `resume:user-center`
- [x] T028 [P] [US1] Add TechnologyEntry “组件体系与 Ant Design 二次封装” to `interview-prep/tech-profile__entries.json` referencing `resume:dji-rms`
- [x] T029 [P] [US1] Add TechnologyEntry “低代码平台工程实践” to `interview-prep/tech-profile__entries.json` referencing `resume:dji-rms` and `resume:xdr`
- [x] T030 [P] [US1] Add TechnologyEntry “CI/CD 与 Docker 流水线” to `interview-prep/tech-profile__entries.json` referencing `resume:devops`
- [x] T031 [P] [US1] Add TechnologyEntry “NestJS 全栈交付与定时任务” to `interview-prep/tech-profile__entries.json` referencing `resume:xdr`
- [x] T032 [P] [US1] Add TechnologyEntry “ECharts 可视化与大屏性能” to `interview-prep/tech-profile__entries.json` referencing `resume:xdr`

- [x] T033 [US1] Populate `interview-prep/tech-profile__index.md` with links to the 12 entries (按类别分组 + Top 5 面试高频清单)
- [x] T034 [US1] Add a “2-minute drill” section to `interview-prep/tech-profile__index.md` listing Top 5 entries + rehearsal checklist

**Checkpoint**: `node tools/validate-tech-profile.mjs` 对 US1 条目通过；目录可在 60 秒内定位任意条目

---

## Phase 4: User Story 2 - 条目可验证与可审阅 (Priority: P2)

**Goal**: 为每个条目补齐可复现证据与审阅口径，把“会讲”升级为“能验证”

**Independent Test**: 随机抽取任意 1 个条目，执行其 `verification.howToRun` 能得到明确 pass/fail 信号（exit code + 文本提示）。

### Implementation for User Story 2

- [x] T035 [P] [US2] For entries that mention performance, add perfNotes (metric/baseline/budget/method/risks/rollback) in `interview-prep/tech-profile__entries.json` referencing resume metrics (e.g., LCP 2.3s→1.4s, 首屏<1.5s)
- [x] T036 [P] [US2] For entries that mention UX/UI, add uxNotes (a11y/错误态/空状态/一致性) in `interview-prep/tech-profile__entries.json`
- [x] T037 [US2] Add a “review checklist” section in `interview-prep/tech-profile__index.md` (结构完整性/边界声明/证据可复现/风险与回滚)
- [x] T038 [US2] Implement “summary report” output in `tools/validate-tech-profile.mjs` (counts by proficiency/category + missing fields list)
- [x] T039 [US2] Add `--strict` mode to `tools/validate-tech-profile.mjs` (any warning => fail; default: warnings allowed)

- [x] T040 [P] [US2] Create `examples/perf-lcp-skeleton/README.md` describing skeleton prerender approach + measurement method + rollback note
- [x] T041 [P] [US2] Create `examples/bundling-treeshake/README.md` describing Rollup tree-shaking verification steps + size budget (<15KB) note
- [x] T042 [P] [US2] Create `examples/micro-frontend-isolation/README.md` describing qiankun isolation checklist (css/js/global side effects) + verification steps

- [x] T043 [US2] Update `tools/README.md` with “Examples as Evidence” section pointing to `examples/*/README.md` and how they satisfy verification

**Checkpoint**: `node tools/validate-tech-profile.mjs --strict` 对所有条目通过；每条目有可复现证据入口

---

## Phase 5: User Story 3 - 工具/方案对比与选型口径统一 (Priority: P3)

**Goal**: 把“选型题”沉淀为矩阵 + 结论 + 边界 + 回滚，提升面试决策题稳定性

**Independent Test**: 查看任意一张对比矩阵，能明确得出：在什么约束下选什么、为什么、风险是什么、怎么回滚。

### Implementation for User Story 3

- [x] T044 [US3] Fill `interview-prep/matrix__tech-compare-bundlers.md` with dimensions + constraints + conclusion + rollback (link to related entries ids)
- [x] T045 [US3] Fill `interview-prep/matrix__tech-compare-micro-frontend.md` with isolation/communication/deploy/perf dimensions + conclusion + rollback
- [x] T046 [P] [US3] Add “testing strategy matrix” section to `interview-prep/matrix__tech-compare-bundlers.md` (what to verify at build-time/runtime)
- [x] T047 [P] [US3] Add “org/process constraints” section to both matrix files (团队规模/遗留系统/插件生态/合规/发布频率)
- [x] T048 [US3] Update `interview-prep/tech-profile__index.md` to link matrices under a “Decision Playbooks” heading

**Checkpoint**: 2 张矩阵都能在 3 分钟内被复述（约束 → 维度 → 结论 → 风险/回滚），并与条目互链

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: 让任务体系可持续迭代、可复盘、可升级

- [x] T049 Add monthly review template to `interview-prep/roadmap__skill-growth.md` (新增/淘汰条目、趋势追踪、薄弱项变化)
- [x] T050 Add quarterly retro template to `interview-prep/roadmap__skill-growth.md` (Top5 变更原因、证据质量、回滚案例)
- [x] T051 Add “practice log” section to `interview-prep/roadmap__skill-growth.md` (每周一次 2 分钟口述演练记录)
- [x] T052 Add a “naming conventions” section to `interview-prep/tech-profile__index.md` (术语一致性、文件命名、引用规范)
- [x] T053 Run validation and record output snapshot in `interview-prep/tech-profile__index.md` (粘贴一次 summary 结果作为基线证据)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2)
- **US2 (P2)**: Depends on US1 (needs entries to attach evidence/perf/ux notes)
- **US3 (P3)**: Depends on US1 (matrices link to entries; can proceed in parallel with US2 after US1)

### Parallel Opportunities

- Phase 1: T002/T003/T005/T006/T008 can run in parallel
- US1: T021~T032 can run in parallel
- US2: T035/T036/T040~T042 can run in parallel
- US3: T046/T047 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Parallel: author 12 entries in JSON in parallel (different sections / reviewers)
Task: "T021 [US1] Add React 18 entry in interview-prep/tech-profile__entries.json"
Task: "T025 [US1] Add Rollup tree-shaking entry in interview-prep/tech-profile__entries.json"
Task: "T030 [US1] Add CI/CD entry in interview-prep/tech-profile__entries.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 + Phase 2 (skeleton + validator)
2. Complete US1 with Top 5 entries first (React/TS/Webpack/性能/微前端)
3. Run `node tools/validate-tech-profile.mjs` and fix failures
4. Stop and do one 2-minute rehearsal per Top 5 entry

### Incremental Delivery

1. US1: expand to 12 entries + index navigation
2. US2: add evidence + strict validation mode + examples README
3. US3: finalize matrices + link to entries + rehearse decision playbooks
