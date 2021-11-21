<template><h1 id="zsh" tabindex="-1"><a class="header-anchor" href="#zsh" aria-hidden="true">#</a> zsh</h1>
<h2 id="oh-my-zsh" tabindex="-1"><a class="header-anchor" href="#oh-my-zsh" aria-hidden="true">#</a> oh-my-zsh</h2>
<p>用于自定义 zsh 的配置</p>
<ol>
<li>主题配置</li>
<li>插件安装</li>
</ol>
<p>安装</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">sh</span> -c <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh<span class="token variable">)</span></span>"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><a href="https://github.com/ohmyzsh/ohmyzsh" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a>
<a href="zsh">zsh 插件</a></p>
<h2 id="zsh-插件" tabindex="-1"><a class="header-anchor" href="#zsh-插件" aria-hidden="true">#</a> zsh 插件</h2>
<h3 id="autojump" tabindex="-1"><a class="header-anchor" href="#autojump" aria-hidden="true">#</a> autojump</h3>
<p>用于常用目录间的快速跳转(通过维护命令行中最常用的目录的数据库来工作)</p>
<p>安装</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 推荐</span>
brew <span class="token function">install</span> autojump

<span class="token comment"># OR</span>
<span class="token function">git</span> clone --depth<span class="token operator">=</span><span class="token number">1</span> git://github.com/joelthelion/autojump.git

<span class="token builtin class-name">cd</span> autojump

./install.py or ./uninstall.py
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p><a href="https://github.com/wting/autojump" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
<h3 id="z" tabindex="-1"><a class="header-anchor" href="#z" aria-hidden="true">#</a> z</h3>
<p>和 <code>autojump</code> 功能一致，是 <code>oh-my-zsh</code> 内置插件</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 在 ~/.zshrc 中配置</span>
<span class="token assign-left variable">plugins</span><span class="token operator">=</span><span class="token punctuation">(</span>其他插件 z<span class="token punctuation">)</span>

<span class="token comment"># 使配置生效</span>
<span class="token builtin class-name">source</span> ~/.zshrc
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><a href="https://github.com/rupa/z" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
<h3 id="fast-syntax-highlighting" tabindex="-1"><a class="header-anchor" href="#fast-syntax-highlighting" aria-hidden="true">#</a> fast-syntax-highlighting</h3>
<p>终端语法高亮显示</p>
<p>安装</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># clone</span>
<span class="token function">git</span> clone --depth<span class="token operator">=</span><span class="token number">1</span> https://github.com/zdharma/fast-syntax-highlighting.git <span class="token variable">${ZSH_CUSTOM<span class="token operator">:-</span>$HOME<span class="token operator">/</span>.oh-my-zsh<span class="token operator">/</span>custom}</span>/plugins/fast-syntax-highlighting

<span class="token comment"># 在 ~/.zshrc 中配置(在 plugins 的最后面加上 fast-syntax-highlighting)</span>
<span class="token assign-left variable">plugins</span><span class="token operator">=</span><span class="token punctuation">(</span>其他插件 fast-syntax-highlighting<span class="token punctuation">)</span>

<span class="token comment"># 使配置生效</span>
<span class="token builtin class-name">source</span> ~/.zshrc
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><a href="https://github.com/zdharma/fast-syntax-highlighting" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
<h3 id="zsh-autosuggestions" tabindex="-1"><a class="header-anchor" href="#zsh-autosuggestions" aria-hidden="true">#</a> zsh-autosuggestions</h3>
<p>根据您的历史记录和完成情况建议您键入的命令</p>
<p>安装</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># clone</span>
<span class="token function">git</span> clone --depth<span class="token operator">=</span><span class="token number">1</span> git://github.com/zsh-users/zsh-autosuggestions <span class="token variable">$ZSH_CUSTOM</span>/plugins/zsh-autosuggestions

<span class="token comment"># 在 ~/.zshrc 中配置</span>
<span class="token assign-left variable">plugins</span><span class="token operator">=</span><span class="token punctuation">(</span>其他插件 zsh-syntax-highlighting<span class="token punctuation">)</span>

<span class="token comment"># 使配置生效</span>
<span class="token builtin class-name">source</span> ~/.zshrc
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><a href="https://github.com/zsh-users/zsh-autosuggestions" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
<h2 id="zsh-主题" tabindex="-1"><a class="header-anchor" href="#zsh-主题" aria-hidden="true">#</a> zsh 主题</h2>
<h3 id="powerlevel10k" tabindex="-1"><a class="header-anchor" href="#powerlevel10k" aria-hidden="true">#</a> powerlevel10k</h3>
<p>安装</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> clone --depth<span class="token operator">=</span><span class="token number">1</span> https://github.com/romkatv/powerlevel10k.git <span class="token variable">${ZSH_CUSTOM<span class="token operator">:-</span>$HOME<span class="token operator">/</span>.oh-my-zsh<span class="token operator">/</span>custom}</span>/themes/powerlevel10k

<span class="token comment"># 在 ~/.zshrc 中配置</span>
<span class="token assign-left variable">ZSH_THEME</span><span class="token operator">=</span><span class="token string">"powerlevel10k/powerlevel10k"</span>

<span class="token comment"># 使配置生效</span>
<span class="token builtin class-name">source</span> ~/.zshrc
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>配置</p>
<blockquote>
<p>使用 <code>iTerm2</code> 可自动安装所需字体</p>
</blockquote>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>p10k configure
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>修复 <code>vscode</code> 终端图标乱码，修改 <code>terminal.integrated.fontFamily</code> 为 <code>&quot;MesloLGS NF&quot;</code></p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token property">"terminal.integrated.fontFamily"</span><span class="token operator">:</span> <span class="token string">"MesloLGS NF"</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>更新</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> -C <span class="token variable">${ZSH_CUSTOM<span class="token operator">:-</span>$HOME<span class="token operator">/</span>.oh-my-zsh<span class="token operator">/</span>custom}</span>/themes/powerlevel10k pull
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><a href="https://github.com/romkatv/powerlevel10k" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
</template>
