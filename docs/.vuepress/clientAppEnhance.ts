import { defineClientAppEnhance } from '@vuepress/client'
import ScriptX from 'vue-scriptx'

import './styles/typora-theme-lapis-v1.2.1/lapis.css'
import './styles/lapis-style.css'

export default defineClientAppEnhance(({ app }) => {
  app.use(ScriptX)
})
