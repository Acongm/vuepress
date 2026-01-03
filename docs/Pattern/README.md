# 跨组件通信模式合集

本目录包含 **7 种无第三方依赖** 的跨组件通信模式实现。为了“保留各模式最合适的调用方式”，每种模式对外导出的 API **不强求一致**（例如 EventBus 使用 `on/emit`，Store 使用 `setState`，ProxyStore 暴露 `state`）。

---

## 📋 模式总览

| #   | 模式           | 核心文件                                                                        | 文档                                   | 特点                 | 最佳场景         |
| --- | -------------- | ------------------------------------------------------------------------------- | -------------------------------------- | -------------------- | ---------------- |
| 1   | **发布订阅**   | [SharedStateBridgeSingleton.ts](./ServiceRequest/SharedStateBridgeSingleton.md) | [README](./ServiceRequest/README.md)   | 完全解耦，多对多通信 | 工单系统、微前端 |
| 2   | **观察者**     | [ObserverSingleton.ts](./Observer/ObserverSingleton.md)                         | [README](./Observer/README.md)         | 一对多依赖关系       | 数据驱动更新     |
| 3   | **事件总线**   | [EventBusSingleton.ts](./EventBus/EventBusSingleton.md)                         | [README](./EventBus/README.md)         | 简单直接，on/emit    | 全局事件通知     |
| 4   | **状态容器**   | [StoreSingleton.ts](./Store/StoreSingleton.md)                                  | [README](./Store/README.md)            | 状态快照，批量更新   | 简单状态管理     |
| 5   | **广播通道**   | [BroadcastSingleton.ts](./BroadcastChannel/BroadcastSingleton.md)               | [README](./BroadcastChannel/README.md) | 跨标签页同步         | 多标签页/iframe  |
| 6   | **自定义事件** | [CustomEventSingleton.ts](./CustomEvent/CustomEventSingleton.md)                | [README](./CustomEvent/README.md)      | 原生 DOM API         | 跨框架通信       |
| 7   | **代理模式**   | [ProxyStoreSingleton.ts](./ProxyStore/ProxyStoreSingleton.md)                   | [README](./ProxyStore/README.md)       | 透明响应式操作       | Vue3/Valtio 风格 |

---

## 🔗 入口文件约定

每种模式都有一个 `*Singleton.ts` 作为默认入口（也会额外导出底层实例供高级用法）。

---

## 🎯 模式选择指南

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        如何选择通信模式？                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  需要跨浏览器标签页通信？                                            │
│     └── 是 → 广播通道 (BroadcastChannel)                             │
│                                                                      │
│  需要跨框架通信（React + Vue + Angular）？                           │
│     └── 是 → 自定义事件 (CustomEvent)                                │
│                                                                      │
│  需要透明响应式（类似 Vue3）？                                       │
│     └── 是 → 代理模式 (ProxyStore)                                   │
│                                                                      │
│  需要状态快照/批量更新？                                             │
│     └── 是 → 状态容器 (Store)                                        │
│                                                                      │
│  动态加载组件/微前端场景？                                           │
│     └── 是 → 发布订阅 (ServiceRequest)                               │
│                                                                      │
│  简单的全局事件通知？                                                │
│     └── 是 → 事件总线 (EventBus)                                     │
│                                                                      │
│  一对多的数据依赖关系？                                              │
│     └── 是 → 观察者 (Observer)                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 目录结构

```text
Pattern/
├── README.md                          # 本文档
│
├── ServiceRequest/                    # 1. 发布订阅模式
│   ├── Registry.ts                    # 通用注册表
│   ├── SharedStateBridge.ts           # 发布订阅核心类
│   ├── SharedStateBridgeSingleton.ts  # 单例导出 ⭐
│   └── README.md                      # 使用文档
│
├── Observer/                          # 2. 观察者模式
│   ├── Subject.ts                     # 被观察者核心类
│   ├── ObserverSingleton.ts           # 单例导出 ⭐
│   └── README.md                      # 使用文档
│
├── EventBus/                          # 3. 事件总线
│   ├── EventBus.ts                    # 事件总线核心类
│   ├── EventBusSingleton.ts           # 单例导出 ⭐
│   └── README.md                      # 使用文档
│
├── Store/                             # 4. 状态容器
│   ├── Store.ts                       # 状态容器核心类
│   ├── StoreSingleton.ts              # 单例导出 ⭐
│   └── README.md                      # 使用文档
│
├── BroadcastChannel/                  # 5. 广播通道
│   ├── BroadcastBridge.ts             # 广播桥接核心类
│   ├── BroadcastSingleton.ts          # 单例导出 ⭐
│   └── README.md                      # 使用文档
│
├── CustomEvent/                       # 6. 自定义事件
│   ├── CustomEventBridge.ts           # 自定义事件核心类
│   ├── CustomEventSingleton.ts        # 单例导出 ⭐
│   └── README.md                      # 使用文档
│
└── ProxyStore/                        # 7. 代理模式
    ├── ProxyStore.ts                  # 代理存储核心类
    ├── ProxyStoreSingleton.ts         # 单例导出 ⭐
    └── README.md                      # 使用文档
```

