# react

## 为什么要合成事件机制

- 1、更好的兼容性和跨平台
- 2、挂载到 document， 减少内存消耗，避免频繁解绑
- 3、方便事件的统一管理（如事物机制）

#### `

- 1、event 是 SyntheticEvent， 模拟出来的 Dom 事件所有能力
- 2、event.nativeEvent 是原生事件对象
- 3、所有的事件， 都被挂载到 document 上
- 4、和 Dom 事件不一样， 和 vue 事件也不一样

## setState 和 batchUpdate

- 1、有时异步（普通使用）， 有时同步（setTimeout， DOM 事件）
- 2、有时合并（对象形式）， 有时不合并（函数形式）
- 3、后者比较好理解（像 Object.assign）, 主要讲解前者

### 核心要点

- 1、setState 主流程
- 2、batchUpdate 机制
- 3、transaction（事务）机制

## jsx 本质和 vdom

- 1、jsx 即 createElement 函数
- 2、执行生成 vnode
- 3、patch（elem，vnode）和 patch（vnode，newVnode）

## react 组件更新过程

- 1、setState (newState) --> dirtyComponents (可能有子组件)
- 2、render() 生成 newVnode
- 3、patch（vnode， newVnode）

### 更新的两个阶段

- 1、上述的 patch 被拆分为两个阶段：
- 2、reconciliation 阶段 - 执行 diff 算法，纯 JS 计算
- 3、commit 阶段 - 将 diff 结果渲染 Dom

### 可能会有性能问题

- 1、js 是单线程，且和 DOM 渲染共用一个线程
- 2、当组件足够复杂，组件更新时计算和渲染都压力很大
- 3、同时再有 DOM 操作需求（动画，鼠标拖拽等）， 将卡顿

### 解决方案 fiber

- 1、将 reconciliation 阶段进行任务拆分（commit 无法拆分）
- 2、DOM 需要渲染时暂停，空闲时恢复
- 3、window.requestIdleCallback

## react 面试题

### 组件之间如何通讯？

- 1、父子组件 props
- 2、自定义事件 eventBus
- 3、Redux 和 Context

### JSX 本质是什么？

- 1、createElement
- 2、执行返回 vnode

### COntext 是什么，如何应用

- 1、父组件，向其下所有子孙组件传递信息
- 2、如一些简单的公共信息：主题色、语言等
- 3、复杂的公共信息，请用 redux（业务数据管理等）

### shouldComponentUpdate 用途

- 1、性能优化
- 2、配合“不可变值”一起使用， 否则会出错

### redux 单项数据流

- View --> Action --> Dispatch --> Reducer --> State --> View

### setState 场景题

```js
componentDidMount(){
	// count 初始状态为 0
	this.setState({
		count: this.state.count + 1
	})
	console.log('1', this.state.count)	// 0
	this.setState({
		count: this.state.count + 1
	})
	console.log('2', this.state.count)	// 0
	setTimeout(()=>{
		this.setState({
			count: this.state.count + 1
		})
		console.log('3', this.state.count)	// 2
	})
	setTimeout(()=>{
		this.setState({
			count: this.state.count + 1
		})
		console.log('4', this.state.count)	// 3
	})
}
```

### 什么是纯函数

- 1、返回一个新值，没有副作用（不会“偷偷”修改其他值）
- 2、重点： 不可变值
- 3、如 arr1 = arr.slice()

#### \* React 组件生命周期

- 1、单组件生命周期
- 2、父子组件生命周期
- 3、注意 scu

### React 发起 ajax 应该在那个生命周期

- 1、同 Vue
- 2、componentDidMount

### 渲染列表，为何使用 key

- 1、同 Vue。 必须用 key，且不能是 index 和 random
- 2、diff 算法中通过 tag 和 key 来判断，是否是 sameNode
- 3、减少渲染次数，提升渲染性能

### 函数组件和 class 组件区别

- 1、纯函数，输入 props，输出 JSX
- 2、没有实例，没有生命周期，没有 state
- 3、不能扩展其他方法

### 什么是受控组件

- 1、表单的值，受 state 控制
- 2、需要自行监听 onChange, 更新 state
- 3、对比非受控组件

### 何时使用异步组件

- 1、同 vue
- 2、加载大组件
- 3、路由懒加载

### 多个组件有公共逻辑，如何抽离

- 1、高阶组件
- 2、Render Props
- 3、mixin 已被 React 废弃

### redux 如何进行异步请求

- 1、使用异步 action
- 2、如 redux-thunk

### react-router 如何配置懒加载

- 1、使用 lazy 函数 lazy(()=>import('../'))

### PureComponent 有何区别

- 1、实现了浅比较的 shouldComponentUpdate
- 2、优化性能
- 3、但要结合不可变值

### React 事件和 DOM 事件的区别

- 1、所有事件挂载到 document
- 2、event 不是原生的，是 SyntheticEvent 合成事件对象
- 3、dispatchEvent

### React 性能优化

- 1、渲染列表时加 key
- 2、自定义事件、DOM 事件及时销毁
- 3、合理使用异步组件
- 4、减少函数 bind this 的次数
- 5、合理使用 SCU PureComponent 和 memo
- 6、合理使用 Immutable.js (redux 中的不可变值，配合 PureComponent 使用最佳)
- 7、webpack 层面的优化
- 8、前端通用的性能优化， 如图片懒加载
- 9、使用 SSR

### React 和 Vue 的区别

- 1、都支持组件化
- 2、都是数据驱动视图
- 3、都使用 vdom 操作 DOM
- 4、React 使用 JSX 拥抱 JS，Vue 使用模版拥抱 html
- 5、React 函数式编程，Vue 声明式编程
- 6、React 更多需要自力更生，Vue 把想要的都给你
- 7、

## react/class-hooks
