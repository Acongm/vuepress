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

## 运行方式

```bash
node tools/generate-interview-prep.mjs --help
```
