;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [1753],
  {
    7578: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { data: () => p })
      const p = {
        key: 'v-8e6560ec',
        path: '/utils/function.html',
        title: '常用方法',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          {
            level: 2,
            title: '提取身份证信息',
            slug: '提取身份证信息',
            children: []
          },
          { level: 2, title: '环境判断', slug: '环境判断', children: [] },
          {
            level: 2,
            title: '微信 api promise 化',
            slug: '微信-api-promise-化',
            children: []
          }
        ],
        filePathRelative: 'utils/function.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    4576: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { default: () => t })
      const p = (0, a(6252).uE)(
          '<h1 id="常用方法" tabindex="-1"><a class="header-anchor" href="#常用方法" aria-hidden="true">#</a> 常用方法</h1><h2 id="提取身份证信息" tabindex="-1"><a class="header-anchor" href="#提取身份证信息" aria-hidden="true">#</a> 提取身份证信息</h2><ul><li><h4 id="参数" tabindex="-1"><a class="header-anchor" href="#参数" aria-hidden="true">#</a> 参数</h4><ul><li><strong>idCard:</strong> 身份证号码</li><li><strong>separator:</strong> 出生年月日的分割字符，默认为 <code>/</code></li></ul></li><li><h4 id="返回值" tabindex="-1"><a class="header-anchor" href="#返回值" aria-hidden="true">#</a> 返回值</h4><ul><li><strong>age:</strong> 年龄（实岁）</li><li><strong>birthday:</strong> 出生年月日</li><li><strong>gender:</strong> 性别（0 女 1 男）</li></ul></li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">getIdCardInfo</span><span class="token punctuation">(</span>idCard<span class="token punctuation">,</span> separator <span class="token operator">=</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>\n    <span class="token operator">!</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>\n      idCard\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">throw</span> <span class="token function">Error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>idCard<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">不是一个身份证号码</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 提取 idCard 中的字符</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">idSubstr</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">s<span class="token punctuation">,</span> e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> idCard<span class="token punctuation">.</span><span class="token function">substr</span><span class="token punctuation">(</span>s<span class="token punctuation">,</span> e<span class="token punctuation">)</span>\n  <span class="token comment">// 拼接日期</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">splice</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> d<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>separator<span class="token punctuation">)</span>\n  <span class="token comment">// 获取出生年月日 性别（0 女 1 男）</span>\n  <span class="token keyword">let</span> birthday<span class="token punctuation">,</span> gender\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>idCard<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">18</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    birthday <span class="token operator">=</span> <span class="token function">splice</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token function">idSubstr</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">idSubstr</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">idSubstr</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n    gender <span class="token operator">=</span> <span class="token function">idSubstr</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">1</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n    birthday <span class="token operator">=</span> <span class="token function">splice</span><span class="token punctuation">(</span><span class="token function">idSubstr</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">idSubstr</span><span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">idSubstr</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    gender <span class="token operator">=</span> <span class="token function">idSubstr</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">1</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 获取年龄（实岁）</span>\n  <span class="token keyword">const</span> birthDate <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>birthday<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> newDate <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> year <span class="token operator">=</span> newDate<span class="token punctuation">.</span><span class="token function">getFullYear</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">let</span> age <span class="token operator">=</span> year <span class="token operator">-</span> birthDate<span class="token punctuation">.</span><span class="token function">getFullYear</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>newDate <span class="token operator">&lt;</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token punctuation">[</span>year<span class="token punctuation">,</span> birthday<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    age<span class="token operator">--</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    age<span class="token punctuation">,</span>\n    birthday<span class="token punctuation">,</span>\n    gender\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><h2 id="环境判断" tabindex="-1"><a class="header-anchor" href="#环境判断" aria-hidden="true">#</a> 环境判断</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token constant">UA</span> <span class="token operator">=</span> window<span class="token punctuation">.</span>navigator<span class="token punctuation">.</span>userAgent<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment">// Android</span>\n<span class="token keyword">const</span> isAndroid <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">android</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span><span class="token constant">UA</span><span class="token punctuation">)</span>\n\n<span class="token comment">// IOS</span>\n<span class="token keyword">const</span> isIOS <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">iphone|ipad|ipod|ios</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span><span class="token constant">UA</span><span class="token punctuation">)</span>\n\n<span class="token comment">// 浏览器环境</span>\n<span class="token keyword">const</span> inBrowser <span class="token operator">=</span> <span class="token keyword">typeof</span> window <span class="token operator">!==</span> <span class="token string">&#39;undefined&#39;</span>\n\n<span class="token comment">// IE</span>\n<span class="token keyword">const</span> isIE <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">msie|trident</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span><span class="token constant">UA</span><span class="token punctuation">)</span>\n\n<span class="token comment">// Edge</span>\n<span class="token keyword">const</span> isEdge <span class="token operator">=</span> <span class="token constant">UA</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">&#39;edge/&#39;</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span>\n\n<span class="token comment">// Chrome</span>\n<span class="token keyword">const</span> isChrome <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">chrome\\/\\d+</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span><span class="token constant">UA</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>isEdge\n\n<span class="token comment">// 微信</span>\n<span class="token keyword">const</span> isWeChat <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">micromessenger</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span><span class="token constant">UA</span><span class="token punctuation">)</span>\n\n<span class="token comment">// 移动端</span>\n<span class="token keyword">const</span> isMobile <span class="token operator">=</span> <span class="token string">&#39;ontouchstart&#39;</span> <span class="token keyword">in</span> window\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h2 id="微信-api-promise-化" tabindex="-1"><a class="header-anchor" href="#微信-api-promise-化" aria-hidden="true">#</a> 微信 api promise 化</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">promisify</span><span class="token punctuation">(</span><span class="token parameter">fn</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      <span class="token function">fn</span><span class="token punctuation">(</span>\n        Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> options<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n          success<span class="token operator">:</span> resolve<span class="token punctuation">,</span>\n          fail<span class="token operator">:</span> reject\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 例 获取系统信息</span>\n<span class="token function">promisify</span><span class="token punctuation">(</span>wx<span class="token punctuation">.</span>getSystemInfo<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">res</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;fail&#39;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div>',
          8
        ),
        t = {
          render: function (n, s) {
            return p
          }
        }
    }
  }
])
