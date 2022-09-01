# React 18 新特性

## React 18 带来了什么

react 18 的新 API 最大的特点 就是 `Concurrent rendering` 机制。

## Concurrent 的特点

- startTransition: 可以让你的 UI 在一次花费高的状态转变中始终保持响应性
- useDeferredValue: 可以让你延迟屏幕上不那么重要的部分的更新
- `<SuspenseList>`: 可以让你控制 loading 状态指示器（比如转圈圈）的出现顺序
- ~~Streaming SSR with selective hydration: 让你的 app 可以更快地加载并可以进行交互~~

## 入口模式

三种入口模式
legacy 模式： ReactDOM.render(`<app />`, rootNode)。没有开启新功能，这是 react17 采用的默认模式。 (会有警告提示)
~~blocking 模式： ReactDOM.createBlockingRoot(rootNode).render(`<app />`)。作为迁移到 concurrent 模式的过渡模式。~~
concurrent 模式： ReactDOM.createRoot(rootNode).render(`<app />`)。这个模式开启了所有的新功能。

```js
// React 17
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('root')!;
ReactDOM.render(<App />, root);


// React 18
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(<App />);

```

## 异步批处理

批处理是 react 将多个状态更新分组到一个渲染中以获得更好的性能。
react18 之前只能在 react 事件处理程序中批处理更新。
默认情况下，Promise、setTimeout、本机事件处理程序或任何其他事件内部的更新不会在 React 中批处理。
使用自动批处理，这些更新将自动批处理：

```js
const [count, setCount] = useState(0)
const [flag, setFlag] = useState(false)
function handleClick() {
  setTimeout(() => {
    // React 18 and later versions does batch these.
    setCount((c) => c + 1)
    setFlag((f) => !f)
    // React will rerender once at the end (that's batching!)
  })
}
// react 17 render 执行次两次
// react 18 render 执行一次
```

那么，如果我不想要批处理呢？
官方提供了一个 API `flushSync` 用于退出批处理

```js
import { flushSync } from 'react-dom' // Note: react-dom, not react
function handleClick() {
  flushSync(() => {
    setCount((c) => c + 1)
  })
  // React has updated the DOM by now.
  flushSync(() => {
    setFlag((f) => !f)
  })
  // React has updated the DOM by now.
}
```

### 批处理实现

```js
function ensureRootIsScheduled(root, currentTime) {
  ......
  // 确定下一条工作路线，以及它们的优先级。
  var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

  // 这将返回在' getNextLanes '调用期间计算的优先级级别。
  var newCallbackPriority = returnNextLanesPriority();

  // 检查是否存在现有任务。我们也许可以重新利用它。
  if (existingCallbackNode !== null) {
    var existingCallbackPriority = root.callbackPriority;

    if (existingCallbackPriority === newCallbackPriority) {  // 优先级没有改变。我们可以重用现有的任务。
       return ;
    }
    // 优先级发生了变化。取消现有的回调。我们会安排一个新的
    // one below.
    cancelCallback(existingCallbackNode);
  }

  // Schedule a new callback.
  var newCallbackNode;
  ......
  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
} // This is the entry point for every concurrent task, i.e. anything that
// goes through Scheduler.
```

其实是将内部更新的优先级强制指定为 SyncLane，即指定为同步优先级，具体效果就是每一次更新时都会同步的执行渲染。

### FlushSync 的实现

```js
export function flushSync(fn) {
  try {
    // DiscreteEventPriority === SyncLane
    setCurrentUpdatePriority(DiscreteEventPriority)
    fn && fn()
  } finally {
    setCurrentUpdatePriority(previousPriority)
  }
}
```

