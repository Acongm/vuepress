import { defineClientAppEnhance } from '@vuepress/client'
import ScriptX from 'vue-scriptx'
import AISummaryButton from './components/AISummaryButton.vue'

import './styles/typora-theme-lapis-v1.2.1/lapis.css'
import './styles/lapis-style.css'

export default defineClientAppEnhance(({ app }) => {
  app.use(ScriptX)
  // 全局注册 AI 摘要组件
  app.component('AISummaryButton', AISummaryButton)
})
