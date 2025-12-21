---
id: project__xdr-dashboard-report
type: project
title: XDR 系统（魔方大屏 + 报表）
mastery: not_started
tags: [react, echarts, nestjs, lowcode]
projects: [project__xdr-dashboard-report]
source_refs:
  - source: resume
    file: docs/job-description/web前端开发工程师-彭聪.md
    anchor: XDR 系统 - 魔方大屏 + 报表
seed_refs:
  - source: outline
    file: docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md
    anchor: 7）魔方大屏：低代码内部原理
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

核心开发者。负责低代码物料与渲染链路、报表导出与定时任务等跨端交付。

## 原理简述

（Schema 驱动：schema→runtime tree；编辑器：拖拽/撤销重做；数据：数据源与刷新策略；稳定性：容错与降级）

## 对比表格

（低代码：自研 vs 开源框架；报表：SSR/CSR/离线渲染；导出：服务端渲染 vs 客户端截图）

## 模拟问答

- [ ] 低代码渲染器的核心数据结构是什么？如何做局部更新？
- [ ] 实时大屏如何做性能治理（高频刷新、虚拟化、降级、节流）？
- [ ] 报表导出如何保证一致性与权限隔离？失败如何降级？

## 手写代码区

（示例：schema→ 组件树的最小渲染；事件编排表达式的安全白名单思路）

## 我的补充（Manual）

（不会被脚本覆盖）

## 复盘与反思（Learnings）

- 如果重做会怎么改？

## 面试官追问（面试官视角）

- [ ] 为什么选这个方案？替代方案为什么不选？
- [!] 最大一次事故/踩坑是什么？如何定位与回滚？
- [ ] 如果重做会怎么改？
