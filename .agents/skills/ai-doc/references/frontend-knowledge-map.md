# 前端知识图谱 (Frontend Knowledge Map)

> 独立于项目的通用前端知识分类体系，可用于学习路径规划、知识盲区发现、面试准备

---

## 一、完整知识体系架构

```
🌐 前端技术栈
│
├── 📚 编程语言基础
│   ├── JavaScript
│   │   ├── ES6+ 语法 (let/const, 箭头函数, 解构, 模板字符串)
│   │   ├── 原型与原型链 (prototype, __proto__, 继承)
│   │   ├── 闭包与作用域 (词法作用域, 执行上下文)
│   │   ├── this 指向 (call/apply/bind, 隐式/显式绑定)
│   │   ├── 异步编程 (Promise, async/await, 事件循环)
│   │   ├── 模块化 (ESM, CommonJS, UMD, AMD)
│   │   └── 新特性 (ES2020-2024, 装饰器, 私有字段)
│   │
│   ├── TypeScript
│   │   ├── 基础类型 (原始类型, 数组, 元组, 枚举)
│   │   ├── 高级类型 (联合, 交叉, 映射, 条件)
│   │   ├── 泛型 (约束, 推断, 工具类型)
│   │   ├── 类型体操 (infer, 递归类型, 模板字面量)
│   │   └── 工程治理 (tsconfig, 声明文件, 类型安全)
│   │
│   └── CSS
│       ├── 布局 (Flexbox, Grid, 定位, BFC)
│       ├── 选择器与优先级 (特异性, 层叠, 继承)
│       ├── 动画 (transition, animation, keyframes)
│       ├── 响应式 (媒体查询, 视口单位, 容器查询)
│       ├── 预处理器 (Sass/SCSS, Less, PostCSS)
│       └── CSS-in-JS / 原子化 (styled-components, Tailwind)
│
├── 🏗️ 前端框架生态
│   ├── React
│   │   ├── Hooks (useState, useEffect, useRef, 自定义 Hook)
│   │   ├── 状态管理 (Redux, Zustand, Jotai, Recoil)
│   │   ├── 性能优化 (useMemo, useCallback, React.memo)
│   │   ├── 核心原理 (Fiber, 调度器, Diff 算法, 合成事件)
│   │   ├── 生态 (React Router, React Query, Next.js)
│   │   └── React 19 (use, Actions, Server Components)
│   │
│   ├── Vue
│   │   ├── 选项式 vs 组合式 API (setup, ref, reactive)
│   │   ├── 响应式原理 (Proxy, track/trigger, effect)
│   │   ├── 状态管理 (Pinia, Vuex)
│   │   ├── 生态 (Vue Router, Nuxt.js, VueUse)
│   │   └── Vue 3 新特性 (Teleport, Suspense, 多根组件)
│   │
│   └── 设计模式
│       ├── 组件模式 (HOC, Render Props, Compound)
│       ├── 通信模式 (EventBus, 观察者, 发布订阅)
│       ├── 状态模式 (Flux, MVVM, 单向数据流)
│       └── 架构模式 (MVC, MVP, Clean Architecture)
│
├── 🔧 前端工程化
│   ├── 构建工具
│   │   ├── Webpack (Loader, Plugin, 优化策略, 原理)
│   │   ├── Vite (ESM Dev, Rollup Prod, HMR 原理)
│   │   ├── Rollup (库打包, Tree-shaking, 插件系统)
│   │   └── 对比 (打包 vs 免打包, 配置复杂度, 生态)
│   │
│   ├── 代码规范
│   │   ├── ESLint (规则配置, 插件, Flat Config)
│   │   ├── Prettier (格式化, EditorConfig)
│   │   ├── Git Hooks (Husky, lint-staged, Commitizen)
│   │   └── CI 门禁 (GitHub Actions, 质量卡点)
│   │
│   ├── 包管理与 Monorepo
│   │   ├── npm/yarn/pnpm (依赖管理, workspaces)
│   │   ├── Monorepo (Lerna, Nx, Turborepo)
│   │   └── 发包 (npm publish, 版本管理, Changeset)
│   │
│   └── 版本控制 (Git)
│       ├── 常用命令 (branch, merge, rebase, cherry-pick)
│       ├── 工作流 (Git Flow, GitHub Flow, Trunk-Based)
│       └── 规范 (Conventional Commits, CHANGELOG)
│
├── 🌍 浏览器与网络
│   ├── 浏览器原理
│   │   ├── 渲染流程 (DOM, CSSOM, Layout, Paint, Composite)
│   │   ├── JavaScript 引擎 (V8, 编译优化, 垃圾回收)
│   │   ├── 事件循环 (宏任务, 微任务, requestAnimationFrame)
│   │   └── 浏览器存储 (Cookie, localStorage, IndexedDB)
│   │
│   ├── 网络协议
│   │   ├── HTTP/HTTPS (方法, 状态码, 头部, 缓存策略)
│   │   ├── HTTP/2 & HTTP/3 (多路复用, QUIC)
│   │   ├── WebSocket (实时通信, 心跳, 断线重连)
│   │   └── CDN (边缘缓存, 回源策略, 预热)
│   │
│   └── 安全
│       ├── XSS (反射型, 存储型, DOM型, 防御)
│       ├── CSRF (Token, SameSite, 验证)
│       ├── CSP (Content Security Policy)
│       └── CORS (跨域, 预检请求, credentials)
│
├── ⚡ 性能优化
│   ├── 指标体系
│   │   ├── Core Web Vitals (LCP, FID, CLS, INP)
│   │   ├── 加载指标 (FP, FCP, TTI, TBT)
│   │   └── 自定义埋点 (PerformanceObserver, 上报)
│   │
│   ├── 加载优化
│   │   ├── 资源优化 (压缩, 懒加载, 预加载)
│   │   ├── 分包策略 (Code Splitting, Dynamic Import)
│   │   ├── 缓存策略 (强缓存, 协商缓存, Service Worker)
│   │   └── 骨架屏 (首屏体验, 自动生成)
│   │
│   └── 渲染优化
│       ├── 虚拟滚动 (长列表优化)
│       ├── 防抖节流 (用户输入优化)
│       ├── Web Worker (计算卸载)
│       └── 渲染层优化 (GPU 加速, will-change)
│
├── 📱 跨端开发
│   ├── 移动端
│   │   ├── H5 适配 (rem, vw, 1px 问题)
│   │   ├── Hybrid (JSBridge, WebView 通信)
│   │   └── 小程序 (原理, 跨端框架 Taro/uni-app)
│   │
│   ├── 桌面端
│   │   └── Electron (主进程, 渲染进程, IPC)
│   │
│   └── 服务端
│       ├── SSR (Next.js, Nuxt.js, 同构渲染)
│       ├── SSG (静态生成, ISR 增量更新)
│       └── Node.js (Express, Koa, NestJS)
│
├── 🏛️ 架构设计
│   ├── 微前端
│   │   ├── qiankun (沙箱隔离, 样式隔离, 通信)
│   │   ├── Module Federation (模块共享, 版本管理)
│   │   ├── iframe (天然隔离, 通信方案)
│   │   └── 方案对比 (适用场景, 优劣分析)
│   │
│   ├── 低代码
│   │   ├── Schema 设计 (JSON Schema, 协议规范)
│   │   ├── 渲染引擎 (动态渲染, 组件注册)
│   │   ├── 编辑器 (拖拽, 配置面板, 画布)
│   │   └── 出码 (Schema to Code, 导出策略)
│   │
│   └── 插件系统
│       ├── 设计原则 (开闭原则, 依赖注入)
│       ├── 实现模式 (Hook 机制, 事件驱动)
│       └── 案例 (VS Code 插件, Webpack Plugin)
│
├── 🤖 新兴领域
│   ├── AI 前端
│   │   ├── LLM 集成 (API 调用, 流式输出)
│   │   ├── AI Agent (Function Calling, Tool Use)
│   │   ├── Prompt Engineering (提示词设计)
│   │   └── AI 辅助开发 (Copilot, Cursor)
│   │
│   └── WebAssembly
│       ├── 基础 (wat, wasm, 内存模型)
│       └── 应用 (计算密集, 跨语言)
│
└── 🛠️ 开发工具
    ├── IDE (VS Code 插件, 调试技巧)
    ├── 浏览器 DevTools (Performance, Network, Memory)
    ├── 终端 (Zsh, 效率工具)
    └── 在线工具 (Playground, 可视化)
```

