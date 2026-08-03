#!/usr/bin/env node
/**
 * 批量创建 Platform v2 GitHub Issues
 * 用法: node platform-v2-issues/create-issues.mjs [--repo Acongm/vuepress] [--dry-run]
 */

import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))

const LABELS = [
  { name: 'platform-v2', color: '0E8A16', desc: 'Platform v2 程序' },
  { name: 'epic', color: '5319E7', desc: 'Epic' },
  { name: 'phase-0', color: '1D76DB', desc: 'Phase 0' },
  { name: 'phase-1', color: '1D76DB', desc: 'Phase 1' },
  { name: 'phase-2', color: '1D76DB', desc: 'Phase 2' },
  { name: 'phase-3', color: '1D76DB', desc: 'Phase 3' },
  { name: 'phase-4', color: '1D76DB', desc: 'Phase 4' },
  { name: 'phase-5', color: '1D76DB', desc: 'Phase 5' },
  { name: 'priority-p0', color: 'B60205', desc: 'P0' },
  { name: 'priority-p1', color: 'D93F0B', desc: 'P1' },
  { name: 'priority-p2', color: 'FBCA04', desc: 'P2' }
]

const FOOTER = `
---
## 程序关联
- 总控: Acongm/platform → [Program] Platform v2 总控看板
- 分支: platform/v2 → 验收后 merge master
- 文档: Acongm/vuepress/platform-v2-issues/
`

function body(main) {
  return main.trim() + FOOTER
}

