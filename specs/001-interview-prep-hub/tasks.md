---
description: 'Task list template for feature implementation'
---

# Tasks: 高级前端面试准备中枢（纯 Markdown + 自包含）

**Input**: Design documents from `/specs/001-interview-prep-hub/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 本特性未要求 TDD/测试框架；以“可运行命令 + 人工验收步骤”作为验证方式。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Constitution Gates**（来自 `.specify/memory/constitution.md`）：

- 每个 US 相关任务说明 SHOULD 指向真实上下文（简历项目/明确约束）
- 关键实现任务 MUST 包含：类型安全、错误边界、回归风险控制（必要时补充自测/验证任务）
- 涉及性能的任务 MUST 写清：指标口径、基线、验证方式、潜在副作用与兜底

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- 本项目为“文档化 + Node 脚本”单仓库：知识单元位于仓库根目录 `interview-prep/`（扁平），脚本位于 `tools/`，示例位于 `examples/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 初始化目录与基础文档骨架（无外部依赖、可版本化）

- [x] T001 Create feature root structure in repo root: `interview-prep/`, `tools/`, `examples/`, plus `examples/README.md`
- [x] T002 [P] Add `tools/README.md` describing how to run scripts with Node >= 18 and the “no external deps” rule
- [x] T003 [P] Add `interview-prep/README.md` explaining flat-structure rule, naming convention, and how to contribute new units
- [x] T004 [P] Add `interview-prep/.gitkeep` only if needed (avoid empty dir issues)
- [x] T005 [P] Add `.editorconfig` update or notes (if repo already has one, add guidance to `interview-prep/README.md`) to keep Markdown formatting consistent

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 定义文件契约、模板与增量生成规则（阻塞所有 user story）

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create `interview-prep/INDEX.md` skeleton (outline + mastery checkboxes + priority section)
- [x] T007 [P] Create template `interview-prep/TECH_TEMPLATE.md` per contract in `specs/001-interview-prep-hub/contracts/knowledge-unit-contract.md`
- [x] T008 [P] Create template `interview-prep/PROJECT_TEMPLATE.md` per contract in `specs/001-interview-prep-hub/contracts/knowledge-unit-contract.md`
- [x] T009 [P] Create template `interview-prep/MATRIX_TEMPLATE.md` per contract in `specs/001-interview-prep-hub/contracts/knowledge-unit-contract.md`
- [x] T010 [P] Create template `interview-prep/QNA_TEMPLATE.md` per contract in `specs/001-interview-prep-hub/contracts/knowledge-unit-contract.md`
- [x] T011 Implement `tools/generate-interview-prep.mjs` CLI skeleton (Node stdlib only) with subcommands: `generate`, `index`, `reorder`, `blindspots`
- [x] T012 Implement “AUTO-GENERATED block” safe update utility in `tools/generate-interview-prep.mjs` (preserve manual content outside markers)
- [x] T013 Implement validation command `node tools/generate-interview-prep.mjs validate` to enforce:
  - `interview-prep/` flat rule (no subdirs)
  - required frontmatter fields (`id/type/title/mastery`)
  - filename prefix matches `type`
- [x] T014 [P] Add `specs/001-interview-prep-hub/quickstart.md` with step-by-step verification commands for US1/US2/US3 and examples

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 简历驱动的知识单元生成 (Priority: P1) 🎯 MVP

**Goal**: 从简历与参考大纲生成扁平知识单元（项目/技术/矩阵）并支持增量更新且可追溯

**Independent Test**:

- 运行 `node tools/generate-interview-prep.mjs generate` 后，`interview-prep/` 生成/更新若干 `.md` 文件
- 每个文件包含 frontmatter + AUTO-GENERATED 区块 + 模板字段标题
- 人工区块内容在重复生成后不被覆盖

### Implementation for User Story 1

