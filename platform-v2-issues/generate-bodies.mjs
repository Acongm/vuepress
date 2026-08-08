#!/usr/bin/env node
/**
 * 生成 Platform v2 各仓库 GitHub Issue 正文，并可选调用 gh 创建。
 * 用法:
 *   node platform-v2-issues/generate-bodies.mjs
 *   node platform-v2-issues/create-issues.mjs
 *   node platform-v2-issues/create-issues.mjs --repo Acongm/vuepress
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const ROOT = dirname(fileURLToPath(import.meta.url))
const BODIES = join(ROOT, 'bodies')

const FOOTER = `
---

## 程序关联
- 总控看板：Acongm/platform → [Program] Platform v2 总控看板
- 集成分支：platform/v2 → 验收后 merge master
- 包协作：现阶段 pnpm link（见 platform repo-map.md）

## 仓库地图
| 域名 | 仓库 |
|------|------|
| www.acongm.com | Acongm/portal |
| dochub.acongm.com | Acongm/dochub |
| chat.acongm.com | Acongm/chat |
| auth.acongm.com | Acongm/auth |
| api.acongm.com | Acongm/node-vercel-starter |
`

function w(name, content) {
  writeFileSync(join(BODIES, name), content.trim() + FOOTER, 'utf8')
}

mkdirSync(BODIES, { recursive: true })

w(
  'platform-program.md',
  `# Platform v2 总控看板

## 目标
将 VuePress 知识库升级为五端协作：portal + dochub + chat + auth + api；
文档 DB 版本化、kb-pipeline+docpack、匿名限额 Chat、Git↔DB 双向同步。

## 域名与仓库
| 域名 | 仓库 | 阶段 |
|------|------|------|
| www.acongm.com | Acongm/portal | Phase 4 上线 |
| dochub.acongm.com | Acongm/dochub | Phase 3 |
| chat.acongm.com | Acongm/chat | Phase 1 |
| auth.acongm.com | Acongm/auth | Phase 0 |
| api.acongm.com | Acongm/node-vercel-starter | Phase 0–5 |
| （legacy） | Acongm/vuepress | Phase 2 冻结 → Phase 4 归档 |

## 阶段看板
- [ ] **Phase 0** 契约与认证地基
- [ ] **Phase 1** Chat 核心（chat-ui + chat 全页 + rate limit）
- [ ] **Phase 2** KB 管道（kb-pipeline + docpack，AI 迁 api internal）
- [ ] **Phase 3** DocHub（编辑/预览/发布 + 双向同步）
- [ ] **Phase 4** Portal 迁移上线（Fumadocs 替换 vuepress）
- [ ] **Phase 5** 加固（backup、debug、npm 私有化）

## 已冻结决策
- Cookie：`.acongm.com` 共享；OAuth 中枢 `auth.acongm.com`
- 发布：admin 可直推，目标分支可配置（`site.config.git.publishBranch`）
- Lattice：`kb-pipeline` + `docpack`；AI 摘要走 api `internal/ai-forward`
- 会话：Supabase；匿名可访问 + 日限额；日志对齐 `client_id`
- 包：暂 `pnpm link`；`auth-client`/`config` 在 auth 仓；`chat-ui`/`ui-theme`/`kb-types` 在 portal 仓

## 指挥 Issue 索引
在各仓库搜索 label `platform-v2` + `epic`。
`
)

w(
  'platform-epic-phase0.md',
  `# Epic Phase 0 — 契约与认证地基

## 阶段目标
统一认证、DB schema、配置契约，五端可识别 user/anon。

## 本阶段涉及仓库
- **auth**：apps/auth + auth-client + config
- **api**：Supabase migration + JWT 中间件
- **platform**：repo-map、sync-protocol 文档

## 阶段验收（Program 勾选）
- [ ] `auth.acongm.com` 登录成功，cookie 在子域可用
- [ ] api 校验 JWT，返回 role + tier
- [ ] Supabase migration 已执行
- [ ] `site.config.yaml` 模板就绪

## 子 Issue
见 auth P0-03~06、api P0-07~09、platform P0-01~02。
`
)

w(
  'platform-epic-phase1.md',
  `# Epic Phase 1 — Chat 核心

## 阶段目标
chat.acongm.com 全页流式对话；portal 内嵌 ChatDrawer；api 限额与日志。

## 涉及仓库
portal（chat-ui、ui-theme、kb-types、Drawer）、chat、api

## 阶段验收
- [ ] chat.acongm.com 流式对话 + 停止/重试
- [ ] 匿名日限额生效
- [ ] portal ChatDrawer 不跳转、带 pagePath context
- [ ] 日志含 user_id / client_id / conversation_id
`
)

w(
  'platform-epic-phase2.md',
  `# Epic Phase 2 — KB 管道

## 阶段目标
kb-pipeline + docpack；构建期 AI 迁 api internal；Git webhook + 每日 reconcile。

## 阶段验收
- [ ] push 触发 incremental pipeline
- [ ] analyze → kb_analysis + summaries-v1.json
- [ ] docpack → kb_chunks
- [ ] portal/vuepress build 不再直接调 Provider Key
`
)

w(
  'platform-epic-phase3.md',
  `# Epic Phase 3 — DocHub

## 阶段目标
dochub.acongm.com 编辑/预览/发布；DB 版本化；db_to_git 可配置直推。

## 阶段验收
- [ ] 文件树 + 命名空间
- [ ] 草稿 + 预览 token
- [ ] 发布同步 Git + sync_failures 可重试
`
)

w(
  'platform-epic-phase4.md',
  `# Epic Phase 4 — Portal 上线

## 阶段目标
Fumadocs portal 替换 vuepress；www.acongm.com 切换。

## 阶段验收
- [ ] 文档全量迁移
- [ ] ChatDrawer + 摘要
- [ ] vuepress 标注 legacy
`
)

w(
  'platform-epic-phase5.md',
  `# Epic Phase 5 — 加固

## 阶段目标
kb/debug、Thread 持久化、Supabase backup、npm 私有化计划。

## 阶段验收
- [ ] chat 调试面板
- [ ] GHA nightly backup
- [ ] openClaw 7天 ping 文档
`
)

w(
  'platform-p0-01.md',
  `# P0-01 编写 repo-map.md + branch-strategy.md

## 背景
多仓库协作需要单一文档描述职责、pnpm link 路径、Vercel Root Directory。

## 任务
- [ ] 创建 `docs/repo-map.md`：各仓目录、域名、依赖关系图
- [ ] 创建 `docs/branch-strategy.md`：`platform/v2` 流程、tag `v2-phase-N`
- [ ] 记录 pnpm link 示例（chat/dochub 消费 portal/auth packages）

## 验收标准
- [ ] 新开发者仅凭文档可完成 link + 本地启动 auth/chat
- [ ] 写明 Vercel 五项目 Root Directory 表

## 非范围
- 不写实现代码
`
)

w(
  'platform-p0-02.md',
  `# P0-02 编写 sync-protocol.md（Git↔DB 状态机）

## 背景
文档三路来源（Git、DocHub、pipeline）需统一同步语义，避免内容丢失。

## 任务
- [ ] 定义 `document_versions` / `document_heads.sync_state` 状态机
- [ ] 描述 git_to_db、db_to_git、reconcile 触发条件
- [ ] 定义 sync_failures 重试策略
- [ ] 与 api P2-09、P3-07 对齐

## 验收标准
- [ ] 文档含冲突场景（git_ahead / db_ahead / conflict）处理表
- [ ] 明确「版本只追加、不覆盖 content」原则
`
)

w(
  'platform-p4-06.md',
  `# P4-06 域名切换 Runbook

## 任务
- [ ] 编写并行预览 vs 直接切换两种 Runbook
- [ ] DNS、Vercel domain、cookie 检查清单
- [ ] 回滚步骤（指回 vuepress gh-pages）

## 验收标准
- [ ] Runbook 可在 30 分钟内执行完毕（含检查项）
`
)

w(
  'platform-p5-05.md',
  `# P5-05 openClaw 7 天 Supabase ping 文档

## 任务
- [ ] 记录 openClaw 定时访问 URL（auth 或 api health）
- [ ] 记录 Supabase 免费档 pause 恢复步骤
- [ ] 与 GHA backup 互补说明

## 验收标准
- [ ] openClaw 可按文档配置 cron
`
)

w(
  'platform-p5-06.md',
  `# P5-06 @acongm/* 迁 npm 私有包计划

## 任务
- [ ] 列出待发布包及目标仓库名
- [ ] 版本策略 semver + changelog
- [ ] 从 pnpm link 迁移到 workspace:^ / npm 的步骤

## 验收标准
- [ ] 迁移 checklist 完整，无遗漏包
`
)

// auth
w(
  'auth-epic.md',
  `# Epic — auth 仓库

## 职责
- 部署 **auth.acongm.com**（OAuth 中枢）
- 维护 **packages/auth-client**、**packages/config**（暂存，后迁 npm）

## 分支
platform/v2

## Phase Issue
- P0-03 ~ P0-06

## pnpm link 消费方
portal、chat、dochub
`
)

w(
  'auth-p0-03.md',
  `# P0-03 初始化 pnpm workspace + apps/auth

## 目标
auth 仓可本地 dev + Vercel 部署骨架。

## 任务
- [ ] `pnpm-workspace.yaml`：`apps/*`、`packages/*`
- [ ] `apps/auth`：Next.js App Router
- [ ] 路由占位：`/login`、`/callback`、`/logout`
- [ ] `apps/auth/vercel.json`

## 验收标准
- [ ] `pnpm dev` 启动 auth 应用
- [ ] TypeScript + ESLint 与 portal 对齐

## 依赖
无（Phase 0 首个 auth 任务）

## 输出
- 目录结构文档写入 README
`
)

w(
  'auth-p0-04.md',
  `# P0-04 packages/auth-client

## 目标
各前端仓共用 Supabase 浏览器客户端 + `.acongm.com` cookie。

## 任务
- [ ] `@acongm/auth-client`：createBrowserClient / createServerClient
- [ ] cookie `domain: '.acongm.com'`
- [ ] hooks：`useSession`、`useUser`、`signInWithGitHub`、`signOut`
- [ ] 导出 TypeScript 类型

## 验收标准
- [ ] portal/chat 通过 `pnpm link` 可 import
- [ ] 登录后 `www` 与 `chat` 子域可读 session

## 依赖
- P0-03
- Supabase 项目已创建

## 安全
- 仅使用 anon key 于客户端；service role 禁止出现在前端
`
)

w(
  'auth-p0-05.md',
  `# P0-05 packages/config + site.config.yaml

## 目标
换仓库/域名/分支时只改配置文件。

## 任务
- [ ] `site.config.yaml` 模板（portal/chat/dochub/api 域名、git 分支、限额）
- [ ] `loadSiteConfig()` 读取 env 覆盖
- [ ] 导出 `getApiBase()`、`getPublishBranch()` 等

## 验收标准
- [ ] auth、api 可读取同一 schema
- [ ] `publishBranch` 可设为 `master` 或 `dev`

## 配置示例字段
\`\`\`yaml
git:
  owner: Acongm
  repo: portal
  contentDir: content/docs
  defaultBranch: master
  publishBranch: master
limits:
  anon: { chatPerDay: 20 }
\`\`\`
`
)

w(
  'auth-p0-06.md',
  `# P0-06 部署 Vercel auth.acongm.com

## 任务
- [ ] 创建 Vercel Project，Root Directory `apps/auth`
- [ ] 环境变量：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 绑定域名 auth.acongm.com
- [ ] Supabase Redirect URLs 配置

## 验收标准
- [ ] 生产环境 OAuth 完整流程
- [ ] HTTPS + cookie 跨子域验证通过

## 依赖
- P0-04、P0-05
`
)

// portal epic + issues - abbreviated structure with full detail
w(
  'portal-epic.md',
  `# Epic — portal 仓库

## 职责
- **www.acongm.com** Fumadocs 文档站（vuepress React 重构）
- 暂存 packages：`chat-ui`、`ui-theme`、`kb-types`

## 分支 platform/v2

## Phase
P1、P2、P4 相关 Issue 见本仓 labels
`
)

w(
  'portal-p1-01.md',
  `# P1-01 初始化 portal + Fumadocs 骨架

## 任务
- [ ] Next.js + Fumadocs MDX（`fumadocs-ui`、`fumadocs-mdx`）
- [ ] `content/docs` 空目录 + 1 篇试点文档
- [ ] `pnpm-workspace` + packages 目录
- [ ] Vercel 配置草案

## 验收
- [ ] 本地 `/docs` 可访问
- [ ] 与 vuepress 同 base path 策略文档化
`
)

w(
  'portal-p1-02.md',
  `# P1-02 packages/ui-theme（Codex 主题）

## 任务
- [ ] CSS 变量：背景、边框、accent（Codex 深色为主）
- [ ] Tailwind preset 或 `@acongm/ui-theme` 导出
- [ ] chat、dochub 可 link 使用

## 验收
- [ ] Drawer/全页 Chat 视觉一致
`
)

w(
  'portal-p1-03.md',
  `# P1-03 packages/chat-ui

## 任务
- [ ] assistant-ui + Codex theme 集成
- [ ] `ChatFullscreen` 布局（供 chat 仓）
- [ ] `ChatDrawer` 布局（供 portal）
- [ ] 依赖 agent-session-sdk 逻辑（可先内联后抽包）

## 验收
- [ ] 流式 Markdown 渲染
- [ ] 停止/重试/复制

## 依赖
- P1-02、api P1-08
`
)

w(
  'portal-p1-04.md',
  `# P1-04 packages/kb-types

## 任务
- [ ] `ChatV1StreamEvent`、`SummariesV1Snapshot` 等类型
- [ ] 与 `specs/ai-chat-api.md` 对齐
- [ ] 可选：从 api OpenAPI 生成

## 验收
- [ ] portal/chat/api 引用无 any 泄漏
`
)

w(
  'portal-p1-10.md',
  `# P1-10 ChatDrawer embed

## 任务
- [ ] 文档页挂载 Drawer，传 `pagePath/moduleKey/title`
- [ ] 打开时不跳转 chat.acongm.com
- [ ] 与 `ai-assist` 响应式断点对齐（≥1180 分栏）

## 验收
- [ ] 当前文章上下文进入 chat 请求 body
`
)

w(
  'portal-p2-10.md',
  `# P2-10 摘要双通道读取

## 任务
- [ ] 优先读构建产物 `summaries-v1.json`
- [ ] fallback `GET api/kb/summary?path=`
- [ ] Chat 首条摘要卡片 UI

## 依赖 api P2-07
`
)

w(
  'portal-p4-01.md',
  `# P4-01 MD 批量迁移脚本

## 任务
- [ ] 从 Acongm/vuepress `docs/` 复制到 `content/docs`
- [ ] 生成 Fumadocs `meta.json`（从 config.ts sidebar 转换）
- [ ] 校验链接、frontmatter

## 验收
- [ ] 18+ 分类导航可用
- [ ] 抽样 20 篇 diff 无丢内容
`
)

w(
  'portal-p4-02.md',
  `# P4-02 Vue → MDX 组件映射表

## 任务
- [ ] 扫描 vuepress 自定义组件用法
- [ ] 映射到 React MDX 组件或纯 Markdown 替代

## 输出
docs/mdx-component-map.md
`
)

w(
  'portal-p4-03.md',
  `# P4-03 响应式 + TOC

## 任务
- [ ] 对齐 vuepress TOC、navbar、sidebar 行为
- [ ] 320~1440 无横向溢出（沿用 v1 设计成功标准）

## 验收
- [ ] 与 superpowers v1 设计 8 项宽度检查通过
`
)

w(
  'portal-p4-04.md',
  `# P4-04 ChatDrawer context 绑定

## 任务
- [ ] Fumadocs 路由变化更新 context
- [ ] 切换文档不清空同页 session 历史（可选 sessionStorage）

## 依赖 P1-10
`
)

w(
  'portal-p4-05.md',
  `# P4-05 部署 www.acongm.com

## 任务
- [ ] Vercel Project portal，Root `apps/portal`
- [ ] 绑定 www.acongm.com
- [ ] 执行 platform P4-06 Runbook

## 依赖 P4-01~04
`
)

// chat
w(
  'chat-epic.md',
  `# Epic — chat 仓库 → chat.acongm.com

## 职责
全页 Chat + 参数调试（Phase 5）

## link 依赖
- `@acongm/auth-client` from auth
- `@acongm/chat-ui` from portal
- `@acongm/ui-theme` from portal
`
)

w(
  'chat-p1-05.md',
  `# P1-05 Next + Vercel chat.acongm.com

## 任务
- [ ] Next App Router 脚手架
- [ ] Vercel 绑定 chat.acongm.com
- [ ] README：pnpm link 步骤

## 验收
- [ ] 空壳部署可访问
`
)

w(
  'chat-p1-06.md',
  `# P1-06 接入 chat-ui + auth-client

## 任务
- [ ] `ChatFullscreen` 全页布局
- [ ] `useChatRuntime` 对接 api v1 stream
- [ ] package.json link 路径

## 依赖 portal P1-03、auth P0-04
`
)

w(
  'chat-p1-07.md',
  `# P1-07 匿名限额 + client_id

## 任务
- [ ] 生成/持久化 `x-client-id`（localStorage）
- [ ] 未登录显示限额提示
- [ ] 429 友好错误

## 依赖 api P1-08
`
)

w(
  'chat-p5-02.md',
  `# P5-02 Sources + kb/debug 面板

## 依赖 api P5-01
`
)

w(
  'chat-p5-03.md',
  `# P5-03 Thread Supabase 持久化

## 任务
- [ ] chat_threads / chat_messages 读写
- [ ] 登录用户跨设备；匿名仅 client_id 本地

## 依赖 api schema + auth
`
)

// dochub
w(
  'dochub-epic.md',
  `# Epic — dochub → dochub.acongm.com

编辑、预览、发布知识库；link auth-client + ui-theme
`
)

w(
  'dochub-p3-01.md',
  `# P3-01 Next + dochub.acongm.com

## 任务
- [ ] 脚手架 + Vercel
- [ ] 登录门禁（editor+）

## 依赖 auth P0-06
`
)

w(
  'dochub-p3-02.md',
  `# P3-02 命名空间 + 文件树

## 任务
- [ ] 对接 `GET /dochub/tree?ns=`
- [ ] 模块空间切换 UI

## 依赖 api P3-06
`
)

w(
  'dochub-p3-03.md',
  `# P3-03 编辑 + 草稿自动保存

## 任务
- [ ] MDX/Markdown 编辑器
- [ ] 定时保存 draft 到 api

## 验收
- [ ] 断网恢复不丢草稿
`
)

w(
  'dochub-p3-04.md',
  `# P3-04 独立预览 token

## 任务
- [ ] 生成预览链接 `dochub.acongm.com/preview/:token`
- [ ] 只读、可分享、过期时间

## 依赖 api P3-08
`
)

w(
  'dochub-p3-05.md',
  `# P3-05 发布 + 同步状态 UI

## 任务
- [ ] admin 直推可配置分支
- [ ] 展示 sync_state / 重试按钮

## 依赖 api P3-07
`
)

// api
w(
  'api-epic.md',
  `# Epic — API node-vercel-starter → api.acongm.com

模块：auth、ai、kb、dochub、sync、webhooks、internal

分支 platform/v2
`
)

w(
  'api-p0-07.md',
  `# P0-07 Supabase migration

## 表
- dochub_namespaces, document_versions, document_heads
- kb_analysis, kb_chunks, sync_jobs, sync_failures
- chat_threads, chat_messages（可先 Phase 5）

## 验收
- [ ] migration SQL 在 Supabase 可执行
- [ ] RLS 策略草案

## 输出
supabase/migrations/001_platform_v2.sql
`
)

w(
  'api-p0-08.md',
  `# P0-08 JWT + 角色中间件

## 任务
- [ ] 校验 Supabase JWT
- [ ] 角色：viewer / editor / admin
- [ ] 匿名 tier 识别

## 验收
- [ ] 保护 dochub 写接口；chat 匿名可访问
`
)

w(
  'api-p0-09.md',
  `# P0-09 site.config 读取

## 任务
- [ ] 服务端加载 git.publishBranch、limits
- [ ] 与 auth packages/config schema 一致
`
)

w(
  'api-p1-08.md',
  `# P1-08 ai stream + rate limit

## 任务
- [ ] anon/user 日限额（Redis 或 DB 计数）
- [ ] CORS 仅 *.acongm.com
- [ ] AbortController 兼容

## 验收
- [ ] 超限返回 429 + 结构化 error
`
)

w(
  'api-p1-09.md',
  `# P1-09 结构化日志

## 字段
user_id, client_id, conversation_id, call_source, tokens, model

## 禁止记录完整 user message 到第三方（可配置采样）
`
)

w(
  'api-p2-01.md',
  `# P2-01 kb-pipeline 骨架

## 任务
- [ ] `packages/kb-pipeline` 阶段接口 PipelineContext
- [ ] CLI：`kb-pipeline run --stage all|--mode incremental`

## 输出
阶段函数：ingest→normalize→hash→analyze→index→publish→sync-db
`
)

w(
  'api-p2-02.md',
  `# P2-02 ingest + normalize + hash

## 任务
- [ ] git diff 变更列表
- [ ] sourceHash / analysisHash（对齐现有 summaries-v1）
`
)

w(
  'api-p2-03.md',
  `# P2-03 analyze → internal/ai-forward

## 任务
- [ ] 仅 hash 变化时调 AI
- [ ] 写入 kb_analysis + summary json
- [ ] Key 仅 internal 模块

## 非范围
替换 docpack 检索（那是 P2-04）
`
)

w(
  'api-p2-04.md',
  `# P2-04 docpack index

## 任务
- [ ] 接入 @rlemaigre/docpack 或等价
- [ ] 写入 kb_chunks

## 验收
- [ ] 检索 API 可命中 chunk
`
)

w(
  'api-p2-05.md',
  `# P2-05 publish summaries-v1.json

## 任务
- [ ] 生成静态 JSON 供 portal build 消费
- [ ] 上传到 portal 构建输入或 CDN
`
)

w(
  'api-p2-06.md',
  `# P2-06 GitHub webhook

## 任务
- [ ] push 事件 → sync_jobs
- [ ] 签名校验

## 触发 incremental pipeline
`
)

w(
  'api-p2-07.md',
  `# P2-07 GET /kb/summary、/kb/retrieve

## 任务
- [ ] summary by path
- [ ] retrieve：scope、topK、moduleKey

## 验收
- [ ] portal P2-10 可对接
`
)

w(
  'api-p2-08.md',
  `# P2-08 reconcile cron 00:00 + sync_failures

## 任务
- [ ] 比对 git hash vs db
- [ ] 写 sync_failures，不删版本

## Cron
UTC 16:00 = 北京 00:00
`
)

w(
  'api-p2-09.md',
  `# P2-09 git_to_db

## 任务
- [ ] push 后写入 document_versions
- [ ] 更新 document_heads

## 见 platform sync-protocol.md
`
)

w(
  'api-p3-06.md',
  `# P3-06 dochub CRUD

## REST
tree, get doc, put draft, list versions
`
)

w(
  'api-p3-07.md',
  `# P3-07 db_to_git

## 任务
- [ ] GitHub App
- [ ] admin → push publishBranch（可配置）
- [ ] editor → PR

## 失败
写 sync_failures，保留 DB 版本
`
)

w(
  'api-p3-08.md',
  `# P3-08 preview token API

## POST 生成 / GET 校验只读内容
`
)

w(
  'api-p3-09.md',
  `# P3-09 角色校验

## editor+ 写；admin 直推；viewer 只读
`
)

w(
  'api-p5-01.md',
  `# P5-01 GET /kb/debug

## 返回 retrieval 结果 + context_quality，不调模型
`
)

w(
  'api-p5-04.md',
  `# P5-04 Supabase backup GHA

## 任务
- [ ] nightly pg_dump → GitHub encrypted artifact
- [ ] 保留 7 天

## 可与 openClaw ping 文档联动
`
)

// vuepress
w(
  'vuepress-epic.md',
  `# Epic — vuepress legacy

## 职责
过渡维护；不新增 AI 功能；内容源直至 portal P4。

## 分支 platform/v2-portal（可选）
`
)

w(
  'vuepress-p2-11.md',
  `# P2-11 冻结 build:ai:v1

## 任务
- [ ] vercel.json / GHA 移除 AI 调用，改由 api webhook
- [ ] README 注明冻结日期

## 依赖 api P2-03 就绪后执行
`
)

w(
  'vuepress-p4-07.md',
  `# P4-07 legacy 归档

## 任务
- [ ] README 顶部 legacy 横幅
- [ ] 指向 portal 仓库
- [ ] archive 或只读分支策略
`
)

console.log('Generated body files in', BODIES)

// create-issues runner inline if called with --create
if (process.argv.includes('--create')) {
  const config = JSON.parse(readFileSync(join(ROOT, 'issues.json'), 'utf8'))
  const repoFilter = process.argv.find((a) => a.startsWith('--repo='))?.split('=')[1]

  for (const [repo, labels] of Object.entries(config.labels)) {
    void labels
  }

  for (const label of config.labels) {
    for (const repo of Object.keys(config.repos)) {
      if (repoFilter && repo !== repoFilter) continue
      try {
        execSync(
          `gh label create "${label.name}" -R ${repo} --color "${label.color}" --description "${label.description}" 2>/dev/null || true`,
          { stdio: 'ignore' }
        )
      } catch {
        // repo may not exist
      }
    }
  }

  const created = {}
  for (const [repo, issues] of Object.entries(config.repos)) {
    if (repoFilter && repo !== repoFilter) continue
    created[repo] = []
    for (const issue of issues) {
      const bodyPath = join(ROOT, issue.bodyFile)
      if (!existsSync(bodyPath)) {
        console.error('Missing body:', bodyPath)
        continue
      }
      const labelArgs = issue.labels.map((l) => `--label "${l}"`).join(' ')
      try {
        const url = execSync(
          `gh issue create -R ${repo} --title "${issue.title.replace(/"/g, '\\"')}" --body-file "${bodyPath}" ${labelArgs}`,
          { encoding: 'utf8' }
        ).trim()
        created[repo].push({ title: issue.title, url })
        console.log('OK', repo, url)
      } catch (e) {
        console.error('FAIL', repo, issue.title, e.message?.slice(0, 200))
      }
    }
  }
  writeFileSync(join(ROOT, 'created-issues.json'), JSON.stringify(created, null, 2))
}
