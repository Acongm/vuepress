# Platform v2 Issue 索引

## 已创建（Cloud Agent token）

### Acongm/vuepress
| Issue | 标题 |
|-------|------|
| [#12](https://github.com/Acongm/vuepress/issues/12) | [Epic] Platform v2 — vuepress（legacy 过渡） |
| [#13](https://github.com/Acongm/vuepress/issues/13) | [P2-11] 冻结 build:ai:v1 至 portal 切换 |
| [#14](https://github.com/Acongm/vuepress/issues/14) | [P4-07] 标注 legacy + 归档说明 |
| [#11](https://github.com/Acongm/vuepress/issues/11) | （测试 Issue，可关闭） |

### Acongm/node-vercel-starter
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

## 待创建（需仓库对 token 可见后运行脚本）

仓库：`Acongm/platform`、`Acongm/auth`、`Acongm/portal`、`Acongm/chat`、`Acongm/dochub`

```bash
cd vuepress   # 或任意 clone 了本目录的仓
node platform-v2-issues/create-issues.mjs --repo=Acongm/platform
node platform-v2-issues/create-issues.mjs --repo=Acongm/auth
node platform-v2-issues/create-issues.mjs --repo=Acongm/portal
node platform-v2-issues/create-issues.mjs --repo=Acongm/chat
node platform-v2-issues/create-issues.mjs --repo=Acongm/dochub
```

若仓库为 **私有**，请在 GitHub Settings → Applications 授权 Cursor/gh，或本地 `gh auth login` 后执行。

## 建议手动添加 Labels（token 无 label 权限）

在各仓库创建：

- platform-v2, epic, phase-0~5, priority-p0/p1/p2

然后为 Issue 批量打标。

## Program 总控 Issue

在 **Acongm/platform** 创建后，将链接回填到各 Epic 描述顶部。
