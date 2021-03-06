;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [2966],
  {
    6182: (n, a, s) => {
      'use strict'
      s.r(a), s.d(a, { data: () => e })
      const e = {
        key: 'v-dd6edac6',
        path: '/issue/h5.html',
        title: 'H5 相关',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          {
            level: 2,
            title: 'WebView 返回上一页不刷新',
            slug: 'webview-返回上一页不刷新',
            children: []
          }
        ],
        filePathRelative: 'issue/h5.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    4239: (n, a, s) => {
      'use strict'
      s.r(a), s.d(a, { default: () => p })
      const e = (0, s(6252).uE)(
          '<h1 id="h5-相关" tabindex="-1"><a class="header-anchor" href="#h5-相关" aria-hidden="true">#</a> H5 相关</h1><h2 id="webview-返回上一页不刷新" tabindex="-1"><a class="header-anchor" href="#webview-返回上一页不刷新" aria-hidden="true">#</a> WebView 返回上一页不刷新</h2><h4 id="原因" tabindex="-1"><a class="header-anchor" href="#原因" aria-hidden="true">#</a> 原因</h4><p>为了提升浏览网页的效率加入了缓存机制</p><h4 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案" aria-hidden="true">#</a> 解决方案</h4><p>监听 <code>pageshow</code> 事件，通过 <code>persisted</code> 或者 <code>performance.navigation.type</code> 属性判断当前页面是否通过缓存载入</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token function-variable function">pageshowFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>\n    e<span class="token punctuation">.</span>persisted <span class="token operator">||</span>\n    <span class="token punctuation">(</span>window<span class="token punctuation">.</span>performance <span class="token operator">&amp;&amp;</span> window<span class="token punctuation">.</span>performance<span class="token punctuation">.</span>navigation<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token number">2</span><span class="token punctuation">)</span>\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    location<span class="token punctuation">.</span><span class="token function">reload</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\nwindow<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;pageshow&#39;</span><span class="token punctuation">,</span> pageshowFn<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div>',
          7
        ),
        p = {
          render: function (n, a) {
            return e
          }
        }
    }
  }
])
