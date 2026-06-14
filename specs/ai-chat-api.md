# AI Chat v1 API 契约

AI 阅读助手只在用户发送消息时调用后端。页面加载和助手展开仅读取构建产物 `summaries-v1.json`。

## 流式接口

```http
POST /api/ai/v1/chat/stream
Content-Type: application/json
Accept: text/event-stream
```

```json
{
  "messages": [{ "role": "user", "content": "结合当前文章，解释 Fiber" }],
  "context": {
    "scope": "article",
    "pagePath": "/react/react16.md",
    "moduleKey": "react",
    "title": "React 16",
    "tags": ["React"],
    "content": "裁剪后的当前文章正文"
  },
  "enableWebSearch": false
}
```

- 客户端不得发送 `system` 消息；系统提示由服务端统一生成。
- 前端最多发送最近 12 条 user/assistant 消息，服务端继续执行字符预算裁剪。
- “当前文章”“本模块”“联网检索”是输入框快捷 Tag，点击后插入可编辑自然语言，再从文本推导请求选项。

## SSE 事件

```text
event: meta
data: {"type":"meta","provider":"custom","model":"..."}

event: delta
data: {"type":"delta","content":"增量文本"}

event: usage
data: {"type":"usage","promptTokens":100,"completionTokens":20,"totalTokens":120}

event: done
data: {"type":"done"}
```

失败事件为 `error`，结构是 `{ "type": "error", "message": "..." }`。客户端可使用 `AbortController` 停止生成。

## JSON 接口

`POST /api/ai/v1/chat` 使用同一请求结构，返回 `{ provider, model, message, sources? }`，用于不支持 SSE 的调用方。

旧 `/api/ai/chat` 保持兼容，但 AI 阅读助手 v1 不再使用它。