/** @type {Record<string, Array<{title: string, labels: string[], body: string}>} */
const ISSUES = {
  'Acongm/platform': [
    {
      title: '[Program] Platform v2 总控看板',
      labels: ['platform-v2', 'epic'],
      body: body(`
# Platform v2 总控看板

## 目标
五端协作 portal + dochub + chat + auth + api；文档 DB 版本化；kb-pipeline+docpack；Git↔DB 同步。

## 域名
| 域名 | 仓库 |
|------|------|
| www.acongm.com | Acongm/portal |
| dochub.acongm.com | Acongm/dochub |
| chat.acongm.com | Acongm/chat |
| auth.acongm.com | Acongm/auth |
| api.acongm.com | Acongm/node-vercel-starter |

## 阶段
- [ ] Phase 0 认证地基
- [ ] Phase 1 Chat
- [ ] Phase 2 KB 管道
- [ ] Phase 3 DocHub
- [ ] Phase 4 Portal 上线
- [ ] Phase 5 加固

## 决策
- Cookie .acongm.com；auth.acongm.com OAuth 中枢
- admin 直推，publishBranch 可配置
- kb-pipeline + docpack；AI 摘要走 api internal
- Supabase 会话；匿名限额
- 包暂 pnpm link
`)
    },
    {
      title: '[Epic Phase 0] 契约与认证地基',
      labels: ['platform-v2', 'epic', 'phase-0'],
      body: body('阶段验收: auth 登录、api JWT、Supabase migration、site.config。子 Issue: auth P0-03~06, api P0-07~09, platform P0-01~02。')
    },
    {
      title: '[Epic Phase 1] Chat 核心',
      labels: ['platform-v2', 'epic', 'phase-1'],
      body: body('chat.acongm.com 全页 + portal ChatDrawer + rate limit + 日志。')
    },
    {
      title: '[Epic Phase 2] KB 管道',
      labels: ['platform-v2', 'epic', 'phase-2'],
      body: body('kb-pipeline + docpack；AI 迁 internal；webhook + reconcile。')
    },
    {
      title: '[Epic Phase 3] DocHub',
      labels: ['platform-v2', 'epic', 'phase-3'],
      body: body('dochub.acongm.com 编辑预览发布；双向同步。')
    },
    {
      title: '[Epic Phase 4] Portal 上线',
      labels: ['platform-v2', 'epic', 'phase-4'],
      body: body('Fumadocs 替换 vuepress；www 切换。')
    },
    {
      title: '[Epic Phase 5] 加固与 npm 私有化',
      labels: ['platform-v2', 'epic', 'phase-5'],
      body: body('debug、backup、openClaw ping、npm 计划。')
    },
    {
      title: '[P0-01] 编写 repo-map.md + branch-strategy.md',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body(`
## 任务
- docs/repo-map.md：仓库、域名、pnpm link、Vercel Root Directory
- docs/branch-strategy.md：platform/v2 流程

## 验收
新同学可按文档完成 link 与本地启动。
`)
    },
    {
      title: '[P0-02] 编写 sync-protocol.md（Git↔DB 状态机）',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body(`
## 任务
- document_versions / sync_state 状态机
- git_to_db、db_to_git、reconcile、sync_failures 重试

## 验收
冲突场景表完整；版本只追加不覆盖。
`)
    },
    {
      title: '[P4-06] 域名切换 Runbook',
      labels: ['platform-v2', 'phase-4', 'priority-p2'],
      body: body('并行预览 vs 直接切换；DNS/Vercel/cookie 清单；回滚步骤。')
    },
    {
      title: '[P5-05] openClaw 7 天 Supabase ping 文档',
      labels: ['platform-v2', 'phase-5', 'priority-p2'],
      body: body('openClaw 定时访问；Supabase pause 恢复；与 GHA backup 配合。')
    },
    {
      title: '[P5-06] @acongm/* 迁 npm 私有包计划',
      labels: ['platform-v2', 'phase-5', 'priority-p2'],
      body: body('包清单、semver、从 pnpm link 迁移步骤。')
    }
  ],
  'Acongm/auth': [
    {
      title: '[Epic] Platform v2 — auth 仓库',
      labels: ['platform-v2', 'epic'],
      body: body('auth.acongm.com；packages/auth-client、config。分支 platform/v2。')
    },
    {
      title: '[P0-03] 初始化 pnpm workspace + apps/auth',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body(`
## 任务
- pnpm-workspace：apps/*、packages/*
- apps/auth Next.js：/login /callback /logout
- vercel.json

## 验收
pnpm dev 可启动。
`)
    },
    {
      title: '[P0-04] packages/auth-client（Supabase + .acongm.com cookie）',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body(`
## 任务
- @acongm/auth-client：SSR cookie domain .acongm.com
- useSession / signIn / signOut

## 验收
portal/chat link 后子域可读 session。

## 依赖 P0-03
`)
    },
    {
      title: '[P0-05] packages/config + site.config.yaml',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body(`
## 任务
- site.config.yaml：域名、git.publishBranch、limits
- loadSiteConfig()

## 验收
auth 与 api 读取同一 schema。
`)
    },
    {
      title: '[P0-06] 部署 Vercel auth.acongm.com',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body(`
## 任务
- Vercel Root apps/auth
- 域名 auth.acongm.com
- Supabase Redirect URLs

## 依赖 P0-04、P0-05
`)
    }
  ],
  'Acongm/portal': [
    {
      title: '[Epic] Platform v2 — portal 仓库',
      labels: ['platform-v2', 'epic'],
      body: body('www.acongm.com Fumadocs；暂存 chat-ui、ui-theme、kb-types。')
    },
    {
      title: '[P1-01] 初始化 portal + Fumadocs 骨架',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('Next + Fumadocs；content/docs 试点；pnpm workspace。')
    },
    {
      title: '[P1-02] packages/ui-theme（Codex 主题）',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('@acongm/ui-theme CSS 变量；chat/dochub 可 link。')
    },
    {
      title: '[P1-03] packages/chat-ui（assistant-ui + Drawer/Fullscreen）',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('ChatDrawer + ChatFullscreen；流式 Markdown；停止重试。依赖 P1-02、api P1-08。')
    },
    {
      title: '[P1-04] packages/kb-types',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('ChatV1、SummariesV1 类型；对齐 specs/ai-chat-api.md。')
    },
    {
      title: '[P1-10] ChatDrawer embed 接入文档页',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('不跳转 chat；传 pagePath/moduleKey；响应式分栏。')
    },
    {
      title: '[P2-10] 摘要：summaries-v1.json + API 兜底',
      labels: ['platform-v2', 'phase-2', 'priority-p2'],
      body: body('依赖 api GET /kb/summary。')
    },
    {
      title: '[P4-01] 批量迁移 MD + meta.json 脚本',
      labels: ['platform-v2', 'phase-4', 'priority-p1'],
      body: body('vuepress/docs → content/docs；sidebar 转 meta.json。')
    },
    {
      title: '[P4-02] Vue 自定义块 → MDX 映射表',
      labels: ['platform-v2', 'phase-4', 'priority-p2'],
      body: body('输出 docs/mdx-component-map.md。')
    },
    {
      title: '[P4-03] 响应式布局 + TOC',
      labels: ['platform-v2', 'phase-4', 'priority-p2'],
      body: body('320~1440 无溢出；对齐 v1 设计标准。')
    },
    {
      title: '[P4-04] ChatDrawer 绑定文档 context',
      labels: ['platform-v2', 'phase-4', 'priority-p1'],
      body: body('路由切换更新 context。')
    },
    {
      title: '[P4-05] 部署 www.acongm.com',
      labels: ['platform-v2', 'phase-4', 'priority-p1'],
      body: body('Vercel portal；执行 P4-06 Runbook。')
    }
  ],
  'Acongm/chat': [
    {
      title: '[Epic] Platform v2 — chat 仓库',
      labels: ['platform-v2', 'epic'],
      body: body('chat.acongm.com；link auth-client、chat-ui、ui-theme。')
    },
    {
      title: '[P1-05] Next 脚手架 + Vercel chat.acongm.com',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('README 写 pnpm link 步骤。')
    },
    {
      title: '[P1-06] 接入 chat-ui + auth-client',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('ChatFullscreen；api v1 stream。依赖 portal P1-03。')
    },
    {
      title: '[P1-07] 匿名限额 + x-client-id',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('localStorage client_id；429 提示。依赖 api P1-08。')
    },
    {
      title: '[P5-02] Sources + kb/debug 面板',
      labels: ['platform-v2', 'phase-5', 'priority-p2'],
      body: body('依赖 api P5-01。')
    },
    {
      title: '[P5-03] Thread Supabase 持久化',
      labels: ['platform-v2', 'phase-5', 'priority-p2'],
      body: body('chat_threads/messages；登录用户跨设备。')
    }
  ],
  'Acongm/dochub': [
    {
      title: '[Epic] Platform v2 — dochub 仓库',
      labels: ['platform-v2', 'epic'],
      body: body('dochub.acongm.com 编辑预览发布。')
    },
    {
      title: '[P3-01] Next + dochub.acongm.com',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('登录门禁 editor+。依赖 auth P0-06。')
    },
    {
      title: '[P3-02] 命名空间 + 文件树 UI',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('GET /dochub/tree。依赖 api P3-06。')
    },
    {
      title: '[P3-03] MDX 编辑 + 草稿自动保存',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('定时保存 draft；断网恢复。')
    },
    {
      title: '[P3-04] 独立预览 token 页',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('dochub.acongm.com/preview/:token。依赖 api P3-08。')
    },
    {
      title: '[P3-05] 发布 + 同步状态 UI',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('admin 直推可配置分支；sync_failed 重试。依赖 api P3-07。')
    }
  ],
  'Acongm/node-vercel-starter': [
    {
      title: '[Epic] Platform v2 — API (node-vercel-starter)',
      labels: ['platform-v2', 'epic'],
      body: body('api.acongm.com；模块 auth/ai/kb/dochub/sync/webhooks/internal。分支 platform/v2。')
    },
    {
      title: '[P0-07] Supabase migration（文档版本化 + 同步表）',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body(`
## 表
document_versions, document_heads, kb_analysis, kb_chunks, sync_jobs, sync_failures, chat_threads/messages

## 输出
supabase/migrations/001_platform_v2.sql
`)
    },
    {
      title: '[P0-08] auth 模块 JWT + 角色中间件',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body('viewer/editor/admin；匿名 tier。')
    },
    {
      title: '[P0-09] 读取 site.config（分支/域名/限额）',
      labels: ['platform-v2', 'phase-0', 'priority-p0'],
      body: body('与 auth packages/config schema 一致。')
    },
    {
      title: '[P1-08] ai/v1/stream 加固 + rate limit',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('anon/user 日限额；CORS *.acongm.com；429。')
    },
    {
      title: '[P1-09] 结构化对话日志',
      labels: ['platform-v2', 'phase-1', 'priority-p1'],
      body: body('user_id, client_id, conversation_id, call_source, tokens。')
    },
    {
      title: '[P2-01] packages/kb-pipeline 骨架',
      labels: ['platform-v2', 'phase-2', 'priority-p1'],
      body: body('PipelineContext；CLI kb-pipeline run。')
    },
    {
      title: '[P2-02] ingest + normalize + hash',
      labels: ['platform-v2', 'phase-2', 'priority-p1'],
      body: body('git diff；sourceHash/analysisHash。')
    },
    {
      title: '[P2-03] analyze → internal/ai-forward（AI 摘要）',
      labels: ['platform-v2', 'phase-2', 'priority-p1'],
      body: body('hash 变化才调 AI；写 kb_analysis。Key 仅 internal。')
    },
    {
      title: '[P2-04] index → docpack + kb_chunks',
      labels: ['platform-v2', 'phase-2', 'priority-p1'],
      body: body('RAG 检索用；不替代摘要。')
    },
    {
      title: '[P2-05] publish → summaries-v1.json',
      labels: ['platform-v2', 'phase-2', 'priority-p1'],
      body: body('portal build 消费静态 JSON。')
    },
    {
      title: '[P2-06] webhooks/github → sync_jobs',
      labels: ['platform-v2', 'phase-2', 'priority-p1'],
      body: body('push 签名校验；触发 incremental。')
    },
    {
      title: '[P2-07] GET /kb/summary、/kb/retrieve',
      labels: ['platform-v2', 'phase-2', 'priority-p1'],
      body: body('portal P2-10 对接。')
    },
    {
      title: '[P2-08] cron reconcile 00:00 + sync_failures',
      labels: ['platform-v2', 'phase-2', 'priority-p2'],
      body: body('UTC 16:00 北京 00:00；不删版本。')
    },
    {
      title: '[P2-09] git_to_db（document_versions）',
      labels: ['platform-v2', 'phase-2', 'priority-p1'],
      body: body('见 platform sync-protocol.md。')
    },
    {
      title: '[P3-06] dochub CRUD + document_versions',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('tree、draft、versions API。')
    },
    {
      title: '[P3-07] db_to_git（GitHub App 可配置直推）',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('admin push publishBranch；editor PR；失败写 sync_failures。')
    },
    {
      title: '[P3-08] preview token API',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('只读预览 token 生成与校验。')
    },
    {
      title: '[P3-09] editor/admin 角色校验',
      labels: ['platform-v2', 'phase-3', 'priority-p1'],
      body: body('dochub 写接口保护。')
    },
    {
      title: '[P5-01] GET /kb/debug 参数调试 API',
      labels: ['platform-v2', 'phase-5', 'priority-p2'],
      body: body('返回 retrieval + context_quality，不调模型。')
    },
    {
      title: '[P5-04] Supabase nightly backup → GitHub artifact',
      labels: ['platform-v2', 'phase-5', 'priority-p2'],
      body: body('GHA pg_dump；保留 7 天。')
    }
  ],
  'Acongm/vuepress': [
    {
      title: '[Epic] Platform v2 — vuepress（legacy 过渡）',
      labels: ['platform-v2', 'epic'],
      body: body('过渡维护；不新增 AI；内容源直至 portal P4。')
    },
    {
      title: '[P2-11] 冻结 build:ai:v1 至 portal 切换',
      labels: ['platform-v2', 'phase-2', 'priority-p2'],
      body: body('vercel/GHA 移除 AI 调用；改 api webhook。依赖 api P2-03。')
    },
    {
      title: '[P4-07] 标注 legacy + 归档说明',
      labels: ['platform-v2', 'phase-4', 'priority-p2'],
      body: body('README legacy 横幅；指向 portal。')
    }
  ]
}

