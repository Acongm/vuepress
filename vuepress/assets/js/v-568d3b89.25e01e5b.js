;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [3192],
  {
    5929: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { data: () => p })
      const p = {
        key: 'v-568d3b89',
        path: '/JavaScript/',
        title: 'js 基础知识',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          {
            level: 2,
            title: '数据类型',
            slug: '数据类型',
            children: [
              { level: 3, title: '原始类型', slug: '原始类型', children: [] },
              { level: 3, title: '复杂类型', slug: '复杂类型', children: [] }
            ]
          },
          {
            level: 2,
            title:
              '对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？',
            slug: '对象类型和原始类型的不同之处-函数参数是对象会发生什么问题',
            children: []
          },
          {
            level: 2,
            title:
              'typeof 是否能正确判断类型？instanceof 能正确判断对象的原理是什么？',
            slug: 'typeof-是否能正确判断类型-instanceof-能正确判断对象的原理是什么',
            children: []
          },
          {
            level: 2,
            title: '类型转换',
            slug: '类型转换',
            children: [
              {
                level: 3,
                title: '对象转原始类型',
                slug: '对象转原始类型',
                children: []
              },
              {
                level: 3,
                title: '四则运算符',
                slug: '四则运算符',
                children: []
              },
              {
                level: 3,
                title: '比较运算符',
                slug: '比较运算符',
                children: []
              }
            ]
          },
          {
            level: 2,
            title: '如何正确判断 this？箭头函数的 this 是什么？',
            slug: '如何正确判断-this-箭头函数的-this-是什么',
            children: []
          },
          {
            level: 2,
            title: '== 和 === 有什么区别？',
            slug: '和-有什么区别',
            children: []
          },
          { level: 2, title: '什么是闭包？', slug: '什么是闭包', children: [] },
          {
            level: 2,
            title:
              '什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？',
            slug: '什么是浅拷贝-如何实现浅拷贝-什么是深拷贝-如何实现深拷贝',
            children: [
              {
                level: 3,
                title: '什么是浅拷贝',
                slug: '什么是浅拷贝',
                children: []
              },
              {
                level: 3,
                title: '什么是深拷贝',
                slug: '什么是深拷贝',
                children: []
              },
              {
                level: 3,
                title: '如何理解原型？如何理解原型链？',
                slug: '如何理解原型-如何理解原型链',
                children: []
              }
            ]
          },
          {
            level: 2,
            title: 'ES6 知识点及常考面试题',
            slug: 'es6-知识点及常考面试题',
            children: [
              {
                level: 3,
                title:
                  '原型如何实现继承？Class 如何实现继承？Class 本质是什么？',
                slug: '原型如何实现继承-class-如何实现继承-class-本质是什么',
                children: []
              },
              {
                level: 3,
                title: '为什么要使用模块化？',
                slug: '为什么要使用模块化',
                children: []
              },
              {
                level: 3,
                title: '都有哪几种方式可以实现模块化，各有什么特点？',
                slug: '都有哪几种方式可以实现模块化-各有什么特点',
                children: []
              },
              {
                level: 3,
                title: 'Proxy 可以实现什么功能？',
                slug: 'proxy-可以实现什么功能',
                children: []
              }
            ]
          },
          {
            level: 2,
            title: 'JS 异步编程及常考面试题',
            slug: 'js-异步编程及常考面试题',
            children: [
              {
                level: 3,
                title: '你理解的 Generator 是什么？',
                slug: '你理解的-generator-是什么',
                children: []
              }
            ]
          }
        ],
        filePathRelative: 'JavaScript/README.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    7291: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { default: () => t })
      const p = (0, a(6252).uE)(
          '<h1 id="js-基础知识" tabindex="-1"><a class="header-anchor" href="#js-基础知识" aria-hidden="true">#</a> js 基础知识</h1><h2 id="数据类型" tabindex="-1"><a class="header-anchor" href="#数据类型" aria-hidden="true">#</a> 数据类型</h2><blockquote><p>原始类型存储的都是值，没有函数可以调用</p></blockquote><h3 id="原始类型" tabindex="-1"><a class="header-anchor" href="#原始类型" aria-hidden="true">#</a> 原始类型</h3><ul><li>1、boolean</li><li>2、null</li><li>3、undefined</li><li>4、number</li><li>5、string</li><li>6、symbol</li></ul><h3 id="复杂类型" tabindex="-1"><a class="header-anchor" href="#复杂类型" aria-hidden="true">#</a> 复杂类型</h3><ul><li>7？、Object</li><li>8？、bigInt</li></ul><h2 id="对象类型和原始类型的不同之处-函数参数是对象会发生什么问题" tabindex="-1"><a class="header-anchor" href="#对象类型和原始类型的不同之处-函数参数是对象会发生什么问题" aria-hidden="true">#</a> 对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？</h2><ul><li>当我们将变量赋值给另外一个变量时，复制的是原本变量的地址（指针），也就是说当前变量 b 存放的地址（指针）也是 #001，当我们进行数据修改的时候，就会修改存放在地址（指针） #001 上的值，也就导致了两个变量的值都发生了改变。</li></ul><ul><li>总结， 正常变量赋值中（在“=” 情况下），都是复制原本变量地址,</li></ul><h2 id="typeof-是否能正确判断类型-instanceof-能正确判断对象的原理是什么" tabindex="-1"><a class="header-anchor" href="#typeof-是否能正确判断类型-instanceof-能正确判断对象的原理是什么" aria-hidden="true">#</a> typeof 是否能正确判断类型？instanceof 能正确判断对象的原理是什么？</h2><ul><li>1、typeof 只能判读一些原始类型， 对于数组、对象、函数等，不能准确的判断</li><li>2、如果我们想判断一个对象的正确类型，这时候可以考虑使用 instanceof，因为内部机制是通过原型链来判断的。</li><li>3、Symbol.hasInstance 可自定义对象的 instanceof 值</li></ul><h2 id="类型转换" tabindex="-1"><a class="header-anchor" href="#类型转换" aria-hidden="true">#</a> 类型转换</h2><ul><li>1、转换为布尔值 <ul><li>在条件判断时，除了 undefined， null， false， NaN， &#39;&#39;， 0， -0，其他所有值都转为 true，包括所有对象。</li></ul></li><li>2、转换为数字</li><li>3、转换为字符串</li></ul><h3 id="对象转原始类型" tabindex="-1"><a class="header-anchor" href="#对象转原始类型" aria-hidden="true">#</a> 对象转原始类型</h3><p>对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数，对于该函数来说，算法逻辑一般来说如下：</p><ul><li>如果已经是原始类型了，那就不需要转换了</li><li>如果需要转字符串类型就调用 x.toString()，转换为基础类型的话就返回转换的值。不是字符串类型的话就先调用 valueOf，结果不是基础类型的话再调用 toString</li><li>调用 x.valueOf()，如果转换为基础类型，就返回转换的值</li><li>如果都没有返回原始类型，就会报错</li></ul><h3 id="四则运算符" tabindex="-1"><a class="header-anchor" href="#四则运算符" aria-hidden="true">#</a> 四则运算符</h3><p>加法运算符不同于其他几个运算符，它有以下几个特点：</p><ul><li>运算中其中一方为字符串，那么就会把另一方也转换为字符串</li><li>如果一方不是字符串或者数字，那么会将它转换为数字或者字符串</li><li>那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字</li></ul><h3 id="比较运算符" tabindex="-1"><a class="header-anchor" href="#比较运算符" aria-hidden="true">#</a> 比较运算符</h3><ul><li>如果是对象，就通过 toPrimitive 转换对象</li><li>如果是字符串，就通过 unicode 字符索引来比较</li></ul><h2 id="如何正确判断-this-箭头函数的-this-是什么" tabindex="-1"><a class="header-anchor" href="#如何正确判断-this-箭头函数的-this-是什么" aria-hidden="true">#</a> 如何正确判断 this？箭头函数的 this 是什么？</h2><h2 id="和-有什么区别" tabindex="-1"><a class="header-anchor" href="#和-有什么区别" aria-hidden="true">#</a> == 和 === 有什么区别？</h2><ul><li>对于 === 来说就简单多了，就是判断两者类型和值是否相同。</li><li>对于 == 来说，就要:判断类型-&gt;判断 null==undefined-&gt;string==number-&gt;boolean==number-&gt;object==(string||number||symbol)-&gt;结果</li></ul><h2 id="什么是闭包" tabindex="-1"><a class="header-anchor" href="#什么是闭包" aria-hidden="true">#</a> 什么是闭包？</h2><ul><li>闭包的定义其实很简单：函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包。</li><li>类似一个背包</li><li>闭包存在的意义就是让我们可以间接访问函数内部的变量。</li></ul><h2 id="什么是浅拷贝-如何实现浅拷贝-什么是深拷贝-如何实现深拷贝" tabindex="-1"><a class="header-anchor" href="#什么是浅拷贝-如何实现浅拷贝-什么是深拷贝-如何实现深拷贝" aria-hidden="true">#</a> 什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？</h2><h3 id="什么是浅拷贝" tabindex="-1"><a class="header-anchor" href="#什么是浅拷贝" aria-hidden="true">#</a> 什么是浅拷贝</h3><ul><li>对象类型在赋值的过程中其实是复制了地址，从而会导致改变了一方其他也都被改变的情况。通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个情况。</li><li>Object.assign 就是用来浅拷贝所有属性到新对象中。如果是属性值对象的话，拷贝的是自己</li><li>另外我们还可以通过展开运算符 ... 来实现浅拷贝</li><li>浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，就需要深拷贝</li></ul><h3 id="什么是深拷贝" tabindex="-1"><a class="header-anchor" href="#什么是深拷贝" aria-hidden="true">#</a> 什么是深拷贝</h3><ul><li>JSON.parse(JSON.stringify(object)) 实现深拷贝 <ul><li>会忽略 undefined</li><li>会忽略 symbol</li><li>不能序列化函数</li><li>不能解决循环引用的对象</li></ul></li></ul><h3 id="如何理解原型-如何理解原型链" tabindex="-1"><a class="header-anchor" href="#如何理解原型-如何理解原型链" aria-hidden="true">#</a> 如何理解原型？如何理解原型链？</h3><ul><li><p>原型的 constructor 属性指向构造函数，构造函数又通过 prototype 属性指回原型，</p></li><li><p>但是并不是所有函数都具有这个属性，Function.prototype.bind() 就没有这个属性。</p></li><li><p>其实原型链就是多个对象通过 <strong>proto</strong> 的方式连接了起来。</p></li><li><p>为什么 obj 可以访问到 valueOf 函数，就是因为 obj 通过原型链找到了 valueOf 函数。</p></li><li><p>对于这一小节的知识点，总结起来就是以下几点：</p></li><li><p>Object 是所有对象的爸爸，所有对象都可以通过 <strong>proto</strong> 找到它</p></li><li><p>Function 是所有函数的爸爸，所有函数都可以通过 <strong>proto</strong> 找到它</p></li><li><p>函数的 prototype 是一个对象</p></li><li><p>对象的 <strong>proto</strong> 属性指向原型， <strong>proto</strong> 将对象和原型连接起来组成了原型链</p></li></ul><h2 id="es6-知识点及常考面试题" tabindex="-1"><a class="header-anchor" href="#es6-知识点及常考面试题" aria-hidden="true">#</a> ES6 知识点及常考面试题</h2><h3 id="原型如何实现继承-class-如何实现继承-class-本质是什么" tabindex="-1"><a class="header-anchor" href="#原型如何实现继承-class-如何实现继承-class-本质是什么" aria-hidden="true">#</a> 原型如何实现继承？Class 如何实现继承？Class 本质是什么？</h3><h4 id="组合继承" tabindex="-1"><a class="header-anchor" href="#组合继承" aria-hidden="true">#</a> 组合继承</h4><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Parent</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>val <span class="token operator">=</span> value\n<span class="token punctuation">}</span>\n<span class="token class-name">Parent</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">getValue</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>val<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">Child</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">Parent</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token class-name">Child</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Parent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Child</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\nchild<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 1</span>\nchild <span class="token keyword">instanceof</span> <span class="token class-name">Parent</span> <span class="token comment">// true</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h4 id="寄生组合继承" tabindex="-1"><a class="header-anchor" href="#寄生组合继承" aria-hidden="true">#</a> 寄生组合继承</h4><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Parent</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>val <span class="token operator">=</span> value\n<span class="token punctuation">}</span>\n<span class="token class-name">Parent</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">getValue</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>val<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">Child</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">Parent</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token class-name">Child</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token class-name">Parent</span><span class="token punctuation">.</span>prototype<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  constructor<span class="token operator">:</span> <span class="token punctuation">{</span>\n    value<span class="token operator">:</span> Child<span class="token punctuation">,</span>\n    enumerable<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n    writable<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    configurable<span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Child</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\nchild<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 1</span>\nchild <span class="token keyword">instanceof</span> <span class="token class-name">Parent</span> <span class="token comment">// true</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h4 id="class-继承" tabindex="-1"><a class="header-anchor" href="#class-继承" aria-hidden="true">#</a> Class 继承</h4><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Parent</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>val <span class="token operator">=</span> value\n  <span class="token punctuation">}</span>\n  <span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>val<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">class</span> <span class="token class-name">Child</span> <span class="token keyword">extends</span> <span class="token class-name">Parent</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">let</span> child <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Child</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\nchild<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 1</span>\nchild <span class="token keyword">instanceof</span> <span class="token class-name">Parent</span> <span class="token comment">// true</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h3 id="为什么要使用模块化" tabindex="-1"><a class="header-anchor" href="#为什么要使用模块化" aria-hidden="true">#</a> 为什么要使用模块化？</h3><ul><li>解决命名冲突</li><li>提供复用性</li><li>提高代码可维护性</li></ul><h3 id="都有哪几种方式可以实现模块化-各有什么特点" tabindex="-1"><a class="header-anchor" href="#都有哪几种方式可以实现模块化-各有什么特点" aria-hidden="true">#</a> 都有哪几种方式可以实现模块化，各有什么特点？</h3><ul><li>立即执行函数</li><li>AMD 和 CMD</li><li>CommonJS</li><li>ES Module</li></ul><h3 id="proxy-可以实现什么功能" tabindex="-1"><a class="header-anchor" href="#proxy-可以实现什么功能" aria-hidden="true">#</a> Proxy 可以实现什么功能？</h3><blockquote><p>Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。</p></blockquote><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">let</span> <span class="token function-variable function">onWatch</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> setBind<span class="token punctuation">,</span> getLogger</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> handler <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> property<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">getLogger</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> property<span class="token punctuation">)</span>\n      <span class="token comment">// 这句判断代码是新增的</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> target<span class="token punctuation">[</span>property<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span> <span class="token operator">&amp;&amp;</span> target<span class="token punctuation">[</span>property<span class="token punctuation">]</span> <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>target<span class="token punctuation">[</span>property<span class="token punctuation">]</span><span class="token punctuation">,</span> handler<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> property<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> property<span class="token punctuation">,</span> value<span class="token punctuation">,</span> receiver<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">setBind</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> property<span class="token punctuation">)</span>\n      <span class="token keyword">return</span> Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> property<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Proxy</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> handler<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">let</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span> a<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n<span class="token keyword">let</span> p <span class="token operator">=</span> <span class="token function">onWatch</span><span class="token punctuation">(</span>\n  obj<span class="token punctuation">,</span>\n  <span class="token punctuation">(</span><span class="token parameter">v<span class="token punctuation">,</span> property</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">监听到属性</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>property<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">改变为</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>v<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> property</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&#39;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>property<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&#39; = </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>target<span class="token punctuation">[</span>property<span class="token punctuation">]</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">)</span>\np<span class="token punctuation">.</span>a <span class="token operator">=</span> <span class="token number">2</span> <span class="token comment">// 监听到属性a改变</span>\np<span class="token punctuation">.</span>a <span class="token comment">// &#39;a&#39; = 2</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div><h2 id="js-异步编程及常考面试题" tabindex="-1"><a class="header-anchor" href="#js-异步编程及常考面试题" aria-hidden="true">#</a> JS 异步编程及常考面试题</h2><h3 id="你理解的-generator-是什么" tabindex="-1"><a class="header-anchor" href="#你理解的-generator-是什么" aria-hidden="true">#</a> 你理解的 Generator 是什么？</h3>',
          51
        ),
        t = {
          render: function (n, s) {
            return p
          }
        }
    }
  }
])
