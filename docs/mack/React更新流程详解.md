# React 更新流程详解

## 概览：从 setState 到 DOM 更新的完整旅程

```
用户操作
   ↓
触发更新（setState/useState/useReducer）
   ↓
┌─────────────────────────────────────────────────┐
│  阶段1: 调度阶段 (Schedule)                      │
│  - 创建 Update 对象                              │
│  - 计算优先级 (lanes)                            │
│  - 任务入队                                      │
│  - Scheduler 调度                                │
└─────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────┐
│  阶段2: 协调阶段 (Render/Reconciliation)         │
│  ⚠️ 可中断、可重复执行                            │
│  - beginWork (向下遍历)                          │
│  - Diff 算法                                     │
│  - 标记副作用 (effectTag)                        │
│  - completeWork (向上回溯)                       │
│  - 构建 effectList                               │
└─────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────┐
│  阶段3: 提交阶段 (Commit)                        │
│  ⚠️ 同步执行、不可中断                            │
│  - before mutation                               │
│  - mutation (真实 DOM 操作)                      │
│  - layout (useLayoutEffect/componentDidMount)   │
│  - 切换 Fiber 树指针                             │
└─────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────┐
│  阶段4: 副作用执行 (Effect)                      │
│  ⚠️ 异步执行                                      │
│  - 执行 useEffect cleanup                        │
│  - 执行 useEffect callback                       │
└─────────────────────────────────────────────────┘
   ↓
浏览器绘制，用户看到新界面
```

---

## 阶段 1: 调度阶段 (Schedule)

### 1.1 核心职责

**决定"何时执行"、"如何执行"更新任务**

### 1.2 详细流程

```javascript
// ========== 步骤1: 触发更新 ==========
function setState(newState) {
  // 1. 创建 Update 对象
  const update = {
    lane: getCurrentPriority(), // 优先级
    action: newState, // 新状态
    next: null, // 指向下一个 Update
    callback: null // 回调函数
  }

  // 2. 将 Update 加入 Fiber 的 updateQueue
  const fiber = getCurrentFiber()
  enqueueUpdate(fiber, update)

  // 3. 从当前 Fiber 向上标记到根节点
  scheduleUpdateOnFiber(fiber)
}

// ========== 步骤2: 标记更新路径 ==========
function scheduleUpdateOnFiber(fiber) {
  // 从当前 Fiber 一路向上到 root，标记 lanes
  let node = fiber
  while (node !== null) {
    node.lanes = mergeLanes(node.lanes, update.lane)
    node = node.return // 向上遍历
  }

  // 找到根节点，调度根节点更新
  const root = getRootFromFiber(fiber)
  ensureRootIsScheduled(root)
}

// ========== 步骤3: 优先级计算 ==========
function ensureRootIsScheduled(root) {
  // 1. 获取当前最高优先级
  const nextLanes = getNextLanes(root)

  // 2. 判断优先级类型
  if (includesSyncLane(nextLanes)) {
    // 同步优先级（如用户输入）→ 立即执行
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
  } else {
    // 并发优先级 → 通过 Scheduler 调度
    const schedulerPriority = lanesToSchedulerPriority(nextLanes)
    scheduleCallback(
      schedulerPriority,
      performConcurrentWorkOnRoot.bind(null, root)
    )
  }
}

// ========== 步骤4: Scheduler 调度 ==========
function scheduleCallback(priorityLevel, callback) {
  // Scheduler 负责时间切片和任务调度
  const currentTime = getCurrentTime()
  const timeout = timeoutForPriorityLevel(priorityLevel)
  const expirationTime = currentTime + timeout

  const newTask = {
    callback,
    priorityLevel,
    expirationTime,
    sortIndex: expirationTime
  }

  // 加入任务队列（小顶堆，按过期时间排序）
  push(taskQueue, newTask)

  // 请求调度
  requestHostCallback(flushWork)
}
```

### 1.3 优先级模型（Lane）

```javascript
// 31 条车道，数字越小优先级越高
const SyncLane = 0b0000000000000000000000000000001;              // 1 - 同步（最高）
const InputContinuousLane = 0b0000000000000000000000000000100;   // 4 - 连续输入
const DefaultLane = 0b0000000000000000000000000010000;           // 16 - 默认
const TransitionLane1 = 0b0000000000000000000000001000000;       // 64 - Transition
const IdleLane = 0b0100000000000000000000000000000;              // 最低优先级

// 实际案例
onClick={() => {
  setCount(1);  // SyncLane - 用户交互，立即响应
}}

startTransition(() => {
  setList(newList);  // TransitionLane - 可延迟更新
});
```

### 1.4 时间切片原理

