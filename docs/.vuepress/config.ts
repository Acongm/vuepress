import type { DefaultThemeOptions } from 'vuepress'
import { defineUserConfig } from 'vuepress'
const { path } = require('@vuepress/utils')

const isProduction = process.env.NODE_ENV === 'production'

// 兼容 GitHub Pages 和 vercel 部署
const base = '/vuepress/'

export default defineUserConfig<DefaultThemeOptions>({
  base,
  dest: './vuepress',
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
      {
        text: '工具',
        children: [
          {
            text: '在线工具',
            children: [
              {
                text: '网页工具',
                link: '/online-tools/',
                activeMatch: '/online-tools/$'
              },
              '/online-tools/bookmark-scripts.md'
            ]
          },
          {
            text: '工具方法',
            children: [
              '/utils/regexp.md',
              '/utils/function.md',
              '/utils/library.md'
            ]
          },
          {
            text: 'Git',
            link: '/git/README.md'
          },
          {
            text: '软件相关',
            children: [
              '/software/cross-platform.md',
              '/software/mac.md',
              '/software/windows.md',
              '/software/browser.md',
              '/software/vscode.md',
              '/software/webstorm.md',
              '/software/zsh.md'
            ]
          }
        ]
      },
      {
        text: '专题',
        children: [
          {
            text: '技能提炼',
            link: '/mack/',
            children: [
              '/mack/01-React核心原理.md',
              '/mack/02-Webpack与构建工具.md',
              '/mack/03-性能优化.md',
              '/mack/04-微前端.md',
              '/mack/05-低代码.md',
              '/mack/06-插件系统.md',
              '/mack/07-NestJS与SSR.md',
              '/mack/08-代码规范.md',
              '/mack/09-Promise原理.md',
              '/mack/10-骨架屏.md',
              '/mack/11-HTTP与缓存.md'
            ]
          },
          {
            text: '技能提炼-补充',
            link: '/mack/',
            children: [
              '/mack/01-React核心原理-补充.md',
              '/mack/React更新流程详解.md'
            ]
          }
        ]
      },
      {
        text: '面试',
        // link: '/interview-prep/',
        // activeMatch: '/interview-prep/',
        children: [
          {
            text: '知识库',
            children: [
              {
                text: '知识列表（面试准备）',
                link: '/interview-prep/',
                activeMatch: '/interview-prep/'
              }
            ]
          },
          {
            text: '知识库',
            children: [
              {
                text: '面试题专项',
                link: '/theory/',
                activeMatch: '/theory/'
              }
            ]
          },
          {
            text: '知识库',
            children: [
              {
                text: '面试题（记录）',
                link: '/interview/2025-04-28.md',
                activeMatch: '/interview/'
              }
            ]
          }
        ]
      },
      {
        text: 'JavaScript / TypeScript',
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
            text: '通信模式',
            children: [
              '/Pattern/模式来源与类比.md',
              '/Pattern/'
              // '/Pattern/ServiceRequest/',
              // '/Pattern/Observer/',
              // '/Pattern/EventBus/',
              // '/Pattern/Store/',
              // '/Pattern/BroadcastChannel/',
              // '/Pattern/CustomEvent/',
              // '/Pattern/ProxyStore/'
            ]
          },
          {
            text: 'Performance',
            children: ['/Performance/']
          }
        ]
      },
      {
        text: 'Vue / React',
        children: [
          {
            text: 'Vue',
            children: [
              '/vue/',
              '/vue/vue_theory.md',
              '/vue/vue_interview.md',
              '/vue/vue3.md'
            ]
          },
          {
            text: 'React',
            children: ['/react/class-hooks.md']
          }
        ]
      },
      {
        text: 'Webpack / Node',
        children: [
          {
            text: 'Webpack',
            children: ['/webpack/知识梳理.md', '/webpack/vite-知识梳理.md']
          },
          {
            text: 'Node 相关',
            children: ['/node/npm.md', '/node/toolkit.md']
          },

          {
            text: '疑难杂症',
            children: ['/issue/h5.md', '/issue/pc.md']
          }
        ]
      },
      {
        text: 'Html / CSS ',
        children: [
          {
            text: 'CSS',
            children: [
              {
                text: 'CSS 语法相关',
                link: '/css/',
                activeMatch: '/css/$'
              },
              '/css/skill.md',
              '/css/scss.md'
            ]
          }
        ]
      },
      //   text: '在线音乐',
      //     { text: '移动端', link: 'https://reactmusic.fe-mm.com' }
      //   ]
      // },
      {
        text: '主页',
        children: [
          { text: 'Blog', link: 'https://www.acongm.com' },
          { text: 'Github', link: 'https://github.com/Acongm' },
          {
            text: '简历',
            link: '/job-description/web前端开发工程师-彭聪.md',
            activeMatch: '/job-description/$'
          }
        ]
      }
    ],
    sidebar: {
      '/online-tools/': [
        {
          text: '在线工具',
          children: ['/online-tools/', '/online-tools/bookmark-scripts.md']
        }
      ],
      '/utils/': [
        {
          text: '工具方法',
          children: [
            '/utils/regexp.md',
            '/utils/function.md',
            '/utils/library.md'
          ]
        }
      ],
      '/theory/': [
        {
          text: 'theory',
          children: [
            '/theory/',
            '/theory/interview-question/2025-04-28.md',
            '/theory/job-description-lib/Framework.md',
            '/theory/job-description-lib/01-大疆用户中心重构-面试技术大纲.md',
            '/theory/job-description-lib/02-大疆售后RMS系统重构-面试技术大纲.md',
            '/theory/job-description-lib/03-跨平台公告插件系统-面试技术大纲.md',
            '/theory/job-description-lib/04-大疆DevOps平台维护-面试技术大纲.md',
            '/theory/job-description-lib/05-XDR系统-魔方大屏+报表-面试技术大纲.md',
            '/theory/job-description-lib/06-大疆用户中心重构-hard-mode-面试题.md',
            '/theory/job-description-lib/07-大疆售后RMS系统重构-Hard-Mode-面试题.md',
            '/theory/job-description-lib/08-跨平台公告插件系统-Hard-Mode-面试题.md',
            '/theory/job-description-lib/09-DevOps平台-qiankun微前端-Hard-Mode-面试题.md',
            '/theory/job-description-lib/10-XDR系统-NestJS全栈-Hard-Mode-面试题.md',
            '/theory/job-description-lib/11-frontend-hard-mode-interview-原题提取-基于简历.md'
          ]
        }
      ],
      '/mack/': [
        {
          text: '技能提炼',
          children: [
            '/mack/01-React核心原理.md',
            '/mack/02-Webpack与构建工具.md',
            '/mack/03-性能优化.md',
            '/mack/04-微前端.md',
            '/mack/05-低代码.md',
            '/mack/06-插件系统.md',
            '/mack/07-NestJS与SSR.md',
            '/mack/08-代码规范.md',
            '/mack/09-Promise原理.md',
            '/mack/10-骨架屏.md',
            '/mack/11-HTTP与缓存.md'
          ]
        },
        {
          text: '技能提炼-补充',
          children: [
            '/mack/01-React核心原理-补充.md',
            '/mack/React更新流程详解.md'
          ]
        }
      ],
      '/interview-prep/': [
        {
          text: '面试准备（总览）',
          children: ['/interview-prep/INDEX.md', '/interview-prep/README.md']
        },
        {
          text: 'Projects（项目卡）',
          children: [
            '/interview-prep/project__dji-rms.md',
            '/interview-prep/project__dji-user-center.md',
            '/interview-prep/project__announce-plugin.md',
            '/interview-prep/project__dji-devops.md',
            '/interview-prep/project__xdr-dashboard-report.md'
          ]
        },
        {
          text: 'Tech（技术卡）',
          children: [
            '/interview-prep/tech__webpack.md',
            '/interview-prep/tech__react.md',
            '/interview-prep/tech__typescript.md',
            '/interview-prep/tech__eslint-engineering.md',
            '/interview-prep/tech__micro-frontend-qiankun.md',
            '/interview-prep/tech__rollup.md',
            '/interview-prep/tech__vite.md',
            '/interview-prep/tech__performance.md'
          ]
        },
        {
          text: 'Matrix（对比卡）',
          children: [
            '/interview-prep/matrix__bundler-webpack-vite-rollup.md',
            '/interview-prep/matrix__monorepo-lerna-nx.md',
            '/interview-prep/matrix__form-formily-rjsf-custom.md',
            '/interview-prep/matrix__lowcode-ssr-csr-export.md',
            '/interview-prep/matrix__cicd-release-strategy.md'
          ]
        },
        {
          text: 'Blindspots（盲区清单）',
          children: ['/interview-prep/BLINDSPOTS.md']
        }
      ],
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
      '/Pattern/': [
        {
          text: '通信模式',
          children: [
            '/Pattern/模式来源与类比.md',
            '/Pattern/',
            '/Pattern/ServiceRequest/',
            '/Pattern/Observer/',
            '/Pattern/EventBus/',
            '/Pattern/Store/',
            '/Pattern/BroadcastChannel/',
            '/Pattern/CustomEvent/',
            '/Pattern/ProxyStore/'
          ]
        }
      ],
      '/Performance/': [
        {
          text: 'Performance',
          children: ['/Performance/']
        }
      ],
      '/TypeScript/': [
        {
          text: 'TypeScript',
          children: ['/TypeScript/', '/TypeScript/Study.md']
        }
      ],
      '/vue/': [
        {
          text: 'vue',
          children: [
            '/vue/',
            '/vue/vue_theory.md',
            '/vue/vue_interview.md',
            '/vue/vue-render.md',
            '/vue/vue3.md'
          ]
        }
      ],
      '/react/': [
        {
          text: 'React',
          children: ['/react/class-hooks.md']
        },
        {
          text: 'React16',
          children: ['/react/react16.md']
        },
        {
          text: 'React17',
          children: ['/react/react17.md']
        },
        {
          text: 'React18',
          children: ['/react/react18.md']
        },
        {
          text: 'React-render',
          children: ['/react/react-render.md']
        }
      ],
      '/webpack/': [
        {
          text: 'Webpack-知识梳理',
          children: ['/webpack/知识梳理.md']
        },
        {
          text: 'Webpack-架构及原理',
          children: ['/webpack/架构及原理.md']
        },
        {
          text: 'Webpack-打包工具',
          children: ['/webpack/打包工具.md']
        },
        {
          text: 'webpack-vite-rollup',
          children: ['/webpack/webpack-vite-rollup.md']
        },
        {
          text: 'vite-知识梳理',
          children: ['/webpack/vite-知识梳理.md']
        },
        {
          text: 'vite-架构及原理',
          children: ['/webpack/vite-架构及原理.md']
        }
      ],
      '/css/': [
        {
          text: 'CSS',
          children: ['/css/', '/css/skill.md', '/css/scss.md']
        }
      ],
      '/node/': [
        {
          text: 'Node 相关',
          children: ['/node/npm.md', '/node/toolkit.md']
        }
      ],
      '/job-description/': [
        {
          text: '简历',
          children: ['/job-description/web前端开发工程师-彭聪.md']
          // children: ['/job-description/web前端开发工程师-彭聪.md', '/job-description/web前端开发工程师-彭聪.jpeg', '/job-description/web前端开发工程师-彭聪.pdf']
        }
      ],
      '/interview/': [
        {
          text: '面试题',
          children: ['/interview/']
        }
      ],
      '/git/': ['/git/', '/git/command.md'],
      '/software/': [
        {
          text: '软件相关',
          children: [
            '/software/cross-platform.md',
            '/software/mac.md',
            '/software/windows.md',
            '/software/browser.md',
            '/software/vscode.md',
            '/software/webstorm.md',
            '/software/zsh.md'
          ]
        }
      ],
      '/issue/': [
        {
          text: '疑难杂症',
          children: ['/issue/h5.md', '/issue/pc.md']
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
        id: 'G-B5CNYTFPMD'
      }
    ],
    ['@vuepress/plugin-pwa'],
    [
      '@vuepress/plugin-pwa-popup',
      {
        locales: {
          '/': {
            message: '发现新内容可用',
            buttonText: '刷新'
          }
        }
      }
    ]
  ]
})
