;(self.webpackChunkmd_vuepress = self.webpackChunkmd_vuepress || []).push([
  [8481],
  {
    2618: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { data: () => e })
      const e = {
        key: 'v-74473916',
        path: '/git/',
        title: 'Git',
        lang: 'zh-CN',
        frontmatter: {},
        excerpt: '',
        headers: [
          {
            level: 2,
            title: '常用 Git 命令',
            slug: '常用-git-命令',
            children: []
          },
          {
            level: 2,
            title: 'commit 常用 type',
            slug: 'commit-常用-type',
            children: []
          },
          {
            level: 2,
            title: '删除 Git 中的所有提交历史记录',
            slug: '删除-git-中的所有提交历史记录',
            children: []
          },
          {
            level: 2,
            title: '同步 github fork 项目上游更新',
            slug: '同步-github-fork-项目上游更新',
            children: []
          },
          {
            level: 2,
            title: '将代码提交到 github 的 gh-pages 分支',
            slug: '将代码提交到-github-的-gh-pages-分支',
            children: []
          },
          {
            level: 2,
            title: '使用 GitHub Actions 自动部署',
            slug: '使用-github-actions-自动部署',
            children: [
              {
                level: 3,
                title: '配置 Secrets',
                slug: '配置-secrets',
                children: []
              },
              {
                level: 3,
                title: '编写 workflow 文件',
                slug: '编写-workflow-文件',
                children: []
              }
            ]
          }
        ],
        filePathRelative: 'git/README.md',
        git: { updatedTime: 1631980511e3 }
      }
    },
    8677: (n, s, a) => {
      'use strict'
      a.r(s), a.d(s, { default: () => z })
      var e = a(6252)
      const t = (0, e.Wm)(
          'h1',
          { id: 'git', tabindex: '-1' },
          [
            (0, e.Wm)(
              'a',
              { class: 'header-anchor', href: '#git', 'aria-hidden': 'true' },
              '#'
            ),
            (0, e.Uk)(' Git')
          ],
          -1
        ),
        l = {
          href: 'https://git-scm.com/',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        p = (0, e.Uk)('官网'),
        c = {
          href: 'https://learngitbranching.js.org/?locale=zh_CN',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        r = (0, e.Uk)('Git 学习教程'),
        i = {
          href: 'https://docs.github.com/cn/github/getting-started-with-github/getting-started-with-git',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        o = (0, e.Uk)('Git 入门指南'),
        u = {
          href: 'https://github.com/git/git',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        m = (0, e.Uk)('Github'),
        b = {
          href: 'https://github.com/git-for-windows/git',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        d = (0, e.Uk)('Windows 版 Github'),
        k = {
          href: 'https://npm.taobao.org/mirrors/git-for-windows/',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        g = (0, e.Uk)('Windows 版下载镜像站'),
        h = {
          href: 'https://github.com/maomao1996/daily-notes/issues/7',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        f = (0, e.Uk)('下载技巧 - 使用 jsdelivr 加速 Github 仓库资源'),
        v = (0, e.uE)(
          '<h2 id="常用-git-命令" tabindex="-1"><a class="header-anchor" href="#常用-git-命令" aria-hidden="true">#</a> 常用 Git 命令</h2><div class="custom-container tip"><p class="custom-container-title">提示</p><p>[xxx] 均为可选参数</p></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 拷贝一个 Git 仓库到本地</span>\n<span class="token function">git</span> clone 仓库地址\n<span class="token function">git</span> clone 仓库地址 --depth <span class="token number">1</span> <span class="token comment"># 只克隆最近一次的 commit</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 查看当前的 Git 配置</span>\n<span class="token function">git</span> config --list\n<span class="token comment"># 设置使用 Git 时的用户名称</span>\n<span class="token function">git</span> config <span class="token punctuation">[</span>--global<span class="token punctuation">]</span> user.name <span class="token string">&quot;名称&quot;</span>\n<span class="token comment"># 设置使用 Git 时的邮箱地址</span>\n<span class="token function">git</span> config <span class="token punctuation">[</span>--global<span class="token punctuation">]</span> user.email <span class="token string">&quot;邮箱&quot;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 添加所有文件到暂存区</span>\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 提交暂存区到仓库区</span>\n<span class="token function">git</span> commit -m <span class="token string">&quot;提交信息&quot;</span>\n<span class="token function">git</span> commit --amend <span class="token comment"># 增补提交，使用上次的 commit 信息，不添加新的 commit 记录</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 显示变更的文件</span>\n<span class="token function">git</span> status\n        -s <span class="token comment"># 精简输出</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 列出所有本地分支</span>\n<span class="token function">git</span> branch\n        分支名 <span class="token comment"># 新建一个分支(停留在当前分支)</span>\n        -r <span class="token comment"># 列出所有远程分支</span>\n        -a <span class="token comment"># 列出所有本地分支和远程分支</span>\n        -d 分支名 <span class="token comment"># 删除分支</span>\n        -r <span class="token comment"># 列出所有远程分支</span>\n<span class="token comment"># 新建一个空白分支</span>\n<span class="token function">git</span> checkout --orphan 分支名\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 合并指定分支到当前分支</span>\n<span class="token function">git</span> merge 分支名\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 显示所有远程仓库</span>\n<span class="token function">git</span> remote -v\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 取回远程仓库的变化，并与本地分支合并</span>\n<span class="token function">git</span> pull <span class="token punctuation">[</span>remote<span class="token punctuation">]</span><span class="token punctuation">[</span>branch<span class="token punctuation">]</span>\n<span class="token comment"># 上传本地指定分支到远程仓库</span>\n<span class="token function">git</span> push <span class="token punctuation">[</span>remote<span class="token punctuation">]</span><span class="token punctuation">[</span>branch<span class="token punctuation">]</span>\n<span class="token comment"># 强行推送当前分支到远程仓库，忽略冲突</span>\n<span class="token function">git</span> push <span class="token punctuation">[</span>remote<span class="token punctuation">]</span> --force\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 只暂存被追踪的文件</span>\n<span class="token function">git</span> stash\n        save <span class="token string">&#39;说明信息&#39;</span> <span class="token comment"># 添加说明信息</span>\n        -u <span class="token comment"># 暂存所有文件</span>\n<span class="token comment"># 查看 stash 列表</span>\n<span class="token function">git</span> stash list\n<span class="token comment"># 取出最近一次的 stash</span>\n<span class="token function">git</span> stash apply\n<span class="token comment"># 取出并删除最近一次的 stash</span>\n<span class="token function">git</span> stash pop\n<span class="token comment"># 清空所有 stash</span>\n<span class="token function">git</span> stash <span class="token function">clear</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 查看提交过的完整日志</span>\n<span class="token function">git</span> log\n        --oneline <span class="token comment"># 查看精简日志（精简版本号和提交信息）</span>\n        --pretty<span class="token operator">=</span>oneline <span class="token comment"># 查看精简日志（完整版本号和提交信息）</span>\n<span class="token comment"># 查看所有分支的所有操作记录（包括被删除的 commit 记录和 reset 操作）</span>\n<span class="token function">git</span> reflog\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 撤销 commit 操作</span>\n<span class="token function">git</span> reset --soft HEAD~1 <span class="token comment"># git reset --soft commit_id</span>\n<span class="token comment"># 撤销 commit 和 add 操作</span>\n<span class="token function">git</span> reset --mixed HEAD~1 <span class="token comment"># git reset --mixed commit_id</span>\n<span class="token comment"># 撤销 commit 和 add 操作同时撤销本地已追踪内容的修改</span>\n<span class="token function">git</span> reset --hard HEAD~1 <span class="token comment"># git reset --hard commit_id</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>',
          14
        ),
        y = {
          href: '/git/command.md',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        x = (0, e.Uk)('查看完整版 Git 命令'),
        W = {
          href: 'https://juejin.cn/post/6844904191203213326',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        w = (0, e.Uk)('三年 Git 使用心得 & 常见问题整理'),
        G = {
          href: 'https://github.com/521xueweihan/git-tips',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        _ = (0, e.Uk)('git 命令大全 github'),
        U = (0, e.uE)(
          '<h2 id="commit-常用-type" tabindex="-1"><a class="header-anchor" href="#commit-常用-type" aria-hidden="true">#</a> commit 常用 type</h2><table><thead><tr><th style="text-align:left;">type</th><th style="text-align:left;">含义</th></tr></thead><tbody><tr><td style="text-align:left;">feat</td><td style="text-align:left;">新功能</td></tr><tr><td style="text-align:left;">fix</td><td style="text-align:left;">修复 bug</td></tr><tr><td style="text-align:left;">docs</td><td style="text-align:left;">修改文档</td></tr><tr><td style="text-align:left;">style</td><td style="text-align:left;">代码格式修改</td></tr><tr><td style="text-align:left;">refactor</td><td style="text-align:left;">重构（即不是新增功能，也不是修复 bug）</td></tr><tr><td style="text-align:left;">perf</td><td style="text-align:left;">更改代码以提高性能</td></tr><tr><td style="text-align:left;">test</td><td style="text-align:left;">增加测试</td></tr><tr><td style="text-align:left;">build</td><td style="text-align:left;">构建过程或辅助工具的变动</td></tr><tr><td style="text-align:left;">ci</td><td style="text-align:left;">修改项目持续集成流程</td></tr><tr><td style="text-align:left;">chore</td><td style="text-align:left;">其他类型的提交</td></tr><tr><td style="text-align:left;">revert</td><td style="text-align:left;">恢复上一次提交</td></tr></tbody></table><h2 id="删除-git-中的所有提交历史记录" tabindex="-1"><a class="header-anchor" href="#删除-git-中的所有提交历史记录" aria-hidden="true">#</a> 删除 Git 中的所有提交历史记录</h2><div class="custom-container tip"><p class="custom-container-title">提示</p><p>以 <code>master</code> 分支为例</p></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 创建 orphan 分支</span>\n<span class="token function">git</span> checkout --orphan <span class="token punctuation">[</span>分支名<span class="token punctuation">]</span>\n\n<span class="token comment"># 添加需要上传文件</span>\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n\n<span class="token comment"># 提交更改</span>\n<span class="token function">git</span> commit -m <span class="token string">&quot;Initial&quot;</span>\n\n<span class="token comment"># 删除需要清空提交记录的分支</span>\n<span class="token function">git</span> branch -D master\n\n<span class="token comment"># 将当前分支重命名为需要清空提交记录的分支名</span>\n<span class="token function">git</span> branch -m master\n\n<span class="token comment"># 强制更新存储库</span>\n<span class="token function">git</span> push -f origin master\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h2 id="同步-github-fork-项目上游更新" tabindex="-1"><a class="header-anchor" href="#同步-github-fork-项目上游更新" aria-hidden="true">#</a> 同步 github fork 项目上游更新</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># 1. 添加上游仓库</span>\n<span class="token function">git</span> remote <span class="token function">add</span> upstream https://github.com/项目地址\n\n<span class="token comment"># 2. 拉取上游变动</span>\n<span class="token function">git</span> fetch upstream\n\n<span class="token comment"># 3. 合并(以 master 位置为例)</span>\n<span class="token function">git</span> rebase upstream/master\n<span class="token comment"># OR</span>\n<span class="token function">git</span> merge upstream/master\n\n<span class="token comment"># 4. 更新远程 fork 仓库分支(以 master 位置为例)</span>\n<span class="token function">git</span> push origin master\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h2 id="将代码提交到-github-的-gh-pages-分支" tabindex="-1"><a class="header-anchor" href="#将代码提交到-github-的-gh-pages-分支" aria-hidden="true">#</a> 将代码提交到 github 的 gh-pages 分支</h2><ol><li>安装 <code>gh-pages</code></li></ol><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">yarn</span> <span class="token function">add</span> -D gh-pages\n<span class="token comment"># OR npm install -D gh-pages</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><ol start="2"><li>在 <code>package.json</code> 中添加如下脚本</li></ol><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token property">&quot;deploy&quot;</span><span class="token operator">:</span> <span class="token string">&quot;gh-pages -d dist -m deploy&quot;</span><span class="token punctuation">,</span>\n<span class="token property">&quot;deploy:build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;npm run build &amp;&amp; npm run deploy&quot;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><ol start="3"><li>运行 <code>deploy</code> 脚本</li></ol><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">yarn</span> deploy\n<span class="token comment"># OR npm run deploy</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="使用-github-actions-自动部署" tabindex="-1"><a class="header-anchor" href="#使用-github-actions-自动部署" aria-hidden="true">#</a> 使用 GitHub Actions 自动部署</h2>',
          15
        ),
        A = {
          href: 'https://github.com/features/actions',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        q = (0, e.Uk)('GitHub Actions'),
        E = (0, e.Uk)(' 是 GitHub 的持续集成服务'),
        H = (0, e.Wm)(
          'h3',
          { id: '配置-secrets', tabindex: '-1' },
          [
            (0, e.Wm)(
              'a',
              {
                class: 'header-anchor',
                href: '#配置-secrets',
                'aria-hidden': 'true'
              },
              '#'
            ),
            (0, e.Uk)(' 配置 Secrets')
          ],
          -1
        ),
        C = (0, e.Wm)(
          'blockquote',
          null,
          [(0, e.Wm)('p', null, 'Action 需要有操作仓库的权限')],
          -1
        ),
        S = (0, e.Uk)('GitHub 官方的帮助文档：'),
        j = {
          href: 'https://help.github.com/cn/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        D = (0, e.Uk)('创建用于命令行的个人访问令牌'),
        O = (0, e.uE)(
          '<p>打开需要配置 Actions 的仓库，进入 <code>Settings/Secrets</code> 页面，配置 <code>ACCESS_TOKEN</code> 变量，储存内容为刚刚创建的个人访问令牌</p><h3 id="编写-workflow-文件" tabindex="-1"><a class="header-anchor" href="#编写-workflow-文件" aria-hidden="true">#</a> 编写 <code>workflow</code> 文件</h3><ol><li>点击仓库的 <code>Actions</code> 按钮</li><li>点击 <code>Set up a workflow yourself</code> 按钮</li><li>复制如下内容</li></ol><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">name</span><span class="token punctuation">:</span> GitHub Actions Build and Deploy\n\n<span class="token comment"># 触发条件: push 到 master 分支后</span>\n<span class="token key atrule">on</span><span class="token punctuation">:</span>\n  <span class="token key atrule">push</span><span class="token punctuation">:</span>\n    <span class="token key atrule">branches</span><span class="token punctuation">:</span>\n      <span class="token punctuation">-</span> master\n\n<span class="token comment"># 设置上海时区</span>\n<span class="token key atrule">env</span><span class="token punctuation">:</span>\n  <span class="token key atrule">TZ</span><span class="token punctuation">:</span> Asia/Shanghai\n\n<span class="token comment"># 任务</span>\n<span class="token key atrule">jobs</span><span class="token punctuation">:</span>\n  <span class="token key atrule">build-and-deploy</span><span class="token punctuation">:</span>\n    <span class="token comment"># 服务器环境：最新版 ubuntu</span>\n    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest\n    <span class="token key atrule">steps</span><span class="token punctuation">:</span>\n      <span class="token comment"># 拉取代码</span>\n      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Checkout\n        <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v2\n        <span class="token key atrule">with</span><span class="token punctuation">:</span>\n          <span class="token key atrule">persist-credentials</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>\n\n      <span class="token comment"># 打包静态文件</span>\n      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Build\n        <span class="token key atrule">run</span><span class="token punctuation">:</span> npm install <span class="token important">&amp;&amp;</span> npm run build\n\n      <span class="token comment"># 部署</span>\n      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Deploy\n        <span class="token key atrule">uses</span><span class="token punctuation">:</span> JamesIves/github<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>deploy<span class="token punctuation">-</span>action@releases/v3\n        <span class="token key atrule">with</span><span class="token punctuation">:</span>\n          <span class="token comment"># GitHub 密钥</span>\n          <span class="token key atrule">ACCESS_TOKEN</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.ACCESS_TOKEN <span class="token punctuation">}</span><span class="token punctuation">}</span>\n          <span class="token comment"># GitHub Pages 读取的分支</span>\n          <span class="token key atrule">BRANCH</span><span class="token punctuation">:</span> gh<span class="token punctuation">-</span>pages\n          <span class="token comment"># 静态文件所在目录</span>\n          <span class="token key atrule">FOLDER</span><span class="token punctuation">:</span> dist\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br></div></div>',
          4
        ),
        R = (0, e.Uk)('详细教程可以参考阮一峰老师的'),
        N = {
          href: 'http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        T = (0, e.Uk)('GitHub Actions 入门教程'),
        B = {
          href: 'https://docs.github.com/cn/actions/reference',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        K = (0, e.Uk)('GitHub Actions 中文文档'),
        z = {
          render: function (n, s) {
            const a = (0, e.up)('OutboundLink')
            return (
              (0, e.wg)(),
              (0, e.j4)(
                e.HY,
                null,
                [
                  t,
                  (0, e.Wm)('ul', null, [
                    (0, e.Wm)('li', null, [
                      (0, e.Wm)('a', l, [p, (0, e.Wm)(a)])
                    ]),
                    (0, e.Wm)('li', null, [
                      (0, e.Wm)('a', c, [r, (0, e.Wm)(a)])
                    ]),
                    (0, e.Wm)('li', null, [
                      (0, e.Wm)('a', i, [o, (0, e.Wm)(a)])
                    ]),
                    (0, e.Wm)('li', null, [
                      (0, e.Wm)('a', u, [m, (0, e.Wm)(a)])
                    ]),
                    (0, e.Wm)('li', null, [
                      (0, e.Wm)('a', b, [d, (0, e.Wm)(a)])
                    ]),
                    (0, e.Wm)('li', null, [
                      (0, e.Wm)('a', k, [g, (0, e.Wm)(a)])
                    ]),
                    (0, e.Wm)('li', null, [
                      (0, e.Wm)('a', h, [f, (0, e.Wm)(a)])
                    ])
                  ]),
                  v,
                  (0, e.Wm)('p', null, [(0, e.Wm)('a', y, [x, (0, e.Wm)(a)])]),
                  (0, e.Wm)('p', null, [(0, e.Wm)('a', W, [w, (0, e.Wm)(a)])]),
                  (0, e.Wm)('p', null, [(0, e.Wm)('a', G, [_, (0, e.Wm)(a)])]),
                  U,
                  (0, e.Wm)('p', null, [
                    (0, e.Wm)('a', A, [q, (0, e.Wm)(a)]),
                    E
                  ]),
                  H,
                  C,
                  (0, e.Wm)('p', null, [
                    S,
                    (0, e.Wm)('a', j, [D, (0, e.Wm)(a)])
                  ]),
                  O,
                  (0, e.Wm)('p', null, [
                    R,
                    (0, e.Wm)('a', N, [T, (0, e.Wm)(a)])
                  ]),
                  (0, e.Wm)('p', null, [(0, e.Wm)('a', B, [K, (0, e.Wm)(a)])])
                ],
                64
              )
            )
          }
        }
    }
  }
])
