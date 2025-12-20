# UMD vs ESM（最小示例）

目标：用最小代码理解“UMD 包装 vs ESM 模块”的差异（加载方式、导出形态、运行环境假设）。

## 运行（Node）

```bash
node examples/umd-esm-dual-output/node-test.mjs
```

## 运行（浏览器）

用任意静态方式打开 `examples/umd-esm-dual-output/index.html`（不需要构建）。

## 验证点

- ESM：`import { add } from './esm.mjs'`
- UMD：以 IIFE 方式向全局挂载 `window.UMD_LIB`
