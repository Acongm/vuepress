# AI Chat API 契约

站点前端通过 `VUEPRESS_AI_CHAT_API` 调用对话接口，默认地址：

`https://api.acongm.com/api/ai/chat`

## 请求

```http
POST /api/ai/chat
Content-Type: application/json
```

```json
{
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "context": {
    "scope": "article",
    "pagePath": "/vue/xxx.md",
    "moduleKey": "Vue",
    "title": "文档标题",
    "tags": ["vue", "响应式"]
  },
  "enableWebSearch": false
}
```

### 字段说明

| 字段                | 类型                    | 必填 | 说明                                          |
| ------------------- | ----------------------- | ---- | --------------------------------------------- |
| `messages`          | array                   | 是   | OpenAI 风格消息列表，首条通常为 system prompt |
| `context.scope`     | `"article" \| "module"` | 否   | 对话范围，默认 `article`                      |
| `context.pagePath`  | string                  | 否   | 当前文档路径（`.md`）                         |
| `context.moduleKey` | string                  | 否   | 知识库模块 key                                |
| `context.title`     | string                  | 否   | 当前文档标题                                  |
| `context.tags`      | string[]                | 否   | frontmatter 标签                              |
| `enableWebSearch`   | boolean                 | 否   | 是否启用联网检索，默认 `false`                |

### 联网检索

当 `enableWebSearch: true` 时，服务端应使用配置的 API Key 执行网络检索，将结果注入 LLM 上下文后再生成回答。

前端不传递搜索 API Key。

## 响应

### 成功

```json
{
  "message": "回答正文",
  "sources": [
    {
      "title": "参考标题",
      "url": "https://example.com/doc"
    }
  ]
}
```

兼容旧格式：

```json
{
  "choices": [
    {
      "message": {
        "content": "回答正文"
      }
    }
  ]
}
```

### 失败

```json
{
  "message": "错误说明"
}
```

HTTP 状态码为非 2xx。

## 向后兼容

- 旧客户端仅发送 `{ messages }` 时，服务端应继续正常工作。
- 未识别 `context` / `enableWebSearch` 时忽略即可。
- 无 `sources` 时前端不展示引用区。

## 前端环境变量

见 [`.env.example`](../.env.example)：

- `VUEPRESS_AI_CHAT_API`
- `VUEPRESS_AI_SUMMARY_API`
