#!/usr/bin/env node
/**
 * 将 Platform v2 全部 Issue 创建到 Acongm/vuepress，
 * 用标题前缀 [目标仓] 与正文「目标仓库」标记，便于日后迁移。
 *
 * 用法:
 *   node platform-v2-issues/create-all-on-vuepress.mjs
 *   node platform-v2-issues/create-all-on-vuepress.mjs --dry-run
 */

import { execSync } from 'node:child_process'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const REPO = 'Acongm/vuepress'
const STATE = join(ROOT, 'vuepress-created.json')

const FOOTER = `
---
## 暂存说明
本 Issue 暂存在 Acongm/vuepress，用于 Platform v2 统一跟踪。
迁移时：按「目标仓库」标签搬到对应仓，并关闭本 Issue。
分支约定：各目标仓使用 platform/v2。
方案边界：不改造 vuepress 产品代码；文档站以 portal 为准。
`

function body(main) {
  return main.trim() + FOOTER
}

function issue(target, title, text) {
  return {
    target,
    title: `[${target}] ${title}`,
    body: body(`## 目标仓库\n\`${target === 'api' ? 'Acongm/node-vercel-starter' : `Acongm/${target}`}\`\n\n${text}`)
  }
}

const ISSUES = [
  // —— platform ——
  issue(
    'platform',
    '[Program] Platform v2 总控看板',
    `
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
`
  ),
  issue('platform', '[Epic Phase 0] 契约与认证地基', '验收：auth 登录、api JWT、Supabase migration、site.config。子 Issue：auth P0-03~06、api P0-07~09、platform P0-01~02。'),
  issue('platform', '[Epic Phase 1] Chat 核心', 'chat 全页 + portal ChatDrawer + rate limit + 日志。'),
  issue('platform', '[Epic Phase 2] KB 管道', 'kb-pipeline + docpack；AI 迁 internal；webhook + reconcile。'),
  issue('platform', '[Epic Phase 3] DocHub', 'dochub.acongm.com 编辑预览发布；双向同步。'),
  issue('platform', '[Epic Phase 4] Portal 上线', 'Fumadocs portal 替换 vuepress（仅内容迁移，不改 vuepress 仓代码）。'),
  issue('platform', '[Epic Phase 5] 加固与 npm 私有化', 'debug、backup、openClaw ping、npm 计划。'),
  issue(
    'platform',
    '[P0-01] 编写 repo-map.md + branch-strategy.md',
    `
## 任务
- docs/repo-map.md：仓库、域名、pnpm link、Vercel Root
- docs/branch-strategy.md：platform/v2 流程

## 验收
新同学可按文档完成 link 与本地启动。
`
  ),
  issue(
    'platform',
    '[P0-02] 编写 sync-protocol.md（Git↔DB 状态机）',
    `
## 任务
- document_versions / sync_state 状态机
- git_to_db、db_to_git、reconcile、sync_failures

## 验收
冲突场景表完整；版本只追加不覆盖。
`
  ),
  issue('platform', '[P4-06] 域名切换 Runbook', '并行预览 vs 直接切换；DNS/Vercel/cookie；回滚步骤。'),
  issue('platform', '[P5-05] openClaw 7 天 Supabase ping 文档', '定时访问；pause 恢复；与 GHA backup 配合。'),
  issue('platform', '[P5-06] @acongm/* 迁 npm 私有包计划', '包清单、semver、从 pnpm link 迁移步骤。'),

  // —— auth ——
  issue('auth', '[Epic] Platform v2 — auth', 'auth.acongm.com；packages/auth-client、config。分支 platform/v2。'),
  issue(
    'auth',
    '[P0-03] 初始化 pnpm workspace + apps/auth',
    `
## 任务
- pnpm-workspace：apps/*、packages/*
- apps/auth Next.js：/login /callback /logout
- vercel.json

## 验收
pnpm dev 可启动。
`
  ),
  issue(
    'auth',
    '[P0-04] packages/auth-client（Supabase + .acongm.com cookie）',
    `
## 任务
- @acongm/auth-client：SSR cookie domain .acongm.com
- useSession / signIn / signOut

## 验收
portal/chat link 后子域可读 session。

## 依赖 P0-03
`
  ),
  issue(
    'auth',
    '[P0-05] packages/config + site.config.yaml',
    `
## 任务
- site.config.yaml：域名、git.publishBranch、limits
- loadSiteConfig()

## 验收
auth 与 api 读取同一 schema。
`
  ),
  issue(
    'auth',
    '[P0-06] 部署 Vercel auth.acongm.com',
    `
## 任务
- Vercel Root apps/auth
- 域名 auth.acongm.com
- Supabase Redirect URLs

## 依赖 P0-04、P0-05
`
  ),

  // —— portal ——
  issue('portal', '[Epic] Platform v2 — portal', 'www.acongm.com Fumadocs；暂存 chat-ui、ui-theme、kb-types。'),
  issue('portal', '[P1-01] 初始化 portal + Fumadocs 骨架', 'Next + Fumadocs；content/docs 试点；pnpm workspace。'),
  issue('portal', '[P1-02] packages/ui-theme（Codex 主题）', '@acongm/ui-theme CSS 变量；chat/dochub 可 link。'),
  issue(
    'portal',
    '[P1-03] packages/chat-ui（assistant-ui + Drawer/Fullscreen）',
    'ChatDrawer + ChatFullscreen；流式 Markdown；停止重试。依赖 P1-02、api P1-08。'
  ),
  issue('portal', '[P1-04] packages/kb-types', 'ChatV1、SummariesV1 类型；对齐 ai-chat-api 契约。'),
  issue(
    'portal',
    '[P1-10] ChatDrawer embed 接入文档页',
    '不跳转 chat；传 pagePath/moduleKey；响应式分栏。'
  ),
  issue('portal', '[P2-10] 摘要：summaries-v1.json + API 兜底', '依赖 api GET /kb/summary。'),
  issue(
    'portal',
    '[P4-01] 批量迁移 MD + meta.json 脚本',
    '从 vuepress/docs **复制**到 portal/content/docs（不修改 vuepress）；sidebar 转 meta.json。'
  ),
  issue('portal', '[P4-02] Vue 自定义块 → MDX 映射表', '输出 docs/mdx-component-map.md。'),
  issue('portal', '[P4-03] 响应式布局 + TOC', '320~1440 无溢出；对齐 v1 设计标准。'),
  issue('portal', '[P4-04] ChatDrawer 绑定文档 context', '路由切换更新 context。'),
  issue('portal', '[P4-05] 部署 www.acongm.com', 'Vercel portal；执行 platform P4-06 Runbook。'),

  // —— chat ——
  issue('chat', '[Epic] Platform v2 — chat', 'chat.acongm.com；link auth-client、chat-ui、ui-theme。'),
  issue('chat', '[P1-05] Next 脚手架 + Vercel chat.acongm.com', 'README 写 pnpm link 步骤。'),
  issue('chat', '[P1-06] 接入 chat-ui + auth-client', 'ChatFullscreen；api v1 stream。依赖 portal P1-03。'),
  issue('chat', '[P1-07] 匿名限额 + x-client-id', 'localStorage client_id；429 提示。依赖 api P1-08。'),
  issue('chat', '[P5-02] Sources + kb/debug 面板', '依赖 api P5-01。'),
  issue('chat', '[P5-03] Thread Supabase 持久化', 'chat_threads/messages；登录用户跨设备。'),

  // —— dochub ——
  issue('dochub', '[Epic] Platform v2 — dochub', 'dochub.acongm.com 编辑预览发布。'),
  issue('dochub', '[P3-01] Next + dochub.acongm.com', '登录门禁 editor+。依赖 auth P0-06。'),
  issue('dochub', '[P3-02] 命名空间 + 文件树 UI', 'GET /dochub/tree。依赖 api P3-06。'),
  issue('dochub', '[P3-03] MDX 编辑 + 草稿自动保存', '定时保存 draft；断网恢复。'),
  issue('dochub', '[P3-04] 独立预览 token 页', 'dochub.acongm.com/preview/:token。依赖 api P3-08。'),
  issue(
    'dochub',
    '[P3-05] 发布 + 同步状态 UI',
    'admin 直推可配置分支；sync_failed 重试。依赖 api P3-07。'
  ),

  // —— api ——
  issue(
    'api',
    '[Epic] Platform v2 — API',
    `api.acongm.com（Acongm/node-vercel-starter）；模块 auth/ai/kb/dochub/sync/webhooks/internal。
镜像：原仓已有 https://github.com/Acongm/node-vercel-starter/issues/1`
  ),
  issue(
    'api',
    '[P0-07] Supabase migration（文档版本化 + 同步表）',
    `
## 表
document_versions, document_heads, kb_analysis, kb_chunks, sync_jobs, sync_failures, chat_threads/messages

## 输出
supabase/migrations/001_platform_v2.sql

镜像：https://github.com/Acongm/node-vercel-starter/issues/2
`
  ),
  issue('api', '[P0-08] auth 模块 JWT + 角色中间件', 'viewer/editor/admin；匿名 tier。镜像 #3'),
  issue('api', '[P0-09] 读取 site.config（分支/域名/限额）', '与 auth packages/config schema 一致。镜像 #4'),
  issue('api', '[P1-08] ai/v1/stream 加固 + rate limit', 'anon/user 日限额；CORS *.acongm.com；429。镜像 #5'),
  issue('api', '[P1-09] 结构化对话日志', 'user_id, client_id, conversation_id, call_source, tokens。镜像 #6'),
  issue('api', '[P2-01] packages/kb-pipeline 骨架', 'PipelineContext；CLI kb-pipeline run。镜像 #7'),
  issue('api', '[P2-02] ingest + normalize + hash', 'git diff；sourceHash/analysisHash。镜像 #8'),
  issue('api', '[P2-03] analyze → internal/ai-forward（AI 摘要）', 'hash 变化才调 AI；写 kb_analysis。Key 仅 internal。镜像 #9'),
  issue('api', '[P2-04] index → docpack + kb_chunks', 'RAG 检索用；不替代摘要。镜像 #10'),
  issue('api', '[P2-05] publish → summaries-v1.json', 'portal build 消费静态 JSON。镜像 #11'),
  issue('api', '[P2-06] webhooks/github → sync_jobs', 'push 签名校验；触发 incremental。镜像 #12'),
  issue('api', '[P2-07] GET /kb/summary、/kb/retrieve', 'portal P2-10 对接。镜像 #13'),
  issue('api', '[P2-08] cron reconcile 00:00 + sync_failures', 'UTC 16:00 北京 00:00；不删版本。镜像 #14'),
  issue('api', '[P2-09] git_to_db（document_versions）', '见 platform sync-protocol.md。镜像 #15'),
  issue('api', '[P3-06] dochub CRUD + document_versions', 'tree、draft、versions API。镜像 #16'),
  issue('api', '[P3-07] db_to_git（GitHub App 可配置直推）', 'admin push publishBranch；editor PR；失败写 sync_failures。镜像 #17'),
  issue('api', '[P3-08] preview token API', '只读预览 token 生成与校验。镜像 #18'),
  issue('api', '[P3-09] editor/admin 角色校验', 'dochub 写接口保护。镜像 #19'),
  issue('api', '[P5-01] GET /kb/debug 参数调试 API', '返回 retrieval + context_quality，不调模型。镜像 #20'),
  issue('api', '[P5-04] Supabase nightly backup → GitHub artifact', 'GHA pg_dump；保留 7 天。镜像 #21')
]