## 二、学习路径建议

### 初级前端 (0-1 年)

1. **HTML/CSS 基础** → 语义化、布局、响应式
2. **JavaScript 核心** → 语法、DOM、事件、异步
3. **开发工具** → VS Code、Chrome DevTools、Git 基础
4. **一个框架入门** → React 或 Vue 基础使用

### 中级前端 (1-3 年)

1. **TypeScript** → 类型系统、工程配置
2. **框架深入** → 原理、状态管理、性能优化
3. **工程化** → 构建工具、代码规范、CI/CD
4. **计算机基础** → 网络协议、浏览器原理

### 高级前端 (3-5 年)

1. **架构设计** → 微前端、低代码、插件系统
2. **性能专精** → 指标体系、极限优化
3. **跨端能力** → SSR、Hybrid、小程序
4. **团队建设** → 规范制定、技术分享、Code Review

### 专家级 (5 年+)

1. **技术决策** → 技术选型、架构演进
2. **业务结合** → 技术赋能业务
3. **前沿探索** → AI、WebAssembly、Web3
4. **影响力** → 开源、演讲、写作

---

## 三、面试高频考点

### JavaScript

- [ ] 闭包原理及应用场景
- [ ] 原型链与继承
- [ ] this 指向规则
- [ ] Event Loop (宏任务/微任务)
- [ ] Promise/async-await 实现

