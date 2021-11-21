<template><h1 id="mac-平台" tabindex="-1"><a class="header-anchor" href="#mac-平台" aria-hidden="true">#</a> Mac 平台</h1>
<h2 id="homebrew" tabindex="-1"><a class="header-anchor" href="#homebrew" aria-hidden="true">#</a> Homebrew</h2>
<p>Mac 上安装命令行程序最好的工具</p>
<p>安装</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>/bin/bash -c <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh<span class="token variable">)</span></span>"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>切换镜像</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 切换 brew.git</span>
<span class="token builtin class-name">cd</span> <span class="token string">"<span class="token variable"><span class="token variable">$(</span>brew --repo<span class="token variable">)</span></span>"</span>
<span class="token function">git</span> remote set-url origin https://mirrors.aliyun.com/homebrew/brew.git

<span class="token comment"># 切换 homebrew-core.git</span>
<span class="token builtin class-name">cd</span> <span class="token string">"<span class="token variable"><span class="token variable">$(</span>brew --repo<span class="token variable">)</span></span>/Library/Taps/homebrew/homebrew-core"</span>
<span class="token function">git</span> remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-core.git

<span class="token comment"># 刷新</span>
brew update

<span class="token comment"># 切换 homebrew-bottles</span>
<span class="token comment"># 查看当前 shell</span>
<span class="token builtin class-name">echo</span> <span class="token environment constant">$SHELL</span>

<span class="token comment"># Bash 版本</span>
<span class="token builtin class-name">echo</span> <span class="token string">'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles'</span> <span class="token operator">>></span> ~/.bash_profile
<span class="token builtin class-name">source</span> ~/.bash_profile

<span class="token comment"># Zsh 版本</span>
<span class="token builtin class-name">echo</span> <span class="token string">'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles'</span> <span class="token operator">>></span> ~/.zshrc
<span class="token builtin class-name">source</span> ~/.zshrc
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>切换镜像详细可查看<a href="https://developer.aliyun.com/mirror/homebrew?spm=a2c6h.13651102.0.0.e40a1b11ZkPX9D" target="_blank" rel="noopener noreferrer">阿里云 Homebrew 镜像<OutboundLink/></a></p>
<p><a href="https://github.com/Homebrew" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a>
<a href="https://brew.sh/index_zh-cn" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a></p>
<h2 id="iterm2" tabindex="-1"><a class="header-anchor" href="#iterm2" aria-hidden="true">#</a> iTerm2</h2>
<p>Mac 上最好用的终端</p>
<ol>
<li>支持子窗口</li>
<li>自动补全</li>
<li>查看粘贴历史</li>
<li>自定义配置项</li>
</ol>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 查看所有的 shell</span>
<span class="token function">cat</span> /etc/shells

<span class="token comment"># 查看当前窗口使用的 shell</span>
<span class="token builtin class-name">echo</span> <span class="token environment constant">$SHELL</span>

<span class="token comment"># 查看系统用户默认的 shell</span>
<span class="token function">cat</span> /etc/passwd <span class="token operator">|</span> <span class="token function">grep</span> <span class="token function">sh</span>

<span class="token comment"># 切换系统默认 shell</span>
chsh -s /bin/zsh
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p><a href="https://github.com/gnachman/iTerm2" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a>
<a href="https://www.iterm2.com" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a></p>
<h2 id="效率神器-alfred" tabindex="-1"><a class="header-anchor" href="#效率神器-alfred" aria-hidden="true">#</a> 效率神器 Alfred</h2>
<ol>
<li>定位文件、打开文件</li>
<li>打开网址、书签、App</li>
<li>自定义搜索</li>
<li>查看剪贴板历史</li>
<li>计算器、查词典、运行 <code>shell</code> 命令</li>
</ol>
<p><a href="https://www.alfredapp.com" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a></p>
<h2 id="mac-微信的功能拓展" tabindex="-1"><a class="header-anchor" href="#mac-微信的功能拓展" aria-hidden="true">#</a> Mac 微信的功能拓展</h2>
<ol>
<li>消息防撤回</li>
<li>免认证登录与多开</li>
<li>退群监控</li>
<li>屏蔽更新</li>
</ol>
<p>安装</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 安装小助手</span>
<span class="token function">curl</span> -o- -L https://raw.githubusercontent.com/lmk123/oh-my-wechat/master/install.sh <span class="token operator">|</span> <span class="token function">bash</span> -s
<span class="token comment"># OR 国内用户推荐</span>
<span class="token function">curl</span> -o- -L https://omw.limingkai.cn/install.sh <span class="token operator">|</span> <span class="token function">bash</span> -s