const dryRun = process.argv.includes('--dry-run')
const already = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { created: [] }
const doneTitles = new Set(already.created.map((x) => x.title))

const created = [...already.created]
let ok = 0
let skip = 0
let fail = 0

for (const item of ISSUES) {
  if (doneTitles.has(item.title)) {
    console.log('SKIP (exists in state)', item.title)
    skip++
    continue
  }
  if (dryRun) {
    console.log('[dry-run]', item.title)
    continue
  }
  const tmp = join(ROOT, '.tmp-body.md')
  writeFileSync(tmp, item.body, 'utf8')
  try {
    const url = execSync(
      `gh issue create -R ${REPO} --title "${item.title.replace(/"/g, '\\"')}" --body-file "${tmp}"`,
      { encoding: 'utf8' }
    ).trim()
    created.push({ target: item.target, title: item.title, url })
    writeFileSync(STATE, JSON.stringify({ created }, null, 2))
    console.log('OK', url)
    ok++
  } catch (e) {
    console.error('FAIL', item.title, String(e.message || e).slice(0, 200))
    fail++
  }
}

writeFileSync(STATE, JSON.stringify({ created, summary: { ok, skip, fail, total: ISSUES.length } }, null, 2))
console.log(JSON.stringify({ ok, skip, fail, total: ISSUES.length }, null, 2))
