;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [3297],
  {
    2106: (a, e, l) => {
      'use strict'
      l.r(e), l.d(e, { data: () => d })
      const d = {
        key: 'v-29e2a472',
        path: '/JavaScript/call%E3%80%81apply%E4%B8%8Ebind.html',
        title: 'call、apply 与 bind',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          { level: 2, title: 'call()', slug: 'call', children: [] },
          { level: 2, title: 'apply()', slug: 'apply', children: [] },
          { level: 2, title: 'bind', slug: 'bind', children: [] }
        ],
        filePathRelative: 'JavaScript/call、apply与bind.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    3435: (a, e, l) => {
      'use strict'
      l.r(e), l.d(e, { default: () => n })
      const d = (0, l(6252).uE)(
          '<h1 id="call、apply-与-bind" tabindex="-1"><a class="header-anchor" href="#call、apply-与-bind" aria-hidden="true">#</a> call、apply 与 bind</h1><h2 id="call" tabindex="-1"><a class="header-anchor" href="#call" aria-hidden="true">#</a> call()</h2><pre><code>通过 call 方法，你可以在一个对象上借用另一个对象上的方法，\n比如Object.prototype.toString.call([])，\n就是一个Array对象借用了Object对象上的方法。\n</code></pre><h2 id="apply" tabindex="-1"><a class="header-anchor" href="#apply" aria-hidden="true">#</a> apply()</h2><pre><code>  语法与 call() 方法的语法几乎完全相同，\n  唯一的区别在于，apply 的第二个参数必须是一个包含多个参数的数组（或类数组对象）。\n</code></pre><h2 id="bind" tabindex="-1"><a class="header-anchor" href="#bind" aria-hidden="true">#</a> bind</h2><pre><code>bind() 函数会创建一个新函数（称为绑定函数）\n\nbind是ES5新增的一个方法\n传参和call或apply类似\n不会执行对应的函数，call或apply会自动执行对应的函数\n返回对函数的引用\n</code></pre>',
          7
        ),
        n = {
          render: function (a, e) {
            return d
          }
        }
    }
  }
])
