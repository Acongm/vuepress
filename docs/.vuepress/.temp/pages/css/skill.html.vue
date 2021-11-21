<template><h1 id="css-奇淫技巧" tabindex="-1"><a class="header-anchor" href="#css-奇淫技巧" aria-hidden="true">#</a> CSS 奇淫技巧</h1>
<h2 id="识别-html-字符中的-n" tabindex="-1"><a class="header-anchor" href="#识别-html-字符中的-n" aria-hidden="true">#</a> 识别 HTML 字符中的 \n</h2>
<blockquote>
<p><code>white-space</code> CSS 属性是用来设置如何处理元素中的 空白</p>
</blockquote>
<div class="language-css ext-css line-numbers-mode"><pre v-pre class="language-css"><code><span class="token property">white-space</span><span class="token punctuation">:</span> pre<span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><table>
<thead>
<tr>
<th style="text-align:center">属性值</th>
<th style="text-align:center">换行符</th>
<th style="text-align:center">空格和制表符</th>
<th style="text-align:center">文字换行</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">normal</td>
<td style="text-align:center">合并</td>
<td style="text-align:center">合并</td>
<td style="text-align:center">换行</td>
</tr>
<tr>
<td style="text-align:center">nowrap</td>
<td style="text-align:center">合并</td>
<td style="text-align:center">合并</td>
<td style="text-align:center">不换行</td>
</tr>
<tr>
<td style="text-align:center">pre</td>
<td style="text-align:center">保留</td>
<td style="text-align:center">保留</td>
<td style="text-align:center">不换行</td>
</tr>
<tr>
<td style="text-align:center">pre-wrap</td>
<td style="text-align:center">保留</td>
<td style="text-align:center">保留</td>
<td style="text-align:center">换行</td>
</tr>
<tr>
<td style="text-align:center">pre-line</td>
<td style="text-align:center">保留</td>
<td style="text-align:center">合并</td>
<td style="text-align:center">换行</td>
</tr>
<tr>
<td style="text-align:center">break-spaces</td>
<td style="text-align:center">保留</td>
<td style="text-align:center">保留</td>
<td style="text-align:center">换行</td>
</tr>
</tbody>
</table>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space" target="_blank" rel="noopener noreferrer">MDN<OutboundLink/></a></p>
</template>
