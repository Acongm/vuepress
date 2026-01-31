# tools（无外部依赖）

本目录只允许使用 **Node.js 标准库**，不引入任何第三方依赖，不依赖构建工具。

## 环境要求

- Node.js >= 18

## 脚本结构

大部分脚本已移至 `.agents/skills/ai-doc/scripts/`，本目录保留入口和基础工具。

### 本目录脚本

| 脚本                          | 说明                      |
| ----------------------------- | ------------------------- |
| `ai-doc.mjs`                  | AI 文档整理工具（主入口） |
| `knowledge-map.json`          | 前端知识图谱配置          |
| `generate-interview-prep.mjs` | 面试准备知识单元生成      |
| `validate-tech-profile.mjs`   | 技术档案校验              |
| `extract-fhmi-by-resume.mjs`  | 从简历提取面试题          |

### Skill 脚本（.agents/skills/ai-doc/scripts/）

| 脚本                     | 说明                 | 用法                                          |
| ------------------------ | -------------------- | --------------------------------------------- |
| `sync-nav-config.mjs`    | 从 JSON 同步导航配置 | `node ...scripts/sync-nav-config.mjs --write` |
| `generate-doc-index.mjs` | 生成文档索引和标签   | `node ...scripts/generate-doc-index.mjs`      |

### Skill 配置（.agents/skills/ai-doc/references/）

| 文件                        | 说明                           |
| --------------------------- | ------------------------------ |
| `nav-config.json`           | 导航配置源（navbar + sidebar） |
| `docs-index.json`           | 文档索引（自动生成）           |
| `docs-index.md`             | 文档索引报告（自动生成）       |
| `frontend-knowledge-map.md` | 独立前端知识图谱               |

## 运行方式

```bash
# 本目录脚本
node tools/ai-doc.mjs --help
node tools/generate-interview-prep.mjs --help

# Skill 脚本
node .agents/skills/ai-doc/scripts/sync-nav-config.mjs --help
node .agents/skills/ai-doc/scripts/generate-doc-index.mjs
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
