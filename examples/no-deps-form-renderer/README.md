# 无依赖表单渲染（Schema → HTML）

目标：用最小代码验证“无依赖表单渲染”的核心：**schema 驱动 + 校验/错误边界 + 渲染输出**。

## 运行

```bash
node examples/no-deps-form-renderer/render.mjs
```

## 验证点

- schema 描述字段（type/label/required）
- 渲染器输出 HTML 字符串（可用于 SSR/导出/快照）
- 输入校验失败时能输出可定位的错误
