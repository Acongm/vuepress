---
id: project__dji-rms
type: project
title: 大疆售后 RMS 系统重构
mastery: not_started
tags: [react, typescript, webpack, antd, engineering]
projects: [project__dji-rms]
source_refs:
  - source: resume
    file: docs/job-description/web前端开发工程师-彭聪.md
    anchor: 大疆售后 RMS 系统重构
seed_refs:
  - source: outline
    file: docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md
    anchor: 2）Umi：ESLint 规范有哪些，以及如何整合到实践
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

项目前端负责人。负责多团队协作规范、工程体系与关键模块交付，目标是提升交付质量、降低 bug 率与维护成本。

## 原理简述

（从“复杂系统重构”的角度讲：模块划分、权限边界、工程门禁、性能与稳定性）

## 对比表格

（例如：Webpack vs Vite；AntD 表单方案 vs 自研；lint 规则从 warning 到 error 的渐进策略）

## 模拟问答

- [ ] 你是如何设计权限与模块边界的？如何避免跨域依赖与循环引用？
- [ ] ESLint/Prettier/CI 门禁是如何让团队真的执行的？
- [ ] 你做过哪些性能治理？如何建立预算与回归机制？

## 手写代码区

（示例：权限路由守卫/菜单生成；错误边界与日志上报；模块依赖约束的实现思路）

## 我的补充（Manual）

（不会被脚本覆盖）

## 复盘与反思（Learnings）

- 如果重做会怎么改？

## 面试官追问（面试官视角）

- [ ] 为什么选这个方案？替代方案为什么不选？
- [!] 最大一次事故/踩坑是什么？如何定位与回滚？
- [ ] 如果重做会怎么改？
