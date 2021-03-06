;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [7449],
  {
    1118: (a, e, n) => {
      'use strict'
      n.r(e), n.d(e, { data: () => r })
      const r = {
        key: 'v-aee1d2a4',
        path: '/JavaScript/%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87-%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE-%E9%97%AD%E5%8C%85.html',
        title: '执行上下文-作用域链-闭包',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          {
            level: 2,
            title: '1.1 执行上下文-作用域链-闭包',
            slug: '_1-1-执行上下文-作用域链-闭包',
            children: [
              {
                level: 3,
                title: '理解 JavaScript 中的执行上下文和执行栈',
                slug: '理解-javascript-中的执行上下文和执行栈',
                children: []
              }
            ]
          }
        ],
        filePathRelative: 'JavaScript/执行上下文-作用域链-闭包.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    2197: (a, e, n) => {
      'use strict'
      n.r(e), n.d(e, { default: () => i })
      const r = (0, n(6252).uE)(
          '<h1 id="执行上下文-作用域链-闭包" tabindex="-1"><a class="header-anchor" href="#执行上下文-作用域链-闭包" aria-hidden="true">#</a> 执行上下文-作用域链-闭包</h1><h2 id="_1-1-执行上下文-作用域链-闭包" tabindex="-1"><a class="header-anchor" href="#_1-1-执行上下文-作用域链-闭包" aria-hidden="true">#</a> 1.1 执行上下文-作用域链-闭包</h2><h3 id="理解-javascript-中的执行上下文和执行栈" tabindex="-1"><a class="header-anchor" href="#理解-javascript-中的执行上下文和执行栈" aria-hidden="true">#</a> 理解 JavaScript 中的执行上下文和执行栈</h3><pre><code>JavaScript 中有三种执行上下文类型。全局、函数、Eval执行上下文。\n在全局执行上下文中，this 的值指向全局对象。(在浏览器中，this引用 Window 对象)。\n</code></pre><p>` 在函数执行上下文中，this 的值取决于该函数是如何被调用的。如果它被一个引用对象调用，那么 this 会被设置成那个对象，否则 this 的值被设置为全局对象或者 undefined（在严格模式下）</p><h4 id="_1-立即执行函数" tabindex="-1"><a class="header-anchor" href="#_1-立即执行函数" aria-hidden="true">#</a> 1. 立即执行函数</h4><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 代码</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="_2-闭包" tabindex="-1"><a class="header-anchor" href="#_2-闭包" aria-hidden="true">#</a> 2. 闭包</h4><pre><code>对于闭包(closure)，当外部函数返回之后，内部函数依然可以访问外部函数的变量。\n\n闭包的方法是通过背包的类比， 当一个函数被创建并传递或从另一个函数返回时，它会携带一个背包。\n背包中是函数声明时作用域内的所有变量。\n</code></pre><h4 id="_3-使用闭包定义私有变量" tabindex="-1"><a class="header-anchor" href="#_3-使用闭包定义私有变量" aria-hidden="true">#</a> 3. 使用闭包定义私有变量</h4><pre><code>通常，JavaScript开发者使用下划线作为私有变量的前缀。但是实际上，这些变量依然可以被访问和修改，并非真正的私有变量。这时，使用闭包可以定义真正的私有变量：\n</code></pre><h4 id="_4-prototype" tabindex="-1"><a class="header-anchor" href="#_4-prototype" aria-hidden="true">#</a> 4. prototype</h4><pre><code>每个JavaScript构造函数都有一个prototype属性，用于设置所有实例对象需要共享的属性和方法。\nprototype属性不能列举。JavaScript仅支持通过prototype属性进行继承属性和方法。\n</code></pre><h4 id="_5-模块化" tabindex="-1"><a class="header-anchor" href="#_5-模块化" aria-hidden="true">#</a> 5. 模块化</h4><pre><code>JavaScript并非模块化编程语言，至少ES6落地之前都不是。然而对于一个复杂的Web应用，模块化编程是一个最基本的要求。\n这时，可以使用立即执行函数来实现模块化，正如很多JS库比如jQuery以及我们Fundebug都是这样实现的。\n所谓模块化，就是根据需要控制模块内属性与方法的可访问性，即私有或者公开。\n</code></pre><h4 id="_6-变量提升" tabindex="-1"><a class="header-anchor" href="#_6-变量提升" aria-hidden="true">#</a> 6. 变量提升</h4><pre><code>JavaScript会将所有变量和函数声明移动到它的作用域的最前面，这就是所谓的变量提升(Hoisting)。也就是说，无论你在什么地方声明变量和函数，解释器都会将它们移动到作用域的最前面。因此我们可以先使用变量和函数，而后声明它们。\n</code></pre><h4 id="_7-柯里化" tabindex="-1"><a class="header-anchor" href="#_7-柯里化" aria-hidden="true">#</a> 7. 柯里化</h4><pre><code>柯里化，即Currying，可以是函数变得更加灵活。\n我们可以一次性传入多个参数调用它；也可以只传入一部分参数来调用它，让它返回一个函数去处理剩下的参数。\n</code></pre><h4 id="_8-apply-call-与-bind-方法" tabindex="-1"><a class="header-anchor" href="#_8-apply-call-与-bind-方法" aria-hidden="true">#</a> 8. apply, call 与 bind 方法</h4><pre><code>JavaScript开发者有必要理解apply、call与bind方法的不同点。它们的共同点是第一个参数都是this，即函数运行时依赖的上下文。\n\n三者之中，call方法是最简单的，它等价于指定this值调用函数：\n\napply方法与call方法类似。两者唯一的不同点在于，apply方法使用数组指定参数，而call方法每个参数单独需要指定\n\n使用bind方法，可以为函数绑定this值，然后作为一个新的函数返回：\n</code></pre><h4 id="_9-memoization" tabindex="-1"><a class="header-anchor" href="#_9-memoization" aria-hidden="true">#</a> 9. Memoization</h4><pre><code>Memoization用于优化比较耗时的计算，通过将计算结果缓存到内存中，这样对于同样的输入值，下次只需要中内存中读取结果。\n例如，将每个执行结果都存入函数内部作用域中的值中。\n</code></pre><h4 id="_10-函数重载" tabindex="-1"><a class="header-anchor" href="#_10-函数重载" aria-hidden="true">#</a> 10. 函数重载</h4><pre><code>所谓函数重载(method overloading)，就是函数名称一样，但是输入输出不一样。或者说，允许某个函数有各种不同输入，根据不同的输入，返回不同的结果。\n凭直觉，函数重载可以通过if…else或者switch实现，这就不去管它了。\njQuery之父John Resig提出了一个非常巧(bian)妙(tai)的方法，利用了闭包。\n</code></pre><p>、、、、 、、、、 、、、、 、、、、 、、、、 、、、、 、、、、 、、、、</p>',
          26
        ),
        i = {
          render: function (a, e) {
            return r
          }
        }
    }
  }
])
