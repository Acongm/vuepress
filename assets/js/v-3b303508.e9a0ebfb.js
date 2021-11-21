;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [857],
  {
    8170: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { data: () => p })
      const p = {
        key: 'v-3b303508',
        path: '/vue/code/proxy-observe.html',
        title: 'proxy-observe 核心代码 自定义实现',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [],
        filePathRelative: 'vue/code/proxy-observe.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    8568: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { default: () => t })
      const p = (0, a(6252).uE)(
          '<h1 id="proxy-observe-核心代码-自定义实现" tabindex="-1"><a class="header-anchor" href="#proxy-observe-核心代码-自定义实现" aria-hidden="true">#</a> proxy-observe 核心代码 自定义实现</h1><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// 创建响应式</span>\n<span class="token keyword">function</span> <span class="token function">reactive</span><span class="token punctuation">(</span><span class="token parameter">target <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> target <span class="token operator">!==</span> <span class="token string">&#39;object&#39;</span> <span class="token operator">||</span> target <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 不是对象或数组，则返回</span>\n    <span class="token keyword">return</span> target\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 代理配置</span>\n  <span class="token keyword">const</span> proxyConf <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 只处理本身（非原型的）属性</span>\n      <span class="token keyword">const</span> ownKeys <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">ownKeys</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>ownKeys<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;get&#39;</span><span class="token punctuation">,</span> key<span class="token punctuation">)</span> <span class="token comment">// 监听</span>\n      <span class="token punctuation">}</span>\n\n      <span class="token keyword">const</span> result <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span>\n\n      <span class="token comment">// 深度监听</span>\n      <span class="token comment">// 性能如何提升的？</span>\n      <span class="token keyword">return</span> <span class="token function">reactive</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 重复的数据，不处理</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> target<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token boolean">true</span>\n      <span class="token punctuation">}</span>\n\n      <span class="token keyword">const</span> ownKeys <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">ownKeys</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>ownKeys<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;已有的 key&#39;</span><span class="token punctuation">,</span> key<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;新增的 key&#39;</span><span class="token punctuation">,</span> key<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n\n      <span class="token keyword">const</span> result <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">,</span> val<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;set&#39;</span><span class="token punctuation">,</span> key<span class="token punctuation">,</span> val<span class="token punctuation">)</span>\n      <span class="token comment">// console.log(&#39;result&#39;, result) // true</span>\n      <span class="token keyword">return</span> result <span class="token comment">// 是否设置成功</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token function">deleteProperty</span><span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> result <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">deleteProperty</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> key<span class="token punctuation">)</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;delete property&#39;</span><span class="token punctuation">,</span> key<span class="token punctuation">)</span>\n      <span class="token comment">// console.log(&#39;result&#39;, result) // true</span>\n      <span class="token keyword">return</span> result <span class="token comment">// 是否删除成功</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 生成代理对象</span>\n  <span class="token keyword">const</span> observed <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> proxyConf<span class="token punctuation">)</span>\n  <span class="token keyword">return</span> observed\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 测试数据</span>\n<span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token punctuation">{</span>\n  name<span class="token operator">:</span> <span class="token string">&#39;zhangsan&#39;</span><span class="token punctuation">,</span>\n  age<span class="token operator">:</span> <span class="token number">20</span><span class="token punctuation">,</span>\n  info<span class="token operator">:</span> <span class="token punctuation">{</span>\n    city<span class="token operator">:</span> <span class="token string">&#39;beijing&#39;</span><span class="token punctuation">,</span>\n    a<span class="token operator">:</span> <span class="token punctuation">{</span>\n      b<span class="token operator">:</span> <span class="token punctuation">{</span>\n        c<span class="token operator">:</span> <span class="token punctuation">{</span>\n          d<span class="token operator">:</span> <span class="token punctuation">{</span>\n            e<span class="token operator">:</span> <span class="token number">100</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> proxyData <span class="token operator">=</span> <span class="token function">reactive</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br></div></div>',
          2
        ),
        t = {
          render: function (n, s) {
            return p
          }
        }
    }
  }
])