[react 源码 - flushSync](https://github.com/facebook/react/blame/v18.2.0/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1367)

## startTransition

### 概述

React 18 加入了一个全新的 API startTransition，这个 API 相当牛，可以让我们的页面在大屏更新里保持响应。这个 API 通过标记某些更新为"transitions"，来提高用户交互。可以说 React 可以让你在一次状态改变的过程中始终提供视觉上的回馈并且在这个过程中让浏览器能保持响应。

### 解决了什么问题

使项目始终感觉流畅和响应的并不容易。
比如有时用户点击了一个按钮或者在输入框中输入，同时这些操作将会导致页面大量的更新，此时将会导致页面冻结或者挂起不动一会直到之前的更新任务完成为止。

在 React 18 之前，所有的更新没有优先级之分，都是紧急的，这意味着上面的两种状态更新会被同时 render，并且仍然会 block 住用户从他们的交互中获得反馈直到所有的东西都 render 好。

```js
// 紧急的更新：展示用户的输入
setInputValue(e.target.value);

// 将非紧急的更新标记为"transitions"
startTransition(() => {
    setContent(e.target.value);
});
`
```

### 浅析原理

#### startTransition 伪代码

在执行更新前将 ReactCurrentBatchConfig 里的 transition 属性赋值为 1，标记这次 Update 为"transition"，更新结束后再将 transition 属性赋为初始值 0

[react 源码 - startTransition ](https://github.com/facebook/react/blame/v18.2.0/packages/react/src/ReactStartTransition.js#L14)

```js
const ReactCurrentBatchConfig = {
  transition: (0: number)
}
export function startTransition(scope: () => void) {
  const prevTransition = ReactCurrentBatchConfig.transition
  ReactCurrentBatchConfig.transition = 1
  try {
    scope() // setContent(e.target.value);
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition
  }
}
```

#### dispatchSetState 伪代码

（更新的入口） 根据优先级进行更新
[react 源码 - dispatchSetState](https://github.com/facebook/react/blame/v18.2.0/packages/react-reconciler/src/ReactFiberHooks.new.js#L2228)

```ts
function dispatchSetState<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A
) {

  // 获取更新的优先级
  const lane = requestUpdateLane(fiber)
  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };
  //  ...
}
```

#### ReactFiberLane 伪代码

通过 31 位的二进制来定义 31 种优先级, 数值越小优先级越大

[react 源码 - ReactFiberLane ](https://github.com/facebook/react/blame/v18.2.0/packages/react-reconciler/src/ReactFiberLane.new.js#L34)

```ts
export const TotalLanes = 31

export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000

export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001

export const InputContinuousHydrationLane: Lane = /*    */ 0b0000000000000000000000000000010
export const InputContinuousLane: Lane = /*             */ 0b0000000000000000000000000000100

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000000001000
export const DefaultLane: Lane = /*                     */ 0b0000000000000000000000000010000

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000000000000100000
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111111111111000000
const TransitionLane1: Lane = /*                        */ 0b0000000000000000000000001000000
const TransitionLane2: Lane = /*                        */ 0b0000000000000000000000010000000
// ....
const TransitionLane15: Lane = /*                       */ 0b0000000000100000000000000000000
const TransitionLane16: Lane = /*                       */ 0b0000000001000000000000000000000
```

#### requestUpdateLane 伪代码

更新优先级
(是否有 `transition update`)

[react 源码 - requestUpdateLane](https://github.com/facebook/react/blame/v18.2.0/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L452)

```js
export function requestUpdateLane(fiber: Fiber): Lane {
  // Special cases
  const mode = fiber.mode
  // Concurrent 时, 返回最高优先级 SyncLane
  if ((mode & ConcurrentMode) === NoMode) {
    return (SyncLane: Lane)
  }
  const isTransition = requestCurrentTransition() !== NoTransition
  if (isTransition) {
    // 确保相同的优先级在相同的事件的稳定
    // 在第一个事件进行缓存, 确定是事件就重置缓存
    if (currentEventTransitionLane === NoLane) {
      // 同一个事件中的所有transition都被分配到相同的队列上。
      currentEventTransitionLane = claimNextTransitionLane()
    }
    return currentEventTransitionLane
  }
}
```

#### requestCurrentTransition 伪代码

返回优先级
[react 源码 - requestCurrentTransition ](https://github.com/facebook/react/blame/v18.2.0/packages/react-reconciler/src/ReactFiberTransition.js)

```js
const { ReactCurrentBatchConfig } = ReactSharedInternals

export const NoTransition = null