```javascript
// Scheduler 的工作循环
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime
  let currentTask = peek(taskQueue) // 获取最高优先级任务

  while (currentTask !== null) {
    if (
      currentTask.expirationTime > currentTime && // 未过期
      (!hasTimeRemaining || shouldYieldToHost()) // 且时间片用完
    ) {
      // 让出主线程，下一帧继续
      break
    }

    const callback = currentTask.callback
    const continuationCallback = callback() // 执行任务

    if (typeof continuationCallback === 'function') {
      // 任务未完成，继续等待调度
      currentTask.callback = continuationCallback
    } else {
      // 任务完成，移出队列
      pop(taskQueue)
    }

    currentTask = peek(taskQueue)
  }

  // 如果还有任务，继续调度
  if (currentTask !== null) {
    return true
  }
  return false
}

// 判断是否应该让出主线程
function shouldYieldToHost() {
  const currentTime = getCurrentTime()
  return currentTime >= deadline // 默认 5ms 一个时间片
}
```

### 1.5 实际案例演示

```javascript
// 场景：用户快速输入搜索框
function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleChange = (e) => {
    const value = e.target.value

    // 紧急更新：立即更新输入框显示（SyncLane）
    setQuery(value)

    // 非紧急更新：搜索结果可以延迟（TransitionLane）
    startTransition(() => {
      const filtered = hugeDataSet.filter((item) => item.includes(value))
      setResults(filtered)
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {/* 用户输入不会被搜索计算阻塞 */}
      <ResultList data={results} />
    </>
  )
}
```

**调度流程分析：**

```
用户输入 "R"
  ↓
创建 2 个 Update：
  - Update1: setQuery("R") - SyncLane (优先级1)
  - Update2: setResults([...]) - TransitionLane (优先级64)
  ↓
Scheduler 调度：
  - 先执行 Update1（高优先级）→ 输入框立即显示 "R"
  - 后执行 Update2（低优先级）→ 搜索结果延迟更新
  ↓
如果用户继续输入 "Re"：
  - 新的 Update1 打断 Update2
  - 废弃未完成的搜索任务
  - 重新开始新的搜索
```

---

## 阶段 2: 协调阶段 (Render/Reconciliation)

### 2.1 核心职责

**计算"要做什么"DOM 变更，但不真正执行**

### 2.2 双缓冲机制

```javascript
// React 维护两棵 Fiber 树
const root = {
  current: currentFiberTree, // 当前屏幕显示的树
  workInProgress: null // 正在构建的新树
}

// current 树和 workInProgress 树通过 alternate 互相指向
currentFiber.alternate = workInProgressFiber
workInProgressFiber.alternate = currentFiber

// 协调阶段：在 workInProgress 树上工作
// 提交阶段：切换 current 指针
```

```
初始状态：
current 树 (显示在屏幕)        workInProgress 树 (不存在)
    App                              null
    ↓
   div
    ↓
  "Hello"

触发更新 setState("World")：
current 树 (仍然显示)          workInProgress 树 (后台构建)
    App ←──alternate──→            App'
    ↓                              ↓
   div  ←──alternate──→           div'
    ↓                              ↓
  "Hello"                        "World"  (新计算的)

提交完成后：
旧 current 树                   新 current 树 (切换指针)
    App                              App'
    ↓                                ↓
   div                              div'
    ↓                                ↓
  "Hello"                          "World" ← 用户看到这个
  (变成备用树)
```

### 2.3 详细流程：beginWork

```javascript
// ========== 向下遍历：beginWork ==========
function beginWork(current, workInProgress) {
  // current: 旧 Fiber
  // workInProgress: 新 Fiber

  // 1. 判断是否可以复用
  if (current !== null) {
    const oldProps = current.memoizedProps
    const newProps = workInProgress.pendingProps

    if (
      oldProps === newProps && // props 没变
      !hasContextChanged() // context 没变
    ) {
      // 🎯 bailout：跳过该子树，复用旧 Fiber
      return bailoutOnAlreadyFinishedWork(current, workInProgress)
    }
  }

  // 2. 根据组件类型处理
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress)
    case ClassComponent:
      return updateClassComponent(current, workInProgress)
    case HostComponent: // 原生 DOM 标签
      return updateHostComponent(current, workInProgress)
  }
}

// ========== 函数组件更新 ==========
function updateFunctionComponent(current, workInProgress) {
  const Component = workInProgress.type
  const props = workInProgress.pendingProps

  // 1. 执行函数组件，获取 children
  const children = Component(props) // 调用 useState、useEffect 等

  // 2. 调和子节点（Diff 算法核心）
  reconcileChildren(current, workInProgress, children)

  return workInProgress.child // 返回第一个子节点
}

// ========== 协调子节点（Diff） ==========
function reconcileChildren(current, workInProgress, children) {
  if (current === null) {
    // 初次挂载：直接创建新 Fiber
    workInProgress.child = mountChildFibers(workInProgress, children)
  } else {
    // 更新：对比新旧子节点
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child, // 旧子节点
      children // 新子节点
    )
  }
}
```

