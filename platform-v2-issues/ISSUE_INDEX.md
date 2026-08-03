# Platform v2 Issue 索引（暂存于 Acongm/vuepress）

> 全部方案 Issue 暂存在本仓，标题前缀 `[目标仓]` 标记迁移目标。  
> **不改造 vuepress 产品代码**；文档站以 portal 为准。

## 总控

| # | 标题 |
|---|------|
| [#15](https://github.com/Acongm/vuepress/issues/15) | `[platform] [Program] Platform v2 总控看板` |

筛选：在 Issues 搜索 `is:issue [platform]` / `[auth]` / `[portal]` / `[chat]` / `[dochub]` / `[api]`

## 按目标仓库

### platform（#15–#26）指挥仓 Acongm/platform

| # | 标题 |
|---|------|
| 15 | Program 总控看板 |
| 16 | Epic Phase 0 |
| 17 | Epic Phase 1 |
| 18 | Epic Phase 2 |
| 19 | Epic Phase 3 |
| 20 | Epic Phase 4 |
| 21 | Epic Phase 5 |
| 22 | P0-01 repo-map |
| 23 | P0-02 sync-protocol |
| 24 | P4-06 域名 Runbook |
| 25 | P5-05 openClaw ping |
| 26 | P5-06 npm 私有化计划 |

### auth（#27–#31）→ Acongm/auth

| # | 标题 |
|---|------|
| 27 | Epic auth |
| 28 | P0-03 workspace + apps/auth |
| 29 | P0-04 auth-client |
| 30 | P0-05 config |
| 31 | P0-06 部署 auth.acongm.com |

### portal（#32–#43）→ Acongm/portal

| # | 标题 |
|---|------|
| 32 | Epic portal |
| 33 | P1-01 Fumadocs 骨架 |
| 34 | P1-02 ui-theme |
| 35 | P1-03 chat-ui |
| 36 | P1-04 kb-types |
| 37 | P1-10 ChatDrawer |
| 38 | P2-10 摘要双通道 |
| 39 | P4-01 MD 迁移脚本 |
| 40 | P4-02 MDX 映射 |
| 41 | P4-03 响应式 TOC |
| 42 | P4-04 Drawer context |
| 43 | P4-05 部署 www |

### chat（#44–#49）→ Acongm/chat

| # | 标题 |
|---|------|
| 44 | Epic chat |
| 45 | P1-05 Next + Vercel |
| 46 | P1-06 chat-ui 接入 |
| 47 | P1-07 匿名限额 |
| 48 | P5-02 Sources/debug |
| 49 | P5-03 Thread 持久化 |

### dochub（#50–#55）→ Acongm/dochub

| # | 标题 |
|---|------|
| 50 | Epic dochub |
| 51 | P3-01 Next + 域名 |
| 52 | P3-02 文件树 |
| 53 | P3-03 编辑草稿 |
| 54 | P3-04 预览 token |
| 55 | P3-05 发布同步 UI |

### api（#56–#76）→ Acongm/node-vercel-starter

正文含镜像链接（原仓 #1–#21）。迁移时可合并/关闭重复。

| # | 标题 |
|---|------|
| 56 | Epic API |
| 57–59 | P0-07~09 |
| 60–61 | P1-08~09 |
| 62–70 | P2-01~09 |
| 71–74 | P3-06~09 |
| 75–76 | P5-01, P5-04 |

## 请关闭的误建 Issue

| # | 原因 |
|---|------|
| [#11](https://github.com/Acongm/vuepress/issues/11)–[#14](https://github.com/Acongm/vuepress/issues/14) | 旧测试 / 错误的「改 vuepress」Epic |

## 日后迁移

1. 建好目标仓并授权
2. 按前缀筛选复制 Issue（或用 `gh issue create` 迁移）
3. 关闭 vuepress 上对应 Issue，在 Program #15 勾选

脚本：`platform-v2-issues/create-all-on-vuepress.mjs`  
状态：`platform-v2-issues/vuepress-created.json`
