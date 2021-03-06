;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [8242],
  {
    2213: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { data: () => p })
      const p = {
        key: 'v-74458d05',
        path: '/css/',
        title: 'CSS 语法相关',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          { level: 2, title: '滚动条样式', slug: '滚动条样式', children: [] }
        ],
        filePathRelative: 'css/README.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    6814: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { default: () => l })
      var p = a(6252)
      const e = (0, p.uE)(
          '<h1 id="css-语法相关" tabindex="-1"><a class="header-anchor" href="#css-语法相关" aria-hidden="true">#</a> CSS 语法相关</h1><h2 id="滚动条样式" tabindex="-1"><a class="header-anchor" href="#滚动条样式" aria-hidden="true">#</a> 滚动条样式</h2><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token comment">/* 滚动条 */</span>\n<span class="token selector">::-webkit-scrollbar</span> <span class="token punctuation">{</span>\n  <span class="token comment">/* 纵向 */</span>\n  <span class="token property">width</span><span class="token punctuation">:</span> 8px<span class="token punctuation">;</span>\n  <span class="token comment">/* 横向 */</span>\n  <span class="token property">height</span><span class="token punctuation">:</span> 8px<span class="token punctuation">;</span>\n  <span class="token property">background-color</span><span class="token punctuation">:</span> #ededed<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">/* 滚动条上的按钮(上下箭头) */</span>\n<span class="token selector">::-webkit-scrollbar-button</span> <span class="token punctuation">{</span>\n  <span class="token property">display</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">/* 滚动条轨道 */</span>\n<span class="token selector">::-webkit-scrollbar-track</span> <span class="token punctuation">{</span>\n  <span class="token property">background-color</span><span class="token punctuation">:</span> #ededed<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">/* 滚动条轨道，没有滑块 */</span>\n<span class="token selector">::-webkit-scrollbar-track-piece</span> <span class="token punctuation">{</span>\n  <span class="token property">background-color</span><span class="token punctuation">:</span> #ededed<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">/* 垂直滚动条和水平滚动条交汇的部分 */</span>\n<span class="token selector">::-webkit-scrollbar-corner</span> <span class="token punctuation">{</span>\n  <span class="token property">background-color</span><span class="token punctuation">:</span> #ededed<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">/* 滚动条上的滚动滑块 */</span>\n<span class="token selector">::-webkit-scrollbar-thumb</span> <span class="token punctuation">{</span>\n  <span class="token property">border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>\n  <span class="token property">background-color</span><span class="token punctuation">:</span> #d6d6d6<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">/* 右下角拖动块 */</span>\n<span class="token selector">::-webkit-resizer</span> <span class="token punctuation">{</span>\n  <span class="token property">display</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br></div></div>',
          3
        ),
        t = {
          href: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/::-webkit-scrollbar',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        c = (0, p.Uk)('MDN'),
        l = {
          render: function (n, s) {
            const a = (0, p.up)('OutboundLink')
            return (
              (0, p.wg)(),
              (0, p.j4)(
                p.HY,
                null,
                [
                  e,
                  (0, p.Wm)('p', null, [(0, p.Wm)('a', t, [c, (0, p.Wm)(a)])])
                ],
                64
              )
            )
          }
        }
    }
  }
])
