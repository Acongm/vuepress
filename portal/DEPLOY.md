# Portal 部署指南（Vercel + www.acongm.com）

## 1. 推送到 Acongm/portal

Cloud Agent 若无 portal 写权限，在本机用 **acongm** 账号执行：

```bash
cd portal   # vuepress 仓内 portal/ 目录，或独立 portal 仓根目录
node scripts/push-to-portal-repo.mjs
```

或手动：

```bash
git remote add portal https://github.com/Acongm/portal.git
git checkout -b cursor/portal-init-8d71
git push -u portal cursor/portal-init-8d71
```

然后在 GitHub 创建 PR：`cursor/portal-init-8d71` → `main`。

## 2. Vercel 项目配置

在 [Vercel Dashboard](https://vercel.com) → Add New Project → Import `Acongm/portal`：

| 设置项 | 值 |
|--------|-----|
| Framework Preset | Next.js |
| Root Directory | `apps/portal` |
| Install Command | `cd ../.. && pnpm install` |
| Build Command | `cd ../.. && pnpm --filter @acongm/portal build` |
| Output Directory | （留空，Next.js 默认） |
| Node.js Version | 22.x |

若 Root Directory 设为仓库根目录，则使用根目录 `vercel.json`（已配置 monorepo 构建）。

### 环境变量（可选，后续 Chat/AI）

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_API_URL` | `https://api.acongm.com` |

### 自定义域名

1. Project → Settings → Domains → Add `www.acongm.com`
2. 按提示在 DNS 添加 CNAME 到 `cname.vercel-dns.com`
3. 可选：将根域 `acongm.com` 301 到 `www`

## 3. 本地验证

```bash
pnpm install
pnpm migrate:docs   # 需同级 vuepress/docs
pnpm build
pnpm dev          # http://localhost:3000
```
