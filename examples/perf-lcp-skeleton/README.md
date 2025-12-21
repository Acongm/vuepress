# Evidence: perf-lcp-skeleton

> 目的：作为 `perf-lcp-firstscreen` 条目的“可复现证据”补充材料，说明骨架屏/预渲染如何影响 LCP，并给出验证口径与回滚策略。

## Context

- 对应简历：`resume:user-center`（LCP 2.3s → 1.4s，首屏 < 1.5s）
- 目标：提升感知性能与 LCP，同时控制副作用（例如 CLS）

## Approach（方法）

- **骨架屏/预渲染**：提前输出“首屏结构”，让用户更快看到内容轮廓（降低 LCP 代表性节点出现时间）
- **关键渲染路径（CRP）治理**：减少阻塞资源、提升关键资源优先级

## Verification（如何验证）

1. 建立基线（优化前）
   - 记录 LCP/CLS/INP（口径一致：同环境、同网络、同设备/模拟器）
   - 记录 Performance timeline 与关键资源瀑布图
2. 实施骨架/预渲染与 CRP 调整（优化后）
   - 重复同样的采样方式
3. 对比与结论
   - LCP 是否下降？CLS 是否变差？INP 是否被影响？

**Pass/Fail Signals**

- PASS：LCP 达到预算（例如 <= 1.5s），且 CLS 不显著恶化（按团队口径阈值）
- FAIL：LCP 无改善或 CLS 明显变差；或出现白屏/闪烁/布局跳动引发体验投诉

## Risks（常见副作用）

- 骨架与真实内容尺寸不一致导致 CLS
- 预渲染内容与真实数据差异导致闪烁

## Rollback（回滚策略）

- 可开关：骨架/预渲染策略必须可快速关闭（feature flag / 配置开关）
- 先保稳定：出现回归先回退到基线版本，再做小步实验
