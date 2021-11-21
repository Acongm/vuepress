;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [103],
  {
    6255: (n, e, s) => {
      'use strict'
      s.r(e), s.d(e, { data: () => a })
      const a = {
        key: 'v-6c94be79',
        path: '/software/mac.html',
        title: 'Mac 平台',
        lang: 'zh-CN',
        frontmatter: { sidebarDepth: 2 },
        excerpt: '',
        headers: [
          { level: 2, title: 'Homebrew', slug: 'homebrew', children: [] },
          { level: 2, title: 'iTerm2', slug: 'iterm2', children: [] },
          {
            level: 2,
            title: '效率神器 Alfred',
            slug: '效率神器-alfred',
            children: []
          },
          {
            level: 2,
            title: 'Mac 微信的功能拓展',
            slug: 'mac-微信的功能拓展',
            children: []
          },
          { level: 2, title: 'IINA', slug: 'iina', children: [] },
          { level: 2, title: 'eZip', slug: 'ezip', children: [] },
          {
            level: 2,
            title: '腾讯柠檬清理',
            slug: '腾讯柠檬清理',
            children: []
          },
          {
            level: 2,
            title: '截图神器 IShot',
            slug: '截图神器-ishot',
            children: []
          },
          {
            level: 2,
            title: '超级右键 iRightMouse',
            slug: '超级右键-irightmouse',
            children: []
          },
          {
            level: 2,
            title: '翻译软件 Bob',
            slug: '翻译软件-bob',
            children: []
          }
        ],
        filePathRelative: 'software/mac.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    3326: (n, e, s) => {
      'use strict'
      s.r(e), s.d(e, { default: () => ln })
      var a = s(6252)
      const l = (0, a.uE)(
          '<h1 id="mac-平台" tabindex="-1"><a class="header-anchor" href="#mac-平台" aria-hidden="true">#</a> Mac 平台</h1><h2 id="homebrew" tabindex="-1"><a class="header-anchor" href="#homebrew" aria-hidden="true">#</a> Homebrew</h2><p>Mac 上安装命令行程序最好的工具</p><p>安装</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>/bin/bash -c <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh<span class="token variable">)</span></span>&quot;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>切换镜像</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 切换 brew.git</span>\n<span class="token builtin class-name">cd</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span>brew --repo<span class="token variable">)</span></span>&quot;</span>\n<span class="token function">git</span> remote set-url origin https://mirrors.aliyun.com/homebrew/brew.git\n\n<span class="token comment"># 切换 homebrew-core.git</span>\n<span class="token builtin class-name">cd</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span>brew --repo<span class="token variable">)</span></span>/Library/Taps/homebrew/homebrew-core&quot;</span>\n<span class="token function">git</span> remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-core.git\n\n<span class="token comment"># 刷新</span>\nbrew update\n\n<span class="token comment"># 切换 homebrew-bottles</span>\n<span class="token comment"># 查看当前 shell</span>\n<span class="token builtin class-name">echo</span> <span class="token environment constant">$SHELL</span>\n\n<span class="token comment"># Bash 版本</span>\n<span class="token builtin class-name">echo</span> <span class="token string">&#39;export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles&#39;</span> <span class="token operator">&gt;&gt;</span> ~/.bash_profile\n<span class="token builtin class-name">source</span> ~/.bash_profile\n\n<span class="token comment"># Zsh 版本</span>\n<span class="token builtin class-name">echo</span> <span class="token string">&#39;export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles&#39;</span> <span class="token operator">&gt;&gt;</span> ~/.zshrc\n<span class="token builtin class-name">source</span> ~/.zshrc\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div>',
          7
        ),
        r = (0, a.Uk)('切换镜像详细可查看'),
        t = {
          href: 'https://developer.aliyun.com/mirror/homebrew?spm=a2c6h.13651102.0.0.e40a1b11ZkPX9D',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        p = (0, a.Uk)('阿里云 Homebrew 镜像'),
        i = {
          href: 'https://github.com/Homebrew',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        o = (0, a.Uk)('Github'),
        m = {
          href: 'https://brew.sh/index_zh-cn',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        c = (0, a.Uk)('软件官网'),
        b = (0, a.uE)(
          '<h2 id="iterm2" tabindex="-1"><a class="header-anchor" href="#iterm2" aria-hidden="true">#</a> iTerm2</h2><p>Mac 上最好用的终端</p><ol><li>支持子窗口</li><li>自动补全</li><li>查看粘贴历史</li><li>自定义配置项</li></ol><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 查看所有的 shell</span>\n<span class="token function">cat</span> /etc/shells\n\n<span class="token comment"># 查看当前窗口使用的 shell</span>\n<span class="token builtin class-name">echo</span> <span class="token environment constant">$SHELL</span>\n\n<span class="token comment"># 查看系统用户默认的 shell</span>\n<span class="token function">cat</span> /etc/passwd <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">sh</span>\n\n<span class="token comment"># 切换系统默认 shell</span>\nchsh -s /bin/zsh\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div>',
          4
        ),
        h = {
          href: 'https://github.com/gnachman/iTerm2',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        u = (0, a.Uk)('Github'),
        d = {
          href: 'https://www.iterm2.com',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        k = (0, a.Uk)('软件官网'),
        W = (0, a.Wm)(
          'h2',
          { id: '效率神器-alfred', tabindex: '-1' },
          [
            (0, a.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#效率神器-alfred',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, a.Uk)(' 效率神器 Alfred')
          ],
          -1
        ),
        g = (0, a.Wm)(
          'ol',
          null,
          [
            (0, a.Wm)('li', null, '定位文件、打开文件'),
            (0, a.Wm)('li', null, '打开网址、书签、App'),
            (0, a.Wm)('li', null, '自定义搜索'),
            (0, a.Wm)('li', null, '查看剪贴板历史'),
            (0, a.Wm)('li', null, [
              (0, a.Uk)('计算器、查词典、运行 '),
              (0, a.Wm)('code', null, 'shell'),
              (0, a.Uk)(' 命令')
            ])
          ],
          -1
        ),
        f = {
          href: 'https://www.alfredapp.com',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        w = (0, a.Uk)('软件官网'),
        v = (0, a.uE)(
          '<h2 id="mac-微信的功能拓展" tabindex="-1"><a class="header-anchor" href="#mac-微信的功能拓展" aria-hidden="true">#</a> Mac 微信的功能拓展</h2><ol><li>消息防撤回</li><li>免认证登录与多开</li><li>退群监控</li><li>屏蔽更新</li></ol><p>安装</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 安装小助手</span>\n<span class="token function">curl</span> -o- -L https://raw.githubusercontent.com/lmk123/oh-my-wechat/master/install.sh <span class="token operator">|</span> <span class="token function">bash</span> -s\n<span class="token comment"># OR 国内用户推荐</span>\n<span class="token function">curl</span> -o- -L https://omw.limingkai.cn/install.sh <span class="token operator">|</span> <span class="token function">bash</span> -s\n\n<span class="token comment"># 更新小助手</span>\nomw\n\n<span class="token comment"># 微信在自动更新后会删除小助手，可运行以下命令恢复</span>\nomw -n\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div>',
          4
        ),
        U = {
          href: 'https://github.com/MustangYM/WeChatExtension-ForMac',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        E = (0, a.Uk)('Github'),
        _ = (0, a.Wm)(
          'h2',
          { id: 'iina', tabindex: '-1' },
          [
            (0, a.Wm)(
              'a',
              { class: 'header-anchor', href: '#iina', 'aria-hidden': 'true' },
              '#'
            ),
            (0, a.Uk)(' IINA')
          ],
          -1
        ),
        x = (0, a.Wm)('p', null, '视频播放器', -1),
        A = (0, a.Wm)(
          'ol',
          null,
          [
            (0, a.Wm)('li', null, '界面简洁、美观，契合 macOS 设计风格'),
            (0, a.Wm)('li', null, '功能强大，设置以播放体验为中心'),
            (0, a.Wm)('li', null, '支持鼠标和触控板手势'),
            (0, a.Wm)('li', null, '在线字幕、缩略图预览、画中画等')
          ],
          -1
        ),
        B = {
          href: 'https://github.com/iina/iina',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        M = (0, a.Uk)('Github'),
        L = {
          href: 'https://iina.io/',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        H = (0, a.Uk)('软件官网'),
        O = (0, a.Wm)(
          'h2',
          { id: 'ezip', tabindex: '-1' },
          [
            (0, a.Wm)(
              'a',
              { class: 'header-anchor', href: '#ezip', 'aria-hidden': 'true' },
              '#'
            ),
            (0, a.Uk)(' eZip')
          ],
          -1
        ),
        S = (0, a.Wm)('p', null, '专为 macOS 而设计的压缩软件', -1),
        z = (0, a.Wm)(
          'ol',
          null,
          [
            (0, a.Wm)('li', null, '界面简洁、美观，完美兼容 Mojave'),
            (0, a.Wm)('li', null, '支持超过 20 种压缩格式'),
            (0, a.Wm)('li', null, '批量文件加密')
          ],
          -1
        ),
        T = {
          href: 'https://ezip.awehunt.com',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        q = (0, a.Uk)('软件官网'),
        y = (0, a.Wm)(
          'h2',
          { id: '腾讯柠檬清理', tabindex: '-1' },
          [
            (0, a.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#腾讯柠檬清理',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, a.Uk)(' 腾讯柠檬清理')
          ],
          -1
        ),
        I = (0, a.Wm)(
          'ol',
          null,
          [
            (0, a.Wm)('li', null, '界面简洁清新'),
            (0, a.Wm)('li', null, '支持垃圾清理、文件查重、软件卸载'),
            (0, a.Wm)('li', null, '支持微信、QQ、XCode、Sketch 深度扫描清理')
          ],
          -1
        ),
        R = {
          href: 'https://lemon.qq.com',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        C = (0, a.Uk)('软件官网'),
        D = (0, a.Wm)(
          'h2',
          { id: '截图神器-ishot', tabindex: '-1' },
          [
            (0, a.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#截图神器-ishot',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, a.Uk)(' 截图神器 IShot')
          ],
          -1
        ),
        G = (0, a.Wm)(
          'ol',
          null,
          [
            (0, a.Wm)(
              'li',
              null,
              '区域截图、窗口截图、多窗口截图、延时截图、长截图、滚动截图'
            ),
            (0, a.Wm)(
              'li',
              null,
              '快速标注(矩形、圆形、横线、箭头、画笔、马赛克、文字标记、序号标签、局部高亮)'
            ),
            (0, a.Wm)('li', null, '支持截图导圆角、阴影调节'),
            (0, a.Wm)('li', null, '贴图、取色')
          ],
          -1
        ),
        N = {
          href: 'https://www.better365.cn/ishot.html',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        $ = (0, a.Uk)('软件官网'),
        Z = {
          href: 'https://apps.apple.com/cn/app/ishot-%E6%88%AA%E5%9B%BE-%E5%BD%95%E5%B1%8F-2020%E5%85%A8%E6%96%B0%E9%AB%98%E5%BA%A6/id1485844094',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        F = (0, a.Uk)('App Store'),
        j = (0, a.Wm)(
          'h2',
          { id: '超级右键-irightmouse', tabindex: '-1' },
          [
            (0, a.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#超级右键-irightmouse',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, a.Uk)(' 超级右键 iRightMouse')
          ],
          -1
        ),
        P = (0, a.Wm)(
          'ol',
          null,
          [
            (0, a.Wm)('li', null, '多种格式的右键新建文件'),
            (0, a.Wm)('li', null, '快速移动文件'),
            (0, a.Wm)('li', null, '常用目录设置'),
            (0, a.Wm)('li', null, '快速打开终端、vscode 等')
          ],
          -1
        ),
        Q = {
          href: 'https://www.better365.cn/irightmouse.html',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        X = (0, a.Uk)('软件官网'),
        Y = {
          href: 'https://apps.apple.com/cn/app/irightmouse-%E8%B6%85%E7%BA%A7%E5%8F%B3%E9%94%AE/id1497428978',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        J = (0, a.Uk)('App Store'),
        K = (0, a.Wm)(
          'h2',
          { id: '翻译软件-bob', tabindex: '-1' },
          [
            (0, a.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#翻译软件-bob',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, a.Uk)(' 翻译软件 Bob')
          ],
          -1
        ),
        V = (0, a.Wm)(
          'ol',
          null,
          [
            (0, a.Wm)('li', null, '支持划词、截图、输入翻译'),
            (0, a.Wm)('li', null, '支持翻译多开'),
            (0, a.Wm)('li', null, '自动识别语种'),
            (0, a.Wm)('li', null, '可自定义插件')
          ],
          -1
        ),
        nn = {
          href: 'https://github.com/ripperhe/Bob',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        en = (0, a.Uk)('Github'),
        sn = {
          href: 'https://ripperhe.gitee.io/bob',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        an = (0, a.Uk)('软件官网'),
        ln = {
          render: function (n, e) {
            const s = (0, a.up)('OutboundLink')
            return (
              (0, a.wg)(),
              (0, a.j4)(
                a.HY,
                null,
                [
                  l,
                  (0, a.Wm)('p', null, [
                    r,
                    (0, a.Wm)('a', t, [p, (0, a.Wm)(s)])
                  ]),
                  (0, a.Wm)('p', null, [
                    (0, a.Wm)('a', i, [o, (0, a.Wm)(s)]),
                    (0, a.Wm)('a', m, [c, (0, a.Wm)(s)])
                  ]),
                  b,
                  (0, a.Wm)('p', null, [
                    (0, a.Wm)('a', h, [u, (0, a.Wm)(s)]),
                    (0, a.Wm)('a', d, [k, (0, a.Wm)(s)])
                  ]),
                  W,
                  g,
                  (0, a.Wm)('p', null, [(0, a.Wm)('a', f, [w, (0, a.Wm)(s)])]),
                  v,
                  (0, a.Wm)('p', null, [(0, a.Wm)('a', U, [E, (0, a.Wm)(s)])]),
                  _,
                  x,
                  A,
                  (0, a.Wm)('p', null, [
                    (0, a.Wm)('a', B, [M, (0, a.Wm)(s)]),
                    (0, a.Wm)('a', L, [H, (0, a.Wm)(s)])
                  ]),
                  O,
                  S,
                  z,
                  (0, a.Wm)('p', null, [(0, a.Wm)('a', T, [q, (0, a.Wm)(s)])]),
                  y,
                  I,
                  (0, a.Wm)('p', null, [(0, a.Wm)('a', R, [C, (0, a.Wm)(s)])]),
                  D,
                  G,
                  (0, a.Wm)('p', null, [
                    (0, a.Wm)('a', N, [$, (0, a.Wm)(s)]),
                    (0, a.Wm)('a', Z, [F, (0, a.Wm)(s)])
                  ]),
                  j,
                  P,
                  (0, a.Wm)('p', null, [
                    (0, a.Wm)('a', Q, [X, (0, a.Wm)(s)]),
                    (0, a.Wm)('a', Y, [J, (0, a.Wm)(s)])
                  ]),
                  K,
                  V,
                  (0, a.Wm)('p', null, [
                    (0, a.Wm)('a', nn, [en, (0, a.Wm)(s)]),
                    (0, a.Wm)('a', sn, [an, (0, a.Wm)(s)])
                  ])
                ],
                64
              )
            )
          }
        }
    }
  }
])
