<template><h1 id="call、apply-与-bind" tabindex="-1"><a class="header-anchor" href="#call、apply-与-bind" aria-hidden="true">#</a> call、apply 与 bind</h1>
<h2 id="call" tabindex="-1"><a class="header-anchor" href="#call" aria-hidden="true">#</a> call()</h2>
<pre><code>通过 call 方法，你可以在一个对象上借用另一个对象上的方法，
比如Object.prototype.toString.call([])，
就是一个Array对象借用了Object对象上的方法。
</code></pre>
<h2 id="apply" tabindex="-1"><a class="header-anchor" href="#apply" aria-hidden="true">#</a> apply()</h2>
<pre><code>  语法与 call() 方法的语法几乎完全相同，
  唯一的区别在于，apply 的第二个参数必须是一个包含多个参数的数组（或类数组对象）。
</code></pre>
<h2 id="bind" tabindex="-1"><a class="header-anchor" href="#bind" aria-hidden="true">#</a> bind</h2>
<pre><code>bind() 函数会创建一个新函数（称为绑定函数）

bind是ES5新增的一个方法
传参和call或apply类似
不会执行对应的函数，call或apply会自动执行对应的函数
返回对函数的引用
</code></pre>
</template>