export function requestCurrentTransition(): Transition | null {
  return ReactCurrentBatchConfig.transition
}
```

#### claimNextTransitionLane 伪代码

返回当前事件触发的标记为"transition"的 update 的优先级

[react 源码 - claimNextTransitionLane](https://github.com/facebook/react/blame/v18.2.0/packages/react-reconciler/src/ReactFiberLane.new.js#L493)

```js
export function claimNextTransitionLane(): Lane {
  // 在执行中, 将每个新的 transition 任务分配到下一个优先级
  // 大多数情况下, 每个过渡都有自己的优先级, 知道我们结束结束.
  const lane = nextTransitionLane
  nextTransitionLane <<= 1
  if ((nextTransitionLane & TransitionLanes) === NoLanes) {
    nextTransitionLane = TransitionLane1
  }
  return lane
}
```

#### getEventPriority 伪代码

判定其他更新的优先级

[react 源码 - getEventPriority](https://github.com/facebook/react/blame/v18.2.0/packages/react-dom/src/events/ReactDOMEventListener.js#L410)

```js
export function getEventPriority(domEventName: DOMEventName): * {
  switch (domEventName) {
    // Used by SimpleEventPlugin:
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    // ...
    case 'input':
    case 'select':
    case 'selectstart':
      // DiscreteEventPriority === SyncLane
      return DiscreteEventPriority
    // ...
  }
}
```

总的来说就是在执行更新前将 ReactCurrentBatchConfig 里的 transition 属性赋值为 1，标记这次 Update 为"transition"，更新结束后再将 transition 属性赋为初始值 0

这里通过修改 `ReactCurrentBatchConfig.transition` 的值来做标记，
后面在 `setState` 中， 通过 `dispatchAction` 来判断代码执行顺序的优先级。

### startTransition - 实践

```js
import React, { useState, startTransition } from 'react'
function App() {
  const [ctn, updateCtn] = useState('')
  const [num, updateNum] = useState(0)
  return (
    <div>
      <input
        value={ctn}
        onChange={(e) => {
          updateCtn(e.target.value)
          // 标记非紧急更新来处理，差不多后端并发一样变异步了，主线程不执行。但这里概念会变成等待更新
          startTransition(() => updateNum(num + 1))
          // updateNum(num + 1)
        }}
      />
      <BusyChild num={num} />
    </div>
  )
}

// 由于程序相对简单，需要做render的时间延迟，这样我们就更好的看到效果

const BusyChild = React.memo(({ num }: { num: number }) => {
  console.log('BusyChild view')
  const cur = performance.now()
  // 增加render的耗时 时间越大，卡顿效果越明显
  while (performance.now() - cur < 100) {}

  return <div>{num}</div>
})
```

[输入渲染 30000 条数据 Demo](https://codesandbox.io/s/react-18-demo-forked-780b73?file=/src/App.js)

### useTransition - 实践

一般情况下，我们可能需要通知用户后台正在工作。为此提供了一个带有 `isPending` 转换标志的 `useTransition`，React 将在状态转换期间提供视觉反馈，并在转换发生时保持浏览器响应。

```js
import { useTransition } from 'react'
const [isPending, startTransition] = useTransition()
return isPending && <Spin />
```

### useDeferredValue - 实践

```js
import { useDeferredValue } from 'react'
const deferredValue = useDeferredValue(value)
```

用法如下：

```jsx
import { useDeferredValue, useState } from 'react'
import MySlowList from '../components/MySlowList'

export default function UseDeferredValuePage(props) {
  const [text, setText] = useState('hello')
  const deferredText = useDeferredValue(text)

  const handleChange = (e) => {
    setText(e.target.value)
  }
  return (
    <div>
      <h3>UseDeferredValuePage</h3>
      {/* 保持将当前文本传递给 input */}
      <input value={text} onChange={handleChange} />
      {/* 但在必要时可以将列表“延后” */}
      <p>{deferredText}</p>

      <MySlowList text={deferredText} />
    </div>
  )
}
```

### useDeferredValue 与 useTransition 区别

- 相同：useDeferredValue 本质上和内部实现与 useTransition 一样都是标记成了非紧急更新任务。
- 不同：useTransition 是把更新任务变成了延迟更新任务，而 useDeferredValue 是产生一个新的值，这个值作为延时状态。

### 与`setTimeout`、`debounce`异同

在 startTransition 出现之前，我们可以使用 setTimeout 来实现优化。但是现在在处理上面的优化的时候，有了 startTransition 基本上可以抛弃 setTimeout 了，原因主要有以三点：

首先，与 setTimeout 不同的是，startTransition 并不会延迟调度，而是会立即执行，startTransition 接收的函数是同步执行的，只是这个 update 被加了一个“transitions"的标记。而这个标记，React 内部处理更新的时候是会作为参考信息的。这就意味着，相比于 setTimeout， 把一个 update 交给 startTransition 能够更早地被处理。而在于较快的设备上，这个过度是用户感知不到的。

<!-- ### 同 `debounce` 的区别：

`debounce` 即 `setTimeout` 总是会有一个固定的延迟，而 useDeferredValue 的值只会在渲染耗费的时间下滞后，在性能好的机器上，延迟会变少，反之则变长。 -->

## Suspense - 实践

更方便的组织并行请求和 loading 状态的代码

16 就已经支持, 例如:

```js
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'))

