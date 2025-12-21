# Data Model: 技术画像与路线图（Phase 1）

**Feature**: `002-tech-stack-principles`  
**Date**: 2025-12-21

## Entities

### TechnologyEntry

表示一项技术/工具/方案的能力条目。

- **id**: string（稳定标识，用于引用）
- **name**: string（展示名）
- **category**: string（如：framework / language / tooling / performance / testing / architecture）
- **proficiency**: string（core / strong / working / aware）
- **principles**: string[]（使用该技术时坚持的不可妥协原则）
- **patterns**: string[]（常用模式/架构套路）
- **bestPractices**: string[]（最佳实践清单）
- **alternatives**: string[]（替代方案）
- **tradeOffs**: string[]（关键权衡：收益/成本/风险）
- **boundaries**: string[]（适用边界与前提）
- **verification**: Evidence（可自动化执行的验证入口；测试或替代验证）
- **cpsol**: { context, problem, solution, outcome, learnings }（可复述稿）
- **uxNotes?**: string[]（当涉及 UX 时：一致性/a11y/错误态等）
- **perfNotes?**: { metric, baseline, budget, method, risks, rollback }[]（当涉及性能时：指标口径/基线/预算/验证）
- **refs**: string[]（参考资料：文章/规范/代码链接等）
- **updatedAt**: string（YYYY-MM-DD）

### Evidence

表示“如何验证条目”的证据入口（必须可自动化执行）。

- **type**: string（test | script | example | checklist）
- **howToRun**: string（可复制执行的命令或步骤）
- **successSignal**: string（通过信号）
- **failureSignal**: string（失败信号）
- **notes?**: string（补充说明/前置条件）

### ComparisonMatrix

一组相似方案的对比矩阵，用于统一选型口径。

- **id**: string
- **title**: string
- **candidates**: string[]
- **dimensions**: string[]
- **constraints**: string[]（前提约束）
- **conclusion**: string（推荐与边界）
- **risksAndRollback**: string（风险与回滚策略）
- **updatedAt**: string（YYYY-MM-DD）

### RoadmapItem

路线图的最小执行单元（周/双周为粒度）。

- **id**: string
- **theme**: string（如：Performance Deep Dive）
- **timebox**: string（如：2025-W52）
- **focusAreas**: string[]
- **deliverables**: string[]（条目/矩阵/演练/复盘等）
- **verification**: Evidence[]（如何验收本周期产出）
- **reflection**: { whatWentWell, gaps, nextActions }（复盘）

## Relationships

- TechnologyEntry 1 — 1 Evidence（每条目至少 1 个可执行验证入口）
- RoadmapItem 1 — N Evidence（一个周期可对应多个验证入口）
- ComparisonMatrix 与 TechnologyEntry 互相引用（用 id 或文件路径交叉链接）
