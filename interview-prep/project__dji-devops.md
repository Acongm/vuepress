---
id: project__dji-devops
type: project
title: 大疆 DevOps 平台维护
mastery: not_started
tags: [vue3, typescript, qiankun, cicd]
projects: [project__dji-devops]
source_refs:
  - source: resume
    file: docs/job-description/web前端开发工程师-彭聪.md
    anchor: 大疆 DevOps 平台维护
seed_refs:
  - source: outline
    file: docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md
    anchor: 6）大疆 DevOps 平台维护：微前端选型 + 各微前端原理
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

核心开发者。面向多团队、多模块交付场景，通过微前端实现独立部署与统一治理，并通过 CI/CD 提升发布效率。

## 原理简述

（微前端：注册/加载/生命周期调度；隔离：CSS/JS sandbox；通信：props/event bus；性能：预加载与共享依赖取舍）

## 对比表格

（qiankun vs single-spa vs Module Federation vs iframe：边界、代价、适用场景）

## 模拟问答

- [ ] 为什么选 qiankun？哪些约束让它更合适？
- [ ] 子应用资源如何加载与调度？沙箱怎么做？有哪些坑？
- [ ] CI/CD 如何做门禁与回滚？如何保证可追溯（commit→ 构建 → 镜像 → 发布）？

## 手写代码区

（示例：子应用注册/激活判断；沙箱 Proxy 的关键思路；通信协议最小实现）

## 我的补充（Manual）

（不会被脚本覆盖）

## 复盘与反思（Learnings）

- 如果重做会怎么改？

## 面试官追问（面试官视角）

- [ ] 为什么选这个方案？替代方案为什么不选？
- [!] 最大一次事故/踩坑是什么？如何定位与回滚？
- [ ] 如果重做会怎么改？