function MyComponent() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  )
}
```

在 react18 中, 对其进行了一些丰富的处理,
我们可以 封装一层 `promise`，请求中，我们将 `promise` 作为异常抛出，请求完成展示结果。
例如:

```js
function wrapPromise(promise) {
  let status = 'pending'
  let result
  let suspender = promise.then(
    (r) => {
      status = 'success'
      result = r
    },
    (e) => {
      status = 'error'
      result = e
    }
  )
  return {
    read() {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    }
  }
}
```

此外, 还补充了 SuspenseList

### SuspenseList

~~` ts 下运行使用失败`~~

用于控制 Suspense 组件的显示顺序。

#### `revealOrder` Suspense 加载顺序

- `together` 所有 Suspense 一起显示，也就是最后一个加载完了才一起显示全部
- `forwards` 按照顺序显示 Suspense
- `backwards` 反序显示 Suspense

#### `tail`是否显示 fallback，只在 revealOrder 为 forwards 或者 backwards 时候有效

- `hidden`不显示
- `collapsed`轮到自己再显示 

#### SuspenseList 示例

```jsx
import { useState, Suspense, SuspenseList } from 'react'
import User from '../components/User'
import Num from '../components/Num'
import { fetchData } from '../utils'
import ErrorBoundaryPage from './ErrorBoundaryPage'

const initialResource = fetchData()

export default function SuspenseListPage(props) {
  const [resource, setResource] = useState(initialResource)

  return (
    <div>
      <h3>SuspenseListPage</h3>
      <SuspenseList tail="collapsed">
        <ErrorBoundaryPage fallback={<h1>网络出错了</h1>}>
          <Suspense fallback={<h1>loading - user</h1>}>
            <User resource={resource} />
          </Suspense>
        </ErrorBoundaryPage>

        <Suspense fallback={<h1>loading-num</h1>}>
          <Num resource={resource} />
        </Suspense>
      </SuspenseList>

      <button onClick={() => setResource(fetchData())}>refresh</button>
    </div>
  )
}
```

## 其他

- ~~userId~~
- ~~useSyncExternalStore~~
- ~~useInsertionEffect~~

## 问题

- 任务如何按时间片拆分、时间片间如何中断与恢复？
- 任务是怎样设定优先级的？
- 如何让高优先级任务后生成而先执行，低优先级任务如又何恢复？

![sync VS Concurrent](https://pic3.zhimg.com/80/v2-1bd643bbc6d0e43f4dbee76ff7840e16_1440w.jpg)

```js
import React, { useState, startTransition } from 'react'

function App() {
  const [ctn, updateCtn] = useState('')
  const upData = () => {
    updateCtn((v) => v + 'a')
    startTransition(() => {
      updateCtn((v) => v + 'b')
    })
    updateCtn((v) => v + 'c')
    startTransition(() => {
      updateCtn((v) => v + 'd')
    })
  }
  console.log('render', ctn)
  // render ac
  // render abcd
  return (
    <div>
      <button onClick={upData}>upData</button>
      <p>{ctn}</p>
    </div>
  )
}
```

## 思考

下面代码 `startTransition` 为什么不起作用

```js
const [ctn, updateCtn] = useState('')
const upData = () => {
  updateCtn((v) => v + 'a')
  startTransition(() => {
    flushSync(() => {
      updateCtn((v) => v + 'b')
      updateCtn((v) => v + 'c')
    })
  })
  updateCtn((v) => v + 'd')
  flushSync(() => {
    updateCtn((v) => v + 'e')
  })
}
console.log('render', ctn)
// abc
// abcde
```

## 参考资料

- [React 18 新特性之 startTransition](https://juejin.cn/post/7029120932086022174)
- [深入剖析 React Concurrent](https://zhuanlan.zhihu.com/p/60307571)
- [react18 新特性及实践总结](https://juejin.cn/post/7117512204059934733)
- [Sync/setTimeout/debounce/throttle/Concurrent - 性能 Demo](https://codesandbox.io/s/koyz664q35)
