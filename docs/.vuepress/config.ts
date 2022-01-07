import type { DefaultThemeOptions } from 'vuepress'
import { defineUserConfig } from 'vuepress'
const { path } = require('@vuepress/utils')

const isProduction = process.env.NODE_ENV === 'production'

// 兼容 GitHub Pages 和 vercel 部署
const base = process.env.BUILD_ENV ? process.env.BUILD_ENV : '/vuepress/'

export default defineUserConfig<DefaultThemeOptions>({
  base,
  dest: './vuepress',
  bundler: isProduction ? '@vuepress/webpack' : '@vuepress/vite',
  lang: 'zh-CN',
  title: 'Acongm',
  description: '前端常用知识、踩坑记录、软件推荐等',
  head: [
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }
    ],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.ico' }],
    ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/favicon.ico' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    [
      'script',
      {
        src: isProduction
          ? 'https://hm.baidu.com/hm.js?8092fab2f2adfc7938ba5b8885aef5b4'
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
        text: '面试',
        children: ['/theory/']
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
            children: ['/webpack/知识梳理.md']
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

      // {
      //   text: '在线音乐',
      //   children: [
      //     { text: 'PC 端', link: 'https://netease-music.fe-mm.com' },
      //     { text: '移动端', link: 'https://reactmusic.fe-mm.com' }
      //   ]
      // },
      {
        text: '主页',
        children: [
          { text: 'Blog', link: 'https://www.acongm.com' },
          { text: 'Github', link: 'https://github.com/Acongm' }
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
          children: ['/theory/']
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
            '/vue/vue3.md'
          ]
        }
      ],
      '/react/': [
        {
          text: 'React',
          children: ['/react/class-hooks.md']
        }
      ],
      '/webpack/': [
        {
          text: 'Webpack',
          children: ['/webpack/知识梳理.md']
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
    contributors: false
    // darkMode: false
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
        id: 'UA-153242456-1'
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
