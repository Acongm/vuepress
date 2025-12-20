# examples（可执行验证）

本目录用于放置“最小可运行示例”，验证关键原理可落地。

要求：

- **无外部依赖**：仅使用 Node.js 标准库（必要时使用浏览器原生能力）
- 每个示例目录必须包含 README，给出可复制的运行步骤与验证点

## 目录

- `umd-esm-dual-output/`：UMD vs ESM 的差异与使用方式
- `remote-module-loading/`：远程模块加载（无网络依赖，使用 file/data URL）
- `no-deps-form-renderer/`：无依赖 schema → html 渲染（概念验证）