### 2.4 Diff 算法详解

```javascript
// ========== Diff 算法：3 种情况 ==========
function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
  // 情况1: 单节点 Diff
  if (typeof newChild === 'object' && newChild !== null) {
    if (!Array.isArray(newChild)) {
      return reconcileSingleElement(returnFiber, currentFirstChild, newChild)
    }
  }

  // 情况2: 多节点 Diff（最复杂）
  if (Array.isArray(newChild)) {
    return reconcileChildrenArray(returnFiber, currentFirstChild, newChild)
  }

  // 情况3: 文本节点
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return reconcileSingleTextNode(returnFiber, currentFirstChild, newChild)
  }

  // 其他情况：删除所有旧子节点
  return deleteRemainingChildren(returnFiber, currentFirstChild)
}

// ========== 单节点 Diff ==========
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  const key = element.key
  let child = currentFirstChild

  // 遍历旧子节点，找是否有可复用的
  while (child !== null) {
    if (child.key === key) {
      if (child.type === element.type) {
        // ✅ key 和 type 都相同 → 复用
        deleteRemainingChildren(returnFiber, child.sibling) // 删除其他兄弟
        const existing = useFiber(child, element.props)
        existing.return = returnFiber
        return existing
      } else {
        // ❌ key 相同但 type 不同 → 删除所有旧节点
        deleteRemainingChildren(returnFiber, child)
        break
      }
    } else {
      // ❌ key 不同 → 标记删除
      deleteChild(returnFiber, child)
    }
    child = child.sibling
  }

  // 没有可复用的，创建新 Fiber
  const created = createFiberFromElement(element)
  created.return = returnFiber
  return created
}

// ========== 多节点 Diff（核心算法）==========
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
  let resultingFirstChild = null
  let previousNewFiber = null
  let oldFiber = currentFirstChild
  let newIdx = 0
  let lastPlacedIndex = 0

  // 🔹 第一轮遍历：处理更新的节点
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    const newChild = newChildren[newIdx]

    if (oldFiber.key === newChild.key) {
      // key 相同，尝试复用
      const newFiber = updateSlot(returnFiber, oldFiber, newChild)
      if (newFiber.type === oldFiber.type) {
        // ✅ 复用成功
        newFiber.index = newIdx
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      }
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber
      } else {
        previousNewFiber.sibling = newFiber
      }
      previousNewFiber = newFiber
      oldFiber = oldFiber.sibling
    } else {
      // key 不同，跳出第一轮
      break
    }
  }

  // 🔹 第二轮遍历：处理剩余节点
  if (newIdx === newChildren.length) {
    // 新节点遍历完，删除剩余旧节点
    deleteRemainingChildren(returnFiber, oldFiber)
    return resultingFirstChild
  }

  if (oldFiber === null) {
    // 旧节点遍历完，新增剩余新节点
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx])
      // ... 插入逻辑
    }
    return resultingFirstChild
  }

  // 🔹 第三轮遍历：处理移动的节点
  // 将剩余旧节点放入 Map，key → fiber
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber)

  for (; newIdx < newChildren.length; newIdx++) {
    const newChild = newChildren[newIdx]
    const matchedFiber = existingChildren.get(newChild.key || newIdx)

    if (matchedFiber) {
      // 在 Map 中找到了，可以复用
      existingChildren.delete(newChild.key || newIdx)
      // ... 标记移动或不移动
    } else {
      // 没找到，创建新节点
      const newFiber = createChild(returnFiber, newChild)
      // ...
    }
  }

  // 删除 Map 中剩余的旧节点（在新列表中不存在）
  existingChildren.forEach((child) => deleteChild(returnFiber, child))

  return resultingFirstChild
}
```

### 2.5 Diff 算法案例演示

```javascript
// 案例1: 简单更新
// 旧: [A, B, C]
// 新: [A, B, D]

// 第一轮遍历：
// A vs A: key 相同，type 相同 → ✅ 复用
// B vs B: key 相同，type 相同 → ✅ 复用
// C vs D: key 不同 → 跳出

// 第三轮遍历：
// 删除 C，新增 D

// 结果：effectTag
// A: Update (无变化但检查过)
// B: Update
// C: Deletion
// D: Placement
```