---

## 📊 模式对比

### 功能对比

| 特性       | 发布订阅 | 观察者 | 事件总线 | 状态容器 | 广播通道 | 自定义事件 | 代理模式 |
| ---------- | :------: | :----: | :------: | :------: | :------: | :--------: | :------: |
| 完全解耦   |    ✅    |   ⚠️   |    ✅    |    ✅    |    ✅    |     ✅     |    ✅    |
| 多对多通信 |    ✅    |   ❌   |    ✅    |    ✅    |    ✅    |     ✅     |    ✅    |
| 跨标签页   |    ❌    |   ❌   |    ❌    |    ❌    |    ✅    |     ❌     |    ❌    |
| 跨框架     |    ✅    |   ✅   |    ✅    |    ✅    |    ✅    |     ✅     |    ✅    |
| 状态缓存   |    ✅    |   ✅   |    ✅    |    ✅    |    ✅    |     ✅     |    ✅    |
| 状态快照   |    ❌    |   ❌   |    ❌    |    ✅    |    ❌    |     ❌     |    ✅    |
| 透明操作   |    ❌    |   ❌   |    ❌    |    ❌    |    ❌    |     ❌     |    ✅    |
| 一次性订阅 |    ❌    |   ❌   |    ✅    |    ❌    |    ❌    |     ✅     |    ❌    |

### 浏览器兼容性

| 模式       | Chrome | Firefox | Safari | Edge | IE  |
| ---------- | :----: | :-----: | :----: | :--: | :-: |
| 发布订阅   |   ✅   |   ✅    |   ✅   |  ✅  | ✅  |
| 观察者     |   ✅   |   ✅    |   ✅   |  ✅  | ✅  |
| 事件总线   |   ✅   |   ✅    |   ✅   |  ✅  | ✅  |
| 状态容器   |   ✅   |   ✅    |   ✅   |  ✅  | ✅  |
| 广播通道   |  54+   |   38+   | 15.4+  | 79+  | ❌  |
| 自定义事件 |   ✅   |   ✅    |   ✅   |  ✅  | 9+  |
| 代理模式   |  49+   |   18+   |  10+   | 12+  | ❌  |

---

## 🔧 各模式详解

### 1️⃣ 发布订阅模式 (Pub/Sub)

> 📁 [ServiceRequest/](./ServiceRequest/) | 📄 [文档](./ServiceRequest/README.md)

**核心文件**：

- [SharedStateBridge.ts](./ServiceRequest/SharedStateBridge.md) - 发布订阅核心类
- [SharedStateBridgeSingleton.ts](./ServiceRequest/SharedStateBridgeSingleton.md) - 单例导出

**原理**：通过中间调度中心解耦发布者和订阅者，支持多对多通信。

```typescript
import {
  publishSharedData,
  subscribeSharedData
} from './ServiceRequest/SharedStateBridgeSingleton'

// 发布
publishSharedData('user.profile', { name: 'John' })

// 订阅
subscribeSharedData('user.profile', (data) => {
  console.log('Profile updated:', data)
})
```

---

### 2️⃣ 观察者模式 (Observer)

> 📁 [Observer/](./Observer/) | 📄 [文档](./Observer/README.md)

**核心文件**：

- [Subject.ts](./Observer/Subject.md) - 被观察者（Subject）类
- [ObserverSingleton.ts](./Observer/ObserverSingleton.md) - 单例导出

**原理**：被观察者维护观察者列表，状态变化时直接通知所有观察者。

```typescript
import { subject } from './Observer/ObserverSingleton'

const counter$ = subject<number>('counter')
counter$.attach((value) => console.log(value))
counter$.notify(10)
```

**vs 发布订阅**：观察者直接依赖被观察者，发布订阅通过中间调度。

