;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [2450],
  {
    7703: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { data: () => t })
      const t = {
        key: 'v-6657f713',
        path: '/online-tools/bookmark-scripts.html',
        title: '书签脚本',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          { level: 2, title: '回到顶部', slug: '回到顶部', children: [] },
          { level: 2, title: '显示密码', slug: '显示密码', children: [] }
        ],
        filePathRelative: 'online-tools/bookmark-scripts.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    2332: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { default: () => p })
      const t = (0, a(6252).uE)(
          '<h1 id="书签脚本" tabindex="-1"><a class="header-anchor" href="#书签脚本" aria-hidden="true">#</a> 书签脚本</h1><h2 id="回到顶部" tabindex="-1"><a class="header-anchor" href="#回到顶部" aria-hidden="true">#</a> 回到顶部</h2><p>只支持窗口滚动，不支持内联滚动</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>javascript<span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  document<span class="token punctuation">.</span>scrollingElement<span class="token punctuation">.</span><span class="token function">scrollIntoView</span><span class="token punctuation">(</span><span class="token punctuation">{</span> behavior<span class="token operator">:</span> <span class="token string">&#39;smooth&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p><a href="javascript:void(function(){document.scrollingElement.scrollIntoView({behavior:&#39;smooth&#39;})})()">回到顶部</a></p><h2 id="显示密码" tabindex="-1"><a class="header-anchor" href="#显示密码" aria-hidden="true">#</a> 显示密码</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>javascript<span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  document<span class="token punctuation">.</span><span class="token function">querySelectorAll</span><span class="token punctuation">(</span><span class="token string">&#39;input[type=password]&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">dom</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    dom<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;type&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;text&#39;</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><a href="javascript:void(function(){document.querySelectorAll(&#39;input[type=password]&#39;).forEach(function(dom){dom.setAttribute(&#39;type&#39;,&#39;text&#39;)})})()">显示密码</a></p>',
          8
        ),
        p = {
          render: function (n, s) {
            return t
          }
        }
    }
  }
])
