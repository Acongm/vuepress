;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [6006],
  {
    5661: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { data: () => e })
      const e = {
        key: 'v-77d59f2c',
        path: '/git/commit.html',
        title: 'Git commit 规范',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          {
            level: 2,
            title: 'Commit message 的格式',
            slug: 'commit-message-的格式',
            children: []
          },
          { level: 2, title: 'Header', slug: 'header', children: [] },
          { level: 2, title: 'type', slug: 'type', children: [] },
          { level: 2, title: 'scope', slug: 'scope', children: [] },
          { level: 2, title: 'subject', slug: 'subject', children: [] },
          { level: 2, title: 'Body', slug: 'body', children: [] },
          {
            level: 2,
            title: 'Footer',
            slug: 'footer',
            children: [
              {
                level: 3,
                title: '不兼容变动',
                slug: '不兼容变动',
                children: []
              },
              {
                level: 3,
                title: '关闭 Issue',
                slug: '关闭-issue',
                children: []
              },
              { level: 3, title: 'Revert', slug: 'revert', children: [] }
            ]
          },
          {
            level: 2,
            title: 'Commitizen - commit 格式化工具',
            slug: 'commitizen-commit-格式化工具',
            children: [
              { level: 3, title: '安装', slug: '安装', children: [] },
              {
                level: 3,
                title: 'cz-conventional-changelog用来规范提交信息。',
                slug: 'cz-conventional-changelog用来规范提交信息。',
                children: []
              },
              {
                level: 3,
                title: 'package.json 配置',
                slug: 'package-json-配置',
                children: []
              },
              { level: 3, title: '说明', slug: '说明', children: [] }
            ]
          }
        ],
        filePathRelative: 'git/commit.md',
        git: { updatedTime: 1631986505e3 }
      }
    },
    3373: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { default: () => l })
      const e = (0, a(6252).uE)(
          '<h1 id="git-commit-规范" tabindex="-1"><a class="header-anchor" href="#git-commit-规范" aria-hidden="true">#</a> Git commit 规范</h1><h2 id="commit-message-的格式" tabindex="-1"><a class="header-anchor" href="#commit-message-的格式" aria-hidden="true">#</a> Commit message 的格式</h2><blockquote><p>header 是必需的，body 和 footer 可以省略。 不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。这是为了避免自动换行影响美观。</p></blockquote><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>type</span><span class="token punctuation">&gt;</span></span>(<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scope</span><span class="token punctuation">&gt;</span></span>): <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>subject</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>BLANK</span> <span class="token attr-name">LINE</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>BLANK</span> <span class="token attr-name">LINE</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>footer</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="header" tabindex="-1"><a class="header-anchor" href="#header" aria-hidden="true">#</a> Header</h2><p>Header部分只有一行，包括三个字段：type（必需）、scope（可选）和subject（必需）。</p><h2 id="type" tabindex="-1"><a class="header-anchor" href="#type" aria-hidden="true">#</a> type</h2><p>用于说明 commit 的类别，只允许使用下面7个标识。</p><ul><li><p>feat：新功能（feature）</p></li><li><p>fix：修补bug</p></li><li><p>docs：文档（documentation）</p></li><li><p>style： 格式（不影响代码运行的变动）</p></li><li><p>refactor：重构（即不是新增功能，也不是修改bug的代码变动）</p></li><li><p>test：增加测试</p></li><li><p>chore：构建过程或辅助工具的变动</p></li><li><p>feat:</p><ul><li><code>一个新特性</code></li><li>A new feature</li></ul></li><li><p>fix:</p><ul><li><code>一个bug修复</code></li><li>A bug fix</li></ul></li><li><p>docs:</p><ul><li><code>只修改文档</code></li><li>Documentation only changes</li></ul></li><li><p>style:</p><ul><li><code>不影响代码含义的更改(空白、格式、缺少分号等)</code></li><li>Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)</li></ul></li><li><p>refactor:</p><ul><li><code>既不修复bug也不添加特性的代码更改</code></li><li>A code change that neither fixes a bug nor adds a feature</li></ul></li><li><p>perf:</p><ul><li><code>提高性能的代码修改</code></li><li>A code change that improves performance</li></ul></li><li><p>test:</p><ul><li><code>添加缺失的测试或纠正现有测试</code></li><li>Adding missing tests or correcting existing tests</li></ul></li><li><p>build:</p><ul><li><code>影响构建系统或外部依赖的更改(例如作用域:gulp, broccoli, npm)</code></li><li>Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)</li></ul></li><li><p>ci:</p><ul><li><code>更改ci配置文件和脚本(示例范围:Travis, Circle, BrowserStack, SauceLabs)</code></li><li>Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)</li></ul></li><li><p>chore:</p><ul><li><code>其他不修改src或测试文件的更改</code></li><li>Other changes that don&#39;t modify src or test files</li></ul></li><li><p>revert:</p><ul><li><code>恢复前一个提交</code></li><li>Reverts a previous commit</li></ul></li></ul><p>如果type为feat和fix，则该 commit 将肯定出现在 Change log 之中。其他情况（docs、chore、style、refactor、test）由你决定，要不要放入 Change log，建议是不要。</p><h2 id="scope" tabindex="-1"><a class="header-anchor" href="#scope" aria-hidden="true">#</a> scope</h2><blockquote><p>scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。 如果你的修改影响了不止一个scope，你可以使用*代替。</p></blockquote><h2 id="subject" tabindex="-1"><a class="header-anchor" href="#subject" aria-hidden="true">#</a> subject</h2><blockquote><p>subject是 commit 目的的简短描述，不超过50个字符。</p></blockquote><ul><li>注意 <ul><li>以动词开头，使用第一人称现在时，比如change，而不是changed或changes</li><li>第一个字母小写</li><li>结尾不加句号（.）</li></ul></li></ul><h2 id="body" tabindex="-1"><a class="header-anchor" href="#body" aria-hidden="true">#</a> Body</h2><blockquote><p>Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。</p></blockquote><div class="language-code ext-code line-numbers-mode"><pre class="language-code"><code>More detailed explanatory text, if necessary.  Wrap it to \nabout 72 characters or so. \n\nFurther paragraphs come after blank lines.\n\n- Bullet points are okay, too\n- Use a hanging indent\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><ul><li>注意 <ul><li>使用第一人称现在时，比如使用change而不是changed或changes。</li><li>永远别忘了第2行是空行</li><li>应该说明代码变动的动机，以及与以前行为的对比。</li></ul></li></ul><h2 id="footer" tabindex="-1"><a class="header-anchor" href="#footer" aria-hidden="true">#</a> Footer</h2><blockquote><p>Footer 部分只用于以下两种情况：</p></blockquote><h3 id="不兼容变动" tabindex="-1"><a class="header-anchor" href="#不兼容变动" aria-hidden="true">#</a> 不兼容变动</h3><blockquote><p>如果当前代码与上一个版本不兼容，则 Footer 部分以BREAKING CHANGE开头，后面是对变动的描述、以及变动理由和迁移方法。</p></blockquote><div class="language-code ext-code line-numbers-mode"><pre class="language-code"><code>BREAKING CHANGE: isolate scope bindings definition has changed.\n\n    To migrate the code follow the example below:\n\n    Before:\n\n    scope: {\n      myAttr: &#39;attribute&#39;,\n    }\n\n    After:\n\n    scope: {\n      myAttr: &#39;@&#39;,\n    }\n\n    The removed `inject` wasn&#39;t generaly useful for directives so there should be no code using it.\n关闭 Issue\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h3 id="关闭-issue" tabindex="-1"><a class="header-anchor" href="#关闭-issue" aria-hidden="true">#</a> 关闭 Issue</h3><blockquote><p>如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue 。</p></blockquote><p>???????</p><h3 id="revert" tabindex="-1"><a class="header-anchor" href="#revert" aria-hidden="true">#</a> Revert</h3><blockquote><p>还有一种特殊情况，如果当前 commit 用于撤销以前的 commit，则必须以revert:开头，后面跟着被撤销 Commit 的 Header。</p></blockquote><div class="language-code ext-code line-numbers-mode"><pre class="language-code"><code>revert: feat(pencil): add &#39;graphiteWidth&#39; option\n\nThis reverts commit 667ecc1654a317a13331b17617d973392f415f02.\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="commitizen-commit-格式化工具" tabindex="-1"><a class="header-anchor" href="#commitizen-commit-格式化工具" aria-hidden="true">#</a> Commitizen - commit 格式化工具</h2><p>可以使用典型的git工作流程或通过使用CLI向导Commitizen来添加提交消息格式。</p><h3 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> -g commitizen\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>然后，在项目目录里，运行下面的命令，使其支持 Angular 的 Commit message 格式。</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>commitizen init cz-conventional-changelog --save --save-exact\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>以后，凡是用到git commit命令，一律改为使用git cz。这时，就会出现选项，用来生成符合格式的 Commit message。 <img src="https://upload-images.jianshu.io/upload_images/3827973-39053e8f0259dfda.png?imageMogr2/auto-orient/strip|imageView2/2/w/557/format/webp" alt="Image text"></p><h3 id="cz-conventional-changelog用来规范提交信息。" tabindex="-1"><a class="header-anchor" href="#cz-conventional-changelog用来规范提交信息。" aria-hidden="true">#</a> cz-conventional-changelog用来规范提交信息。</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> cz-conventional-changelog -D\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="package-json-配置" tabindex="-1"><a class="header-anchor" href="#package-json-配置" aria-hidden="true">#</a> package.json 配置</h3><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>\n<span class="token property">&quot;script&quot;</span><span class="token operator">:</span><span class="token punctuation">{</span>\n  <span class="token property">&quot;commit&quot;</span><span class="token operator">:</span> <span class="token string">&quot;git-cz&quot;</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token property">&quot;config&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">&quot;commitizen&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;./node_modules/cz-conventional-changelog&quot;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="说明" tabindex="-1"><a class="header-anchor" href="#说明" aria-hidden="true">#</a> 说明</h3><p>当运行 npm run commit时，出现交互选项：</p><ul><li>（1） 选择type <ul><li>Select the type of change that you&#39;re committing:</li></ul></li><li>（2）这一变化的范围是什么? <ul><li>What is the scope of this change (e.g. component or file name): (press enter to skip) 本修改影响的是内容（范围）？可以填文件名</li></ul></li><li>（3）写一个简短的介绍 <ul><li>Write a short, imperative tense description of the change (max 85 chars):</li></ul></li><li>（4）提供一个长的介绍 <ul><li>Provide a longer description of the change: (press enter to skip)</li></ul></li><li>（5）有什么突破性的变化吗? <ul><li>Are there any breaking changes? (y/N)</li></ul></li><li>（6）本修改是否实现了某个issues？ <ul><li>Does this change affect any open issues?</li></ul></li></ul><blockquote><p>对应结构</p></blockquote><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>type(1)</span><span class="token punctuation">&gt;</span></span>(<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scope(2)</span><span class="token punctuation">&gt;</span></span>): <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>subject(3)</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>BLANK</span> <span class="token attr-name">LINE</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body(4)</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>BLANK</span> <span class="token attr-name">LINE</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>footer(5)(6)</span><span class="token punctuation">&gt;</span></span>\n\n\n## validate-commit-msg\nvalidate-commit-msg 用于检查项目的 Commit message 是否符合Angular规范。\n\n该包提供了使用githooks来校验commit message的一些二进制文件。在这里，我推荐使用husky，只需要添加&quot;commitmsg&quot;: &quot;validate-commit-msg&quot;到你的package.json中的nam scripts即可.\n\n当然，你还可以通过定义配置文件.vcmrc来自定义校验格式。详细使用请见文档 validate-commit-msg\n\n## 生成 Change log\n&gt; 如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时， Change log 就可以用脚本自动生成。生成的文档包括以下三个部分：\n- New features\n- Bug fixes\n- Breaking changes.\n每个部分都会罗列相关的 commit ，并且有指向这些 commit 的链接。当然，生成的文档允许手动修改，所以发布前，你还可以添加其他内容。\n```sh\nnpm install -g conventional-changelog\ncd my-project\nconventional-changelog -p angular -i CHANGELOG.md -w\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div>',
          46
        ),
        l = {
          render: function (n, s) {
            return e
          }
        }
    }
  }
])
