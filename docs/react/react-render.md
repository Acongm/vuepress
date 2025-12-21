# React 的渲染流程

现在我们从 **React 源码角度**（以 **React 18+** 为主，基于 `react-reconciler` 和 `react-dom`）系统性地讲解 **React 从 `createRoot().render(<App />)` 到真实 DOM 渲染完成的完整流程**。

我们将聚焦 **Fiber 架构下的核心机制**，涵盖：初始化、调度、渲染（render 阶段）、提交（commit 阶段）、副作用处理等，同时说明关键函数（如 `beginWork`、`completeWork`、`commitRoot`）的作用和调用时机。

---

## 🌟 一句话概括 React 渲染流程：

> **触发更新 → 创建 Fiber 树（workInProgress）→ 协调（reconcile）生成 Effect 链表 → 提交（commit）更新真实 DOM → 执行生命周期/副作用**

整个过程分为两个大阶段：

- **Render Phase**（可中断、异步，构建 Fiber 树 + Effect list）
- **Commit Phase**（不可中断、同步，操作 DOM + 执行副作用）

---

## 一、整体架构图（文字版）

```text
[createRoot().render(<App />)]
         ↓
scheduleUpdateOnFiber(fiber, update)  ← 触发更新
         ↓
ensureRootIsScheduled(root)           ← 调度器介入
         ↓
workLoopConcurrent() 或 workLoopSync()
         │
         ├─▶ performUnitOfWork(fiber)
         │        ↓
         │    beginWork(fiber)         ← 向下协调，处理子节点
         │        ↓
         │    reconcileChildren()      ← diff 新旧 children，创建子 Fiber
         │
         └─▶ completeUnitOfWork(fiber)
                  ↓
              completeWork(fiber)      ← 向上收尾，收集 DOM 副作用
                  ↓
              构建 effectList（链表：nextEffect）
         ↓
所有 Fiber 处理完？ → 是
         ↓
commitRoot(root)
         ↓
commitMutationEffects(root)        ← 执行 DOM 插入/更新/删除
         ↓
commitLayoutEffects(root)          ← 执行 useLayoutEffect / componentDidMount
         ↓
schedulePassiveEffects()           ← 异步调度 useEffect（微任务）
```

---

## 二、分步详解（结合源码逻辑）

### 步骤 1️⃣：初始化根容器（createRoot）

```js
const root = ReactDOM.createRoot(container)
root.render(<App />)
```

**源码位置**：`packages/react-dom/src/client/ReactDOMRoot.js`

- 创建 **FiberRoot**（全局根对象，包含 current Fiber 树）
- 创建 **root Fiber**（type = HostRoot，tag = HostRoot）
- 调用 `updateContainer(<App />, root)` → 创建一个 **Update 对象** 并入队

> ✅ `FiberRoot` 是 React 的“调度单元”，`root.current` 指向当前显示的 Fiber 树。

---

### 步骤 2️⃣：调度更新（Scheduler 介入）

**函数**：`scheduleUpdateOnFiber(fiber, update)` → `ensureRootIsScheduled(root)`

- 判断是否并发模式（`createRoot`）→ 使用 `Scheduler` 调度
- 调用 `scheduleCallback(priorityLevel, workLoop)`
  - 底层用 `MessageChannel` 模拟 `requestIdleCallback`
  - 把 `workLoopConcurrent` 放入微任务/宏任务队列

> 💡 此时 **还没有开始渲染**，只是“安排了一个任务”。

---

### 步骤 3️⃣：工作循环（workLoop）

