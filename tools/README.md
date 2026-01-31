# tools（无外部依赖）

本目录只允许使用 **Node.js 标准库**，不引入任何第三方依赖，不依赖构建工具。

## 环境要求

- Node.js >= 18

## 脚本

- `ai-doc.mjs` - **AI 文档整理工具**
  - `update-config`：更新 `docs/.vuepress/config.ts`（sidebar + navbar）
  - `changelog`：追加 `AI_CHANGELOG.md`
  - `commit`：git add + commit + push
  - `full`：一键执行以上全部
  - `categories`：列出所有可用分类
  - 配套配置：`knowledge-map.json`（前端知识图谱）
- `generate-interview-prep.mjs`
  - `generate`：从简历与面试大纲提取信息，增量更新知识单元（仅改写 AUTO-GENERATED 区块）
  - `index`：生成/更新 `interview-prep/INDEX.md`
  - `reorder`：调整 `INDEX.md` 的优先级顺序
  - `blindspots`：生成/更新 `interview-prep/BLINDSPOTS.md`
  - `validate`：校验扁平规则与 frontmatter 必填字段
- `validate-tech-profile.mjs`
  - 校验 `interview-prep/tech-profile__entries.json` 的结构完整性与证据口径
  - 支持 `--strict`（warnings 也视为失败）

## 运行方式

```bash
node tools/ai-doc.mjs --help
node tools/generate-interview-prep.mjs --help
```

## AI 文档整理（/ai-doc 工作流）

```bash
# 查看所有可用分类
node tools/ai-doc.mjs categories

# 更新 config.ts（sidebar + navbar）
node tools/ai-doc.mjs update-config \
  --category JavaScript \
  --file /JavaScript/promise-chain.md

# 一键完成：更新配置 + 日志 + git commit + push
node tools/ai-doc.mjs full \
  --category JavaScript \
  --file /JavaScript/promise-chain.md \
  --title "Promise链式调用" \
  --questions "Promise如何链式调用,then返回值" \
  --model "Claude Opus 4.5"
```

## Tech Profile Validation（技术画像校验）

```bash
# 快速校验（warnings 不失败）
node tools/validate-tech-profile.mjs --file interview-prep/tech-profile__entries.json

# 严格校验（warnings 也失败）
node tools/validate-tech-profile.mjs --file interview-prep/tech-profile__entries.json --strict
```

## Pass/Fail Signals（验收信号）

- **PASS**：exit code = 0，输出包含 `RESULT: PASS`
- **FAIL**：exit code = 1，输出包含 `ERRORS:`（或 `--strict` 下 `WARNINGS:` 触发失败）
  <<<<<<< Current (Your changes)
  =======

## Examples as Evidence（用示例做证据）

当不引入测试框架时，允许用“可复现步骤 + 明确验收信号”的 README 作为条目证据：

- `examples/perf-lcp-skeleton/README.md`：LCP/首屏（骨架/预渲染）的验证口径与回滚策略
- `examples/bundling-treeshake/README.md`：tree-shaking 与体积预算（<15KB）的验证步骤
- `examples/micro-frontend-isolation/README.md`：qiankun 微前端隔离/通信/发布协同检查清单
  > > > > > > > Incoming (Background Agent changes)
