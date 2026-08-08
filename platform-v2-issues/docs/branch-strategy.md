# Branch Strategy — platform/v2

## 分支

- 开发集成分支：`platform/v2`
- 生产默认：`master`（api 发布分支可通过 site.config 配置为 dev）

## 流程

1. 从 master 拉 `platform/v2`
2. 按 Phase 开发，Issue 验收勾选
3. Phase 结束打 tag 注释在 platform Program Issue（v2-phase-N）
4. merge platform/v2 → master

## 各仓同步

同一 Phase 内多仓 PR 可并行；注意 api 契约先于前端对接（kb-types、auth JWT）。
