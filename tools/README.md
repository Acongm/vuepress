# tools（无外部依赖）

本目录只允许使用 **Node.js 标准库**，不引入任何第三方依赖，不依赖构建工具。

## 环境要求

- Node.js >= 18

## 脚本

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
node tools/generate-interview-prep.mjs --help
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
