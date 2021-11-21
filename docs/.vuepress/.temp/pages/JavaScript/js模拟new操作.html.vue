<template><h1 id="能否模拟实现-js-的-new-操作符" tabindex="-1"><a class="header-anchor" href="#能否模拟实现-js-的-new-操作符" aria-hidden="true">#</a> 能否模拟实现 JS 的 new 操作符</h1>
<h2 id="js-模拟-new-操作" tabindex="-1"><a class="header-anchor" href="#js-模拟-new-操作" aria-hidden="true">#</a> js 模拟 new 操作</h2>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 模拟实现 new 操作符
 * <span class="token keyword">@param</span>  <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">ctor</span> [构造函数]
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token operator">|</span>Function<span class="token operator">|</span>Regex<span class="token operator">|</span>Date<span class="token operator">|</span>Error<span class="token punctuation">}</span></span>      [返回结果]
 */</span>
<span class="token keyword">function</span> <span class="token function">newOperator</span><span class="token punctuation">(</span><span class="token parameter">ctor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> ctor <span class="token operator">!==</span> <span class="token string">'function'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">throw</span> <span class="token string">'newOperator function the first param must be a function'</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// ES6 new.target 是指向构造函数</span>
  newOperator<span class="token punctuation">.</span>target <span class="token operator">=</span> ctor
  <span class="token comment">// 1.创建一个全新的对象，</span>
  <span class="token comment">// 2.并且执行[[Prototype]]链接</span>
  <span class="token comment">// 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。</span>
  <span class="token keyword">var</span> newObj <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>ctor<span class="token punctuation">.</span>prototype<span class="token punctuation">)</span>
  <span class="token comment">// ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);</span>
  <span class="token comment">// 除去ctor构造函数的其余参数</span>
  <span class="token keyword">var</span> argsArr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>arguments<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token comment">// 3.生成的新对象会绑定到函数调用的`this`。</span>
  <span class="token comment">// 获取到ctor函数返回结果</span>
  <span class="token keyword">var</span> ctorReturnResult <span class="token operator">=</span> <span class="token function">ctor</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span>newObj<span class="token punctuation">,</span> argsArr<span class="token punctuation">)</span>
  <span class="token comment">// 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null</span>
  <span class="token keyword">var</span> isObject <span class="token operator">=</span>
    <span class="token keyword">typeof</span> ctorReturnResult <span class="token operator">===</span> <span class="token string">'object'</span> <span class="token operator">&amp;&amp;</span> ctorReturnResult <span class="token operator">!==</span> <span class="token keyword">null</span>
  <span class="token keyword">var</span> isFunction <span class="token operator">=</span> <span class="token keyword">typeof</span> ctorReturnResult <span class="token operator">===</span> <span class="token string">'function'</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isObject <span class="token operator">||</span> isFunction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> ctorReturnResult
  <span class="token punctuation">}</span>
  <span class="token comment">// 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。</span>
  <span class="token keyword">return</span> newObj
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div><pre><code>Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的**proto**。
</code></pre>
<h2 id="对于不支持-es5-的浏览器-mdn-上提供了-ployfill-方案。" tabindex="-1"><a class="header-anchor" href="#对于不支持-es5-的浏览器-mdn-上提供了-ployfill-方案。" aria-hidden="true">#</a> 对于不支持 ES5 的浏览器，MDN 上提供了 ployfill 方案。</h2>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> Object<span class="token punctuation">.</span>create <span class="token operator">!==</span> <span class="token string">'function'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function-variable function">create</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">proto<span class="token punctuation">,</span> propertiesObject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> proto <span class="token operator">!==</span> <span class="token string">'object'</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> proto <span class="token operator">!==</span> <span class="token string">'function'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">TypeError</span><span class="token punctuation">(</span><span class="token string">'Object prototype may only be an Object: '</span> <span class="token operator">+</span> proto<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>proto <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span>
        <span class="token string">"This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument."</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> propertiesObject <span class="token operator">!=</span> <span class="token string">'undefined'</span><span class="token punctuation">)</span>
      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span>
        <span class="token string">"This browser's implementation of Object.create is a shim and doesn't support a second argument."</span>
      <span class="token punctuation">)</span>

    <span class="token keyword">function</span> <span class="token constant">F</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token class-name">F</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> proto
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">F</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h2 id="总结-new-做了什么" tabindex="-1"><a class="header-anchor" href="#总结-new-做了什么" aria-hidden="true">#</a> 总结， new 做了什么：</h2>
<pre><code>1、创建了一个全新的对象。
2、这个对象会被执行[[Prototype]]（也就是__proto__）链接。
3、生成的新对象会绑定到函数调用的this。
4、通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
5、如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用会自动返回这个新的对象。
</code></pre>
</template>