```javascript
// 案例2: 列表反转
// 旧: [A(0), B(1), C(2)]
// 新: [C(2), B(1), A(0)]

// 第一轮遍历：
// A vs C: key 不同 → 立即跳出

// 第三轮遍历（用 Map）：
// existingChildren = { A: fiber_A, B: fiber_B, C: fiber_C }

// 处理 C: 在 Map 中找到 fiber_C
//   - oldIndex = 2, lastPlacedIndex = 0
//   - 2 > 0 → 不需要移动 ✅
//   - lastPlacedIndex = 2

// 处理 B: 在 Map 中找到 fiber_B
//   - oldIndex = 1, lastPlacedIndex = 2
//   - 1 < 2 → 需要移动 ⚠️
//   - effectTag = Placement

// 处理 A: 在 Map 中找到 fiber_A
//   - oldIndex = 0, lastPlacedIndex = 2
//   - 0 < 2 → 需要移动 ⚠️
//   - effectTag = Placement

// 结果：
// C: 不动
// B: 移动到 C 后面
// A: 移动到 B 后面
```

### 2.6 completeWork（向上回溯）

```javascript
// ========== completeWork：完成节点处理 ==========
function completeWork(current, workInProgress) {
  const newProps = workInProgress.pendingProps

  switch (workInProgress.tag) {
    case HostComponent: {
      // 原生 DOM 标签
      if (current !== null && workInProgress.stateNode != null) {
        // 更新：标记需要更新的属性
        updateHostComponent(current, workInProgress, newProps)
      } else {
        // 挂载：创建真实 DOM 节点
        const instance = createInstance(workInProgress.type, newProps)

        // 将子节点的 DOM 插入到当前 DOM
        appendAllChildren(instance, workInProgress)

        workInProgress.stateNode = instance
      }
      break
    }
  }

  return null
}

// ========== 创建真实 DOM ==========
function createInstance(type, props) {
  const domElement = document.createElement(type)
  // 设置属性
  for (const propKey in props) {
    if (propKey === 'children') continue
    domElement[propKey] = props[propKey]
  }
  return domElement
}

// ========== 收集子节点的 DOM ==========
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      // 是原生节点，直接插入
      parent.appendChild(node.stateNode)
    } else if (node.child !== null) {
      // 是组件，继续向下找
      node = node.child
      continue
    }

    // 向上回溯到兄弟节点
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return
      }
      node = node.return
    }
    node = node.sibling
  }
}
```

### 2.7 effectList（副作用链表）

```javascript
// 在 completeWork 中收集有副作用的节点
function completeWork(current, workInProgress) {
  // ... 处理节点 ...

  // 收集 effect
  const returnFiber = workInProgress.return
  if (returnFiber !== null) {
    // 将当前节点的 effectList 接到父节点
    if (returnFiber.firstEffect === null) {
      returnFiber.firstEffect = workInProgress.firstEffect
    }
    if (workInProgress.lastEffect !== null) {
      if (returnFiber.lastEffect !== null) {
        returnFiber.lastEffect.nextEffect = workInProgress.firstEffect
      }
      returnFiber.lastEffect = workInProgress.lastEffect
    }

    // 如果当前节点有副作用，加入链表
    if (workInProgress.flags !== NoFlags) {
      if (returnFiber.lastEffect !== null) {
        returnFiber.lastEffect.nextEffect = workInProgress
      } else {
        returnFiber.firstEffect = workInProgress
      }
      returnFiber.lastEffect = workInProgress
    }
  }
}
```

```
示例 Fiber 树：
       App
      /   \
    div   div(Update)
    /      \
  p(Placement)  span(Deletion)

构建的 effectList（单链表）：
p(Placement) → span(Deletion) → div(Update) → null

提交阶段只需遍历这个链表，而不是整棵树！
```

---

## 阶段 3: 提交阶段 (Commit)

### 3.1 核心职责

**执行真实的 DOM 操作和生命周期**

### 3.2 三个子阶段

```javascript
function commitRoot(root) {
  const finishedWork = root.finishedWork // workInProgress 树的根节点

  // 🔹 子阶段1: before mutation（DOM 变更前）
  commitBeforeMutationEffects(finishedWork)

  // 🔹 子阶段2: mutation（DOM 变更）
  commitMutationEffects(finishedWork, root)

  // 🎯 切换 Fiber 树指针（关键时刻）
  root.current = finishedWork

  // 🔹 子阶段3: layout（DOM 变更后）
  commitLayoutEffects(finishedWork, root)

  // 异步调度 useEffect
  schedulePassiveEffects(finishedWork)
}
```

