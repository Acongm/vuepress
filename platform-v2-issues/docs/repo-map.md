# Repository Map — Platform v2

## 域名 ↔ 仓库

| 域名 | 仓库 | Vercel Root |
|------|------|-------------|
| www.acongm.com | Acongm/portal | apps/portal |
| dochub.acongm.com | Acongm/dochub | / |
| chat.acongm.com | Acongm/chat | / |
| auth.acongm.com | Acongm/auth | apps/auth |
| api.acongm.com | Acongm/node-vercel-starter | / |

指挥与文档：Acongm/platform（或 vuepress/platform-v2-issues）

Legacy：Acongm/vuepress — **方案不修改**；内容迁移到 portal 后自行归档


## 包暂存与 pnpm link

| 包 | 所在仓 | 消费方 |
|----|--------|--------|
| @acongm/auth-client | auth/packages/auth-client | portal, chat, dochub |
| @acongm/config | auth/packages/config | auth, api |
| @acongm/chat-ui | portal/packages/chat-ui | portal, chat |
| @acongm/ui-theme | portal/packages/ui-theme | portal, chat, dochub |
| @acongm/kb-types | portal/packages/kb-types | portal, chat, api(类型) |

```bash
# 示例：chat 仓 link
cd auth/packages/auth-client && pnpm link --global
cd portal/packages/chat-ui && pnpm link --global
cd chat && pnpm link --global @acongm/auth-client @acongm/chat-ui
```

## api 内管道

kb-pipeline 位于 node-vercel-starter/packages/kb-pipeline（非前端 monorepo）
