# 远程模块加载（无网络依赖）

目标：用 `import()` + URL（file/data）演示“远程模块加载”的核心概念：**地址 → 拉取/解析 → 执行 → 缓存**。

## 运行

```bash
node examples/remote-module-loading/loader.mjs
```

## 验证点

- `file:`：从本地文件 URL 动态加载模块
- `data:`：从 data URL 动态加载模块（模拟“远端返回 JS 文本”）