function ensureLabels(repo) {
  for (const l of LABELS) {
    try {
      execSync(
        `gh label create "${l.name}" -R ${repo} --color "${l.color}" --description "${l.desc}"`,
        { stdio: 'ignore' }
      )
    } catch {
      // exists
    }
  }
}

function createIssue(repo, issue, dryRun) {
  const tmp = join(ROOT, '.tmp-body.md')
  writeFileSync(tmp, issue.body, 'utf8')
  const labels = issue.labels.map((l) => `--label "${l}"`).join(' ')
  const cmdNoLabels = `gh issue create -R ${repo} --title "${issue.title.replace(/"/g, '\\"')}" --body-file "${tmp}"`
  const cmdWithLabels = `${cmdNoLabels} ${labels}`
  if (dryRun) {
    console.log('[dry-run]', repo, issue.title)
    return null
  }
  try {
    return execSync(cmdWithLabels, { encoding: 'utf8' }).trim()
  } catch {
    return execSync(cmdNoLabels, { encoding: 'utf8' }).trim()
  }
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const repoFilter = args.find((a) => a.startsWith('--repo='))?.split('=')[1]

const created = {}

for (const [repo, issues] of Object.entries(ISSUES)) {
  if (repoFilter && repo !== repoFilter) continue
  try {
    execSync(`gh repo view ${repo}`, { stdio: 'ignore' })
  } catch {
    console.error('SKIP (no access):', repo)
    continue
  }
  ensureLabels(repo)
  created[repo] = []
  for (const issue of issues) {
    try {
      const url = createIssue(repo, issue, dryRun)
      if (url) {
        created[repo].push({ title: issue.title, url })
        console.log('OK', url)
      }
    } catch (e) {
      console.error('FAIL', repo, issue.title, String(e.message || e).slice(0, 300))
    }
  }
}

writeFileSync(join(ROOT, 'created-issues.json'), JSON.stringify(created, null, 2))
console.log('Done. See created-issues.json')
