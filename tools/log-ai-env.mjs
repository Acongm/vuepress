#!/usr/bin/env node

function sanitizeEnvUrl(value, fallback) {
  return String(value || fallback)
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/^(https?):\/(?!\/)/i, '$1://')
}

const summaryUrl = sanitizeEnvUrl(
  process.env.VUEPRESS_AI_SUMMARY_API,
  'https://api.acongm.com/api/ai/summary'
)
const chatUrl = sanitizeEnvUrl(
  process.env.VUEPRESS_AI_CHAT_API,
  'https://api.acongm.com/api/ai/chat'
)

console.log('[ai-env] VUEPRESS_AI_SUMMARY_API ->', summaryUrl)
console.log('[ai-env] VUEPRESS_AI_CHAT_API ->', chatUrl)

if (/^['"]/.test(String(process.env.VUEPRESS_AI_SUMMARY_API || '').trim())) {
  console.warn('[ai-env] warning: VUEPRESS_AI_SUMMARY_API contains quotes; use bare URL')
}
if (/^['"]/.test(String(process.env.VUEPRESS_AI_CHAT_API || '').trim())) {
  console.warn('[ai-env] warning: VUEPRESS_AI_CHAT_API contains quotes; use bare URL')
}

if (!process.env.AI_API_KEY) {
  console.warn('[ai-env] warning: AI_API_KEY not set; summaries.json may be empty')
}
