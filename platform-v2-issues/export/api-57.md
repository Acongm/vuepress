# [P0-07] Supabase migration（文档版本化 + 同步表）

## 目标仓库
`Acongm/node-vercel-starter`


## 表
document_versions, document_heads, kb_analysis, kb_chunks, sync_jobs, sync_failures, chat_threads/messages

## 输出
supabase/migrations/001_platform_v2.sql

镜像：https://github.com/Acongm/node-vercel-starter/issues/2
---
## 暂存说明
本 Issue 暂存在 Acongm/vuepress，用于 Platform v2 统一跟踪。
迁移时：按「目标仓库」标签搬到对应仓，并关闭本 Issue。
分支约定：各目标仓使用 platform/v2。
方案边界：不改造 vuepress 产品代码；文档站以 portal 为准。


Source: https://github.com/Acongm/vuepress/issues/57