- [x] T015 [P] [US1] Create 5 project units (skeletons) in `interview-prep/project__*.md` with `source_refs` pointing to `docs/job-description/web前端开发工程师-彭聪.md`
- [x] T016 [P] [US1] Create initial tech units in `interview-prep/tech__*.md` for: react, typescript, webpack, vite, rollup, micro-frontend-qiankun
- [x] T017 [P] [US1] Create 3 matrix units in `interview-prep/matrix__*.md`:
  - `matrix__bundler-webpack-vite-rollup.md`
  - `matrix__monorepo-lerna-nx.md`
  - `matrix__form-formily-rjsf-custom.md`
- [x] T018 [US1] Implement resume parser (best-effort) in `tools/generate-interview-prep.mjs` to extract:
  - project titles, time ranges, role, stack, scale/outcomes (from `docs/job-description/web前端开发工程师-彭聪.md`)
- [x] T019 [US1] Implement outline seed parser in `tools/generate-interview-prep.mjs` to extract topic headings from `docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md` and map them into `seed_refs`
- [x] T020 [US1] Implement `generate` to upsert knowledge unit files:
  - create file if missing
  - update AUTO-GENERATED block (摘要/提取结果/建议追问)
  - preserve manual sections
- [x] T021 [US1] Implement `generate` to ensure duplicates are handled:
  - same tech across projects aggregated via `projects` array
  - avoid creating multiple files for same `id`
- [x] T022 [US1] Implement `index` command to regenerate `interview-prep/INDEX.md` from current units (stable ordering + sections by type)
- [x] T023 [US1] Add clear error handling in `tools/generate-interview-prep.mjs` for missing/invalid input files (exit code + actionable message)
- [x] T024 [US1] Add a “manual zone” convention in templates (e.g. `## 我的补充（Manual）`) and document it in `interview-prep/README.md`
- [x] T025 [US1] Validate acceptance scenario “incremental update does not overwrite manual content” by editing a manual section and re-running `generate` (document steps in `specs/001-interview-prep-hub/quickstart.md`)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 可重排的演练主界面与卡片详情（Markdown 版） (Priority: P2)

**Goal**: 用 Markdown 形式实现“时间线/项目卡片总览 + 优先级调整 + 四模块详情结构”，替代 Web UI/拖拽实现

**Independent Test**:

- `interview-prep/INDEX.md` 可作为“主界面”浏览（按项目时间线/优先级清单）
- 通过命令或编辑实现重排后，重新生成 index 仍保持顺序
- 打开任意 unit 文件可看到四模块（原理/对比/问答/手写）并能从 INDEX 跳转定位

### Implementation for User Story 2

- [x] T026 [US2] Define INDEX sections in `interview-prep/INDEX.md`: Timeline (projects), Priority Queue (mixed), Tech Index, Matrix Index, Blindspots link
- [x] T027 [US2] Implement `reorder` command in `tools/generate-interview-prep.mjs` to move an `id` before/after another `id` inside `interview-prep/INDEX.md`
- [x] T028 [US2] Persist ordering by storing `priority` in frontmatter for each unit OR by storing an order list in `interview-prep/INDEX.md` (choose one and document in `interview-prep/README.md`)
- [x] T029 [P] [US2] Ensure each knowledge unit file contains the fixed four modules headings:
  - `## 原理简述` / `## 对比表格` / `## 模拟问答` / `## 手写代码区`
- [x] T030 [US2] Add cross-links from `interview-prep/INDEX.md` into each unit file anchors (markdown links) so “卡片展开”可通过跳转实现
- [x] T031 [US2] Document the “no web UI” boundary and rationale (CP-SO-L) in `interview-prep/README.md` (align with your 极简策略)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 面试官视角自测与盲区闭环（Markdown 版） (Priority: P3)

**Goal**: 为每个 unit 提供“面试官视角追问 + 自测标记”，并汇总生成盲区清单，支持回链到具体卡片

**Independent Test**:

