# Platform v2 Issue 索引

## 方案边界（已确认）

- **不修改 Acongm/vuepress**（无产品 Issue、无代码改造）
- 文档站 = **Acongm/portal**（Fumadocs React 重构）
- 指挥 = **Acongm/platform**
- 认证 = **Acongm/auth**
- Chat = **Acongm/chat**
- DocHub = **Acongm/dochub**
- API = **Acongm/node-vercel-starter**

## 已创建

### Acongm/node-vercel-starter（21）

| # | 标题 |
|---|------|
| [#1](https://github.com/Acongm/node-vercel-starter/issues/1) | [Epic] Platform v2 — API |
| [#2](https://github.com/Acongm/node-vercel-starter/issues/2) | [P0-07] Supabase migration |
| [#3](https://github.com/Acongm/node-vercel-starter/issues/3) | [P0-08] auth JWT |
| [#4](https://github.com/Acongm/node-vercel-starter/issues/4) | [P0-09] site.config |
| [#5](https://github.com/Acongm/node-vercel-starter/issues/5) | [P1-08] rate limit |
| [#6](https://github.com/Acongm/node-vercel-starter/issues/6) | [P1-09] 日志 |
| [#7](https://github.com/Acongm/node-vercel-starter/issues/7) | [P2-01] kb-pipeline 骨架 |
| [#8](https://github.com/Acongm/node-vercel-starter/issues/8) | [P2-02] ingest/hash |
| [#9](https://github.com/Acongm/node-vercel-starter/issues/9) | [P2-03] analyze AI 摘要 |
| [#10](https://github.com/Acongm/node-vercel-starter/issues/10) | [P2-04] docpack index |
| [#11](https://github.com/Acongm/node-vercel-starter/issues/11) | [P2-05] summaries-v1 |
| [#12](https://github.com/Acongm/node-vercel-starter/issues/12) | [P2-06] github webhook |
| [#13](https://github.com/Acongm/node-vercel-starter/issues/13) | [P2-07] /kb/summary retrieve |
| [#14](https://github.com/Acongm/node-vercel-starter/issues/14) | [P2-08] reconcile cron |
| [#15](https://github.com/Acongm/node-vercel-starter/issues/15) | [P2-09] git_to_db |
| [#16](https://github.com/Acongm/node-vercel-starter/issues/16) | [P3-06] dochub CRUD |
| [#17](https://github.com/Acongm/node-vercel-starter/issues/17) | [P3-07] db_to_git |
| [#18](https://github.com/Acongm/node-vercel-starter/issues/18) | [P3-08] preview token |
| [#19](https://github.com/Acongm/node-vercel-starter/issues/19) | [P3-09] 角色校验 |
| [#20](https://github.com/Acongm/node-vercel-starter/issues/20) | [P5-01] kb/debug |
| [#21](https://github.com/Acongm/node-vercel-starter/issues/21) | [P5-04] Supabase backup |

### Acongm/vuepress（误建，请关闭）

以下 Issue **不属于方案范围**，请手动 Close as not planned：

- [#11](https://github.com/Acongm/vuepress/issues/11) 测试
- [#12](https://github.com/Acongm/vuepress/issues/12) Epic legacy
- [#13](https://github.com/Acongm/vuepress/issues/13) P2-11 冻结 AI
- [#14](https://github.com/Acongm/vuepress/issues/14) P4-07 归档

`create-issues.mjs` 已移除 vuepress 条目。

## 待创建（当前 Cloud Agent 访问不到这些仓）

`gh repo view` / `git ls-remote` 对下列仓库均返回 **404 Repository not found**：

- Acongm/platform
- Acongm/auth
- Acongm/portal
- Acongm/chat
- Acongm/dochub

可能原因：

1. 仓库尚未在 `Acongm` 账号下创建（或名称不同）
2. 仓库为私有，且 **Cursor Cloud Agent 的 GitHub App 未安装到这些仓库**
3. 创建在其他 org/账号下

### 授权后执行

在本机或已授权环境：

```bash
node platform-v2-issues/create-issues.mjs --repo=Acongm/platform
node platform-v2-issues/create-issues.mjs --repo=Acongm/auth
node platform-v2-issues/create-issues.mjs --repo=Acongm/portal
node platform-v2-issues/create-issues.mjs --repo=Acongm/chat
node platform-v2-issues/create-issues.mjs --repo=Acongm/dochub
```

将创建：

| 仓库 | 数量 |
|------|------|
| platform | 12（Program + Phase Epic + P0/P4/P5 文档） |
| auth | 5 |
| portal | 12 |
| chat | 6 |
| dochub | 6 |

## GitHub App 安装检查清单

1. GitHub → Settings → Applications → Cursor / Cursor Cloud
2. Repository access 勾选：platform、auth、portal、chat、dochub、node-vercel-starter
3. 确认仓库存在且 URL 为 `https://github.com/Acongm/<name>`
4. 重新跑 Cloud Agent 或本地 `gh auth status` 后执行脚本
