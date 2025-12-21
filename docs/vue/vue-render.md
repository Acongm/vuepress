# Vue 的渲染流程

理解 **Vue 的渲染流程**能帮你横向对比两大框架的设计哲学。Vue（特别是 Vue 3）的响应式 + 渲染机制非常精巧，且与 React 的“调度优先”不同，它更偏向 **“依赖收集 + 精准更新”**。

下面我会从 **Vue 3 源码角度**，系统讲解 **从模板（template）到真实 DOM 的完整渲染流程**，包括响应式、编译、虚拟 DOM、patch 等核心环节。

> ✅ 适用于：使用 Vue 3（Composition API + `<script setup>`）的开发者  
> 🔍 源码基于：`vue@3.4+`（基于 `packages/runtime-core` 和 `packages/compiler-core`）

---

## 🌟 一句话概括 Vue 渲染流程：

> **模板 → 编译成 render 函数 → 执行 render 生成 VNode → patch VNode 到真实 DOM → 响应式依赖收集 → 数据变化时精准更新**

整个过程分为两大阶段：**初次渲染（mount）** 和 **更新渲染（update）**。

---

## 一、整体架构图（文字版）

```text
[template / JSX]
       ↓
[模板编译器（compiler-core）]
       ↓
生成 render 函数（返回 VNode 树）
       ↓
[响应式系统（reactivity）]
       ↓
执行 render → 触发依赖收集（track）
       ↓
调用 render 函数 → 得到 VNode
       ↓
[渲染器（renderer）]
       ↓
patch(oldVNode, newVNode) → 调用 mount/patch
       ↓
创建/更新真实 DOM（hostCreateElement 等）
       ↓
[完成渲染]
```

当数据变化：

```text
[响应式数据 setter]
       ↓
trigger → 通知 effect（即组件的 render 函数）
       ↓
重新执行 render → 新 VNode
       ↓
patch(oldVNode, newVNode) → 只更新差异部分
```

---

## 二、详细分步讲解

### 1️⃣ 第一步：模板编译（Compile）

> ⚠️ 仅 SFC（.vue 文件）或使用 `template` 选项时发生；JSX 或手写 render 函数可跳过。

**源码位置**：`packages/compiler-core`

```vue
<template>
  <div>{{ title }}</div>
  <input v-model="name" />
</template>
```

→ 编译后（简化）：

```js
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createBlock('div', null, [
      _toDisplayString(_ctx.title),
      _createVNode('input', {
        'onUpdate:modelValue': ($event) => (_ctx.name = $event)
      })
    ])
  )
}
```

**关键函数**：

- `compile(template)` → 生成 AST → 优化（静态提升、缓存）→ 生成 render 函数字符串
- `generate(ast)` → 输出可执行的 render 函数

> ✅ Vue 的编译时优化（如静态节点提升、事件缓存）让运行时更轻量。

---

### 2️⃣ 第二步：创建组件实例 & 响应式系统

**源码位置**：`packages/reactivity` + `packages/runtime-core/src/component.ts`

当你调用 `createApp(App).mount('#app')`：

1. **创建根组件实例（component instance）**

   - 包含 `setupState`（来自 `setup()` 的返回值）
   - `props`、`slots`、`refs` 等

2. **对数据做响应式处理**

   ```js
   // setup() 中
   const name = ref('cpeng')
   const user = reactive({ age: 30 })
   ```

   - `ref` → 包装成 `{ value: ... }` + getter/setter 收集依赖
   - `reactive` → 用 `Proxy` 拦截 get/set

3. **关键：effect（副作用）**
   - 组件的 **render 函数被包裹在 effect 中**
   ```js
   effect(() => {
     instance.update() // 即重新执行 render
   })
   ```

---

### 3️⃣ 第三步：初次渲染（Mount）

**源码位置**：`packages/runtime-core/src/renderer.ts`

#### 3.1 调用 render 函数

- 执行 `render()` → 返回 VNode 树（虚拟 DOM）
- **此时触发依赖收集（track）**：
  - 访问 `title` → 记录：“这个 render 函数依赖 title”
  - 访问 `name` → 记录：“这个 render 函数依赖 name”

#### 3.2 调用 patch（初次为 mount）

```ts
patch(null, vnode, container, anchor, parentComponent, ...);
```

- 因为 oldVNode 为 `null`，走 `mountElement` 分支

#### 3.3 创建真实 DOM

- 调用 `hostCreateElement('div')`（平台相关，浏览器中就是 `document.createElement`）
- 递归挂载子节点
- 设置文本内容、属性、事件监听器

