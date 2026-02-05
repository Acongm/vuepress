# AI 提炼功能使用指南

## 📚 目录

1. [功能概览](#功能概览)
2. [用户体验](#用户体验)
3. [生成摘要](#生成摘要)
4. [查看摘要](#查看摘要)
5. [高级功能](#高级功能)
6. [常见问题](#常见问题)

---

## 功能概览

您的 VuePress 知识库现已集成 **AI 内容提炼**功能，为每个文档页面提供智能摘要和分析。

### ✨ 核心特性

#### 1. 📝 详细摘要 (150-200 字)

不仅说明"是什么"，还解释"为什么重要"和"如何应用"

#### 2. 💡 核心要点 (3-5 个)

快速抓住文档的关键信息点

#### 3. 🔑 关键词提取

识别文档中的核心技术术语

#### 4. 🛠️ 技术栈识别

自动标记涉及的技术和框架

#### 5. 📊 难度评级

- 🟢 入门：适合初学者
- 🟡 进阶：需要一定基础
- 🔴 高级：深入技术细节

#### 6. 📚 内容类型

- 概念：理论和基础概念
- 实践：实际应用和示例
- 原理：深入的技术原理
- 工具：工具使用和配置

---

## 用户体验

### 访问文档页面

1. 打开任意技术文档
2. 查看右下角的 **"AI 提炼"** 悬浮按钮
3. 点击按钮展开摘要面板

### 摘要面板界面

```
┌─────────────────────────────────┐
│  ✅ AI 内容提炼            ✕    │
├─────────────────────────────────┤
│  [📝 摘要] [💡 详情]           │
│                                 │
│  📝 摘要标签页：                │
│  ┌───────────────────────────┐ │
│  │ "React 16 是 React 框架   │ │
│  │  的重大版本更新..."       │ │
│  └───────────────────────────┘ │
│                                 │
│  🟡 进阶  📚 原理 + 实践       │
├─────────────────────────────────┤
│  🛡️ GLM-4 增强                │
└─────────────────────────────────┘
```

### 标签页切换

#### 📝 摘要标签页

- 完整的文档摘要
- 难度和内容类型标签
- 快速了解文档概况

#### 💡 详情标签页

- **核心要点**：列表形式展示关键信息
- **关键词**：技术术语标签
- **技术栈**：相关技术标记

---

## 生成摘要

### 自动生成（推荐）

摘要在 **构建时自动生成**，无需手动操作。

#### 工作流程

```bash
# 1. 推送代码到 GitHub
git push origin main

# 2. GitHub Actions 自动触发
# 3. 运行摘要生成脚本
node tools/generate-summaries.mjs

# 4. 为所有文档生成 AI 摘要
# 5. 构建并部署站点
npm run build
npm run deploy
```

### 手动生成（本地开发）

如果您在本地开发，可以手动生成摘要：

```bash
# 1. 配置 API Key（如果还没有）
export GLM_API_KEY="your-glm-4-api-key"

# 2. 运行摘要生成脚本
node tools/generate-summaries.mjs

# 3. 查看生成结果
cat docs/.vuepress/public/summaries.json

# 4. 启动本地服务器测试
npm run dev
```

### 生成日志示例

```
[2026-02-04T12:00:00.000Z] ℹ️  开始生成文档摘要...
[2026-02-04T12:00:01.000Z] ℹ️  找到 174 个文档
[2026-02-04T12:00:01.500Z] ℹ️  调用 GLM-4 API (model: glm-4-flash)
[2026-02-04T12:00:03.000Z] ✅  [1/174] 处理: /react/react16.md
[2026-02-04T12:00:03.500Z] ✅  生成成功: React 16 是 React 框架的重大版本更新...
[2026-02-04T12:00:04.000Z] ℹ️  [2/174] 处理: /JavaScript/promise.md
...
[2026-02-04T12:05:00.000Z] ✅  完成！成功: 170, 失败: 4
[2026-02-04T12:05:00.100Z] ℹ️  摘要文件已保存: docs/.vuepress/public/summaries.json
```

---

## 查看摘要

### 在浏览器中查看

1. **打开文档页面**

   - 访问任意文档，如 `/react/react16.html`

2. **点击 AI 提炼按钮**

   - 位于页面右下角
   - 紫色渐变按钮，带有灯泡图标

3. **查看摘要标签页**

   - 阅读详细摘要
   - 查看难度和内容类型

4. **切换到详情标签页**
   - 浏览核心要点列表
   - 查看关键词和技术栈标签
   - 点击标签进行探索

### 摘要内容示例

#### 📝 摘要示例

**文档**: React 16 新特性

**摘要内容**:

> React 16 是 React 框架的重大版本更新，引入了革命性的 Fiber 架构，从根本上改变了组件的渲染机制。通过时间切片和优先级调度，实现了可中断的异步渲染，显著提升了大型应用的用户体验。新增的 Hooks API 让函数组件拥有了状态管理和生命周期能力，使组件逻辑更加简洁和可复用。这些特性特别适用于需要高性能和复杂状态管理的现代 Web 应用。

**难度**: 🟡 进阶  
**类型**: 📚 原理 + 实践

#### 💡 核心要点

- ✅ Fiber 架构实现可中断渲染，提升性能
- ✅ Hooks API 简化函数组件状态管理
- ✅ 异步渲染支持优先级调度
- ✅ 向后兼容，渐进式升级
- ✅ 改善了大型应用的用户体验

#### 🔑 关键词

`React` `Fiber` `Hooks` `异步渲染` `性能优化`

#### 🛠️ 技术栈

`React` `JavaScript` `前端框架`

---

## 高级功能

### 缓存机制

摘要会自动缓存在浏览器本地存储（localStorage），有效期 7 天。

#### 优势

- ✅ 快速加载，无需重复请求
- ✅ 离线可用（如果之前访问过）
- ✅ 节省带宽

#### 清除缓存

如果需要清除缓存：

```javascript
// 在浏览器控制台执行
localStorage.clear()
// 或清除特定摘要
localStorage.removeItem('ai-summary:/react/react16.md')
```

### 调试模式

查看摘要加载的调试信息：

```javascript
// 打开浏览器控制台 (F12)
// 点击 AI 提炼按钮
// 查看控制台输出：

[AI Summary Debug] Current page info: {
  rawPath: "/react/react16.html",
  regularPath: "/react/react16.html",
  convertedPath: "/react/react16.md"
}

[AI Summary Debug] JSON data: {
  enabled: true,
  enhanced: true,
  version: "2.0",
  totalFiles: 174
}

[AI Summary Debug] Summary lookup result: {
  searchKey: "/react/react16.md",
  found: true,
  isEnhanced: true,
  hasKeyPoints: true
}
```

### 数据格式

生成的 `summaries.json` 结构：

```json
{
  "_meta": {
    "version": "2.0",
    "generatedAt": "2026-02-04T12:00:00.000Z",
    "totalFiles": 174,
    "successCount": 170,
    "errorCount": 4,
    "enabled": true,
    "model": "glm-4-flash",
    "enhanced": true,
    "features": [
      "summary",
      "keyPoints",
      "keywords",
      "techStack",
      "difficulty",
      "contentType"
    ]
  },
  "summaries": {
    "/react/react16.md": {
      "summary": "React 16 是 React 框架的重大版本更新...",
      "keyPoints": [
        "Fiber 架构实现可中断渲染",
        "Hooks API 简化组件逻辑",
        "异步渲染支持优先级调度",
        "向后兼容渐进升级",
        "提升大型应用性能"
      ],
      "keywords": ["React", "Fiber", "Hooks", "异步渲染", "性能优化"],
      "techStack": ["React", "JavaScript", "前端框架"],
      "difficulty": "进阶",
      "contentType": "原理 + 实践"
    }
  }
}
```

---

## 常见问题

### Q1: 为什么某些文档没有摘要？

**A:** 可能的原因：

1. 文档内容太短（少于 50 字符）
2. 文档是 README.md（自动跳过）
3. 生成时 API 调用失败
4. 文档是新添加的，还未生成摘要

**解决方法**：

- 重新运行 `node tools/generate-summaries.mjs`
- 检查文档内容是否充足

### Q2: 摘要不准确怎么办？

**A:** AI 生成的摘要可能存在不准确的情况。

**改进方法**：

1. 优化文档结构和内容
2. 在文档开头添加明确的概述
3. 删除缓存的摘要重新生成
4. 调整 `generate-summaries.mjs` 中的提示词

### Q3: 如何更新某个文档的摘要？

**A:** 有两种方法：

**方法 1：删除缓存并重新生成**

```bash
# 删除 summaries.json
rm docs/.vuepress/public/summaries.json

# 重新生成（会为所有文档生成）
node tools/generate-summaries.mjs
```

**方法 2：手动编辑 summaries.json**

```bash
# 直接编辑 JSON 文件
vim docs/.vuepress/public/summaries.json

# 找到对应文档的路径，修改摘要内容
```

### Q4: 为什么加载很慢？

**A:** 首次加载会请求 `summaries.json` 文件。

**优化建议**：

- 启用 CDN 加速
- 压缩 JSON 文件
- 利用浏览器缓存

### Q5: 如何禁用 AI 提炼功能？

**A:** 如果暂时不需要此功能：

**方法 1：不生成摘要**

```bash
# 在 GitHub Actions 中注释掉生成步骤
# .github/workflows/blank.yml
# - run: node tools/generate-summaries.mjs
```

**方法 2：创建空的 summaries.json**

```json
{
  "_meta": {
    "enabled": false,
    "message": "AI 摘要功能已禁用"
  },
  "summaries": {}
}
```

前端会检测到 `enabled: false` 并显示"功能未启用"提示。

### Q6: API 调用失败怎么办？

**A:** 检查以下几点：

1. **验证 API Key**

   ```bash
   echo $GLM_API_KEY
   # 应该显示您的 API Key
   ```

2. **检查网络连接**

   ```bash
   curl -I https://open.bigmodel.cn
   ```

3. **检查 API 配额**

   - 登录智谱 AI 平台
   - 查看 API 调用次数和余额

4. **查看详细错误**
   ```bash
   node tools/generate-summaries.mjs 2>&1 | tee summary-log.txt
   ```

### Q7: 成本问题

**Q: 每月会花费多少？**

**A**: 成本估算（基于 GLM-4-flash）：

- 每个文档约消耗 2300 tokens
- 174 个文档 = 约 400,000 tokens
- 每次构建成本：约 ¥0.4
- 月构建 12 次：约 ¥5

**节省成本的方法**：

- 启用缓存（默认已启用）
- 减少构建频率
- 只为新文档或更新的文档生成摘要

### Q8: 如何启用前端 AI 对话（固定密码验证）？

**⚠️ WARNING:** 以下方案会把 **API Key 和访问密码** 打包到前端代码中，任何人都可以查看。

**A:** 仅建议用于临时测试或低成本场景，生产环境请使用服务端代理。

配置方法：

```bash
AI_API_KEY=your-api-key-here
AI_PASSWORD=访问密码
AI_AUTH_STORAGE=session  # session 或 local
```

说明：

- `AI_PASSWORD` 用于前端验证，验证成功后会缓存到 `sessionStorage` 或 `localStorage`
- `AI_AUTH_STORAGE` 可切换缓存位置（默认 session）
- 不要使用生产 API Key
- 如需更安全方案，请参考 `AI_EXTRACTION_CUSTOM_KEY_IMPLEMENTATION.md` 的服务端代理示例

---

## 🎉 总结

现在您拥有了一个功能完整、用户友好的 AI 内容提炼系统！

### 核心优势

1. **自动化**: 构建时自动生成，无需手动操作
2. **安全性**: API Key 完全保密，不暴露给前端
3. **性能**: 预生成 + 缓存，访问速度快
4. **丰富性**: 6 个维度的内容分析
5. **易用性**: 一键查看，标签页组织

### 下一步

- 📖 阅读 `AI_EXTRACTION_ENHANCEMENT_PLAN.md` 了解更多增强功能
- 🔧 探索自定义 API Key 功能（可选）
- 📊 监控使用情况和用户反馈
- 🚀 持续优化提示词和分析维度

---

**享受智能文档体验！** ✨

如有任何问题，请查阅文档或提交 Issue。
