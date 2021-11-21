<template><h1 id="常用工具包" tabindex="-1"><a class="header-anchor" href="#常用工具包" aria-hidden="true">#</a> 常用工具包</h1>
<blockquote>
<p>只介绍安装方法和常用命令，具体可点击 github 查看详情</p>
</blockquote>
<h2 id="nvm" tabindex="-1"><a class="header-anchor" href="#nvm" aria-hidden="true">#</a> nvm</h2>
<p>node 版本管理工具</p>
<p>安装前，需要将已安装的 <code>nodejs</code> 进行卸载</p>
<h4 id="安装和设置-windows" tabindex="-1"><a class="header-anchor" href="#安装和设置-windows" aria-hidden="true">#</a> 安装和设置 - Windows</h4>
<p><a href="https://github.com/coreybutler/nvm-windows/releases" target="_blank" rel="noopener noreferrer">Windows 下载地址<OutboundLink/></a></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 设置 node 镜像</span>
nvm node_mirror https://npm.taobao.org/mirrors/node/

<span class="token comment"># 设置 npm 镜像</span>
nvm npm_mirror https://npm.taobao.org/mirrors/npm/
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h4 id="安装和设置-mac" tabindex="-1"><a class="header-anchor" href="#安装和设置-mac" aria-hidden="true">#</a> 安装和设置 - Mac</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh <span class="token operator">|</span> <span class="token function">bash</span>
<span class="token comment"># OR</span>
<span class="token function">curl</span> -o- https://gitee.com/mirrors/nvm/raw/v0.37.2/install.sh <span class="token operator">|</span> <span class="token function">bash</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令" aria-hidden="true">#</a> 常用命令</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 查看 nvm 版本</span>
nvm version

<span class="token comment"># 安装最新版的 node</span>
nvm <span class="token function">install</span> latest

<span class="token comment"># 安装指定版本的 node</span>
nvm <span class="token function">install</span> 版本号

<span class="token comment"># 卸载指定版本的 node</span>
nvm uninstall 版本号

<span class="token comment"># 查看已安装的 node 版本</span>
nvm list

<span class="token comment"># 切换到指定的 node 版本</span>
nvm use 版本号
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p><a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener noreferrer">Github - Mac<OutboundLink/></a></p>
<p><a href="https://github.com/coreybutler/nvm-windows" target="_blank" rel="noopener noreferrer">Github - Windows<OutboundLink/></a></p>
<p><a href="https://npm.taobao.org/mirrors/node/" target="_blank" rel="noopener noreferrer">node 版本目录<OutboundLink/></a></p>
<h2 id="nrm" tabindex="-1"><a class="header-anchor" href="#nrm" aria-hidden="true">#</a> nrm</h2>
<p>npm registry 管理工具，能够查看和切换当前使用的 registry</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 安装</span>
<span class="token function">npm</span> <span class="token function">install</span> -g nrm

<span class="token comment"># 查看所有 registry</span>
nrm <span class="token function">ls</span>

<span class="token comment"># 切换 registry</span>
nrm use cnp
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><a href="https://github.com/Pana/nrm" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
<h2 id="nodemon" tabindex="-1"><a class="header-anchor" href="#nodemon" aria-hidden="true">#</a> nodemon</h2>
<p>用于监视 node.js 中当前应用程序的任何更改并自动重启服务器</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 安装</span>
<span class="token function">npm</span> <span class="token function">install</span> -g nodemon
<span class="token comment">#OR</span>
<span class="token function">npm</span> <span class="token function">install</span> --save-dev nodemon

<span class="token comment"># 启动项目</span>
nodemon <span class="token punctuation">[</span>入口文件<span class="token punctuation">]</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><a href="https://github.com/remy/nodemon" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
<h2 id="npm-check-updates" tabindex="-1"><a class="header-anchor" href="#npm-check-updates" aria-hidden="true">#</a> npm-check-updates</h2>
<p>更新 package.json 中的依赖包</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 安装</span>
<span class="token function">npm</span> <span class="token function">install</span> -g npm-check-updates

<span class="token comment"># 检查所有依赖包版本</span>
ncu
<span class="token comment"># 检查指定包版本</span>
ncu axios

<span class="token comment"># 直接升级所有依赖包版本</span>
ncu -u
<span class="token comment"># 升级指定包版本</span>
ncu -u axios

<span class="token comment"># 询问升级依赖包版本</span>
ncu -i
<span class="token comment"># 升级指定包版本</span>
ncu -i axios

<span class="token comment"># 指定版本范围</span>
ncu --target minor
<span class="token comment"># OR</span>
ncu --target patch
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p><a href="https://github.com/tjunnone/npm-check-updates" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
<h2 id="yalc" tabindex="-1"><a class="header-anchor" href="#yalc" aria-hidden="true">#</a> yalc</h2>
<p>npm 包调试工具，可配合 <code>nodemon</code> 做自动化</p>
<blockquote>
<p>在本地将 npm 包模拟发布，将发布后的资源存放在全局，再通过 <code>yalc</code> 命令将包添加至对应项目中</p>
</blockquote>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># 安装</span>
<span class="token function">npm</span> i yalc -g
<span class="token comment">#OR</span>
<span class="token function">yarn</span> global <span class="token function">add</span> yalc

<span class="token comment"># 发布</span>
yalc publish
<span class="token comment"># OR 快速更新所有依赖</span>
yalc push

<span class="token comment"># 添加依赖</span>
yalc <span class="token function">add</span> <span class="token punctuation">[</span>my-package<span class="token punctuation">]</span>

<span class="token comment"># 链接</span>
yalc <span class="token function">link</span>

<span class="token comment"># 更新依赖</span>
yalc update

<span class="token comment"># 移除依赖</span>
yalc remove <span class="token punctuation">[</span>my-package<span class="token punctuation">]</span>
<span class="token comment"># 移除所有依赖并还原</span>
yalc remove --all
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p><a href="https://github.com/wclr/yalc" target="_blank" rel="noopener noreferrer">Github<OutboundLink/></a></p>
</template>
