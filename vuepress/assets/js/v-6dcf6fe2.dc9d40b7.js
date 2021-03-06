;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [9709],
  {
    4234: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { data: () => e })
      const e = {
        key: 'v-6dcf6fe2',
        path: '/node/npm.html',
        title: 'npm 相关',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          { level: 2, title: '镜像相关', slug: '镜像相关', children: [] },
          {
            level: 2,
            title: '查看已安装的依赖包',
            slug: '查看已安装的依赖包',
            children: []
          },
          {
            level: 2,
            title: '查看依赖包的安装路径',
            slug: '查看依赖包的安装路径',
            children: []
          },
          { level: 2, title: '清除缓存', slug: '清除缓存', children: [] },
          {
            level: 2,
            title: '导航到 npm 的相关页面',
            slug: '导航到-npm-的相关页面',
            children: [
              { level: 3, title: '打开文档', slug: '打开文档', children: [] },
              {
                level: 3,
                title: '打开 GitHub repo',
                slug: '打开-github-repo',
                children: []
              },
              {
                level: 3,
                title: '打开 GitHub issues',
                slug: '打开-github-issues',
                children: []
              }
            ]
          },
          {
            level: 2,
            title: '脚本命令相关',
            slug: '脚本命令相关',
            children: []
          }
        ],
        filePathRelative: 'node/npm.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    8774: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { default: () => p })
      const e = (0, a(6252).uE)(
          '<h1 id="npm-相关" tabindex="-1"><a class="header-anchor" href="#npm-相关" aria-hidden="true">#</a> npm 相关</h1><h2 id="镜像相关" tabindex="-1"><a class="header-anchor" href="#镜像相关" aria-hidden="true">#</a> 镜像相关</h2><p>设置淘宝镜像</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry https://registry.npm.taobao.org\n<span class="token comment"># yarn</span>\n<span class="token function">yarn</span> config <span class="token builtin class-name">set</span> registry https://registry.npm.taobao.org\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>查看镜像源地址</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> config get registry\n<span class="token comment"># yarn</span>\n<span class="token function">yarn</span> config get registry\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="查看已安装的依赖包" tabindex="-1"><a class="header-anchor" href="#查看已安装的依赖包" aria-hidden="true">#</a> 查看已安装的依赖包</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 当前项目</span>\n<span class="token function">npm</span> list --depth <span class="token number">0</span>\n\n<span class="token comment"># 全局</span>\n<span class="token function">npm</span> list -g --depth <span class="token number">0</span>\n<span class="token comment"># yarn</span>\n<span class="token function">yarn</span> global list --depth<span class="token operator">=</span><span class="token number">0</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="查看依赖包的安装路径" tabindex="-1"><a class="header-anchor" href="#查看依赖包的安装路径" aria-hidden="true">#</a> 查看依赖包的安装路径</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 当前项目</span>\n<span class="token function">npm</span> root\n\n<span class="token comment"># 全局</span>\n<span class="token function">npm</span> root -g\n<span class="token comment"># yarn</span>\n<span class="token function">yarn</span> global <span class="token function">dir</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="清除缓存" tabindex="-1"><a class="header-anchor" href="#清除缓存" aria-hidden="true">#</a> 清除缓存</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> cache clean -f\n<span class="token comment"># OR</span>\n<span class="token function">yarn</span> cache clean\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="导航到-npm-的相关页面" tabindex="-1"><a class="header-anchor" href="#导航到-npm-的相关页面" aria-hidden="true">#</a> 导航到 npm 的相关页面</h2><h3 id="打开文档" tabindex="-1"><a class="header-anchor" href="#打开文档" aria-hidden="true">#</a> 打开文档</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 在浏览器中打开当前项目的文档</span>\n<span class="token function">npm</span> docs\n\n<span class="token comment"># 在浏览器中打开指定 npm 包的文档</span>\n<span class="token function">npm</span> docs <span class="token punctuation">[</span>package-name<span class="token punctuation">]</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="打开-github-repo" tabindex="-1"><a class="header-anchor" href="#打开-github-repo" aria-hidden="true">#</a> 打开 GitHub repo</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 在浏览器中打开当前项目的 GitHub repo</span>\n<span class="token function">npm</span> repo\n\n<span class="token comment"># 在浏览器中打开指定 npm 包的 GitHub repo</span>\n<span class="token function">npm</span> repo <span class="token punctuation">[</span>package-name<span class="token punctuation">]</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="打开-github-issues" tabindex="-1"><a class="header-anchor" href="#打开-github-issues" aria-hidden="true">#</a> 打开 GitHub issues</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 在浏览器中打开当前项目的 GitHub issues</span>\n<span class="token function">npm</span> bugs\n\n<span class="token comment"># 在浏览器中打开指定 npm 包的 GitHub issues</span>\n<span class="token function">npm</span> bugs <span class="token punctuation">[</span>package-name<span class="token punctuation">]</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="脚本命令相关" tabindex="-1"><a class="header-anchor" href="#脚本命令相关" aria-hidden="true">#</a> 脚本命令相关</h2><p>执行顺序：并行执行 <code>&amp;</code>，继发执行 <code>&amp;&amp;</code></p><p>例 1：<code>npm run script1.js &amp; npm run script2.js</code></p><p>例 2：<code>npm run script1.js &amp;&amp; npm run script2.js</code></p><p>获取当前正在运行的脚本名称 <code>process.env.npm_lifecycle_event</code></p>',
          24
        ),
        p = {
          render: function (n, s) {
            return e
          }
        }
    }
  }
])
