import type { DefaultThemeOptions } from 'vuepress'
import { defineUserConfig } from 'vuepress'
const { path } = require('@vuepress/utils')

const isProduction = process.env.NODE_ENV === 'production'
const isVercel = process.env.VERCEL === '1'
const defaultSummaryApi = isProduction
  ? 'https://api.acongm.com/api/ai/summary'
  : '/api/ai/summary'
const defaultChatApi = isProduction
  ? 'https://api.acongm.com/api/ai/v1/chat/stream'
  : '/api/ai/v1/chat/stream'

// Vercel 使用根路径；GitHub Pages 继续使用仓库子路径。
const base = isVercel ? '/' : process.env.BUILD_ENV || '/vuepress/'
const GA_ID = 'G-B5CNYTFPMD'
const PWA_POPUP_LOCALES = {
  '/': {
    message: '发现新内容可用',
    buttonText: '刷新'
  }
}

function sanitizeEnvUrl(value: string | undefined, fallback: string) {
  return String(value || fallback)
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/^(https?):\/(?!\/)/i, '$1://')
}

/** Dev always uses same-origin /api proxy; absolute env URLs cause CORS. */
function resolveAiApiUrl(
  envValue: string | undefined,
  devDefault: string,
  prodDefault: string
) {
  const fallback = isProduction ? prodDefault : devDefault
  const cleaned = sanitizeEnvUrl(envValue, fallback)
  if (!isProduction && /^https?:\/\//i.test(cleaned)) {
    console.warn(
      `[ai-env] dev ignores absolute API URL (use Vite proxy): ${cleaned} -> ${devDefault}`
    )
    return devDefault
  }
  return cleaned
}

const summaryApiUrl = resolveAiApiUrl(
  process.env.VUEPRESS_AI_SUMMARY_API,
  defaultSummaryApi,
  'https://api.acongm.com/api/ai/summary'
)
const chatApiUrl = resolveAiApiUrl(
  process.env.VUEPRESS_AI_CHAT_API,
  defaultChatApi,
  'https://api.acongm.com/api/ai/v1/chat/stream'
)

if (!isProduction) {
  console.log('[ai-env] dev summary API:', summaryApiUrl)
  console.log('[ai-env] dev chat API:', chatApiUrl)
} else {
  console.log('[ai-env] summary API:', summaryApiUrl)
  console.log('[ai-env] chat API:', chatApiUrl)
}

