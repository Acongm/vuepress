<template><h1 id="pc-相关" tabindex="-1"><a class="header-anchor" href="#pc-相关" aria-hidden="true">#</a> PC 相关</h1>
<h2 id="transform-导致字体不清晰" tabindex="-1"><a class="header-anchor" href="#transform-导致字体不清晰" aria-hidden="true">#</a> <code>transform</code> 导致字体不清晰</h2>
<h4 id="原因" tabindex="-1"><a class="header-anchor" href="#原因" aria-hidden="true">#</a> 原因</h4>
<p><code>transform</code> 在渲染非整数的 <code>px</code> 时就会出现字体模糊。</p>
<h4 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案" aria-hidden="true">#</a> 解决方案</h4>
<p>方案一</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">目标元素</span> <span class="token punctuation">{</span>
  <span class="token property">-webkit-font-smoothing</span><span class="token punctuation">:</span> antialiased<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>方案二</p>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token selector">目标元素</span> <span class="token punctuation">{</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">perspective</span><span class="token punctuation">(</span>1px<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p><a href="https://css-tricks.com/forums/topic/transforms-cause-font-smoothing-weirdness-in-webkit/" target="_blank" rel="noopener noreferrer">详细说明 CSS-TRACKS<OutboundLink/></a></p>
</template>
