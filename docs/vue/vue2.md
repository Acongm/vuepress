# vue 原理

## 1、组件化

- 组件化的历史
- 数据驱动视图
- MVVM

## 2、响应式

- 核心 api Object.defineproperty
- 监听对象（深度），监听数组
- Object.defineproperty 的缺点（vue3 用 Proxy）

## 3、vdom 和 diff

- 应用背景
- vnode 结构
- snabbdom 使用：vnode h patch

## 4、模版编译

- with 语法
- 模版编译为 render 函数
- 执行 render 函数生成 vdom

## 5、渲染过程

- 初次渲染过程
- 更新过程
- 异步渲染

## 6、前端路由

- hash
- h5 history
- 两者对比

## 7、vue 面试真题演练

### 1、v-show 和 v-if 的区别

- v-show 通过 css display 控制显示和隐藏
- v-if 组件真正的渲染和销毁， 而不是显示和隐藏
- 频繁切换显示状态用 v-show， 否则用 v-if

### 为何在 v-for 中使用 key

- 必须用 key， 且不能是 index 和 random
- diff 算法中通过 tag 和 key 来判断， 是否是 sameNode
- 减少渲染次数，提升渲染性能

### 描述 Vue 组件生命周期（父子组件）

- 单组件生命周期
- 父子组件生命周期关系

### Vue 组件如何通讯（常见）

- 父子组件 props 和 this.$emit
- 自定义事件 event.$no event.$off event.emit
- vuex

### 描述组件渲染和更新的过程

- 响应式（监听属性变化）
- 模版渲染
- vdom

### 双向数据绑定 v-model 的实现原理

- input 元素的 value = this.name
- 绑定 input 事件 this.name = $event.target.value
- data 更新触发 re-render

### 对于 MVVM 的理解

- Model、viewModel、view

### computed 有何特点

- 缓存，不变不会重新计算
- 提高性能

### 为何组件 data 必须是一个函数？

- data 必须是一个函数（为了不同的实例不冲突）
- vue 是一个 class

### ajax 请求应该放在哪个生命周期

- mounted
- js 是单线程的， ajax 异步获取数据
- 放在 mounted 之前没有什么用，只会让逻辑变得更混乱

### 如何将组件所有 props 传递给子组件？

- $props
- `<User v-bind="$props">`
- 细节知识点，优先级不高

### 如何自己实现 v-model

```html
<input
  text="text"
  v-bind:value="text"
  v-on:input="$emit('change', $event.target.value)"
/>
```

### 多个组件有相同的逻辑，如何抽离？

- mixin
- 以及 mixin 的一些缺点

### 为何要使用异步组件？

- 加载大组件
- 路由异步加载

### 何时使用 keep-alive？

- 缓存组件，不需要重复渲染
- 如多个静态 tab 页的切换
- 优化性能

### 何时需要使用 beforeDestory

- 解绑自定义事件 event.$off
- 清除定时器
- 解绑自定义的 DOM 事件，如 window scroll 等

### 什么是作用域插槽

```html
<slot :website="website"></slot>
```

### vuex 中 action 和 mutation 有何区别

- action 中处理异步，mutation 不可以
- mutaion 做原子操作
- action 可以整合多个 mutation

### vue-router 常用的路由模式

- hash 默认
- H5 history（需要服务支持）
- 两者比较

### 如何配置 vue-router 异步加载

- path 和 component
- component: ()=> import('..///')

### 请用 vnode 描述一个 DOM 结构

```html
<div id="div1" class="container">
  <p>vdom</p>
  <ul style="font-size: 20px">
    <li>a</li>
  </ul>
</div>
```

```js
{
    tag: 'div',
    props: {
        className: 'container',
        id: 'div1'
    },
    children: {
        tag: 'p',
        children: 'vdom'
    },
    tag: 'ul',
    props: {
        style: 'font-size: 20px',
    },
    children: {
        tag: 'li',
        children: 'a'
    },
    // ...
}
```

### 监听 data 变化的核心 API 是什么

- Object.defineProperty
- 以及深度监听、监听数组
- 有何缺点

### Vue 如何监听数组变化

- Object.defineProperty 不能监听数组变化
- 重新定义原型，重写 push pop 等方法，实现监听
- proxy 可以原生支持监听数组变化

### 请描述响应式原理

- 监听 data 变化
- 组件渲染和更新的流程

### diff 算法的时间复杂度

- O(n)
- 在 O(n^3)基础上做了一些调整

### 简述 diff 算法过程

- patch(elem, vnode)和 path(vnode, newVode)
- pathVnode 和 addVnodes 和 removeVnodes
- updataChildren（key 的重要性）

### vue 为何是异步渲染， $nextTick 何用

- 异步渲染（以合并 data 修改），以提高渲染性能
- $nextTick 在 DOM 更新完后，触发回调

### Vue 常见性能优化方式

- 合理使用 v-show 和 v-if
- 合理使用 computed
- v-for 时加 key， 以及避免和 v-if 同时使用
- （v-for 优先级高， 每次 v-for 会重新计算一遍 v-if）
- 自定义事件、DOM 事件及时销毁
- 合理使用异步组件
- 合理使用 keep-alive
- data 层级不要太深
- 使用 vue-loader 在开发环境做模版编译（预编译）
- webpack 层面的优化
- 前端通用的性能优化，如图片懒加载
- 使用 SSR
