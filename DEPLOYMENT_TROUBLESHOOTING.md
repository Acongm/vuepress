# 部署故障排查指南

## 当前状态

**日期**: 2026-02-03  
**分支**: `copilot/organize-knowledge-base`  
**工作流**: GitHub Actions Build and Deploy Demo

## 常见部署失败原因

### 1. GitHub Secrets 未配置

**症状**: 部署失败，提示权限错误

**解决方案**:
```
1. 访问: https://github.com/Acongm/vuepress/settings/secrets/actions
2. 确认以下 Secrets 已配置:
   - ACONGM_VUEPRESS (必需) - GitHub Personal Access Token
   - GLM_API_KEY (可选) - 用于生成 AI 摘要
```

**创建 PAT (Personal Access Token)**:
```
1. GitHub 头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 勾选权限: repo (全部), workflow
4. 生成后复制 token
5. 添加到仓库 Secrets: ACONGM_VUEPRESS
```

### 2. 构建输出目录错误

**症状**: 部署成功但页面空白或 404

**检查配置**:
```yaml
# .github/workflows/blank.yml
folder: vuepress  # 必须与 package.json 中的构建输出一致
```

**验证本地构建**:
```bash
npm run build
ls -la vuepress/  # 确认输出目录
```

### 3. 依赖安装失败

**症状**: 构建时 npm install 失败

**解决方案**:
```bash
# 本地测试
npm install
npm run build

# 如果有错误，更新 package-lock.json
rm -rf node_modules package-lock.json
npm install
```

### 4. VuePress 配置错误

**症状**: 构建失败，提示配置错误

**检查文件**:
- `docs/.vuepress/config.ts` - 主配置文件
- `docs/.vuepress/clientAppEnhance.ts` - 客户端增强
- `docs/.vuepress/theme/` - 主题配置

**常见问题**:
- 导入路径错误
- 组件未正确注册
- TypeScript 类型错误

### 5. AI 摘要生成失败

**症状**: AI 摘要生成步骤失败，但不影响部署

**原因**:
- 未配置 `GLM_API_KEY`
- API 配额用尽
- 网络连接问题

**解决方案**:
```yaml
# 工作流已配置容错
node tools/generate-summaries.mjs || echo "AI 摘要生成跳过"

# 不影响部署，只是 AI 功能不可用
```

## 触发部署的方法

### 方法 1: 推送代码（推荐）

```bash
# 做一个小改动
echo "" >> README.md
git add README.md
git commit -m "chore: trigger deployment"
git push origin copilot/organize-knowledge-base
```

### 方法 2: 空提交

```bash
git commit --allow-empty -m "chore: trigger deployment"
git push origin copilot/organize-knowledge-base
```

### 方法 3: 手动触发（如果配置了）

```yaml
# 在 .github/workflows/blank.yml 添加
on:
  workflow_dispatch:  # 允许手动触发

# 然后在 GitHub Actions 页面手动运行
```

### 方法 4: 修改工作流文件

```bash
# 在工作流文件末尾添加注释
echo "# Updated $(date)" >> .github/workflows/blank.yml
git add .github/workflows/blank.yml
git commit -m "chore: update workflow timestamp"
git push
```

## 查看部署状态

### 1. GitHub Actions 日志

**访问**: https://github.com/Acongm/vuepress/actions

**查看内容**:
- 工作流运行状态（成功/失败）
- 详细日志输出
- 错误信息

### 2. 检查 gh-pages 分支

```bash
# 查看远程分支
git ls-remote --heads origin

# 应该看到 gh-pages 分支
# refs/heads/gh-pages
```

### 3. 访问部署的网站

**URL**: https://acongm.github.io/vuepress/

**检查点**:
- 页面是否正常加载
- 内容是否最新
- AI 提炼按钮是否显示（右下角）

## 本次部署检查清单

- [ ] 确认 ACONGM_VUEPRESS Secret 已配置
- [ ] 确认分支配置正确: copilot/organize-knowledge-base
- [ ] 本地构建测试通过: `npm run build`
- [ ] 所有必需文件存在:
  - [ ] docs/.vuepress/config.ts
  - [ ] docs/.vuepress/clientAppEnhance.ts
  - [ ] docs/.vuepress/components/AISummaryButton.vue
  - [ ] docs/.vuepress/theme/layouts/Layout.vue
  - [ ] tools/generate-summaries.mjs
- [ ] 推送代码触发部署
- [ ] 查看 Actions 运行日志
- [ ] 访问网站验证

## 紧急回滚

如果新版本有问题，快速回滚到 master 分支:

```bash
# 推送到 master 会覆盖 gh-pages
git checkout master
git push origin master

# 或手动回滚 gh-pages 分支
git checkout gh-pages
git reset --hard <previous-commit>
git push origin gh-pages --force
```

## 获取帮助

1. **查看日志**: Actions 页面的详细日志
2. **本地调试**: 运行 `npm run dev` 测试
3. **查看文档**: 
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - [WORKFLOW_SETUP_COMPLETE.md](./WORKFLOW_SETUP_COMPLETE.md)
   - [GITHUB_ACTIONS_GUIDE.md](./GITHUB_ACTIONS_GUIDE.md)

## 当前问题排查

**问题**: 部署未成功

**可能原因**:
1. GitHub Secrets 未配置
2. 工作流权限不足
3. 构建错误
4. 网络问题

**建议操作**:
1. ✅ 检查 Secrets 配置
2. ✅ 查看 Actions 日志找到具体错误
3. ✅ 做一个小改动重新触发部署
4. ✅ 本地测试构建命令

---

**更新时间**: 2026-02-03 16:30  
**下次检查**: 推送后 2-8 分钟查看 Actions 状态
