# AI v1 摘要流水线验证指南

用于验证 **GitHub Actions（gh-pages）** 与 **Vercel** 两条流水线中「构建期 AI 分析」是否符合预期。

## 流水线差异

| 项目         | GitHub Actions                                          | Vercel                             |
| ------------ | ------------------------------------------------------- | ---------------------------------- |
| 触发         | push `master` / `copilot/organize-knowledge-base`       | 每次部署                           |
| 覆盖率检查   | `check:ai-v1 -- --strict`（失败则阻断）                 | `check:ai-v1`（非 strict）         |
| 快照恢复     | cache + `SUMMARIES_FALLBACK_URL=https://www.acongm.com` | 同左（`restore-summaries-v1.mjs`） |
| 增量 AI      | `npm run build:ai:v1`                                   | 同左                               |
| 构建后 smoke | `smoke:ai` + `smoke:summaries-v1`                       | 同左                               |

核心命令链见 `.github/workflows/blank.yml` 与 `vercel.json`。

## 增量 AI 预期行为

1. 读取 `.cache/ai-summaries-v1.json`（或从线上 `summaries-v1.json` 恢复）
2. 对比 `docs/**/*.md` 的 `sourceHash` / `analysisHash`
3. **仅对新增、变更、此前 `error` 的文档调用 AI**（`aiCalls` 应等于待处理数）
4. 未变更文档复用缓存，不重复计费
5. 输出 `docs/.vuepress/public/summaries-v1.json` 供前端静态读取

## 本地镜像验证（提交前）

```bash
# 1. 增量逻辑单元验证（无需真实 API Key）
npm run verify:incremental-ai

# 2. 客户端路径/状态文案
npm run test:ai-client-v1

# 3. 构建脚本行为（10 项）
npm run test:ai-v1

# 4. 覆盖率（与 GHA strict 一致）
npm run check:ai-v1 -- --strict

# 5. 干跑：不调用 provider，验证缓存保留
AI_SUMMARY_DRY_RUN=1 npm run build:ai:v1

# 6. 生产构建 + smoke
VERCEL=1 npm run build
npm run smoke:ai
npm run smoke:summaries-v1
```

**通过标准：**

- `verify:incremental-ai` 输出 `[verify-incremental-ai] passed`
- `check:ai-v1 --strict` 显示 `missing: 0`，`coverage` ≥ 88%（以当前种子快照为准）
- `smoke:summaries-v1` 显示 `passed (N success entries)`

## 线上验证清单（部署后）

### 1. 检查流水线日志

在 GHA / Vercel 构建日志中确认：

- `restore-summaries-v1` 成功（或 cache hit）
- `build:ai:v1` 段中 **`aiCalls` 仅等于本次变更 md 数量**（纯文档 typo 修复应 ≈ 1，无 md 变更应 ≈ 0）
- `check:ai-v1` 通过
- `smoke:summaries-v1` 通过

### 2. 检查静态产物

```bash
curl -s https://www.acongm.com/summaries-v1.json | node -e "
let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
  const s=JSON.parse(d);
  const ok=Object.values(s.files).filter(f=>f.status==='success').length;
  console.log('files',Object.keys(s.files).length,'success',ok);
})"
```

### 3. 抽查页面 UI

| 页面                          | 预期                                                                  |
| ----------------------------- | --------------------------------------------------------------------- |
| `/react/react16.html`         | AI 面板显示「构建期 AI 提炼」+ CI 摘要正文                            |
| `/mark/01-React核心原理.html` | 显示「本文摘要生成失败，将在后续构建自动重试。」（快照 status=error） |
| 章节 README                   | 显示「章节索引页，请打开具体文章查看摘要。」                          |

### 4. 对话接口（可选）

- 生产：浏览器请求 `https://api.acongm.com/api/ai/v1/chat/stream`
- 本地 dev：`VUEPRESS_AI_CHAT_API=/api/ai/v1/chat/stream` + Vite 代理 `/api → api.acongm.com`

## GHA 所需 Secrets

| Secret            | 用途                        |
| ----------------- | --------------------------- |
| `AI_API_KEY`      | `build:ai:v1` 调用 DeepSeek |
| `ACONGM_VUEPRESS` | gh-pages 部署 PAT           |

Vercel 环境变量同理配置 `AI_API_KEY`；可选 `SUMMARIES_FALLBACK_URL`。

## 常见问题

| 现象                         | 可能原因                                                   |
| ---------------------------- | ---------------------------------------------------------- |
| 全文「暂无构建期摘要」       | `summaries-v1.json` 未部署或路径未 decode（中文 URL 编码） |
| `aiCalls` 全量暴涨           | cache 丢失且 fallback 失败；检查 `SUMMARIES_FALLBACK_URL`  |
| strict 失败 `missing: N`     | 新 md 未纳入构建；push 后等 GHA 增量补齐                   |
| 本地 `__PWA_POPUP_LOCALES__` | dev 模式需在 `config.ts` `define` 注入（已修复）           |

## 相关文件

- `tools/ai-summary-v1.mjs` — 增量计划与 hash
- `tools/generate-summaries-v1.mjs` — 构建入口
- `tools/check-ai-summary-v1-coverage.mjs` — 覆盖率
- `tools/smoke-summaries-v1.mjs` — 产物 smoke
- `tools/verify-incremental-ai.mjs` — 增量断言
- `docs/.vuepress/public/summaries-v1.json` — 线上快照
