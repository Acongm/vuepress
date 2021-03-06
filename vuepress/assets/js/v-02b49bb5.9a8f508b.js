;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [7088],
  {
    5789: (l, e, n) => {
      'use strict'
      n.r(e), n.d(e, { data: () => r })
      const r = {
        key: 'v-02b49bb5',
        path: '/software/webstorm.html',
        title: 'WebStorm 配置',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          { level: 2, title: '获取许可证', slug: '获取许可证', children: [] },
          { level: 2, title: '汉化', slug: '汉化', children: [] },
          { level: 2, title: '编辑器美化', slug: '编辑器美化', children: [] },
          { level: 2, title: '插件市场', slug: '插件市场', children: [] },
          { level: 2, title: '保存格式化', slug: '保存格式化', children: [] },
          {
            level: 2,
            title: 'webpack 项目识别 alias',
            slug: 'webpack-项目识别-alias',
            children: []
          }
        ],
        filePathRelative: 'software/webstorm.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    326: (l, e, n) => {
      'use strict'
      n.r(e), n.d(e, { default: () => il })
      var r = n(6252)
      const a = n.p + 'assets/img/instasll.8c70bf30.jpg',
        i = (0, r.Wm)(
          'h1',
          { id: 'webstorm-配置', tabindex: '-1' },
          [
            (0, r.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#webstorm-配置',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, r.Uk)(' WebStorm 配置')
          ],
          -1
        ),
        m = (0, r.Wm)(
          'h2',
          { id: '获取许可证', tabindex: '-1' },
          [
            (0, r.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#获取许可证',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, r.Uk)(' 获取许可证')
          ],
          -1
        ),
        t = {
          href: 'https://www.jetbrains.com/shop/eform/opensource',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        u = (0, r.Uk)('使用开源项目免费申请 JetBrains 全家桶开源许可证'),
        o = (0, r.Wm)(
          'h2',
          { id: '汉化', tabindex: '-1' },
          [
            (0, r.Wm)(
              'a',
              { class: 'header-anchor', href: '#汉化', 'aria-hidden': 'true' },
              '#'
            ),
            (0, r.Uk)(' 汉化')
          ],
          -1
        ),
        s = (0, r.Wm)(
          'li',
          null,
          [
            (0, r.Uk)('方案一 '),
            (0, r.Wm)('ul', null, [
              (0, r.Wm)('li', null, [
                (0, r.Uk)('进入 '),
                (0, r.Wm)('code', null, '文件 - 设置 - Plugins - Marketplace')
              ]),
              (0, r.Wm)('li', null, [
                (0, r.Uk)('搜索 '),
                (0, r.Wm)(
                  'code',
                  null,
                  'Chinese ​(Simplified)​ Language Pack EAP'
                ),
                (0, r.Uk)(' 下载安装')
              ])
            ])
          ],
          -1
        ),
        W = (0, r.Uk)('方案二 '),
        c = (0, r.Uk)('打开 '),
        k = {
          href: 'https://plugins.jetbrains.com/plugin/13710-chinese-simplified-language-pack-eap',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        h = (0, r.Uk)('Chinese ​(Simplified)​ Language Pack EAP'),
        d = (0, r.Wm)(
          'li',
          null,
          [
            (0, r.Uk)('点击 '),
            (0, r.Wm)('code', null, 'Install to IDE'),
            (0, r.Uk)(' 按钮再选择对应编辑器')
          ],
          -1
        ),
        p = (0, r.Uk)('方案三 '),
        b = (0, r.Wm)(
          'li',
          null,
          [
            (0, r.Uk)('查看本地 '),
            (0, r.Wm)('code', null, 'WebStorm'),
            (0, r.Uk)(' 版本 '),
            (0, r.Wm)('ul', null, [
              (0, r.Wm)('li', null, [
                (0, r.Uk)('进入 '),
                (0, r.Wm)('code', null, '帮助 - 关于')
              ]),
              (0, r.Wm)('li', null, [
                (0, r.Uk)('找到 '),
                (0, r.Wm)('code', null, 'Build #WS-'),
                (0, r.Uk)(' 后面的数字')
              ])
            ])
          ],
          -1
        ),
        U = (0, r.Uk)('打开 '),
        g = {
          href: 'https://plugins.jetbrains.com/plugin/13710-chinese-simplified-language-pack-eap',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        f = (0, r.Uk)('Chinese ​(Simplified)​ Language Pack EAP'),
        w = (0, r.Wm)(
          'li',
          null,
          [
            (0, r.Uk)('点击 '),
            (0, r.Wm)('code', null, 'Versions'),
            (0, r.Uk)(
              ' 选择对应编辑器再搜索对应版本下载（当找不到一样的版本时，可以看列表的第二栏版本范围，找包含你编辑器的版本下载就行）'
            )
          ],
          -1
        ),
        v = (0, r.Wm)('li', null, '通过磁盘安装刚下载的文件', -1),
        j = (0, r.Wm)(
          'p',
          null,
          [(0, r.Wm)('img', { src: a, alt: '磁盘安装' })],
          -1
        ),
        _ = (0, r.Wm)(
          'h2',
          { id: '编辑器美化', tabindex: '-1' },
          [
            (0, r.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#编辑器美化',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, r.Uk)(' 编辑器美化')
          ],
          -1
        ),
        x = (0, r.Uk)('主题（进入 '),
        A = (0, r.Wm)('code', null, '文件 - 设置 - Plugins - Marketplace', -1),
        P = (0, r.Uk)(' 安装如下插件） '),
        D = {
          href: 'https://plugins.jetbrains.com/plugin/10044-atom-material-icons/',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        S = (0, r.Uk)('Atom Material Icons'),
        C = (0, r.Uk)(' 图标美化'),
        I = {
          href: 'https://plugins.jetbrains.com/plugin/12178-atom-onedark-theme',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        L = (0, r.Uk)('Atom OneDark Theme'),
        M = (0, r.Uk)(' Atom OneDark 主题'),
        B = {
          href: 'https://plugins.jetbrains.com/plugin/8006-material-theme-ui',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        E = (0, r.Uk)('Material Theme UI'),
        O = (0, r.Uk)('Material Design 主题'),
        y = {
          href: 'https://plugins.jetbrains.com/plugin/index?xmlId=com.markskelton.one-dark-theme',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        T = (0, r.Uk)('One Dark theme'),
        F = (0, r.Uk)('黑色主题'),
        G = (0, r.Uk)('配色方案 '),
        J = {
          href: 'https://github.com/uloco/webstorm-bluloco-scheme',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        N = (0, r.Uk)('bluloco 方案'),
        R = {
          href: 'https://cdn.jsdelivr.net/gh/uloco/webstorm-bluloco-scheme/Bluloco%20Dark.icls',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        z = (0, r.Uk)('Dark 下载'),
        H = {
          href: 'https://cdn.jsdelivr.net/gh/uloco/webstorm-bluloco-scheme/Bluloco%20Light.icls',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        K = (0, r.Uk)('Light 下载'),
        V = (0, r.Wm)(
          'li',
          null,
          [
            (0, r.Uk)('自定义背景图 '),
            (0, r.Wm)('ul', null, [
              (0, r.Wm)('li', null, [
                (0, r.Uk)('进入 '),
                (0, r.Wm)('code', null, '文件 - 设置 - 外观和行为 - Appearance')
              ]),
              (0, r.Wm)('li', null, [
                (0, r.Uk)('点击 '),
                (0, r.Wm)('code', null, 'BACKGROUND IMAGE')
              ])
            ])
          ],
          -1
        ),
        Y = (0, r.Uk)('其他 '),
        q = {
          href: 'https://plugins.jetbrains.com/plugin/9525--env-files-support',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        Q = (0, r.Uk)('.env files support'),
        X = (0, r.Uk)(' .env 文件键值字符串高亮'),
        Z = (0, r.Wm)(
          'h2',
          { id: '插件市场', tabindex: '-1' },
          [
            (0, r.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#插件市场',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, r.Uk)(' 插件市场')
          ],
          -1
        ),
        $ = {
          href: 'https://plugins.jetbrains.com/',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        ll = (0, r.Uk)('官方'),
        el = (0, r.Wm)(
          'h2',
          { id: '保存格式化', tabindex: '-1' },
          [
            (0, r.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#保存格式化',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, r.Uk)(' 保存格式化')
          ],
          -1
        ),
        nl = (0, r.Wm)(
          'ol',
          null,
          [
            (0, r.Wm)('li', null, [
              (0, r.Uk)('进入 '),
              (0, r.Wm)('code', null, '文件 - 设置 - 工具 - File Watchers')
            ]),
            (0, r.Wm)('li', null, [
              (0, r.Uk)('点击 '),
              (0, r.Wm)('code', null, '+'),
              (0, r.Uk)(' 选择 '),
              (0, r.Wm)('code', null, 'Prettier')
            ]),
            (0, r.Wm)('li', null, [
              (0, r.Uk)('将 '),
              (0, r.Wm)('code', null, 'File type'),
              (0, r.Uk)(' 修改为你需要的文件类型，通用可选 '),
              (0, r.Wm)('code', null, 'Any')
            ])
          ],
          -1
        ),
        rl = (0, r.Wm)(
          'h2',
          { id: 'webpack-项目识别-alias', tabindex: '-1' },
          [
            (0, r.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#webpack-项目识别-alias',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, r.Uk)(' webpack 项目识别 alias')
          ],
          -1
        ),
        al = (0, r.Wm)(
          'ol',
          null,
          [
            (0, r.Wm)('li', null, [
              (0, r.Uk)('进入 '),
              (0, r.Wm)(
                'code',
                null,
                '文件 - 设置 - 框架和语言 - JavaScript - Webpack'
              )
            ]),
            (0, r.Wm)('li', null, [
              (0, r.Uk)('将 webpack 配置文件地址修改为对应地址 '),
              (0, r.Wm)('ol', null, [
                (0, r.Wm)('li', null, [
                  (0, r.Uk)('vue-cli2: 项目地址 + '),
                  (0, r.Wm)('code', null, '\\build\\webpack.base.conf.js')
                ]),
                (0, r.Wm)('li', null, [
                  (0, r.Uk)('vue-cli3: 项目地址 + '),
                  (0, r.Wm)(
                    'code',
                    null,
                    '\\node_modules\\@vue\\cli-service\\webpack.config.js'
                  )
                ])
              ])
            ])
          ],
          -1
        ),
        il = {
          render: function (l, e) {
            const n = (0, r.up)('OutboundLink')
            return (
              (0, r.wg)(),
              (0, r.j4)(
                r.HY,
                null,
                [
                  i,
                  m,
                  (0, r.Wm)('p', null, [(0, r.Wm)('a', t, [u, (0, r.Wm)(n)])]),
                  o,
                  (0, r.Wm)('ul', null, [
                    s,
                    (0, r.Wm)('li', null, [
                      W,
                      (0, r.Wm)('ul', null, [
                        (0, r.Wm)('li', null, [
                          c,
                          (0, r.Wm)('a', k, [h, (0, r.Wm)(n)])
                        ]),
                        d
                      ])
                    ]),
                    (0, r.Wm)('li', null, [
                      p,
                      (0, r.Wm)('ul', null, [
                        b,
                        (0, r.Wm)('li', null, [
                          U,
                          (0, r.Wm)('a', g, [f, (0, r.Wm)(n)])
                        ]),
                        w,
                        v
                      ])
                    ])
                  ]),
                  j,
                  _,
                  (0, r.Wm)('ul', null, [
                    (0, r.Wm)('li', null, [
                      x,
                      A,
                      P,
                      (0, r.Wm)('ul', null, [
                        (0, r.Wm)('li', null, [
                          (0, r.Wm)('a', D, [S, (0, r.Wm)(n)]),
                          C
                        ]),
                        (0, r.Wm)('li', null, [
                          (0, r.Wm)('a', I, [L, (0, r.Wm)(n)]),
                          M
                        ]),
                        (0, r.Wm)('li', null, [
                          (0, r.Wm)('a', B, [E, (0, r.Wm)(n)]),
                          O
                        ]),
                        (0, r.Wm)('li', null, [
                          (0, r.Wm)('a', y, [T, (0, r.Wm)(n)]),
                          F
                        ])
                      ])
                    ]),
                    (0, r.Wm)('li', null, [
                      G,
                      (0, r.Wm)('ul', null, [
                        (0, r.Wm)('li', null, [
                          (0, r.Wm)('a', J, [N, (0, r.Wm)(n)]),
                          (0, r.Wm)('ul', null, [
                            (0, r.Wm)('li', null, [
                              (0, r.Wm)('a', R, [z, (0, r.Wm)(n)])
                            ]),
                            (0, r.Wm)('li', null, [
                              (0, r.Wm)('a', H, [K, (0, r.Wm)(n)])
                            ])
                          ])
                        ])
                      ])
                    ]),
                    V,
                    (0, r.Wm)('li', null, [
                      Y,
                      (0, r.Wm)('ul', null, [
                        (0, r.Wm)('li', null, [
                          (0, r.Wm)('a', q, [Q, (0, r.Wm)(n)]),
                          X
                        ])
                      ])
                    ])
                  ]),
                  Z,
                  (0, r.Wm)('ul', null, [
                    (0, r.Wm)('li', null, [
                      (0, r.Wm)('a', $, [ll, (0, r.Wm)(n)])
                    ])
                  ]),
                  el,
                  nl,
                  rl,
                  al
                ],
                64
              )
            )
          }
        }
    }
  }
])
