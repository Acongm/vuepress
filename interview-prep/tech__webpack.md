---
id: tech__webpack
type: tech
title: Webpack（构建流程/产物/性能优化）
mastery: not_started
tags: [webpack, bundler, performance]
projects: [project__dji-rms]
source_refs:
  - source: resume
    file: docs/job-description/web前端开发工程师-彭聪.md
    anchor: TODO
seed_refs:
  - source: outline
    file: docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md
    anchor: TODO
updated_at: 2025-12-20
---

<!-- AUTO-GENERATED:START -->

## 摘要（Auto）

- 生成时间：2025-12-20
- 简历中出现的项目标题（提取）：大疆用户中心重构 / 大疆售后 RMS 系统重构 / 跨平台公告插件系统 / 大疆 DevOps 平台维护 / XDR 系统 - 魔方大屏 + 报表
- 面试大纲关键词（提取 Top10）：1）大疆用户中心重构：性能优化 + HTTP 原理 + Webpack 架构 / 性能指标与方法论 / 简历可落地点（结合你的“优化四板斧”） / HTTP 常考点（从“为什么变快”倒推） / Webpack 架构（工程化面试常考） / 按优化顺序，把方案“串起来”（排查 → 定位 → 选择 → 验证） / 0. 排查与基线（先把问题“量化”） / 1. 先保“可见”——骨架屏预渲染（直接拉低 LCP） / 2. 再减“阻塞”——关键渲染路径（CRP）梳理：CSS/字体/首图优先级 / 3. 再降“下载与解析成本”——更小的包体与更少的无效代码

## 建议追问（Auto）

- 你为什么在该项目/场景里选择这个方案？替代方案为何不选？
- 最大一次事故/踩坑是什么？如何定位与回滚？
- 如果重做：架构/边界/工程化会怎么调整？

<!-- AUTO-GENERATED:END -->

## 在我项目中的角色与使用场景

（写清“你在哪个项目、为什么用、解决什么约束”）

## 原理简述

（是什么 → 为什么用 → 替代方案 → 权衡 → 项目定制/优化）

## 对比表格

（至少 2 个替代方案 + 你的决策依据，包含风险与回滚/迁移策略）

## 模拟问答

- [ ] Q1：……
  - 推荐回答结构：Context → Problem → Solution → Outcome → Learnings
- [ ] Q2：……

## 手写代码区

（给出最小可运行代码片段或伪代码，明确输入/输出、边界与失败路径）

## 我的补充（Manual）

- MANUAL_MARKER: keep-me

（不会被脚本覆盖：踩坑、细节、反例、排查路径）

## 复盘与反思（Learnings）

- 如果重做会怎么改？

## 面试官追问（面试官视角）

- [ ] 为什么选这个方案？替代方案为什么不选？
- [!] 最大一次事故/踩坑是什么？如何定位与回滚？
- [ ] 如果重做会怎么改？
