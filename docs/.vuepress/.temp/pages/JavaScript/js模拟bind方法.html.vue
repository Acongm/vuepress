<template><h1 id="js-模拟-bind-方法" tabindex="-1"><a class="header-anchor" href="#js-模拟-bind-方法" aria-hidden="true">#</a> js 模拟 bind 方法</h1>
<h2 id="_1-能否模拟实现-js-的-bind-方法" tabindex="-1"><a class="header-anchor" href="#_1-能否模拟实现-js-的-bind-方法" aria-hidden="true">#</a> 1：能否模拟实现 JS 的 bind 方法</h2>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token comment">// 第一版 修改this指向，合并参数</span>
<span class="token class-name">Function</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">bindFn</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">bind</span><span class="token punctuation">(</span><span class="token parameter">thisArg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token keyword">this</span> <span class="token operator">!==</span> <span class="token string">'function'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">TypeError</span><span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">+</span> <span class="token string">'must be a function'</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 存储函数本身</span>
  <span class="token keyword">var</span> self <span class="token operator">=</span> <span class="token keyword">this</span>
  <span class="token comment">// 去除thisArg的其他参数 转成数组</span>
  <span class="token keyword">var</span> args <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>arguments<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token keyword">var</span> <span class="token function-variable function">bound</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// bind返回的函数 的参数转成数组</span>
    <span class="token keyword">var</span> boundArgs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span>
    <span class="token comment">// apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果</span>
    <span class="token keyword">return</span> <span class="token function">self</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span>thisArg<span class="token punctuation">,</span> args<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span>boundArgs<span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> bound
<span class="token punctuation">}</span>
<span class="token comment">// 测试</span>
<span class="token keyword">var</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">'若川'</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">original</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token punctuation">[</span>a<span class="token punctuation">,</span> b<span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token keyword">var</span> bound <span class="token operator">=</span> original<span class="token punctuation">.</span><span class="token function">bindFn</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>
<span class="token function">bound</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span> <span class="token comment">// '若川', [1, 2]</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token comment">// 第三版 实现new调用</span>
<span class="token class-name">Function</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">bindFn</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">bind</span><span class="token punctuation">(</span><span class="token parameter">thisArg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token keyword">this</span> <span class="token operator">!==</span> <span class="token string">'function'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">TypeError</span><span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">+</span> <span class="token string">' must be a function'</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 存储调用bind的函数本身</span>
  <span class="token keyword">var</span> self <span class="token operator">=</span> <span class="token keyword">this</span>
  <span class="token comment">// 去除thisArg的其他参数 转成数组</span>
  <span class="token keyword">var</span> args <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>arguments<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token keyword">var</span> <span class="token function-variable function">bound</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// bind返回的函数 的参数转成数组</span>
    <span class="token keyword">var</span> boundArgs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span>
    <span class="token keyword">var</span> finalArgs <span class="token operator">=</span> args<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span>boundArgs<span class="token punctuation">)</span>
    <span class="token comment">// new 调用时，其实this instanceof bound判断也不是很准确。es6 new.target就是解决这一问题的。</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token keyword">instanceof</span> <span class="token class-name">bound</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 这里是实现上文描述的 new 的第 1, 2, 4 步</span>
      <span class="token comment">// 1.创建一个全新的对象</span>
      <span class="token comment">// 2.并且执行[[Prototype]]链接</span>
      <span class="token comment">// 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。</span>
      <span class="token comment">// self可能是ES6的箭头函数，没有prototype，所以就没必要再指向做prototype操作。</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>self<span class="token punctuation">.</span>prototype<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// ES5 提供的方案 Object.create()</span>
        <span class="token comment">// bound.prototype = Object.create(self.prototype);</span>
        <span class="token comment">// 但 既然是模拟ES5的bind，那浏览器也基本没有实现Object.create()</span>
        <span class="token comment">// 所以采用 MDN ployfill方案 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create</span>
        <span class="token keyword">function</span> <span class="token function">Empty</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token class-name">Empty</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> self<span class="token punctuation">.</span>prototype
        bound<span class="token punctuation">.</span>prototype <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Empty</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 这里是实现上文描述的 new 的第 3 步</span>
      <span class="token comment">// 3.生成的新对象会绑定到函数调用的`this`。</span>
      <span class="token keyword">var</span> result <span class="token operator">=</span> <span class="token function">self</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> finalArgs<span class="token punctuation">)</span>
      <span class="token comment">// 这里是实现上文描述的 new 的第 5 步</span>
      <span class="token comment">// 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，</span>
      <span class="token comment">// 那么`new`表达式中的函数调用会自动返回这个新的对象。</span>
      <span class="token keyword">var</span> isObject <span class="token operator">=</span> <span class="token keyword">typeof</span> result <span class="token operator">===</span> <span class="token string">'object'</span> <span class="token operator">&amp;&amp;</span> result <span class="token operator">!==</span> <span class="token keyword">null</span>
      <span class="token keyword">var</span> isFunction <span class="token operator">=</span> <span class="token keyword">typeof</span> result <span class="token operator">===</span> <span class="token string">'function'</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>isObject <span class="token operator">||</span> isFunction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> result
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> <span class="token keyword">this</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果</span>
      <span class="token keyword">return</span> <span class="token function">self</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span>thisArg<span class="token punctuation">,</span> finalArgs<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> bound
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3>
<pre><code>1、bind 是 Function 原型链中的 Function.prototype 的一个属性，它是一个函数，修改 this 指向，合并参数传递给原函数，返回值是一个新的函数。
2、bind 返回的函数可以通过 new 调用，这时提供的 this 的参数被忽略，指向了 new 生成的全新对象。内部模拟实现了 new 操作符。
3、es5-shim 源码模拟实现 bind 时用 Function 实现了 length。
事实上，平时其实很少需要使用自己实现的投入到生成环境中。但面试官通过这个面试题能考察很多知识。比如 this 指向，原型链，闭包，函数等知识，可以扩展很多。
</code></pre>
</template>
