import { defineClientAppEnhance } from '@vuepress/client'
import ScriptX from 'vue-scriptx'

import './styles/typora-theme-lapis-v1.2.1/lapis.css'
import './styles/lapis-style.css'
import './styles/ai-assist.scss'

function setupServiceWorkerUpdates() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'CACHE_UPDATED') {
      console.info('[pwa] cache updated')
    }
  })

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        if (!worker) {
          return
        }

        worker.addEventListener('statechange', () => {
          if (worker.state !== 'installed') {
            return
          }
          if (!navigator.serviceWorker.controller) {
            return
          }
          worker.postMessage({ type: 'SKIP_WAITING' })
        })
      })
    })
    .catch(() => {
      // ignore SW registration errors
    })
}

export default defineClientAppEnhance(({ app }) => {
  app.use(ScriptX)
  setupServiceWorkerUpdates()
})