```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

- `workInProgress`：当前正在构建的 Fiber 节点（WIP 树）
- `shouldYield()`：检查是否该让出主线程（基于 5ms 时间片）

---

### 步骤 4️⃣：performUnitOfWork → beginWork（向下）

```js
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  const current = unitOfWork.alternate
  let next = beginWork(current, unitOfWork, subtreeRenderLanes)

  if (next === null) {
    // 没有子节点 → 完成当前节点
    completeUnitOfWork(unitOfWork)
  }
  return next // 返回 child，继续向下
}
```

#### 🔍 `beginWork` 做了什么？

**源码位置**：`packages/react-reconciler/src/ReactFiberBeginWork.js`

- 根据 `fiber.tag` 类型处理：
  - `FunctionComponent` → 调用 `renderWithHooks()` → 执行你的函数组件
  - `HostComponent`（如 `div`）→ 准备 props
- 调用 `reconcileChildren(current, workInProgress, nextChildren)`
  - **核心 diff 逻辑**：对比新旧 children，复用/创建/删除 Fiber
  - 使用 key 优化（类似 Vue）
  - 返回 `workInProgress.child`

> ✅ 此阶段 **不操作 DOM**，只构建新的 Fiber 树（WIP 树）。

---

### 步骤 5️⃣：completeUnitOfWork → completeWork（向上）

当一个 Fiber 节点没有子节点（或子节点已处理完），开始回溯：

```js
function completeUnitOfWork(unitOfWork: Fiber): void {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    completeWork(current, completedWork, subtreeRenderLanes);

    // 构建 effect list（用于 commit 阶段）
    const next = /* sibling or parent */;
    completedWork = next;
  } while (completedWork !== null);
}
```

#### 🔍 `completeWork` 做了什么？

**源码位置**：`packages/react-reconciler/src/ReactFiberCompleteWork.js`

- 对 `HostComponent`（如 `div`）：
  - 调用 `createInstance(type, props)` → **创建 DOM 节点描述**（非真实创建）
  - 调用 `appendAllChildren(instance, completedWork)` → 把子 DOM 挂到自己
  - 设置 `fiber.stateNode = instance`
- 标记副作用：
  - `Placement`（需要插入）
  - `Update`（需要更新属性）
  - `Deletion`（需要删除）
- 构建 `effectList` 链表（通过 `nextEffect` 指针）

> ✅ 此阶段 **收集所有 DOM 操作**，但 **仍未操作真实 DOM**。

---

### 步骤 6️⃣：提交阶段（Commit Phase）

当整棵 WIP 树构建完成，进入 **不可中断的同步阶段**：

```js
function commitRoot(root) {
  // 1. before mutation（快照）
  commitBeforeMutationEffects(root)

  // 2. mutation（操作 DOM）
  commitMutationEffects(root, rootFiber, lanes)

  // 3. layout（同步副作用）
  commitLayoutEffects(root, lanes)

  // 4. 调度 passive effects（useEffect）
  schedulePassiveEffects()
}
```

#### 🧨 6.1 commitMutationEffects（真实 DOM 操作）

- 遍历 `effectList`
- 根据 `effectTag` 执行：
  - `Placement` → `parent.appendChild(child.stateNode)`
  - `Update` → `updateDOMProperties(oldProps, newProps)`
  - `Deletion` → `parent.removeChild(child.stateNode)`

#### 🧪 6.2 commitLayoutEffects

- 执行 `useLayoutEffect` 回调
- 执行 Class 组件的 `componentDidMount` / `componentDidUpdate`
- **此时 DOM 已更新，可读取布局**

#### ⏳ 6.3 schedulePassiveEffects

- 用 `Scheduler.scheduleCallback(NormalPriority, flushPassiveEffects)`
- 在 **下一个宏任务**（或微任务）中执行 `useEffect`
- **避免阻塞 paint**

---

### 步骤 7️⃣：双缓冲切换（Double Buffering）

- 提交完成后：
  ```js
  root.current = finishedWork // WIP 树变成 current 树
  ```
- 下次更新时，新的 WIP 树会复用 `current.alternate`

> ✅ 避免内存抖动，高效复用 Fiber 节点。

---

## 三、关键数据结构回顾

### Fiber 节点核心字段

```ts
interface Fiber {
  tag: WorkTag // FunctionComponent, HostComponent...
  type: any // 组件类型或 'div'
  stateNode: any // 真实 DOM 或组件实例
  return: Fiber | null // 父
  child: Fiber | null // 第一个子
  sibling: Fiber | null // 下一个兄弟
  alternate: Fiber | null // 双缓冲指针
  effectTag: number // Placement | Update | Deletion
  nextEffect: Fiber | null // Effect 链表
}
```

### Effect 链表

- 所有有副作用的 Fiber 节点通过 `nextEffect` 串成单链表
- commit 阶段只需遍历该链表，无需遍历整棵树

---

## 四、结合你的项目场景（my-ticket-agent）

你在渲染动态表单：

```tsx
{
  fields.map((f) => <TicketField key={f.id} config={f} />)
}
```

1. 当 `fields` 更新 → 触发 `setState`
2. React 进入 `beginWork` → 执行你的组件函数 → 得到新 children
3. `reconcileChildren` 对比新旧 `fields`：
   - 复用已有 `<TicketField>` Fiber（靠 key）
   - 标记新增/删除
4. `completeWork` 为每个字段收集 DOM 操作
5. `commitMutationEffects` 批量更新 DOM
6. `useEffect` 最后执行（可用于日志/埋点）

> 💡 因为 React **不知道具体哪变了**，所以默认会重新执行整个组件函数（除非 `memo` 优化）。

---

## 五、关键源码文件速查（React 18）

| 功能           | 源码路径                                     |
| -------------- | -------------------------------------------- |
| Fiber 工作循环 | `react-reconciler/src/ReactFiberWorkLoop.js` |
| beginWork      | `ReactFiberBeginWork.js`                     |
| completeWork   | `ReactFiberCompleteWork.js`                  |
| commit 阶段    | `ReactFiberCommitWork.js`                    |
| 调度器         | `scheduler/src/Scheduler.js`                 |
| React DOM 入口 | `react-dom/src/client/ReactDOMRoot.js`       |

---

## ✅ 总结：React 渲染三阶段

| 阶段           | 是否可中断 | 主要工作                         | 关键函数                                       |
| -------------- | ---------- | -------------------------------- | ---------------------------------------------- |
| **Render**     | ✅         | 构建 Fiber 树、diff、收集 effect | `beginWork`, `completeWork`                    |
| **Pre-commit** | ❌         | 快照（getSnapshotBeforeUpdate）  | `commitBeforeMutationEffects`                  |
| **Commit**     | ❌         | 操作 DOM、执行副作用             | `commitMutationEffects`, `commitLayoutEffects` |

---

如果你希望，我可以：

- 提供一个 **极简 React Fiber 模拟器**（< 100 行 JS，演示 beginWork/completeWork）
- 对比 **React 和 Vue 在动态表单更新时的性能差异**
- 或深入讲解 **并发模式下的 Suspense / Transition 如何影响此流程**