### 3.3 before mutation 阶段

```javascript
function commitBeforeMutationEffects(firstChild) {
  let fiber = firstChild

  while (fiber !== null) {
    // 处理类组件的 getSnapshotBeforeUpdate
    if (fiber.tag === ClassComponent) {
      const instance = fiber.stateNode
      if (fiber.flags & Snapshot) {
        const snapshot = instance.getSnapshotBeforeUpdate(
          fiber.alternate.memoizedProps,
          fiber.alternate.memoizedState
        )
        instance.__reactInternalSnapshotBeforeUpdate = snapshot
      }
    }

    // 处理 DOM 节点的焦点状态
    if (fiber.tag === HostComponent) {
      // 记录当前聚焦的元素
      const focusedElement = document.activeElement
      // 在 layout 阶段可能需要恢复焦点
    }

    fiber = fiber.nextEffect
  }
}
```

**作用：**

- 获取 DOM 变更前的快照（如滚动位置）
- 为 componentDidUpdate 的第三个参数 `snapshot` 准备数据

### 3.4 mutation 阶段（核心）

```javascript
function commitMutationEffects(firstChild, root) {
  let fiber = firstChild

  while (fiber !== null) {
    const flags = fiber.flags

    // 🔹 处理 ContentReset（重置文本内容）
    if (flags & ContentReset) {
      commitResetTextContent(fiber)
    }

    // 🔹 处理 Ref（先解绑旧 ref）
    if (flags & Ref) {
      const current = fiber.alternate
      if (current !== null) {
        commitDetachRef(current)
      }
    }

    // 🔹 核心：根据 effectTag 执行 DOM 操作
    const primaryFlags = flags & (Placement | Update | Deletion)

    switch (primaryFlags) {
      case Placement: {
        // ➕ 插入 DOM
        commitPlacement(fiber)
        fiber.flags &= ~Placement // 清除标记
        break
      }
      case Update: {
        // 🔄 更新 DOM
        commitWork(fiber)
        break
      }
      case Deletion: {
        // ➖ 删除 DOM
        commitDeletion(root, fiber)
        break
      }
      case PlacementAndUpdate: {
        // 插入 + 更新
        commitPlacement(fiber)
        commitWork(fiber)
        break
      }
    }

    fiber = fiber.nextEffect
  }
}

// ========== 插入 DOM ==========
function commitPlacement(finishedWork) {
  // 1. 找到父 DOM 节点
  const parentFiber = getHostParentFiber(finishedWork)
  const parentDOM = parentFiber.stateNode

  // 2. 找到插入位置（兄弟节点）
  const before = getHostSibling(finishedWork)

  // 3. 执行插入
  if (before) {
    parentDOM.insertBefore(finishedWork.stateNode, before)
  } else {
    parentDOM.appendChild(finishedWork.stateNode)
  }
}

// ========== 更新 DOM ==========
function commitWork(finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent: {
      // 执行 useLayoutEffect 的 cleanup
      commitHookEffectListUnmount(HookLayout, finishedWork)
      return
    }
    case HostComponent: {
      const instance = finishedWork.stateNode
      if (instance != null) {
        const newProps = finishedWork.memoizedProps
        const oldProps = finishedWork.alternate?.memoizedProps

        // 更新 DOM 属性
        updateDOMProperties(instance, newProps, oldProps)
      }
      return
    }
  }
}

// ========== 更新 DOM 属性 ==========
function updateDOMProperties(domElement, newProps, oldProps) {
  // 删除旧属性
  for (const propKey in oldProps) {
    if (newProps.hasOwnProperty(propKey) || !oldProps.hasOwnProperty(propKey)) {
      continue
    }
    if (propKey === 'style') {
      domElement.style = {}
    } else if (propKey.startsWith('on')) {
      // 移除事件监听
    } else {
      domElement[propKey] = null
    }
  }

  // 设置新属性
  for (const propKey in newProps) {
    const newValue = newProps[propKey]
    const oldValue = oldProps?.[propKey]

    if (newValue === oldValue) continue

    if (propKey === 'style') {
      // 更新样式
      for (const styleKey in newValue) {
        domElement.style[styleKey] = newValue[styleKey]
      }
    } else if (propKey === 'children') {
      if (typeof newValue === 'string' || typeof newValue === 'number') {
        domElement.textContent = newValue
      }
    } else if (propKey.startsWith('on')) {
      // 绑定事件
      const eventType = propKey.toLowerCase().substring(2)
      domElement.addEventListener(eventType, newValue)
    } else {
      domElement[propKey] = newValue
    }
  }
}

// ========== 删除 DOM ==========
function commitDeletion(root, fiber) {
  // 1. 解绑 ref
  detachFiberRef(fiber)

  // 2. 递归删除子树
  unmountHostComponents(fiber)

  // 3. 从父节点移除 DOM
  const parent = getHostParentFiber(fiber)
  if (parent) {
    removeChild(parent.stateNode, fiber.stateNode)
  }
}

function unmountHostComponents(current) {
  let node = current

  while (true) {
    if (node.tag === ClassComponent) {
      // 调用 componentWillUnmount
      const instance = node.stateNode
      instance.componentWillUnmount()
    } else if (node.tag === FunctionComponent) {
      // 执行 useEffect 的 cleanup
      commitHookEffectListUnmount(HookPassive, node)
    }

    if (node.child !== null) {
      node = node.child
      continue
    }

    if (node === current) {
      return
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === current) {
        return
      }
      node = node.return
    }
    node = node.sibling
  }
}
```