---

### 3️⃣ 事件总线 (Event Bus)

> 📁 [EventBus/](./EventBus/) | 📄 [文档](./EventBus/README.md)

**核心文件**：

- [EventBus.ts](./EventBus/EventBus.md) - 事件总线核心类
- [EventBusSingleton.ts](./EventBus/EventBusSingleton.md) - 单例导出

**原理**：集中式事件管理，经典的 on/emit 模式。

```typescript
import { on, emit, once } from './EventBus/EventBusSingleton'

// 一次性订阅
once('app:ready', () => {
  console.log('App initialized!')
})

emit('app:ready', true)

// 普通订阅
on('app:ready', (ready) => console.log('ready?', ready))
```

---

### 4️⃣ 状态容器 (Singleton Store)

> 📁 [Store/](./Store/) | 📄 [文档](./Store/README.md)

**核心文件**：

- [Store.ts](./Store/Store.md) - 状态容器核心类
- [StoreSingleton.ts](./Store/StoreSingleton.md) - 单例导出

**原理**：单例状态对象 + 订阅机制，支持状态快照和批量更新。

```typescript
import { setState, getSnapshot, batchUpdate } from './Store/StoreSingleton'

// 批量更新
batchUpdate({
  'user.name': 'John',
  'user.age': 30,
  theme: 'dark'
})

// 单点更新
setState('user.name', 'John')

// 获取快照
console.log(getSnapshot())
```

---

### 5️⃣ 广播通道 (Broadcast Channel)

> 📁 [BroadcastChannel/](./BroadcastChannel/) | 📄 [文档](./BroadcastChannel/README.md)

**核心文件**：

- [BroadcastBridge.ts](./BroadcastChannel/BroadcastBridge.md) - 广播桥接核心类
- [BroadcastSingleton.ts](./BroadcastChannel/BroadcastSingleton.md) - 单例导出

**原理**：浏览器原生 BroadcastChannel API，支持跨标签页通信。

```typescript
import { publish, subscribe } from './BroadcastChannel/BroadcastSingleton'

// 标签页 A：发布
publish('session', { userId: 123 })

// 标签页 B：自动收到
subscribe('session', (session) => {
  console.log('Session synced:', session)
})
```

⚠️ **注意**：仅同源页面可通信，不支持 IE。

---

### 6️⃣ 自定义事件 (Custom Events)

> 📁 [CustomEvent/](./CustomEvent/) | 📄 [文档](./CustomEvent/README.md)

**核心文件**：

- [CustomEventBridge.ts](./CustomEvent/CustomEventBridge.md) - 自定义事件核心类
- [CustomEventSingleton.ts](./CustomEvent/CustomEventSingleton.md) - 单例导出

**原理**：原生 DOM CustomEvent + dispatchEvent。

```typescript
import { dispatch, on } from './CustomEvent/CustomEventSingleton'

// React 组件发布
dispatch('button:clicked', { from: 'react' })

// Vue 组件订阅
on('button:clicked', (data) => {
  console.log('Received:', data)
})
```

**适用**：跨框架通信（React + Vue + Angular）、微前端。

---

### 7️⃣ 代理模式 (Proxy Store)

> 📁 [ProxyStore/](./ProxyStore/) | 📄 [文档](./ProxyStore/README.md)

**核心文件**：

- [ProxyStore.ts](./ProxyStore/ProxyStore.md) - 代理存储核心类
- [ProxyStoreSingleton.ts](./ProxyStore/ProxyStoreSingleton.md) - 单例导出

**原理**：ES6 Proxy 拦截读写操作，自动触发响应。

```typescript
import { state, subscribe } from './ProxyStore/ProxyStoreSingleton'

// 订阅
subscribe('count', (value) => console.log('Count:', value))

// 直接赋值，自动触发订阅
state.count = 10 // 输出: Count: 10
state.count++ // 输出: Count: 11
```

**风格**：类似 Vue 3 响应式 / Valtio。

---

## 🪝 React Hook 建议

由于各模式的 API 设计不同（这是刻意的），更推荐在业务侧针对“你选择的那种模式”写一个非常薄的 Hook 适配层。

---

## 📚 扩展阅读

- [观察者模式 vs 发布订阅模式](./Observer/README.md#与发布订阅模式的区别)
- [React 状态管理对比](./ServiceRequest/README.md#react-状态管理-vs-发布订阅模式对比)
- [微前端通信方案](./CustomEvent/README.md#微前端通信)
