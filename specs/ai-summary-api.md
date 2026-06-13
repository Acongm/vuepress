# AI Summary API 契约

站点前端通过 `VUEPRESS_AI_SUMMARY_API` 调用摘要接口，默认地址：

`https://api.acongm.com/api/ai/summary`

构建时亦可通过 `AI_API_KEY` 预生成 `summaries.json`，运行时仅在静态/本地提取均不可用时调用本接口。

## 请求

```http
POST /api/ai/summary
Content-Type: application/json
```

```json
{
  "path": "/online-tools/index.md",
  "title": "网页工具",
  "content": "文档正文（建议 50–12000 字）"
}
```

### 字段说明

| 字段      | 类型   | 必填 | 说明                     |
| --------- | ------ | ---- | ------------------------ |
| `path`    | string | 否   | 文档路径（`.md`）        |
| `title`   | string | 否   | 文档标题                 |
| `content` | string | 是   | 用于提炼的 Markdown 正文 |

## 响应

### 成功

```json
{
  "summary": "150-200 字摘要",
  "keyPoints": ["要点 1", "要点 2"],
  "keywords": ["React", "Hooks"],
  "techStack": ["React", "JavaScript"],
  "difficulty": "进阶",
  "contentType": "原理 + 实践",
  "source": "live",
  "generatedAt": "2026-06-13T12:00:00.000Z"
}
```

`source` 与 `generatedAt` 为实时生成标记；构建时预生成的 `summaries.json` 不含这两项。

### 失败

```json
{
  "message": "错误说明"
}
```

HTTP 状态码为非 2xx。

## 前端加载优先级

1. `localStorage` 缓存（live 24h / static 7d）
2. 构建产物 `summaries.json`
3. DOM 本地结构化提取（`build-local-summary.js`）
4. 本 Live API（生产环境）

## 相关环境变量

见 [`.env.example`](../.env.example)：

- `VUEPRESS_AI_SUMMARY_API`
- `AI_API_KEY`（仅构建时 / 服务端）
- `SUMMARIES_FALLBACK_URL`（Vercel 构建缓存种子）

## 相关文档

- Chat 接口：[`specs/ai-chat-api.md`](./ai-chat-api.md)