### 3.5 layout 阶段

```javascript
function commitLayoutEffects(finishedWork, root) {
  let fiber = finishedWork

  while (fiber !== null) {
    const flags = fiber.flags

    // 🔹 执行生命周期和 Hook
    if (flags & (Update | Callback)) {
      switch (fiber.tag) {
        case ClassComponent: {
          const instance = fiber.stateNode
          if (fiber.alternate === null) {
            // 首次挂载：componentDidMount
            instance.componentDidMount()
          } else {
            // 更新：componentDidUpdate
            const snapshot = instance.__reactInternalSnapshotBeforeUpdate
            instance.componentDidUpdate(
              fiber.alternate.memoizedProps,
              fiber.alternate.memoizedState,
              snapshot
            )
          }
          break
        }
        case FunctionComponent: {
          // 执行 useLayoutEffect 的 callback
          commitHookEffectListMount(HookLayout, fiber)
          break
        }
      }
    }

    // 🔹 绑定 Ref
    if (flags & Ref) {
      commitAttachRef(fiber)
    }

    fiber = fiber.nextEffect
  }
}

// ========== 绑定 Ref ==========
function commitAttachRef(finishedWork) {
  const ref = finishedWork.ref
  if (ref !== null) {
    const instance = finishedWork.stateNode

    if (typeof ref === 'function') {
      // 函数形式：ref={(node) => this.divRef = node}
      ref(instance)
    } else {
      // 对象形式：ref={this.divRef}
      ref.current = instance
    }
  }
}
```

### 3.6 实际案例：完整更新流程

```javascript
// 初始组件
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build App' }
  ])

  const addTodo = () => {
    setTodos([...todos, { id: 3, text: 'Deploy' }])
  }

  return (
    <div>
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}
```

**点击按钮后的完整流程：**

```
1️⃣ 调度阶段：
   - 用户点击 button
   - 触发 setTodos
   - 创建 Update {lane: SyncLane, action: newTodos}
   - 标记 Fiber 树路径：li → ul → div → TodoApp → root
   - Scheduler 立即调度（SyncLane）

2️⃣ 协调阶段（Render）：

   beginWork(TodoApp):
     - 调用 TodoApp() 函数
     - useState 返回新的 todos（3 个元素）
     - 返回新 ReactElement 树
     - reconcileChildren → 发现 ul 的 children 变化

   beginWork(ul):
     - reconcileChildrenArray：Diff 列表
     - 旧: [li(id=1), li(id=2)]
     - 新: [li(id=1), li(id=2), li(id=3)]
     - 第一轮遍历：li(1) 复用 ✅，li(2) 复用 ✅
     - 第二轮遍历：新增 li(3) → effectTag = Placement

   completeWork(li(id=3)):
     - createInstance：document.createElement('li')
     - li.textContent = 'Deploy'
     - 收集到 effectList

   completeWork(ul):
     - 更新 ul 的 effectList

   最终 effectList：
     li(id=3, Placement) → null

3️⃣ 提交阶段（Commit）：

   before mutation:
     - 无 getSnapshotBeforeUpdate，跳过

   mutation:
     - 遍历 effectList
     - 处理 li(id=3, Placement)
     - commitPlacement:
       → 找到父节点：ul.stateNode (真实 DOM)
       → ul.appendChild(li_3_dom)
       → 真实 DOM 树更新完成！

   切换指针:
     - root.current = workInProgress 树

   layout:
     - 无 useLayoutEffect，跳过
     - 绑定 ref（如果有）

4️⃣ 浏览器绘制：
   - React 让出主线程
   - 浏览器重绘，用户看到新的 "Deploy" 项

5️⃣ 副作用执行（Effect）：
   - 异步执行 useEffect（如果有）
```

---

