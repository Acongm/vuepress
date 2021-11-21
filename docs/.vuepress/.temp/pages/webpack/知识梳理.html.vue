<template><h1 id="webpack" tabindex="-1"><a class="header-anchor" href="#webpack" aria-hidden="true">#</a> webpack</h1>
<h2 id="知识梳理" tabindex="-1"><a class="header-anchor" href="#知识梳理" aria-hidden="true">#</a> 知识梳理</h2>
<ul>
<li>1、基本配置</li>
<li>2、高级配置</li>
<li>3、优化打包效率</li>
<li>4、优化产出代码</li>
<li>5、构建流程概述</li>
<li>6、babel</li>
</ul>
<h2 id="webpack-面试题" tabindex="-1"><a class="header-anchor" href="#webpack-面试题" aria-hidden="true">#</a> webpack 面试题</h2>
<ul>
<li>1、前端代码为何要进行构建和打包？</li>
<li>2、module chunk bundle 分别什么意思，有何区别？</li>
<li>3、loader 和 plugin 的区别？</li>
<li>4、webpack 如何实现懒加载？</li>
<li>5、webpack 常见性能优化</li>
<li>6、babel-runtime 和 babel-polyfill 的区别</li>
</ul>
<h2 id="关于-webpack-5" tabindex="-1"><a class="header-anchor" href="#关于-webpack-5" aria-hidden="true">#</a> 关于 webpack 5</h2>
<ul>
<li>1、webpack5 主要是内部效率的优化</li>
<li>2、对比 webpack4， 没有太多使用上的改动</li>
</ul>
<h2 id="webpack-性能优化" tabindex="-1"><a class="header-anchor" href="#webpack-性能优化" aria-hidden="true">#</a> webpack 性能优化</h2>
<ul>
<li>1、优化打包构建速度---开发体验和效率</li>
<li>2、优化产出代码---产品性能</li>
</ul>
<p>·构建速度</p>
<ul>
<li>1、优化 babel-loader
----- cacheDirectory（开启缓存，编译缓存）
----- include、exclude， 筛选打包文件
2、IgnorePlugin
----- 例如 'moment',
new webpack.IgnorePlugin(/./locale/, /moment/)
直接不引入， 代码中没有
3、noParse
----- 避免重复打包
独完整的<code>react.min.js</code> 文件就没有采用模块化
忽略对<code>react.min.js</code>文件的递归解析处理
noParse: [/react.min.js$/]
引入，但不打包
4、happyPack
----- 多进程打包
js 单线程， 开启多线程打包
提高构建速度（特别是多核 CPU）
5、ParallelUglifyPlugin
----- 多进程压缩 JS
webpack 内置 Uglify 工具压缩 JS
JS 单线程， 开启多进程压缩更快
和 happyPack 同理
6、自动刷新
watch: true
watchOptions 监听配置
7、热更新
新代码生效，网页不刷新，状态不丢失
8、DellPlugin
----- 动态链接库插件
webpack 已内置 DllPlugin 支持
DllPlugin - 打包出 dll 文件
DllReferencePlugin - 使用 dll 文件</li>
</ul>
<h2 id="关于开启多进程" tabindex="-1"><a class="header-anchor" href="#关于开启多进程" aria-hidden="true">#</a> 关于开启多进程</h2>
<pre><code>1、项目较大，打包较慢，开启多进程能提高速度
2、项目较小，打包很快，开启多进程会降低速度（进程开销）
</code></pre>
<h2 id="webpack-优化构建速度-可用于生产环境" tabindex="-1"><a class="header-anchor" href="#webpack-优化构建速度-可用于生产环境" aria-hidden="true">#</a> webpack 优化构建速度（可用于生产环境）</h2>
<pre><code>1、优化babel-loader
2、IgnorePlugin
3、noParse
4、happyPack
5、ParallelUglifyPlugin
</code></pre>
<h2 id="webpack-优化构建速度-不用于生产环境" tabindex="-1"><a class="header-anchor" href="#webpack-优化构建速度-不用于生产环境" aria-hidden="true">#</a> webpack 优化构建速度（不用于生产环境）</h2>
<pre><code>1、自动刷新
2、热更新
3、DllPlugin
</code></pre>
<h2 id="webpack-性能优化-产出代码" tabindex="-1"><a class="header-anchor" href="#webpack-性能优化-产出代码" aria-hidden="true">#</a> webpack 性能优化 - 产出代码</h2>
<pre><code>1、体积更小
2、合理分包，不重复加载
3、速度更快、内存使用更少
</code></pre>
<p>·</p>
<pre><code>1、小图片 base64 编码
2、bundle 加 hash
3、懒加载
4、提取公共代码
5、IngorePlugin
6、使用CDN加速
7、使用production
    自定开启代码压缩
    Vue、React 等会自动删掉调试代码（如开发环境的warning）
    启动Tree-Shaking
8、Scope Hosting
</code></pre>
</template>
