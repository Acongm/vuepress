# [P0-02] 编写 sync-protocol.md（Git↔DB 状态机）

## 目标仓库
`Acongm/platform`


## 任务
- document_versions / sync_state 状态机
- git_to_db、db_to_git、reconcile、sync_failures

## 验收
冲突场景表完整；版本只追加不覆盖。
---
## 暂存说明
本 Issue 暂存在 Acongm/vuepress，用于 Platform v2 统一跟踪。
迁移时：按「目标仓库」标签搬到对应仓，并关闭本 Issue。
分支约定：各目标仓使用 platform/v2。
方案边界：不改造 vuepress 产品代码；文档站以 portal 为准。


Source: https://github.com/Acongm/vuepress/issues/23