> 💡 Vue 的 VNode 结构（简化）：
>
> ```ts
> interface VNode {
>   type: string | Component // 'div' 或 MyComponent
>   props: Record<string, any> | null
>   children: VNode[] | string | null
>   el: Element | null // 真实 DOM 引用（mount 后赋值）
>   shapeFlag: number // 标记类型（文本？组件？）
> }
> ```

---

### 4️⃣ 第四步：响应式更新（Reactivity → Render → Patch）

当你修改数据：

```js
name.value = 'new name'
```

#### 4.1 触发 setter（reactivity）

- `ref` 的 setter 被调用 → 调用 `trigger(target, 'set', key)`
- 找到所有依赖这个 `name` 的 **effect**（即组件的 render 函数）

#### 4.2 调度更新（scheduler）

- Vue 默认使用 **异步更新队列**（类似 React 的 setState 批处理）
- 将 `instance.update` 放入 `queueJob`
- 下一 tick（`Promise.resolve().then`）批量执行

> ✅ 优势：多次修改只触发一次 render

#### 4.3 重新 render + patch

- 再次执行 render → 新 VNode
- 调用 `patch(oldVNode, newVNode, ...)`
- 进入 **diff 算法**（Vue 的 diff 是“同层比较 + key 优化”）

##### Vue 的 patch 核心逻辑：

```ts
if (oldVNode.type === newVNode.type) {
  // 类型相同 → 更新
  patchElement(oldVNode, newVNode)
} else {
  // 类型不同 → 卸载旧节点，挂载新节点
  unmount(oldVNode)
  mount(newVNode)
}
```

##### 对于文本节点：

- 直接 `textContent = newVNode.children`

##### 对于元素节点：

- 更新 props（class/style/事件等）
- 递归 patch children

##### 对于组件：

- 调用子组件的 render，递归整个流程

---

## 三、Vue vs React Fiber 关键差异

| 维度           | Vue 3                                     | React Fiber                                    |
| -------------- | ----------------------------------------- | ---------------------------------------------- |
| **更新驱动**   | 响应式依赖（精准知道谁变了）              | 调度 + 优先级（不知道具体哪变，需重新 render） |
| **渲染中断**   | ❌ 不可中断（更新是同步的，但异步调度）   | ✅ 可中断（Fiber + Scheduler）                 |
| **编译优化**   | ✅ 编译时做大量优化（静态提升、事件缓存） | ❌ 主要靠运行时（React Compiler 在实验中）     |
| **VNode 生成** | 编译时生成 render 函数                    | 运行时每次 render() 调用生成                   |
| **性能模型**   | “谁变了就更新谁”                          | “重新 render + diff 找差异”                    |

> 💡 Vue 更像“精准外科手术”，React 更像“全量扫描 + 智能调度”。

---

## 四、关键源码文件速查（Vue 3）

| 功能       | 源码路径                                                      |
| ---------- | ------------------------------------------------------------- |
| 响应式系统 | `packages/reactivity/src/`                                    |
| 渲染器核心 | `packages/runtime-core/src/renderer.ts`                       |
| VNode 处理 | `packages/runtime-core/src/vnode.ts`                          |
| 组件实例   | `packages/runtime-core/src/component.ts`                      |
| 模板编译   | `packages/compiler-core/src/`                                 |
| patch 算法 | `renderer.ts` 中的 `patch`, `processElement`, `patchChildren` |

---

## 五、举个你熟悉的例子：动态表单

你在 Vue 中写：

```vue
<template>
  <Form>
    <FormItem v-for="f in fields" :key="f.id" :type="f.type" />
  </template>
```

1. `fields` 是 `ref([])`
2. 编译后 render 函数会访问 `fields.value`
3. 首次 render → `track(fields, 'get', 'value')`
4. 当 `fields.value.push(...)` → `trigger` → 重新 render
5. patch 时：
   - 比较新旧 `fields` 列表
   - 利用 `key` 做高效 diff（移动/新增/删除）
   - 只更新变化的 `<FormItem>`

> ✅ 因为 Vue 知道 **是 `fields` 变了**，所以只重新 render 这个组件（或子树），不像 React 默认会从根开始 render（除非 memo）。

---

## ✅ 总结

Vue 的渲染流程 = **编译 + 响应式 + VNode + patch**，核心优势在于：

1. **编译时优化** → 运行时更轻
2. **依赖收集** → 更新更精准
3. **异步更新队列** → 避免重复 render

而 React Fiber 的优势在于 **可中断调度 + 并发能力**，适合复杂交互场景。

---

如果你想，我可以：

- 画一张 **Vue 响应式 + 渲染的协作图**
- 对比 **Vue 和 React 在你的 “my-ticket-agent” 表单场景下的更新行为**
- 或者深入讲解 **Vue 的 patchChildren diff 算法（带 key vs 不带 key）**