export default defineUserConfig<DefaultThemeOptions>({
  base,
  dest: './vuepress',
  define: {
    __GA_ID__: JSON.stringify(GA_ID),
    __AI_SUMMARY_API__: JSON.stringify(summaryApiUrl),
    __AI_CHAT_API__: JSON.stringify(chatApiUrl),
    __PWA_POPUP_LOCALES__: JSON.stringify(PWA_POPUP_LOCALES)
  },
  bundlerConfig: isProduction
    ? {}
    : {
        viteOptions: {
          server: {
            proxy: {
              '/api': {
                target: 'https://api.acongm.com',
                changeOrigin: true,
                secure: true
              }
            }
          }
        }
      },
  bundler: isProduction ? '@vuepress/webpack' : '@vuepress/vite',
  lang: 'zh-CN',
  title: 'acongm',
  description: '前端常用知识、踩坑记录、软件推荐等',
  head: [
    ['link', { rel: 'apple-touch-icon', href: '/favicon.ico' }],
    ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/favicon.ico' }],
    ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#3eaf7c' }],

    ['link', { rel: 'manifest', href: `/manifest.webmanifest` }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    [
      'script',
      {
        src: isProduction
          ? 'https://hm.baidu.com/hm.js?8e5be87f55d52e1115a38afce593d2bb'
          : ''
      }
    ]
  ],
  theme: path.resolve(__dirname, 'theme'),
  themeConfig: {
    logo: '/logo.jpg',
    navbar: [
      // ==================== 基础语言 ====================
      {
        text: '基础语言',
        children: [
          {
            text: 'JavaScript',
            children: [
              '/JavaScript/',
              '/JavaScript/经典闭包处理.md',
              '/JavaScript/执行上下文-作用域链-闭包.md',
              '/JavaScript/call、apply与bind.md',
              '/JavaScript/js模拟bind方法.md',
              '/JavaScript/js模拟new操作.md'
            ]
          },
          {
            text: 'TypeScript',
            children: ['/TypeScript/', '/TypeScript/Study.md']
          },
          {
            text: 'CSS',
            children: ['/css/', '/css/skill.md', '/css/scss.md']
          }
        ]
      },
      // ==================== 框架生态 ====================
      {
        text: '框架生态',
        children: [
          {
            text: 'React',
            children: [
              '/react/class-hooks.md',
              '/react/react16.md',
              '/react/react17.md',
              '/react/react18.md',
              '/react/react-render.md'
            ]
          },
          {
            text: 'Vue',
            children: [
              '/vue/',
              '/vue/vue_theory.md',
              '/vue/vue_interview.md',
              '/vue/vue3.md',
              '/vue/code/Object.defineproperty.md',
              '/vue/code/Proxy.md',
              '/vue/code/proxy-observe.md',
              '/vue/vue-render.md',
              '/vue/vue2.md'
            ]
          },
          {
            text: '设计模式',
            children: ['/Pattern/模式来源与类比.md', '/Pattern/']
          }
        ]
      },
      // ==================== 工程化 ====================
      {
        text: '工程化',
        children: [
          {
            text: '构建工具',
            children: [
              '/webpack/知识梳理.md',
              '/webpack/架构及原理.md',
              '/webpack/vite-知识梳理.md',
              '/webpack/vite-架构及原理.md',
              '/webpack/webpack-vite-rollup.md',
              '/webpack/install/ni.md',
              '/webpack/install/npm.md',
              '/webpack/install/pnpm.md',
              '/webpack/install/yarn.md',
              '/webpack/打包工具.md'
            ]
          },
          {
            text: 'Node.js',
            children: ['/node/npm.md', '/node/toolkit.md']
          },
          {
            text: 'Git',
            children: ['/git/', '/git/command.md', '/git/commit.md']
          },
          {
            text: '性能优化',
            children: ['/performance/']
          }
        ]
      },
      // ==================== 进阶专题 ====================
      {
        text: '进阶专题',
        children: [
          {
            text: '技能提炼',
            children: [
              '/mark/',
              '/mark/01-React核心原理.md',
              '/mark/01-React核心原理-补充.md',
              '/mark/02-Webpack与构建工具.md',
              '/mark/03-性能优化.md',
              '/mark/04-微前端.md',
              '/mark/05-低代码.md',
              '/mark/06-插件系统.md',
              '/mark/07-NestJS与SSR.md',
              '/mark/08-代码规范.md',
              '/mark/09-Promise原理.md',
              '/mark/10-骨架屏.md',
              '/mark/11-HTTP与缓存.md',
              '/mark/React更新流程详解.md'
            ]
          },
          {
            text: 'AI 开发',
            children: ['/ai/']
          },
          {
            text: '每日资讯',
            children: [
              '/daily-news/2026-06-14.md',
              '/daily-news/2026-06-13.md',
              '/daily-news/2026-06-12.md',
              '/daily-news/2026-06-11.md',
              '/daily-news/2026-06-10.md',
              '/daily-news/2026-06-09.md',
              '/daily-news/2026-06-08.md',
              '/daily-news/2026-06-07.md',
              '/daily-news/2026-06-06.md',
              '/daily-news/2026-06-05.md',
              '/daily-news/2026-06-04.md',
              '/daily-news/2026-06-03.md',
              '/daily-news/2026-06-02.md',
              '/daily-news/2026-06-01.md',
              '/daily-news/2026-05-26.md',
              '/daily-news/2026-05-25.md',
              '/daily-news/2026-05-24.md',
              '/daily-news/2026-05-23.md',
              '/daily-news/2026-05-22.md',
              '/daily-news/2026-05-21.md',
              '/daily-news/2026-05-20.md',
              '/daily-news/2026-05-19.md',
              '/daily-news/2026-05-18.md',
              '/daily-news/2026-05-17.md',
              '/daily-news/2026-05-15.md',
              '/daily-news/2026-05-14.md',
              '/daily-news/2026-05-13.md',
              '/daily-news/2026-05-12.md',
              '/daily-news/2026-05-11.md',
              '/daily-news/2026-05-10.md',
              '/daily-news/2026-05-09.md',
              '/daily-news/2026-05-08.md',
              '/daily-news/2026-05-07.md',
              '/daily-news/2026-05-06.md',
              '/daily-news/2026-05-05.md',
              '/daily-news/2026-05-04.md',
              '/daily-news/2026-05-03.md',
              '/daily-news/2026-05-02.md',
              '/daily-news/2026-04-09.md'
            ]
          },
          {
            text: '踩坑记录',
            children: ['/issue/h5.md', '/issue/pc.md']
          }
        ]
      },
      // ==================== 工具箱 ====================
      {
        text: '工具箱',
        children: [
          {
            text: '工具函数',
            children: [
              '/utils/regexp.md',
              '/utils/function.md',
              '/utils/library.md'
            ]
          },
          {
            text: '在线工具',
            children: ['/online-tools/', '/online-tools/bookmark-scripts.md']
          },
          {
            text: '软件推荐',
            children: [
              '/software/cross-platform.md',
              '/software/mac.md',
              '/software/windows.md',
              '/software/browser.md',
              '/software/vscode.md',
              '/software/webstorm.md',
              '/software/zsh.md',
              '/software/claude-skills-guide.md'
            ]
          }
        ]
      },
      // ==================== 面试 ====================
      {
        text: '面试',
        children: [
          {
            text: '面试准备',
            children: [
              { text: '知识列表', link: '/interview-prep/' },
              { text: '面试题库', link: '/theory/' },
              { text: '面试记录', link: '/interview/2025-04-28.md' }
            ]
          },
          {
            text: '简历问答',
            children: [
              { text: '问答大纲', link: '/job-description/ASK_LIST.md' },
              {
                text: '口语版',
                link: '/job-description/ASK_RECORD_SPEAK_AI.md'
              },
              { text: '代码版', link: '/job-description/ASK_CODE_EXAMPLES.md' },
              {
                text: '知识点索引',
                link: '/job-description/ASK_RECORD_KEY.md'
              },
              { text: '书面版', link: '/job-description/ASK_RECORD_BOOK_AI.md' }
            ]
          }
        ]
      },
      // ==================== 主页 ====================
      {
        text: '主页',
        children: [
          { text: 'Blog', link: 'https://www.acongm.com' },
          { text: 'Github', link: 'https://github.com/Acongm' },
          { text: '简历', link: '/job-description/web前端开发工程师-彭聪.md' }
        ]
      }
    ],
    sidebar: {
      '/JavaScript/': [
        {
          text: 'JavaScript',
          children: [
            '/JavaScript/',
            '/JavaScript/经典闭包处理.md',
            '/JavaScript/执行上下文-作用域链-闭包.md',
            '/JavaScript/call、apply与bind.md',
            '/JavaScript/js模拟bind方法.md',
            '/JavaScript/js模拟new操作.md'
          ]
        }
      ],
      '/TypeScript/': [
        {
          text: 'TypeScript',
          children: ['/TypeScript/', '/TypeScript/Study.md']
        }
      ],
      '/css/': [
        {
          text: 'CSS',
          children: ['/css/', '/css/skill.md', '/css/scss.md']
        }
      ],
      '/react/': [
        {
          text: 'React',
          children: [
            '/react/class-hooks.md',
            '/react/react16.md',
            '/react/react17.md',
            '/react/react18.md',
            '/react/react-render.md'
          ]
        }
      ],
      '/vue/': [
        {
          text: 'Vue',
          children: [
            '/vue/',
            '/vue/vue_theory.md',
            '/vue/vue_interview.md',
            '/vue/vue3.md',
            '/vue/code/Object.defineproperty.md',
            '/vue/code/Proxy.md',
            '/vue/code/proxy-observe.md',
            '/vue/vue-render.md',
            '/vue/vue2.md'
          ]
        }
      ],
      '/Pattern/': [
        {
          text: '设计模式',
          children: [
            '/Pattern/',
            '/Pattern/模式来源与类比.md',
            '/Pattern/COMPARISON.md'
          ]
        },
        {
          text: 'EventBus',
          children: [
            '/Pattern/EventBus/',
            '/Pattern/EventBus/EventBus.md',
            '/Pattern/EventBus/EventBusSingleton.md'
          ]
        },
        {
          text: 'Observer',
          children: [
            '/Pattern/Observer/',
            '/Pattern/Observer/Subject.md',
            '/Pattern/Observer/ObserverSingleton.md'
          ]
        },
        {
          text: 'Store',
          children: [
            '/Pattern/Store/',
            '/Pattern/Store/Store.md',
            '/Pattern/Store/StoreSingleton.md'
          ]
        },
        {
          text: 'ProxyStore',
          children: [
            '/Pattern/ProxyStore/',
            '/Pattern/ProxyStore/ProxyStore.md',
            '/Pattern/ProxyStore/ProxyStoreSingleton.md'
          ]
        },
        {
          text: 'CustomEvent',
          children: [
            '/Pattern/CustomEvent/',
            '/Pattern/CustomEvent/CustomEventBridge.md',
            '/Pattern/CustomEvent/CustomEventSingleton.md'
          ]
        },
        {
          text: 'BroadcastChannel',
          children: [
            '/Pattern/BroadcastChannel/',
            '/Pattern/BroadcastChannel/BroadcastBridge.md',
            '/Pattern/BroadcastChannel/BroadcastSingleton.md'
          ]
        },
        {
          text: 'ServiceRequest',
          children: [
            '/Pattern/ServiceRequest/',
            '/Pattern/ServiceRequest/Registry.md',
            '/Pattern/ServiceRequest/ServiceRequestRegistry.md',
            '/Pattern/ServiceRequest/SharedStateBridge.md',
            '/Pattern/ServiceRequest/SharedStateBridgeSingleton.md'
          ]
        }
      ],
      '/webpack/': [
        {
          text: 'Webpack',
          children: [
            '/webpack/知识梳理.md',
            '/webpack/架构及原理.md',
            '/webpack/vite-知识梳理.md',
            '/webpack/vite-架构及原理.md',
            '/webpack/webpack-vite-rollup.md',
            '/webpack/install/ni.md',
            '/webpack/install/npm.md',
            '/webpack/install/pnpm.md',
            '/webpack/install/yarn.md',
            '/webpack/打包工具.md'
          ]
        }
      ],
      '/node/': [
        {
          text: 'Node.js',
          children: ['/node/npm.md', '/node/toolkit.md']
        }
      ],
      '/git/': [
        {
          text: 'Git',
          children: ['/git/', '/git/command.md', '/git/commit.md']
        }
      ],
      '/performance/': [
        {
          text: '性能优化',
          children: ['/performance/']
        }
      ],
      '/mark/': [
        {
          text: '技能提炼',
          children: [
            '/mark/',
            '/mark/01-React核心原理.md',
            '/mark/01-React核心原理-补充.md',
            '/mark/02-Webpack与构建工具.md',
            '/mark/03-性能优化.md',
            '/mark/04-微前端.md',
            '/mark/05-低代码.md',
            '/mark/06-插件系统.md',
            '/mark/07-NestJS与SSR.md',
            '/mark/08-代码规范.md',
            '/mark/09-Promise原理.md',
            '/mark/10-骨架屏.md',
            '/mark/11-HTTP与缓存.md',
            '/mark/React更新流程详解.md',
            '/mark/ai-doc-content-enhancement.md'
          ]
        }
      ],
      '/ai/': [
        {
          text: 'AI 开发',
          children: ['/ai/']
        }
      ],
      '/daily-news/': [
        {
          text: '每日资讯',
          children: [
            '/daily-news/2026-06-14.md',
            '/daily-news/2026-06-13.md',
            '/daily-news/2026-06-12.md',
            '/daily-news/2026-06-11.md',
            '/daily-news/2026-06-10.md',
            '/daily-news/2026-06-09.md',
            '/daily-news/2026-06-08.md',
            '/daily-news/2026-06-07.md',
            '/daily-news/2026-06-06.md',
            '/daily-news/2026-06-05.md',
            '/daily-news/2026-06-04.md',
            '/daily-news/2026-06-03.md',
            '/daily-news/2026-06-02.md',
            '/daily-news/2026-06-01.md',
            '/daily-news/2026-05-26.md',
            '/daily-news/2026-05-25.md',
            '/daily-news/2026-05-24.md',
            '/daily-news/2026-05-23.md',
            '/daily-news/2026-05-22.md',
            '/daily-news/2026-05-21.md',
            '/daily-news/2026-05-20.md',
            '/daily-news/2026-05-19.md',
            '/daily-news/2026-05-18.md',
            '/daily-news/2026-05-17.md',
            '/daily-news/2026-05-15.md',
            '/daily-news/2026-05-14.md',
            '/daily-news/2026-05-13.md',
            '/daily-news/2026-05-12.md',
            '/daily-news/2026-05-11.md',
            '/daily-news/2026-05-10.md',
            '/daily-news/2026-05-09.md',
            '/daily-news/2026-05-08.md',
            '/daily-news/2026-05-07.md',
            '/daily-news/2026-05-06.md',
            '/daily-news/2026-05-05.md',
            '/daily-news/2026-05-04.md',
            '/daily-news/2026-05-03.md',
            '/daily-news/2026-05-02.md',
            '/daily-news/2026-04-09.md'
          ]
        }
      ],
      '/issue/': [
        {
          text: '踩坑记录',
          children: ['/issue/h5.md', '/issue/pc.md']
        }
      ],
      '/utils/': [
        {
          text: '工具函数',
          children: [
            '/utils/regexp.md',
            '/utils/function.md',
            '/utils/library.md'
          ]
        }
      ],
      '/online-tools/': [
        {
          text: '在线工具',
          children: ['/online-tools/', '/online-tools/bookmark-scripts.md']
        }
      ],
      '/software/': [
        {
          text: '软件推荐',
          children: [
            '/software/cross-platform.md',
            '/software/mac.md',
            '/software/windows.md',
            '/software/browser.md',
            '/software/vscode.md',
            '/software/webstorm.md',
            '/software/zsh.md',
            '/software/claude-skills-guide.md'
          ]
        }
      ],
      '/interview-prep/': [{ text: '面试准备', link: '/interview-prep/' }],
      '/theory/': [{ text: '面试题库', link: '/theory/' }],
      '/interview/': [
        {
          text: '面试记录',
          children: [
            '/interview/2025-04-28.md',
            '/interview/2025-04-28-analysis.md'
          ]
        }
      ],
      '/job-description/': [
        {
          text: '简历问答',
          children: [
            '/job-description/ASK_LIST.md',
            '/job-description/ASK_RECORD_SPEAK_AI.md',
            '/job-description/ASK_CODE_EXAMPLES.md',
            '/job-description/ASK_RECORD_KEY.md',
            '/job-description/ASK_RECORD_BOOK_AI.md',
            '/job-description/web前端开发工程师-彭聪.md'
          ]
        }
      ]
    },
    lastUpdatedText: '上次更新',
    contributors: false,
    darkMode: false
  },
  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: '搜索'
          }
        }
      }
    ],
    [
      '@vuepress/plugin-google-analytics',
      {
        id: GA_ID
      }
    ],
    ['@vuepress/plugin-pwa'],
    [
      '@vuepress/plugin-pwa-popup',
      {
        locales: PWA_POPUP_LOCALES
      }
    ]
  ]
})
