# 部署指南

## 🚀 工作流配置

### 自动部署分支

当前配置的自动部署分支：
- ✅ `master` - 主分支（生产环境）
- ✅ `copilot/organize-knowledge-base` - AI 功能分支（测试环境）

### 触发机制

当向以上分支推送代码时，GitHub Actions 将自动：

1. **检出代码**
2. **安装 Node.js 20**
3. **安装依赖** (`npm install`)
4. **生成 AI 摘要** (如果配置了 `GLM_API_KEY`)
   - 扫描所有 Markdown 文档
   - 使用 GLM-4 生成 2-3 句话摘要
   - 保存到 `docs/.vuepress/public/summaries.json`
   - 如果未配置 API Key，创建空文件（不影响构建）
5. **构建项目** (`npm run build`)
6. **部署到 GitHub Pages** (`gh-pages` 分支)

### 查看部署结果

推送代码后：

1. **查看工作流运行状态**
   - 访问：https://github.com/Acongm/vuepress/actions
   - 找到最新的 "GitHub Actions Build and Deploy Demo" 工作流
   - 点击查看详细日志

2. **访问部署的网站**
   - 等待工作流完成（通常 2-5 分钟）
   - 访问：https://acongm.github.io/vuepress/
   - 打开任意文档页面
   - 点击右下角的 AI 提炼按钮查看效果

3. **检查 AI 摘要功能**
   - 如果配置了 `GLM_API_KEY`，AI 提炼按钮会显示摘要
   - 如果未配置，按钮会显示"未启用"提示

## 🔑 必需的 Secrets

确保在仓库设置中配置以下 Secrets：

### 1. `ACONGM_VUEPRESS` (必需)
- **用途**：部署到 GitHub Pages
- **类型**：GitHub Personal Access Token (PAT)
- **权限**：`repo` (完整仓库访问权限)
- **配置位置**：Settings → Secrets → Actions → New repository secret

### 2. `GLM_API_KEY` (可选)
- **用途**：生成 AI 文档摘要
- **类型**：智谱 AI GLM-4 API Key
- **获取方式**：https://open.bigmodel.cn/
- **配置位置**：Settings → Secrets → Actions → New repository secret
- **注意**：如果不配置，AI 摘要功能将被禁用（不影响网站正常运行）

## 📝 本地测试

在推送到远程分支前，可以先本地测试：

```bash
# 1. 安装依赖
npm install

# 2. 本地测试 AI 摘要生成（可选）
export GLM_API_KEY="your-api-key"
node tools/generate-summaries.mjs

# 3. 本地构建
npm run build

# 4. 本地预览（可选）
npm run dev
```

## 🔧 工作流文件

### 主部署工作流
- **文件**：`.github/workflows/blank.yml`
- **名称**：GitHub Actions Build and Deploy Demo
- **触发分支**：`master`, `copilot/organize-knowledge-base`
- **功能**：构建 + 生成 AI 摘要 + 部署

### AI 文档生成工作流
- **文件**：`.github/workflows/ai-doc-generation.yml`
- **名称**：AI 文档生成工作流
- **触发方式**：
  - Issues 添加 `ai-doc` 标签
  - Issue 评论包含 `/ai-doc 主题`
  - 手动触发
- **功能**：使用 GLM-4 生成文档并创建 PR

## 🎯 当前配置目的

**为什么添加 `copilot/organize-knowledge-base` 分支？**

1. **测试 AI 功能**：在合并到 master 前，先在测试分支部署查看效果
2. **验证集成**：确保 AI 摘要生成、文档管理等功能正常工作
3. **预览界面**：查看 AI 提炼按钮的实际效果
4. **性能测试**：评估构建时间和部署流程

## ⚠️ 注意事项

### 部署冲突
- 两个分支部署到同一个 `gh-pages` 分支
- 后推送的分支会覆盖先推送的
- 建议：测试完成后及时合并或删除测试分支

### 成本考虑
- 每次推送都会触发 AI 摘要生成（如果配置了 GLM_API_KEY）
- 174 个文档约 ¥0.26 / 次
- 频繁推送会增加 API 成本
- 建议：测试时可以暂时不配置 GLM_API_KEY

### 构建时间
- 不生成 AI 摘要：约 2-3 分钟
- 生成 AI 摘要：约 5-8 分钟（首次）
- 使用缓存：约 2-3 分钟（后续）

## 📚 相关文档

- [PR 功能详解](./PR_FEATURES_EXPLAINED.md)
- [AI 摘要功能](./AI_SUMMARY_FEATURE.md)
- [GitHub Actions 指南](./GITHUB_ACTIONS_GUIDE.md)
- [快速开始](./QUICK_START.md)

## 🐛 故障排查

### 工作流失败

**问题**：工作流运行失败
**解决方法**：
1. 检查 Actions 日志
2. 确认 `ACONGM_VUEPRESS` Secret 已配置
3. 确认 PAT 有足够权限
4. 检查 Node.js 版本兼容性

### AI 摘要生成失败

**问题**：AI 摘要生成报错但构建继续
**解决方法**：
1. 这是正常的，不会影响部署
2. 如果需要 AI 功能，配置 `GLM_API_KEY`
3. 检查 API Key 是否有效
4. 确认 API 额度是否充足

### 部署后看不到效果

**问题**：部署成功但网站没有更新
**解决方法**：
1. 等待 1-2 分钟（GitHub Pages 缓存）
2. 强制刷新浏览器（Ctrl+F5）
3. 清除浏览器缓存
4. 使用无痕模式访问

---

**最后更新**：2026-02-03
**维护者**：Acongm
