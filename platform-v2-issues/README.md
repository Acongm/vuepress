# Platform v2 Issues

本目录包含各仓库 GitHub Issue 批量创建工具与文档。

## 一键创建（需 gh CLI 登录且有仓库权限）

```bash
# 全部可访问仓库
node platform-v2-issues/create-issues.mjs

# 仅 API
node platform-v2-issues/create-issues.mjs --repo=Acongm/node-vercel-starter

# 预览不创建
node platform-v2-issues/create-issues.mjs --dry-run
```

## 仓库与 Issue 数量

| 仓库 | Issues |
|------|--------|
| Acongm/platform | 12 |
| Acongm/auth | 5 |
| Acongm/portal | 12 |
| Acongm/chat | 6 |
| Acongm/dochub | 6 |
| Acongm/node-vercel-starter | 21 |
| ~~Acongm/vuepress~~ | **不建 Issue**（方案不修改） |

## 新仓库权限

若 `auth/portal/chat/dochub/platform` 为私有仓，需：

1. GitHub → Settings → 为 Cursor/GitHub App 授权访问这些仓库
2. 或在本机用个人 token 运行 `create-issues.mjs`

创建结果写入 `created-issues.json`。

## 开发顺序

1. Phase 0: auth + api P0 + platform P0 文档
2. Phase 1: portal/chat packages + api P1
3. Phase 2: api kb-pipeline
4. Phase 3: dochub + api dochub
5. Phase 4: portal 迁移
6. Phase 5: 加固

分支：各仓 `platform/v2`。