## 阶段 4: 副作用执行 (Effect)

### 4.1 useEffect 的异步调度

```javascript
// 在 commit 的 layout 阶段结束后调度
function commitRoot(root) {
  // ... before mutation, mutation, layout ...

  // 🔹 调度 useEffect
  if (rootDoesHavePassiveEffects) {
    scheduleCallback(NormalPriority, () => {
      flushPassiveEffects()
      return null
    })
  }
}

// ========== 执行 useEffect ==========
function flushPassiveEffects() {
  // 1. 先执行所有 cleanup 函数
  commitPassiveUnmountEffects(root.current)

  // 2. 再执行所有 effect 函数
  commitPassiveMountEffects(root.current)
}

function commitPassiveUnmountEffects(firstChild) {
  let fiber = firstChild
  while (fiber !== null) {
    if (fiber.tag === FunctionComponent) {
      const updateQueue = fiber.updateQueue
      if (updateQueue !== null) {
        const lastEffect = updateQueue.lastEffect
        if (lastEffect !== null) {
          const firstEffect = lastEffect.next
          let effect = firstEffect
          do {
            const destroy = effect.destroy
            if (destroy !== undefined) {
              destroy() // 执行 cleanup
            }
            effect = effect.next
          } while (effect !== firstEffect)
        }
      }
    }
    fiber = fiber.nextEffect
  }
}

function commitPassiveMountEffects(firstChild) {
  let fiber = firstChild
  while (fiber !== null) {
    if (fiber.tag === FunctionComponent) {
      const updateQueue = fiber.updateQueue
      if (updateQueue !== null) {
        const lastEffect = updateQueue.lastEffect
        if (lastEffect !== null) {
          const firstEffect = lastEffect.next
          let effect = firstEffect
          do {
            const create = effect.create
            effect.destroy = create() // 执行 effect，保存 cleanup
            effect = effect.next
          } while (effect !== firstEffect)
        }
      }
    }
    fiber = fiber.nextEffect
  }
}
```

### 4.2 useEffect vs useLayoutEffect

```javascript
// 执行时机对比
function Component() {
  useLayoutEffect(() => {
    console.log('1. useLayoutEffect')
    return () => console.log('2. useLayoutEffect cleanup')
  })

  useEffect(() => {
    console.log('3. useEffect')
    return () => console.log('4. useEffect cleanup')
  })

  console.log('0. render')
  return <div>Hello</div>
}

// 首次挂载打印顺序：
// 0. render
// 1. useLayoutEffect         ← layout 阶段，同步执行
// (浏览器绘制)
// 3. useEffect               ← 浏览器绘制后，异步执行

// 更新时打印顺序：
// 0. render
// 2. useLayoutEffect cleanup ← layout 阶段，同步执行
// 1. useLayoutEffect
// (浏览器绘制)
// 4. useEffect cleanup       ← 浏览器绘制后，异步执行
// 3. useEffect
```

**选择指南：**

```javascript
// ✅ 使用 useEffect（默认选择）
useEffect(() => {
  // - 数据获取
  // - 订阅事件
  // - 日志上报
  // - 不影响布局的 DOM 操作
}, [])

// ✅ 使用 useLayoutEffect（特殊场景）
useLayoutEffect(() => {
  // - 需要读取 DOM 布局信息
  // - 需要在浏览器绘制前同步更新 DOM（避免闪烁）
  // - 与第三方 DOM 库集成

  const rect = divRef.current.getBoundingClientRect()
  setPosition(rect.top) // 基于 DOM 尺寸的计算
}, [])
```

---

## 关键概念总结

### 1. 为什么 Render 可中断，Commit 不可中断？

```
Render 阶段：
  ✅ 纯计算，无副作用
  ✅ 在 workInProgress 树上工作，不影响屏幕显示
  ✅ 可以被打断后重新开始，丢弃未完成的工作
  ✅ 多次执行同一计算不会有问题

Commit 阶段：
  ❌ 有副作用（DOM 操作、生命周期）
  ❌ 直接影响用户看到的界面
  ❌ 不能执行一半，必须原子性完成
  ❌ 中断会导致 UI 撕裂、状态不一致
```

### 2. 双缓冲的意义

```
就像视频播放的"双缓冲"：
- 前台缓冲区：用户正在看的画面（current 树）
- 后台缓冲区：正在准备的下一帧（workInProgress 树）

后台可以：
  ✅ 慢慢准备（可中断）
  ✅ 反复修改（可重来）
  ✅ 不影响前台显示

准备好后：
  ⚡ 一次性切换指针（root.current = workInProgress）
  ⚡ 用户立即看到完整的新界面，无闪烁
```

