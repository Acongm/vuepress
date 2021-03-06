;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [9035],
  {
    5805: (s, a, n) => {
      'use strict'
      n.r(a), n.d(a, { data: () => e })
      const e = {
        key: 'v-40748f39',
        path: '/utils/regexp.html',
        title: '常用正则',
        lang: 'zh-CN',
        frontmatter: { sidebarDepth: 2 },
        excerpt: '',
        headers: [
          {
            level: 2,
            title: '验证相关',
            slug: '验证相关',
            children: [
              {
                level: 3,
                title: '是否是金额（精确到分）',
                slug: '是否是金额-精确到分',
                children: []
              },
              {
                level: 3,
                title: '是否是手机号',
                slug: '是否是手机号',
                children: []
              },
              {
                level: 3,
                title: '是否是邮箱号',
                slug: '是否是邮箱号',
                children: []
              },
              {
                level: 3,
                title: '是否是 QQ 号',
                slug: '是否是-qq-号',
                children: []
              },
              {
                level: 3,
                title: '是否是链接地址',
                slug: '是否是链接地址',
                children: []
              },
              {
                level: 3,
                title: '是否是身份证号码',
                slug: '是否是身份证号码',
                children: []
              }
            ]
          },
          {
            level: 2,
            title: '格式相关',
            slug: '格式相关',
            children: [
              {
                level: 3,
                title: '344 格式手机号',
                slug: '_344-格式手机号',
                children: []
              },
              {
                level: 3,
                title: '隐藏手机号中间 4 位',
                slug: '隐藏手机号中间-4-位',
                children: []
              }
            ]
          }
        ],
        filePathRelative: 'utils/regexp.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    2776: (s, a, n) => {
      'use strict'
      n.r(a), n.d(a, { default: () => p })
      const e = (0, n(6252).uE)(
          '<h1 id="常用正则" tabindex="-1"><a class="header-anchor" href="#常用正则" aria-hidden="true">#</a> 常用正则</h1><h2 id="验证相关" tabindex="-1"><a class="header-anchor" href="#验证相关" aria-hidden="true">#</a> 验证相关</h2><h3 id="是否是金额-精确到分" tabindex="-1"><a class="header-anchor" href="#是否是金额-精确到分" aria-hidden="true">#</a> 是否是金额（精确到分）</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^(0|([1-9]\\d*))(\\.\\d{1,2})?$</span><span class="token regex-delimiter">/</span></span>\n\n<span class="token operator">/</span><span class="token punctuation">(</span><span class="token operator">?</span><span class="token operator">:</span><span class="token operator">^</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token operator">-</span><span class="token number">9</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token operator">-</span><span class="token number">9</span><span class="token punctuation">]</span><span class="token operator">+</span><span class="token punctuation">)</span><span class="token operator">?</span><span class="token punctuation">(</span><span class="token operator">?</span><span class="token operator">:</span>\\<span class="token punctuation">.</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token operator">-</span><span class="token number">9</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">?</span>$<span class="token punctuation">)</span><span class="token operator">|</span><span class="token punctuation">(</span><span class="token operator">?</span><span class="token operator">:</span><span class="token operator">^</span><span class="token punctuation">(</span><span class="token operator">?</span><span class="token operator">:</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">}</span>$<span class="token punctuation">)</span><span class="token operator">|</span><span class="token punctuation">(</span><span class="token operator">?</span><span class="token operator">:</span><span class="token operator">^</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token operator">-</span><span class="token number">9</span><span class="token punctuation">]</span>\\<span class="token punctuation">.</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token operator">-</span><span class="token number">9</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token operator">?</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token operator">-</span><span class="token number">9</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">?</span>$<span class="token punctuation">)</span><span class="token operator">/</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="是否是手机号" tabindex="-1"><a class="header-anchor" href="#是否是手机号" aria-hidden="true">#</a> 是否是手机号</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^1\\d{10}$</span><span class="token regex-delimiter">/</span></span>\n\n<span class="token operator">/</span><span class="token operator">^</span><span class="token number">1</span><span class="token punctuation">[</span><span class="token number">3</span><span class="token operator">-</span><span class="token number">9</span><span class="token punctuation">]</span>\\d<span class="token punctuation">{</span><span class="token number">9</span><span class="token punctuation">}</span>$<span class="token operator">/</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="是否是邮箱号" tabindex="-1"><a class="header-anchor" href="#是否是邮箱号" aria-hidden="true">#</a> 是否是邮箱号</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$</span><span class="token regex-delimiter">/</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="是否是-qq-号" tabindex="-1"><a class="header-anchor" href="#是否是-qq-号" aria-hidden="true">#</a> 是否是 QQ 号</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^[1-9]{1}\\d{4,11}$</span><span class="token regex-delimiter">/</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="是否是链接地址" tabindex="-1"><a class="header-anchor" href="#是否是链接地址" aria-hidden="true">#</a> 是否是链接地址</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^(https|http):\\/\\/[A-Za-z0-9-_]+\\.[A-Za-z0-9]+[\\/=\\?%\\-&amp;_~`@[\\]\\&#39;:+!]*([^&lt;&gt;\\&quot;\\&quot;])*$</span><span class="token regex-delimiter">/</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="是否是身份证号码" tabindex="-1"><a class="header-anchor" href="#是否是身份证号码" aria-hidden="true">#</a> 是否是身份证号码</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$</span><span class="token regex-delimiter">/</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="格式相关" tabindex="-1"><a class="header-anchor" href="#格式相关" aria-hidden="true">#</a> 格式相关</h2><h3 id="_344-格式手机号" tabindex="-1"><a class="header-anchor" href="#_344-格式手机号" aria-hidden="true">#</a> 344 格式手机号</h3><ul><li>从左到右</li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">(^\\d{3}|\\d{4}\\B)</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span>\n<span class="token comment">// 例：</span>\n<span class="token string">&#39;15512341234&#39;</span><span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">(^\\d{3}|\\d{4}\\B)</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span><span class="token punctuation">,</span> <span class="token string">&#39;$1 &#39;</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ul><li>从右到左</li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\\B(?=(?:\\d{4})+$)</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span>\n<span class="token comment">// 例：</span>\n<span class="token string">&#39;15512341234&#39;</span><span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\\B(?=(?:\\d{4})+$)</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span><span class="token punctuation">,</span> <span class="token string">&#39; &#39;</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="隐藏手机号中间-4-位" tabindex="-1"><a class="header-anchor" href="#隐藏手机号中间-4-位" aria-hidden="true">#</a> 隐藏手机号中间 4 位</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">(\\d{3})\\d{4}(\\d{4})</span><span class="token regex-delimiter">/</span></span>\n<span class="token comment">// 例：</span>\n<span class="token string">&#39;15512341234&#39;</span><span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">(\\d{3})\\d{4}(\\d{4})</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span> <span class="token string">&#39;$1****$2&#39;</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>',
          22
        ),
        p = {
          render: function (s, a) {
            return e
          }
        }
    }
  }
])
