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

## 迁移状态（2026-08-03，cursor[bot] 权限更新后）

| 目标仓 | 有效 Issue | 说明 |
|--------|------------|------|
| [portal](https://github.com/Acongm/portal/issues) | **#1–#24** | `Acongm/platform` 实为 portal 仓；指挥类 + portal 类均在此 |
| [auth](https://github.com/Acongm/auth/issues) | **#1–#5** | 已迁移 |
| [chat](https://github.com/Acongm/chat/issues) | **#1–#6** | 已迁移 |
| [node-vercel-starter](https://github.com/Acongm/node-vercel-starter/issues) | **#1–#21** | api 类镜像，未在 vuepress 重复创建 |
| dochub | — | **仓库尚未创建**（`Acongm/dochub` 404） |

### 需手动关闭的重复 Issue（迁移脚本去重 bug 导致二次创建）

cursor[bot] 无 comment/close 权限，请用 acongm 账号关闭下列较高编号副本：

| 仓库 | 保留 | 关闭（重复） |
|------|------|--------------|
| portal | #1–#24 | **#25–#48** |
| auth | #1–#5 | **#6–#10** |
| chat | #1–#6 | **#7–#12** |

脚本已修复：`doneKeys` 与检查键统一为 `vuepress#→targetRepo`。

### dochub 待办

1. 在 GitHub 创建 `Acongm/dochub`（或授权 Cursor GitHub App 访问）
2. 运行：`node platform-v2-issues/migrate-issues-from-vuepress.mjs --target=dochub`
3. 迁移 vuepress #50–#55

### vuepress 暂存 Issue

迁移完成后可关闭 vuepress **#15–#55**（api #56–#76 仅保留镜像关联）。cursor[bot] 无法 comment/close，需 acongm 手动处理。

## 迁移到各私有仓（本机执行）

Cloud Agent 使用 **cursor** 机器人账号；**可创建 Issue**，但 **无法 comment/close**。请在本机用你的 **acongm** 账号关闭重复与暂存 Issue：

```bash
gh auth login
git fetch origin platform/v2-issues && git checkout platform/v2-issues
node platform-v2-issues/migrate-issues-from-vuepress.mjs
```

- **35 个** Issue 已迁入 platform(portal) / auth / portal / chat；**6 个** dochub 待仓库创建
- **21 个** `[api]` → 关联 node-vercel-starter #1–#21（不重复创建）
- 正文备份：`platform-v2-issues/export/`
- 结果映射：`platform-v2-issues/migrated-issues.json`

迁移后关闭 vuepress #15–#55；Program 总控在 portal #1。
