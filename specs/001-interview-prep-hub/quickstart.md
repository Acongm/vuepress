# Quickstart: 高级前端面试准备中枢（极简/自包含）

本 quickstart 用于验证当前实现是否符合 spec 与 plan：

- 无外部依赖（仅 Node 标准库）
- 知识单元扁平化（`interview-prep/` 无子目录）
- 增量生成不覆盖人工区块
- 可执行 examples 可运行

## 0. 环境

- Node.js >= 18

## 1. 校验（validate）

```bash
node tools/generate-interview-prep.mjs validate
```

预期：输出 `validate: OK`。

## 2. 生成/更新知识单元（generate）

```bash
node tools/generate-interview-prep.mjs generate
```

预期：

- `interview-prep/` 下生成/更新：
  - `project__*.md`
  - `tech__*.md`
  - `matrix__*.md`
- 文件包含 `AUTO-GENERATED` 区块与四模块标题

## 2.1 增量生成不覆盖人工区块（Manual 保留）

1. 打开任意知识单元（例如 `interview-prep/tech__webpack.md`），在 `## 我的补充（Manual）` 下追加一行，例如：

- `MANUAL_MARKER: keep-me`

2. 再次运行：

```bash
node tools/generate-interview-prep.mjs generate
```

3. 预期：

- 该 `MANUAL_MARKER` 仍然存在（脚本只改写 AUTO-GENERATED 区块，不覆盖人工区块）

## 3. 生成总纲（index）

```bash
node tools/generate-interview-prep.mjs index
```

预期：`interview-prep/INDEX.md` 生成/更新，包含 ORDER 区块与按类型索引。

## 4. 调整优先级（reorder）

```bash
node tools/generate-interview-prep.mjs reorder tech__webpack --before tech__react
```

预期：ORDER 区块更新，且重新生成 index 后顺序仍保持。

## 5. 盲区清单（blindspots）

在任意知识单元的 “模拟问答” 中保留若干条 `- [ ]` 未完成项，然后执行：

```bash
node tools/generate-interview-prep.mjs blindspots
```

预期：生成/更新 `interview-prep/BLINDSPOTS.md`。

## 6. examples 可运行验证

```bash
node examples/umd-esm-dual-output/node-test.mjs
node examples/remote-module-loading/loader.mjs
node examples/no-deps-form-renderer/render.mjs
```