### 3. effectList 的作用

```
不用 effectList：
  - 提交阶段需要遍历整棵 Fiber 树
  - 大部分节点没有变化，浪费时间
  - 复杂度 O(n)，n = 所有节点数

使用 effectList：
  - 只遍历有变化的节点（单链表）
  - 复杂度 O(m)，m = 有变化的节点数
  - 通常 m << n，性能提升显著

示例：
  - Fiber 树 10000 个节点
  - 只有 3 个节点变化
  - 不用 effectList：遍历 10000 次
  - 用 effectList：遍历 3 次 ⚡
```

---

## 完整时序图

```
时间线 ────────────────────────────────────────────────────────→

用户点击
  │
  ├─ 调度阶段 (Schedule)
  │   └─ 0-1ms: 创建 Update、计算优先级、Scheduler 调度
  │
  ├─ 协调阶段 (Render) ⚡ 可中断
  │   ├─ 1-10ms: beginWork (遍历、Diff)
  │   ├─ 可能被高优先级任务打断
  │   ├─ 10-15ms: completeWork (创建 DOM、收集 effect)
  │   └─ 构建 effectList
  │
  ├─ 提交阶段 (Commit) ⚠️ 同步，不可中断
  │   ├─ 15-16ms: before mutation
  │   ├─ 16-18ms: mutation (真实 DOM 操作)
  │   ├─ 18ms: 切换 current 指针 ⚡
  │   └─ 18-20ms: layout (useLayoutEffect、ref)
  │
  ├─ 浏览器绘制
  │   └─ 20-36ms: Paint、Composite
  │       用户看到新界面 👀
  │
  └─ 副作用执行 (Effect) ⚡ 异步
      └─ 36-40ms: useEffect (不阻塞绘制)
```

---

## 调试技巧

### 1. 在浏览器中观察更新

```javascript
// 在组件中添加日志
function MyComponent() {
  console.log('🎨 [Render] MyComponent')

  useLayoutEffect(() => {
    console.log('⚡ [Layout] MyComponent')
  })

  useEffect(() => {
    console.log('🌊 [Effect] MyComponent')
  })

  return <div>Hello</div>
}

// 控制台输出：
// 🎨 [Render] MyComponent       ← Render 阶段
// ⚡ [Layout] MyComponent       ← Commit.layout 阶段
// (界面已更新)
// 🌊 [Effect] MyComponent       ← 异步 Effect 阶段
```

### 2. React DevTools Profiler

```javascript
import { Profiler } from 'react'

;<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>

function onRenderCallback(
  id, // "App"
  phase, // "mount" 或 "update"
  actualDuration, // 本次渲染耗时
  baseDuration, // 理想耗时（无 memo）
  startTime, // 开始时间
  commitTime // 提交时间
) {
  console.log(`${id} ${phase} took ${actualDuration}ms`)
}
```

### 3. 断点调试源码

```javascript
// 在 React 源码中打断点的位置：
// 1. packages/react-reconciler/src/ReactFiberWorkLoop.js
//    - performUnitOfWork (工作循环)
//    - beginWork (向下遍历)
//    - completeWork (向上回溯)

// 2. packages/react-reconciler/src/ReactFiberCommitWork.js
//    - commitMutationEffects (DOM 操作)
//    - commitLayoutEffects (生命周期)

// 3. packages/scheduler/src/Scheduler.js
//    - scheduleCallback (任务调度)
//    - workLoop (时间切片)
```

---

## 总结

### React 更新的核心思想

1. **分层架构**：调度、协调、渲染分离
2. **异步可中断**：Render 阶段可中断，Commit 原子性
3. **优先级调度**：紧急任务优先，非紧急任务可延迟
4. **双缓冲**：后台准备，前台展示，一次性切换
5. **增量更新**：时间切片，避免长任务阻塞主线程

### 关键优化点

- ⚡ Fiber 架构：可中断 + 链表结构
- ⚡ Diff 算法：最小化 DOM 操作
- ⚡ effectList：只处理变化的节点
- ⚡ 批处理：合并多次 setState
- ⚡ Lane 模型：精细化优先级控制

### 最佳实践

1. 使用 `startTransition` 区分紧急/非紧急更新
2. 使用 `useDeferredValue` 延迟昂贵计算
3. 避免在 Render 阶段执行副作用
4. 为 `useEffect` 提供正确的 cleanup
5. 使用 React DevTools Profiler 分析性能

---

**扩展阅读：**

- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
- [React 18 并发特性](https://react.dev/blog/2022/03/29/react-v18)
- [Deep Dive: Reconciliation](https://react.dev/learn/reconciliation)
