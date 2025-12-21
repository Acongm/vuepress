# Evidence: bundling-treeshake

> 目的：作为 `rollup-treeshaking` 条目的“可复现证据”补充材料，说明如何验证 tree-shaking 生效与体积预算达标。

## Context

- 对应简历：`resume:announce-plugin`（Rollup 构建，包体积 < 15KB）

## What to Verify（验证什么）

- **tree-shaking 是否生效**：未被引用的导出不进入最终产物
- **体积预算是否达标**：gzip 后产物 < 15KB（或你设定的预算）
- **兼容边界**：ESM/UMD 双产物策略是否满足消费方

## Verification Steps（可复现步骤）

1. 设定预算口径
   - gzip 后体积作为预算指标（避免仅看未压缩体积）
2. 构建产物并统计体积
   - 记录构建后的文件清单
   - 统计 gzip 前/后体积（用任何可复现工具均可）
3. 验证 tree-shaking
   - 在入口只引用部分 API
   - 确认未引用 API 不出现在产物中（字符串/符号检查或构建分析）

**Pass/Fail Signals**

- PASS：gzip 后体积 < 15KB，且未引用导出不进入产物
- FAIL：体积超预算或未引用导出仍进入产物（说明存在副作用或打包配置问题）

## Risks & Rollback（风险与回滚）

- 风险：过度裁剪导致兼容问题或功能缺失；多产物形态增加发布复杂度
- 回滚：回退到上一个稳定版本产物；保留 UMD 兜底接入方式
