;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [5334],
  {
    8398: (a, n, e) => {
      'use strict'
      e.r(n), e.d(n, { data: () => s })
      const s = {
        key: 'v-2d633f67',
        path: '/react/class-hooks.html',
        title: 'react',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          {
            level: 2,
            title: '为什么要合成事件机制',
            slug: '为什么要合成事件机制',
            children: []
          },
          {
            level: 2,
            title: 'setState 和 batchUpdate',
            slug: 'setstate-和-batchupdate',
            children: [
              { level: 3, title: '核心要点', slug: '核心要点', children: [] }
            ]
          },
          {
            level: 2,
            title: 'jsx 本质和 vdom',
            slug: 'jsx-本质和-vdom',
            children: []
          },
          {
            level: 2,
            title: 'react 组件更新过程',
            slug: 'react-组件更新过程',
            children: [
              {
                level: 3,
                title: '更新的两个阶段',
                slug: '更新的两个阶段',
                children: []
              },
              {
                level: 3,
                title: '可能会有性能问题',
                slug: '可能会有性能问题',
                children: []
              },
              {
                level: 3,
                title: '解决方案 fiber',
                slug: '解决方案-fiber',
                children: []
              }
            ]
          },
          {
            level: 2,
            title: 'react 面试题',
            slug: 'react-面试题',
            children: [
              {
                level: 3,
                title: '组件之间如何通讯？',
                slug: '组件之间如何通讯',
                children: []
              },
              {
                level: 3,
                title: 'JSX 本质是什么？',
                slug: 'jsx-本质是什么',
                children: []
              },
              {
                level: 3,
                title: 'COntext 是什么，如何应用',
                slug: 'context-是什么-如何应用',
                children: []
              },
              {
                level: 3,
                title: 'shouldComponentUpdate 用途',
                slug: 'shouldcomponentupdate-用途',
                children: []
              },
              {
                level: 3,
                title: 'redux 单项数据流',
                slug: 'redux-单项数据流',
                children: []
              },
              {
                level: 3,
                title: 'setState 场景题',
                slug: 'setstate-场景题',
                children: []
              },
              {
                level: 3,
                title: '什么是纯函数',
                slug: '什么是纯函数',
                children: []
              },
              {
                level: 3,
                title: 'React 发起 ajax 应该在那个生命周期',
                slug: 'react-发起-ajax-应该在那个生命周期',
                children: []
              },
              {
                level: 3,
                title: '渲染列表，为何使用 key',
                slug: '渲染列表-为何使用-key',
                children: []
              },
              {
                level: 3,
                title: '函数组件和 class 组件区别',
                slug: '函数组件和-class-组件区别',
                children: []
              },
              {
                level: 3,
                title: '什么是受控组件',
                slug: '什么是受控组件',
                children: []
              },
              {
                level: 3,
                title: '何时使用异步组件',
                slug: '何时使用异步组件',
                children: []
              },
              {
                level: 3,
                title: '多个组件有公共逻辑，如何抽离',
                slug: '多个组件有公共逻辑-如何抽离',
                children: []
              },
              {
                level: 3,
                title: 'redux 如何进行异步请求',
                slug: 'redux-如何进行异步请求',
                children: []
              },
              {
                level: 3,
                title: 'react-router 如何配置懒加载',
                slug: 'react-router-如何配置懒加载',
                children: []
              },
              {
                level: 3,
                title: 'PureComponent 有何区别',
                slug: 'purecomponent-有何区别',
                children: []
              },
              {
                level: 3,
                title: 'React 事件和 DOM 事件的区别',
                slug: 'react-事件和-dom-事件的区别',
                children: []
              },
              {
                level: 3,
                title: 'React 性能优化',
                slug: 'react-性能优化',
                children: []
              },
              {
                level: 3,
                title: 'React 和 Vue 的区别',
                slug: 'react-和-vue-的区别',
                children: []
              }
            ]
          },
          {
            level: 2,
            title: 'react/class-hooks',
            slug: 'react-class-hooks',
            children: []
          }
        ],
        filePathRelative: 'react/class-hooks.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    1943: (a, n, e) => {
      'use strict'
      e.r(n), e.d(n, { default: () => t })
      const s = (0, e(6252).uE)(
          '<h1 id="react" tabindex="-1"><a class="header-anchor" href="#react" aria-hidden="true">#</a> react</h1><h2 id="为什么要合成事件机制" tabindex="-1"><a class="header-anchor" href="#为什么要合成事件机制" aria-hidden="true">#</a> 为什么要合成事件机制</h2><ul><li>1、更好的兼容性和跨平台</li><li>2、挂载到 document， 减少内存消耗，避免频繁解绑</li><li>3、方便事件的统一管理（如事物机制）</li></ul><h4 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a> `</h4><ul><li>1、event 是 SyntheticEvent， 模拟出来的 Dom 事件所有能力</li><li>2、event.nativeEvent 是原生事件对象</li><li>3、所有的事件， 都被挂载到 document 上</li><li>4、和 Dom 事件不一样， 和 vue 事件也不一样</li></ul><h2 id="setstate-和-batchupdate" tabindex="-1"><a class="header-anchor" href="#setstate-和-batchupdate" aria-hidden="true">#</a> setState 和 batchUpdate</h2><ul><li>1、有时异步（普通使用）， 有时同步（setTimeout， DOM 事件）</li><li>2、有时合并（对象形式）， 有时不合并（函数形式）</li><li>3、后者比较好理解（像 Object.assign）, 主要讲解前者</li></ul><h3 id="核心要点" tabindex="-1"><a class="header-anchor" href="#核心要点" aria-hidden="true">#</a> 核心要点</h3><ul><li>1、setState 主流程</li><li>2、batchUpdate 机制</li><li>3、transaction（事务）机制</li></ul><h2 id="jsx-本质和-vdom" tabindex="-1"><a class="header-anchor" href="#jsx-本质和-vdom" aria-hidden="true">#</a> jsx 本质和 vdom</h2><ul><li>1、jsx 即 createElement 函数</li><li>2、执行生成 vnode</li><li>3、patch（elem，vnode）和 patch（vnode，newVnode）</li></ul><h2 id="react-组件更新过程" tabindex="-1"><a class="header-anchor" href="#react-组件更新过程" aria-hidden="true">#</a> react 组件更新过程</h2><ul><li>1、setState (newState) --&gt; dirtyComponents (可能有子组件)</li><li>2、render() 生成 newVnode</li><li>3、patch（vnode， newVnode）</li></ul><h3 id="更新的两个阶段" tabindex="-1"><a class="header-anchor" href="#更新的两个阶段" aria-hidden="true">#</a> 更新的两个阶段</h3><ul><li>1、上述的 patch 被拆分为两个阶段：</li><li>2、reconciliation 阶段 - 执行 diff 算法，纯 JS 计算</li><li>3、commit 阶段 - 将 diff 结果渲染 Dom</li></ul><h3 id="可能会有性能问题" tabindex="-1"><a class="header-anchor" href="#可能会有性能问题" aria-hidden="true">#</a> 可能会有性能问题</h3><ul><li>1、js 是单线程，且和 DOM 渲染共用一个线程</li><li>2、当组件足够复杂，组件更新时计算和渲染都压力很大</li><li>3、同时再有 DOM 操作需求（动画，鼠标拖拽等）， 将卡顿</li></ul><h3 id="解决方案-fiber" tabindex="-1"><a class="header-anchor" href="#解决方案-fiber" aria-hidden="true">#</a> 解决方案 fiber</h3><ul><li>1、将 reconciliation 阶段进行任务拆分（commit 无法拆分）</li><li>2、DOM 需要渲染时暂停，空闲时恢复</li><li>3、window.requestIdleCallback</li></ul><h2 id="react-面试题" tabindex="-1"><a class="header-anchor" href="#react-面试题" aria-hidden="true">#</a> react 面试题</h2><h3 id="组件之间如何通讯" tabindex="-1"><a class="header-anchor" href="#组件之间如何通讯" aria-hidden="true">#</a> 组件之间如何通讯？</h3><ul><li>1、父子组件 props</li><li>2、自定义事件 eventBus</li><li>3、Redux 和 Context</li></ul><h3 id="jsx-本质是什么" tabindex="-1"><a class="header-anchor" href="#jsx-本质是什么" aria-hidden="true">#</a> JSX 本质是什么？</h3><ul><li>1、createElement</li><li>2、执行返回 vnode</li></ul><h3 id="context-是什么-如何应用" tabindex="-1"><a class="header-anchor" href="#context-是什么-如何应用" aria-hidden="true">#</a> COntext 是什么，如何应用</h3><ul><li>1、父组件，向其下所有子孙组件传递信息</li><li>2、如一些简单的公共信息：主题色、语言等</li><li>3、复杂的公共信息，请用 redux（业务数据管理等）</li></ul><h3 id="shouldcomponentupdate-用途" tabindex="-1"><a class="header-anchor" href="#shouldcomponentupdate-用途" aria-hidden="true">#</a> shouldComponentUpdate 用途</h3><ul><li>1、性能优化</li><li>2、配合“不可变值”一起使用， 否则会出错</li></ul><h3 id="redux-单项数据流" tabindex="-1"><a class="header-anchor" href="#redux-单项数据流" aria-hidden="true">#</a> redux 单项数据流</h3><ul><li>View --&gt; Action --&gt; Dispatch --&gt; Reducer --&gt; State --&gt; View</li></ul><h3 id="setstate-场景题" tabindex="-1"><a class="header-anchor" href="#setstate-场景题" aria-hidden="true">#</a> setState 场景题</h3><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n\t<span class="token comment">// count 初始状态为 0</span>\n\t<span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n\t\tcount<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;1&#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>count<span class="token punctuation">)</span>\t<span class="token comment">// 0</span>\n\t<span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n\t\tcount<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;2&#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>count<span class="token punctuation">)</span>\t<span class="token comment">// 0</span>\n\t<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>\n\t\t<span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n\t\t\tcount<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span>\n\t\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;3&#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>count<span class="token punctuation">)</span>\t<span class="token comment">// 2</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\t<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>\n\t\t<span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n\t\t\tcount<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>count <span class="token operator">+</span> <span class="token number">1</span>\n\t\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;4&#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>count<span class="token punctuation">)</span>\t<span class="token comment">// 3</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><h3 id="什么是纯函数" tabindex="-1"><a class="header-anchor" href="#什么是纯函数" aria-hidden="true">#</a> 什么是纯函数</h3><ul><li>1、返回一个新值，没有副作用（不会“偷偷”修改其他值）</li><li>2、重点： 不可变值</li><li>3、如 arr1 = arr.slice()</li></ul><h4 id="react-组件生命周期" tabindex="-1"><a class="header-anchor" href="#react-组件生命周期" aria-hidden="true">#</a> * React 组件生命周期</h4><ul><li>1、单组件生命周期</li><li>2、父子组件生命周期</li><li>3、注意 scu</li></ul><h3 id="react-发起-ajax-应该在那个生命周期" tabindex="-1"><a class="header-anchor" href="#react-发起-ajax-应该在那个生命周期" aria-hidden="true">#</a> React 发起 ajax 应该在那个生命周期</h3><ul><li>1、同 Vue</li><li>2、componentDidMount</li></ul><h3 id="渲染列表-为何使用-key" tabindex="-1"><a class="header-anchor" href="#渲染列表-为何使用-key" aria-hidden="true">#</a> 渲染列表，为何使用 key</h3><ul><li>1、同 Vue。 必须用 key，且不能是 index 和 random</li><li>2、diff 算法中通过 tag 和 key 来判断，是否是 sameNode</li><li>3、减少渲染次数，提升渲染性能</li></ul><h3 id="函数组件和-class-组件区别" tabindex="-1"><a class="header-anchor" href="#函数组件和-class-组件区别" aria-hidden="true">#</a> 函数组件和 class 组件区别</h3><ul><li>1、纯函数，输入 props，输出 JSX</li><li>2、没有实例，没有生命周期，没有 state</li><li>3、不能扩展其他方法</li></ul><h3 id="什么是受控组件" tabindex="-1"><a class="header-anchor" href="#什么是受控组件" aria-hidden="true">#</a> 什么是受控组件</h3><ul><li>1、表单的值，受 state 控制</li><li>2、需要自行监听 onChange, 更新 state</li><li>3、对比非受控组件</li></ul><h3 id="何时使用异步组件" tabindex="-1"><a class="header-anchor" href="#何时使用异步组件" aria-hidden="true">#</a> 何时使用异步组件</h3><ul><li>1、同 vue</li><li>2、加载大组件</li><li>3、路由懒加载</li></ul><h3 id="多个组件有公共逻辑-如何抽离" tabindex="-1"><a class="header-anchor" href="#多个组件有公共逻辑-如何抽离" aria-hidden="true">#</a> 多个组件有公共逻辑，如何抽离</h3><ul><li>1、高阶组件</li><li>2、Render Props</li><li>3、mixin 已被 React 废弃</li></ul><h3 id="redux-如何进行异步请求" tabindex="-1"><a class="header-anchor" href="#redux-如何进行异步请求" aria-hidden="true">#</a> redux 如何进行异步请求</h3><ul><li>1、使用异步 action</li><li>2、如 redux-thunk</li></ul><h3 id="react-router-如何配置懒加载" tabindex="-1"><a class="header-anchor" href="#react-router-如何配置懒加载" aria-hidden="true">#</a> react-router 如何配置懒加载</h3><ul><li>1、使用 lazy 函数 lazy(()=&gt;import(&#39;../&#39;))</li></ul><h3 id="purecomponent-有何区别" tabindex="-1"><a class="header-anchor" href="#purecomponent-有何区别" aria-hidden="true">#</a> PureComponent 有何区别</h3><ul><li>1、实现了浅比较的 shouldComponentUpdate</li><li>2、优化性能</li><li>3、但要结合不可变值</li></ul><h3 id="react-事件和-dom-事件的区别" tabindex="-1"><a class="header-anchor" href="#react-事件和-dom-事件的区别" aria-hidden="true">#</a> React 事件和 DOM 事件的区别</h3><ul><li>1、所有事件挂载到 document</li><li>2、event 不是原生的，是 SyntheticEvent 合成事件对象</li><li>3、dispatchEvent</li></ul><h3 id="react-性能优化" tabindex="-1"><a class="header-anchor" href="#react-性能优化" aria-hidden="true">#</a> React 性能优化</h3><ul><li>1、渲染列表时加 key</li><li>2、自定义事件、DOM 事件及时销毁</li><li>3、合理使用异步组件</li><li>4、减少函数 bind this 的次数</li><li>5、合理使用 SCU PureComponent 和 memo</li><li>6、合理使用 Immutable.js (redux 中的不可变值，配合 PureComponent 使用最佳)</li><li>7、webpack 层面的优化</li><li>8、前端通用的性能优化， 如图片懒加载</li><li>9、使用 SSR</li></ul><h3 id="react-和-vue-的区别" tabindex="-1"><a class="header-anchor" href="#react-和-vue-的区别" aria-hidden="true">#</a> React 和 Vue 的区别</h3><ul><li>1、都支持组件化</li><li>2、都是数据驱动视图</li><li>3、都使用 vdom 操作 DOM</li><li>4、React 使用 JSX 拥抱 JS，Vue 使用模版拥抱 html</li><li>5、React 函数式编程，Vue 声明式编程</li><li>6、React 更多需要自力更生，Vue 把想要的都给你</li><li>7、</li></ul><h2 id="react-class-hooks" tabindex="-1"><a class="header-anchor" href="#react-class-hooks" aria-hidden="true">#</a> react/class-hooks</h2>',
          61
        ),
        t = {
          render: function (a, n) {
            return s
          }
        }
    }
  }
])