### TypeScript

- [ ] type vs interface
- [ ] 泛型约束与推断
- [ ] 工具类型 (Partial, Required, Pick, Omit)

### React

- [ ] Hooks 原理 (为什么不能条件调用)
- [ ] Fiber 架构与调度
- [ ] Diff 算法
- [ ] 合成事件机制

### Vue

- [ ] 响应式原理 (Vue2 vs Vue3)
- [ ] 虚拟 DOM 与 Diff
- [ ] Composition API vs Options API

### 工程化

- [ ] Webpack 构建流程
- [ ] Loader vs Plugin
- [ ] Tree-shaking 原理
- [ ] Vite 为什么快

### 性能优化

- [ ] 首屏优化方案
- [ ] 长列表优化
- [ ] 内存泄漏排查

### 网络/安全

- [ ] HTTP 缓存策略
- [ ] HTTPS 握手过程
- [ ] XSS/CSRF 防御

---

## 四、标签分类系统

### 技术栈标签

| 标签         | 含义                |
| ------------ | ------------------- |
| `javascript` | JavaScript 语言相关 |
| `typescript` | TypeScript 类型系统 |
| `css`        | 样式与布局          |
| `react`      | React 框架          |
| `vue`        | Vue 框架            |
| `webpack`    | Webpack 构建        |
| `vite`       | Vite 构建           |
| `node`       | Node.js             |

### 概念标签

| 标签             | 含义                 |
| ---------------- | -------------------- |
| `hooks`          | React/Vue Hooks 相关 |
| `async`          | 异步编程             |
| `performance`    | 性能优化             |
| `architecture`   | 架构设计             |
| `micro-frontend` | 微前端               |
| `lowcode`        | 低代码               |
| `ssr`            | 服务端渲染           |

### 场景标签

| 标签              | 含义     |
| ----------------- | -------- |
| `interview`       | 面试相关 |
| `project`         | 项目经验 |
| `troubleshooting` | 问题排查 |
| `best-practice`   | 最佳实践 |

---

## 五、项目目录映射

> 以下为本项目 `docs/` 目录与知识体系的映射关系

| 目录               | 分类     | 说明          | Navbar 位置           |
| ------------------ | -------- | ------------- | --------------------- |
| `JavaScript/`      | 编程语言 | JS 基础与进阶 | 基础语言 → JavaScript |
| `TypeScript/`      | 编程语言 | TS 类型系统   | 基础语言 → TypeScript |
| `css/`             | 编程语言 | 样式与布局    | 基础语言 → CSS        |
| `react/`           | 框架生态 | React 全栈    | 框架生态 → React      |
| `vue/`             | 框架生态 | Vue 全栈      | 框架生态 → Vue        |
| `Pattern/`         | 框架生态 | 设计模式      | 框架生态 → Pattern    |
| `webpack/`         | 工程化   | 构建工具      | 工程化 → 构建工具     |
| `node/`            | 工程化   | Node.js       | 工程化 → Node         |
| `git/`             | 工程化   | 版本控制      | 工程化 → Git          |
| `performance/`     | 工程化   | 性能优化      | 工程化 → Performance  |
| `mark/`            | 进阶专题 | 技能提炼      | 进阶专题 → 技能提炼   |
| `ai/`              | 进阶专题 | AI 开发       | 进阶专题 → AI         |
| `issue/`           | 进阶专题 | 踩坑记录      | 进阶专题 → Issue      |
| `utils/`           | 工具箱   | 工具函数      | 工具箱 → Utils        |
| `online-tools/`    | 工具箱   | 在线工具      | 工具箱 → 在线工具     |
| `software/`        | 工具箱   | 软件推荐      | 工具箱 → Software     |
| `interview-prep/`  | 面试     | 面试准备      | 面试 → 准备           |
| `theory/`          | 面试     | 面试题        | 面试 → 题库           |
| `job-description/` | 面试     | 简历          | 面试 → 简历           |

---

_此图谱独立于项目结构，可用于：_

- _学习路径规划_
- _知识盲区发现_
- _面试准备_
- `/ai-doc` _工作流的分类参考_
