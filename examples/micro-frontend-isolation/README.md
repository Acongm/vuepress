# Evidence: micro-frontend-isolation

> 目的：作为 `micro-frontend-qiankun` 条目的“可复现证据”补充材料，提供隔离/通信/发布协同的检查清单。

## Context

- 对应简历：`resume:devops`（Vue3 + qiankun 微前端）

## Isolation Checklist（隔离检查）

### CSS

- 是否有全局样式污染（reset、全局标签选择器、body/html）？
- 是否统一命名空间（BEM/前缀）？
- 是否有“逃逸样式”（子应用影响主应用/其他子应用）？

### JavaScript / Global Side Effects

- 是否污染 `window` 全局变量？
- 是否修改原生原型（Array/Object/Date）？
- 是否存在全局事件监听未清理（memory leak）？
- 是否对 location/history 做了非预期操作？

## Communication Checklist（通信检查）

- 通信协议是否有版本号？
- 数据结构是否可追踪（来源/目的/失败路径）？
- 错误与超时如何兜底？是否可回滚到降级方案？

## Deploy & Rollback Checklist（发布与回滚）

- 是否定义 host/subapp 兼容窗口？
- 是否支持灰度发布？
- 出现回归时回滚策略是什么（回退 subapp 版本 or 回退 host 版本）？

## Verification（如何验证）

**Pass/Fail Signals**

- PASS：隔离检查无明显冲突；通信契约清晰；发布可灰度且可回滚
- FAIL：出现样式污染/全局污染/通信不一致导致回归；或无法快速回滚