- 在任意 `interview-prep/tech__*.md` 或 `project__*.md` 中勾选/标记“待补齐”问题
- 运行 `node tools/generate-interview-prep.mjs blindspots` 后生成/更新 `interview-prep/BLINDSPOTS.md`
- `BLINDSPOTS.md` 中每条盲区都能回链到对应 unit 的锚点

### Implementation for User Story 3

- [x] T032 [P] [US3] Add “面试官追问” section format to templates and existing units (checkbox questions + recommended CP-SO-L outline)
- [x] T033 [US3] Define question status convention (e.g., `[ ] TODO`, `[x] OK`, `[!] HighRisk`) and document in `interview-prep/README.md`
- [x] T034 [US3] Implement `blindspots` command in `tools/generate-interview-prep.mjs` to scan units and generate `interview-prep/BLINDSPOTS.md`
- [x] T035 [US3] Implement `mastery` sync rule: `mastery` in frontmatter should reflect progress (optional auto-update or “manual only”; pick one and document)
- [x] T036 [US3] Add “复盘与反思（Learnings）” mandatory subsection in each unit to support “如果重做会怎么改？”

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Examples（可执行验证）

**Purpose**: 将关键主题落成最小可运行示例（Node 标准库，无依赖）

- [x] T037 [P] Create `examples/umd-esm-dual-output/README.md` + minimal code demonstrating UMD wrapper vs ESM module import (Node + browser instructions)
- [x] T038 [P] Create `examples/remote-module-loading/README.md` + minimal loader demonstrating “remote module” concept with local file URL / data URL (no network dependency)
- [x] T039 [P] Create `examples/no-deps-form-renderer/README.md` + minimal schema-to-html renderer (string output) to validate “无依赖表单渲染”
- [x] T040 Add a top-level `examples/README.md` index that links to each example and explains how it supports interview “handwrite” verification

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: 稳定性、可维护性、可检索性与长期演进能力

- [x] T041 [P] Add doc note on “边界声明” and “错误处理/兜底” checklist to `interview-prep/TECH_TEMPLATE.md` and `PROJECT_TEMPLATE.md`
- [x] T042 Add “performance responsibility” fields to relevant units (e.g., performance topics) with metric baseline + verification steps in `interview-prep/tech__performance.md` (new file)
- [x] T043 [P] Add `tools/generate-interview-prep.mjs` usage help (`--help`) with examples for all subcommands
- [x] T044 Run `node tools/generate-interview-prep.mjs validate` and fix any violations (flat rule, missing frontmatter, wrong prefix)
- [x] T045 Run quickstart validation steps in `specs/001-interview-prep-hub/quickstart.md` and adjust docs/scripts for smooth DX

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Examples (Phase 6)**: Depends on Foundational completion; can be done in parallel with US2/US3
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 outputs (units + index) but should be independently usable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 units; integrates with INDEX/commands but should remain independently testable

### Within Each User Story

- Templates/contract first
- Generator utilities before generation
- Generation before index aggregation
- Index before reorder/blindspots
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel
- Template creation tasks [P] can run in parallel
- Initial unit skeleton files [P] can run in parallel
- Examples [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# 并行创建初始单元文件（不同文件，无依赖）：
Task: "Create `interview-prep/project__dji-user-center.md`"
Task: "Create `interview-prep/project__dji-rms.md`"
Task: "Create `interview-prep/tech__react.md`"
Task: "Create `interview-prep/matrix__bundler-webpack-vite-rollup.md`"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run `generate` + `index` and verify incremental update safety

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → 知识单元可生成/更新（MVP）
3. Add US2 → INDEX 作为“主界面” + 可重排优先级
4. Add US3 → 自测标记 + 盲区闭环
5. Add Examples → 关键主题可执行验证

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- 每个 Story 完成后 SHOULD 增加 1 个“口述演练”任务：用 CP-SO-L 结构复述方案并补齐边界声明
