# Acongm Portal

`www.acongm.com` — Fumadocs + Next.js 文档站（从 vuepress 迁移内容，不修改 vuepress 产品代码）。

## 开发

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000

## 文档迁移

从同级 `vuepress` 仓复制 `docs/` 并生成 `meta.json`：

```bash
pnpm migrate:docs
# 或指定路径
node scripts/migrate-from-vuepress.mjs --source=/path/to/vuepress/docs
```

## 结构

| 路径 | 说明 |
|------|------|
| `apps/portal` | Next.js + Fumadocs（Vercel Root） |
| `apps/portal/content/docs` | 文档内容 |
| `scripts/migrate-from-vuepress.mjs` | MD + sidebar → meta.json |

分支：`platform/v2`
