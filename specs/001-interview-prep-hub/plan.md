# Implementation Plan: 高级前端面试准备中枢（纯 Markdown + 自包含）

**Branch**: `001-interview-prep-hub` | **Date**: 2025-12-20 | **Spec**: `specs/001-interview-prep-hub/spec.md`
**Input**: `docs/job-description/web前端开发工程师-彭聪.md`（唯一输入源） +
`docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md`（参考种子）

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

目标：基于简历与既有面试技术大纲，构建一套**极简、聚焦、自包含**的本地复习体系：

- **工具链极简**：不引入 Web 应用、数据库或复杂构建系统；以“纯 Markdown + 目录/文件命名规范”作为唯一载体
- **扁平知识库**：所有知识单元（项目/技术/对比矩阵/问答）均为一级文件，无嵌套分类，便于检索与版本化
- **可追溯**：每个知识单元必须能回链到简历段落（source refs）或大纲条目（seed refs）
- **可演练**：每个知识单元统一模板字段（原理/替代/权衡/问答/手写代码），并能标记掌握度
- **可落地验证**：关键主题提供最小可运行示例（`examples/`），用纯 Node 运行（无外部依赖）

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Markdown + Node.js（仅用于无依赖脚本与 examples；Node 版本：>= 18）  
**Primary Dependencies**: 无（禁止引入外部依赖；仅使用 Node 标准库）  
**Storage**: 本地文件系统（Markdown 文件 + YAML frontmatter）  
**Testing**: N/A（本阶段不引入测试框架；示例通过可运行命令验证）  
**Target Platform**: 本地开发机（macOS/Windows/Linux 均可）  
**Project Type**: 单仓库文档化项目（知识库 + examples + 可选脚本）  
**Performance Goals**: 60 秒内通过检索/索引定位任意技术点；知识单元规模增长后仍可快速 grep/搜索  
**Constraints**: 不使用数据库/服务端/前端 Web 应用；知识单元必须扁平化；支持增量更新且不覆盖人工补充  
**Scale/Scope**: 初始覆盖 5 个项目 + 15~30 个技术主题 + 3 张选型矩阵 + 20~60 条追问题目，后续可扩展

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

将以下门禁逐条写成“可检查”的结论（通过/不通过 + 证据链接/段落引用）：

- **上下文绑定**：通过。输入源明确限定为 `docs/job-description/web前端开发工程师-彭聪.md`，每个知识单元都要求
  `source_refs` 指向简历项目段落（见 `spec.md` FR-001/FR-004）。
- **原理拆解**：通过。所有技术卡片强制包含五段式拆解（是什么/为什么/替代/权衡/项目定制），并以模板字段固化
  （见 `spec.md` “技术点拆解与选型对比”）。
- **可手写实现**：通过。关键主题必须提供“手写核心实现”以及 `examples/` 最小可运行示例（见 `spec.md` FR-008
  与本 plan 的结构设计）。
- **表达结构**：通过。知识卡片与项目卡片模板中固定 CP-SO-L 段落，并要求边界声明字段（见 contracts/ 模板约束）。
- **性能责任**：通过。凡涉及性能主题必须填写指标口径/基线/验证/副作用兜底（种子来源为
  `web前端开发工程师-彭聪-面试技术大纲.md` 的指标体系）。

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
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
interview-prep/                 # 扁平知识库（所有知识单元一级文件，无子目录）
├── INDEX.md                     # 总大纲 + 掌握度标记（checkbox + mastery 字段）
├── TECH_TEMPLATE.md             # 技术知识卡片模板（强制字段）
├── PROJECT_TEMPLATE.md          # 项目深度还原模板（强制字段）
├── MATRIX_TEMPLATE.md           # 选型对比矩阵模板（强制字段）
├── QNA_TEMPLATE.md              # 面试官追问/模拟问答模板（强制字段）
├── project__dji-user-center.md
├── project__dji-rms.md
├── project__announce-plugin.md
├── project__dji-devops.md
├── project__xdr-dashboard-report.md
├── tech__react.md
├── tech__typescript.md
├── tech__webpack.md
├── tech__vite.md
├── tech__rollup.md
├── tech__micro-frontend-qiankun.md
├── matrix__bundler-webpack-vite-rollup.md
├── matrix__monorepo-lerna-nx.md
└── matrix__form-formily-rjsf-custom.md

examples/                       # 最小可运行示例（可嵌套；不要求扁平）
├── README.md
├── umd-esm-dual-output/
├── remote-module-loading/
└── no-deps-form-renderer/

tools/                          # 无依赖脚本（Node 标准库）
├── README.md
└── generate-interview-prep.mjs # 从简历与大纲生成/增量更新知识单元（保留人工区块）
```

**Structure Decision**: 选择“纯 Markdown 扁平知识库 + Node 无依赖脚本 + examples 可运行示例”的结构。
知识单元全部落在 `interview-prep/` 根目录以满足“非嵌套扁平结构”；`tools/` 与 `examples/` 用于生成与验证，
不属于知识单元分类范围。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

本计划无门禁违规项，无需复杂度豁免表。
