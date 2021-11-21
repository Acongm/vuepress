;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [9607],
  {
    4996: (s, n, a) => {
      'use strict'
      a.r(n), a.d(n, { data: () => e })
      const e = {
        key: 'v-f20d4d92',
        path: '/issue/pc.html',
        title: 'PC 相关',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          {
            level: 2,
            title: 'transform 导致字体不清晰',
            slug: 'transform-导致字体不清晰',
            children: []
          }
        ],
        filePathRelative: 'issue/pc.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    1269: (s, n, a) => {
      'use strict'
      a.r(n), a.d(n, { default: () => c })
      var e = a(6252)
      const t = (0, e.uE)(
          '<h1 id="pc-相关" tabindex="-1"><a class="header-anchor" href="#pc-相关" aria-hidden="true">#</a> PC 相关</h1><h2 id="transform-导致字体不清晰" tabindex="-1"><a class="header-anchor" href="#transform-导致字体不清晰" aria-hidden="true">#</a> <code>transform</code> 导致字体不清晰</h2><h4 id="原因" tabindex="-1"><a class="header-anchor" href="#原因" aria-hidden="true">#</a> 原因</h4><p><code>transform</code> 在渲染非整数的 <code>px</code> 时就会出现字体模糊。</p><h4 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案" aria-hidden="true">#</a> 解决方案</h4><p>方案一</p><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">目标元素</span> <span class="token punctuation">{</span>\n  <span class="token property">-webkit-font-smoothing</span><span class="token punctuation">:</span> antialiased<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>方案二</p><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">目标元素</span> <span class="token punctuation">{</span>\n  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">perspective</span><span class="token punctuation">(</span>1px<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>',
          9
        ),
        r = {
          href: 'https://css-tricks.com/forums/topic/transforms-cause-font-smoothing-weirdness-in-webkit/',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        p = (0, e.Uk)('详细说明 CSS-TRACKS'),
        c = {
          render: function (s, n) {
            const a = (0, e.up)('OutboundLink')
            return (
              (0, e.wg)(),
              (0, e.j4)(
                e.HY,
                null,
                [
                  t,
                  (0, e.Wm)('p', null, [(0, e.Wm)('a', r, [p, (0, e.Wm)(a)])])
                ],
                64
              )
            )
          }
        }
    }
  }
])
