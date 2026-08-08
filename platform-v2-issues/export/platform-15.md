# [Program] Platform v2 总控看板

## 目标仓库
`Acongm/platform`


# Platform v2 总控看板

## 目标
五端协作：portal + dochub + chat + auth + api；文档 DB 版本化；kb-pipeline+docpack；Git↔DB 同步。

## 域名
| 域名 | 仓库 |
|------|------|
| www.acongm.com | Acongm/portal |
| dochub.acongm.com | Acongm/dochub |
| chat.acongm.com | Acongm/chat |
| auth.acongm.com | Acongm/auth |
| api.acongm.com | Acongm/node-vercel-starter |
| 指挥 | Acongm/platform |

## 阶段看板
- [ ] Phase 0 认证地基
- [ ] Phase 1 Chat
- [ ] Phase 2 KB 管道
- [ ] Phase 3 DocHub
- [ ] Phase 4 Portal 上线
- [ ] Phase 5 加固

## 已冻结决策
- Cookie .acongm.com；auth.acongm.com OAuth 中枢
- admin 直推，publishBranch 可配置
- kb-pipeline + docpack；AI 摘要走 api internal
- Supabase 会话；匿名限额 + client_id 日志
- 包暂 pnpm link（auth-client/config 在 auth；chat-ui/ui-theme/kb-types 在 portal）
- **不修改 vuepress 产品代码**
---
## 暂存说明
本 Issue 暂存在 Acongm/vuepress，用于 Platform v2 统一跟踪。
迁移时：按「目标仓库」标签搬到对应仓，并关闭本 Issue。
分支约定：各目标仓使用 platform/v2。
方案边界：不改造 vuepress 产品代码；文档站以 portal 为准。


Source: https://github.com/Acongm/vuepress/issues/15
