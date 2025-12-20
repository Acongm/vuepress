---
id: tech__performance
type: tech
title: 前端性能（指标体系与优化方法论）
mastery: not_started
tags: [performance, web-vitals]
projects: [project__dji-user-center, project__dji-rms]
source_refs:
  - source: resume
    file: docs/job-description/web前端开发工程师-彭聪.md
    anchor: 技术亮点
seed_refs:
  - source: outline
    file: docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md
    anchor: 性能指标与方法论
updated_at: 2025-12-20
---

<!-- AUTO-GENERATED:START -->

## 摘要（Auto）

- 指标体系：LCP / FCP / TTI / CLS / INP、首屏/白屏时间、资源体积、接口耗时、缓存命中率
- 定位手段：Performance/Network、Lighthouse、Web Vitals 上报、Long Task 分析
- 优化策略：关键渲染路径（CRP）、渐进式渲染（骨架屏/占位/分片）、资源优先级（preload/prefetch）

<!-- AUTO-GENERATED:END -->

## 在我项目中的角色与使用场景

（用户中心：聚焦 LCP/首屏；RMS：治理工程化与长期预算，防止性能回退）

## 原理简述

分层认知：

- 加载性能：TTFB/资源下载/缓存命中
- 运行时性能：Long Task、主线程阻塞、渲染频率
- 感知性能：骨架屏、占位、渐进渲染
- 可访问性：a11y 与性能治理的交集（焦点、可读性、交互响应）

## 对比表格

（示例：骨架屏 vs 纯 loading；preload vs prefetch；HTTP/2 复用 vs 域名拆分）

## 模拟问答

- [ ] 你怎么建立性能基线？怎么保证“每一刀都有证据、每一刀都有回归验证”？
- [!] 优化导致 CLS 变差怎么办？如何设计兜底与回滚？
- [ ] 如何建立性能预算（bundle/关键资源上限）并做上线门禁？

## 手写代码区

（示例：web-vitals 上报最小实现；性能预算校验脚本伪代码）

## 面试官追问（面试官视角）

- [ ] 你怎么判断“体感慢”对应哪个指标？怎么落到行动？
- [!] 弱网/中低端机如何评估？如何做回归矩阵？

## 我的补充（Manual）

（不会被脚本覆盖）

## 复盘与反思（Learnings）

- 如果重做会怎么改？