<span class="token comment"># 更新小助手</span>
omw

<span class="token comment"># 微信在自动更新后会删除小助手，可运行以下命令恢复</span>
omw -n
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p><a href="https://github.com/MustangYM/WeChatExtension-ForMac" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
<h2 id="iina" tabindex="-1"><a class="header-anchor" href="#iina" aria-hidden="true">#</a> IINA</h2>
<p>视频播放器</p>
<ol>
<li>界面简洁、美观，契合 macOS 设计风格</li>
<li>功能强大，设置以播放体验为中心</li>
<li>支持鼠标和触控板手势</li>
<li>在线字幕、缩略图预览、画中画等</li>
</ol>
<p><a href="https://github.com/iina/iina" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a>
<a href="https://iina.io/" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a></p>
<h2 id="ezip" tabindex="-1"><a class="header-anchor" href="#ezip" aria-hidden="true">#</a> eZip</h2>
<p>专为 macOS 而设计的压缩软件</p>
<ol>
<li>界面简洁、美观，完美兼容 Mojave</li>
<li>支持超过 20 种压缩格式</li>
<li>批量文件加密</li>
</ol>
<p><a href="https://ezip.awehunt.com" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a></p>
<h2 id="腾讯柠檬清理" tabindex="-1"><a class="header-anchor" href="#腾讯柠檬清理" aria-hidden="true">#</a> 腾讯柠檬清理</h2>
<ol>
<li>界面简洁清新</li>
<li>支持垃圾清理、文件查重、软件卸载</li>
<li>支持微信、QQ、XCode、Sketch 深度扫描清理</li>
</ol>
<p><a href="https://lemon.qq.com" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a></p>
<h2 id="截图神器-ishot" tabindex="-1"><a class="header-anchor" href="#截图神器-ishot" aria-hidden="true">#</a> 截图神器 IShot</h2>
<ol>
<li>区域截图、窗口截图、多窗口截图、延时截图、长截图、滚动截图</li>
<li>快速标注(矩形、圆形、横线、箭头、画笔、马赛克、文字标记、序号标签、局部高亮)</li>
<li>支持截图导圆角、阴影调节</li>
<li>贴图、取色</li>
</ol>
<p><a href="https://www.better365.cn/ishot.html" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a>
<a href="https://apps.apple.com/cn/app/ishot-%E6%88%AA%E5%9B%BE-%E5%BD%95%E5%B1%8F-2020%E5%85%A8%E6%96%B0%E9%AB%98%E5%BA%A6/id1485844094" target="_blank" rel="noopener noreferrer">App Store<OutboundLink/></a></p>
<h2 id="超级右键-irightmouse" tabindex="-1"><a class="header-anchor" href="#超级右键-irightmouse" aria-hidden="true">#</a> 超级右键 iRightMouse</h2>
<ol>
<li>多种格式的右键新建文件</li>
<li>快速移动文件</li>
<li>常用目录设置</li>
<li>快速打开终端、vscode 等</li>
</ol>
<p><a href="https://www.better365.cn/irightmouse.html" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a>
<a href="https://apps.apple.com/cn/app/irightmouse-%E8%B6%85%E7%BA%A7%E5%8F%B3%E9%94%AE/id1497428978" target="_blank" rel="noopener noreferrer">App Store<OutboundLink/></a></p>
<h2 id="翻译软件-bob" tabindex="-1"><a class="header-anchor" href="#翻译软件-bob" aria-hidden="true">#</a> 翻译软件 Bob</h2>
<ol>
<li>支持划词、截图、输入翻译</li>
<li>支持翻译多开</li>
<li>自动识别语种</li>
<li>可自定义插件</li>
</ol>
<p><a href="https://github.com/ripperhe/Bob" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a>
<a href="https://ripperhe.gitee.io/bob" target="_blank" rel="noopener noreferrer">软件官网<OutboundLink/></a></p>
</template>
