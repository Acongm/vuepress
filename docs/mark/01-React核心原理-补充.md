# React 19 新特性详解 & useMemo/useCallback 深度解析

## React 19 新特性（2024 年发布）

### 1. React Compiler（自动优化）- 最大变革

**核心价值：不再需要手动使用 memo/useMemo/useCallback**

```javascript
// React 18 之前（需要手动优化）
const TodoList = React.memo(({ todos, filter }) => {
  const filtered = useMemo(
    () => todos.filter((todo) => todo.status === filter),
    [todos, filter]
  )

  const handleClick = useCallback((id) => {
    console.log(id)
  }, [])

  return <List items={filtered} onClick={handleClick} />
})

// React 19 + Compiler（自动优化）
function TodoList({ todos, filter }) {
  const filtered = todos.filter((todo) => todo.status === filter)
  const handleClick = (id) => console.log(id)
  return <List items={filtered} onClick={handleClick} />
}
// 编译器自动插入必要的缓存逻辑
```

**工作原理：**

- 编译时分析组件代码
- 识别可以缓存的计算和函数
- 自动生成优化后的代码
- 类似 Svelte/Solid.js 的编译时优化

**启用方式：**

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler',
      {
        target: '18' // 可向下兼容 React 18
      }
    ]
  ]
}
```

---

### 2. Actions（表单处理增强）

**新增 Hooks：**

- `useActionState` - 处理表单提交和 loading 状态
- `useFormStatus` - 获取表单状态
- `useOptimistic` - 乐观更新 UI

**示例对比：**

```jsx
// React 18 之前（手动管理状态）
function AddTodo() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const formData = new FormData(e.target)
      await addTodo(formData)
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" />
      <button disabled={pending}>{pending ? 'Adding...' : 'Add'}</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

// React 19（使用 Actions）
function AddTodo() {
  const [state, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      try {
        await addTodo(formData)
        return { success: true }
      } catch (err) {
        return { error: err.message }
      }
    },
    { success: false }
  )

  return (
    <form action={submitAction}>
      <input name="title" />
      <button disabled={isPending}>{isPending ? 'Adding...' : 'Add'}</button>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  )
}
```

**乐观更新示例：**

```jsx
function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  )

  const handleAdd = async (formData) => {
    // 立即显示新 todo（带 pending 标记）
    addOptimisticTodo({
      id: Date.now(),
      title: formData.get('title')
    })

    // 后台提交
    await addTodo(formData)
  }

  return (
    <>
      {optimisticTodos.map((todo) => (
        <div key={todo.id} className={todo.pending ? 'pending' : ''}>
          {todo.title}
        </div>
      ))}
      <form action={handleAdd}>
        <input name="title" />
        <button>Add</button>
      </form>
    </>
  )
}
```

---

### 3. use() API（统一资源读取）

**功能：**

- 在组件中读取 Promise
- 读取 Context（可在条件语句中）
- 自动触发 Suspense

**示例：**

```jsx
// 读取 Promise
function UserProfile({ userPromise }) {
  const user = use(userPromise) // 等待 Promise 完成
  return <div>{user.name}</div>
}

// 条件读取 Context（React 19 新能力）
function ThemedComponent({ isDark }) {
  const theme = use(isDark ? DarkThemeContext : LightThemeContext)
  return <div style={theme}>Content</div>
}

// 与 Suspense 配合
;<Suspense fallback={<Loading />}>
  <UserProfile userPromise={fetchUser(123)} />
</Suspense>
```

---

### 4. ref 作为 prop（简化 ref 传递）

**不再需要 forwardRef：**

```jsx
// React 18（需要 forwardRef）
const Input = React.forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// React 19（直接使用）
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

// 使用方式不变
function Form() {
  const inputRef = useRef()
  return <Input ref={inputRef} />
}
```

---

### 5. Document Metadata（内置 SEO 支持）

**组件中直接管理 `<title>`、`<meta>`：**

```jsx
// React 18（需要 react-helmet）
import { Helmet } from 'react-helmet'

function BlogPost({ post }) {
  return (
    <>
      <Helmet>
        <title>{post.title} - My Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
      </Helmet>
      <article>{post.content}</article>
    </>
  )
}

// React 19（原生支持）
function BlogPost({ post }) {
  return (
    <>
      <title>{post.title} - My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <article>{post.content}</article>
    </>
  )
}

// React 自动提升到 <head> 中，无需额外配置
```

---

### 6. 资源预加载 API

**新增函数：**

- `preload()` - 预加载资源
- `preinit()` - 预初始化脚本/样式
- `prefetchDNS()` - DNS 预解析
- `preconnect()` - 预连接

```jsx
import { preload, preinit, prefetchDNS, preconnect } from 'react-dom'

function ProductPage({ productId }) {
  useEffect(() => {
    // 预加载图片
    preload(`/products/${productId}/hero.jpg`, { as: 'image' })

    // 预初始化分析脚本
    preinit('/analytics.js', { as: 'script' })

    // DNS 预解析
    prefetchDNS('https://api.example.com')

    // 预连接 CDN
    preconnect('https://cdn.example.com')
  }, [productId])

  return <div>Product {productId}</div>
}

// 自动生成 <link rel="preload"> 等标签
```

---

### 7. Suspense 增强

**更好的错误处理：**

```jsx
<Suspense
  fallback={<Loading />}
  onError={(error) => {
    // 错误回调
    logError(error)
  }}
>
  <AsyncComponent />
</Suspense>
```

---

### 8. Context 性能优化

**自动选择性订阅：**

```jsx
// React 18：所有消费者都会重渲染
const ThemeContext = createContext()

// React 19：自动优化，只有使用的值变化才重渲染
function Component() {
  const { color } = useContext(ThemeContext) // 只订阅 color
  return <div style={{ color }}>Text</div>
}
// 当 ThemeContext 的其他属性变化时，此组件不会重渲染
```

---

## 为什么需要 useMemo 和 useCallback？（深度解析）

### 问题根源：JavaScript 的引用类型特性

#### 1. 基本问题演示

```jsx
function Component() {
  const config = { theme: 'dark' } // ⚠️ 每次渲染创建新对象
  return <Child config={config} />
}

// 问题：
// 每次 Component 渲染，config 都是新对象（新的内存地址）
// Child 收到的 props.config 引用不同
// 即使值相同，React.memo 也会认为 props 变了
```

#### 2. JavaScript 对象比较

```javascript
// JavaScript 中引用类型比较的是内存地址
{} === {}           // false（不同引用）
[] === []           // false
() => {} === () => {} // false

// 相同值，不同引用
const obj1 = { a: 1 };
const obj2 = { a: 1 };
obj1 === obj2;      // false ❌

// 相同引用
const obj1 = { a: 1 };
const obj2 = obj1;
obj1 === obj2;      // true ✅
```

---

### useMemo 的必要性

#### 场景 1：避免子组件无效重渲染

```jsx
// ❌ 问题代码
function Parent() {
  const [count, setCount] = useState(0)

  const config = { theme: 'dark' } // 每次都是新对象

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild config={config} />
    </>
  )
}

const ExpensiveChild = React.memo(({ config }) => {
  console.log('Child render') // 每次 Parent 更新都会打印
  // 昂贵的渲染逻辑
  return <div>{config.theme}</div>
})

// 问题分析：
// 1. 点击按钮，count 变化
// 2. Parent 重新渲染
// 3. config 是新对象（新引用）
// 4. ExpensiveChild 的 props.config 变了
// 5. 即使有 React.memo，也会重渲染

// ✅ 解决方案
function Parent() {
  const [count, setCount] = useState(0)

  const config = useMemo(() => ({ theme: 'dark' }), []) // 稳定引用

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild config={config} /> {/* 不会重渲染 ✅ */}
    </>
  )
}

// 工作原理：
// 1. 首次渲染：useMemo 执行，返回 { theme: 'dark' }，缓存
// 2. 后续渲染：依赖项 [] 没变，返回缓存的对象（同一引用）
// 3. ExpensiveChild 的 props.config 引用相同，跳过渲染
```

#### 场景 2：避免昂贵计算重复执行

```jsx
// ❌ 问题代码
function DataTable({ data, sortBy }) {
  // 每次渲染都执行，即使 data 和 sortBy 没变
  const processedData = data
    .sort((a, b) => a[sortBy] - b[sortBy]) // 排序
    .filter((item) => item.active) // 过滤
    .map((item) => ({
      ...item,
      formatted: expensiveFormat(item) // 昂贵的格式化
    }))

  return <Table data={processedData} />
}

// 问题：
// - 即使 data 和 sortBy 不变，每次渲染都会重新计算
// - 如果 data 有 10000 条记录，性能损耗巨大

// ✅ 解决方案
function DataTable({ data, sortBy }) {
  const processedData = useMemo(() => {
    console.log('计算中...') // 只在依赖变化时打印
    return data
      .sort((a, b) => a[sortBy] - b[sortBy])
      .filter((item) => item.active)
      .map((item) => ({
        ...item,
        formatted: expensiveFormat(item)
      }))
  }, [data, sortBy]) // 只在 data 或 sortBy 变化时重新计算

  return <Table data={processedData} />
}
```

#### 场景 3：避免 useEffect 无限循环

```jsx
// ❌ 问题代码
function Component({ userId }) {
  const options = { userId } // 每次都是新对象

  useEffect(() => {
    fetchData(options) // 每次渲染都执行
  }, [options]) // options 每次都不同，无限循环！

  return <div>Loading...</div>
}

// 执行流程：
// 1. 首次渲染：options = { userId: 1 }（引用 A）
// 2. useEffect 执行，fetchData
// 3. fetchData 可能触发状态更新
// 4. 组件重新渲染：options = { userId: 1 }（引用 B，虽然值相同）
// 5. useEffect 检测到 options 变化（引用 A !== 引用 B）
// 6. 再次执行 fetchData
// 7. 无限循环 💥

// ✅ 解决方案
function Component({ userId }) {
  const options = useMemo(() => ({ userId }), [userId])

  useEffect(() => {
    fetchData(options) // 只在 userId 变化时执行
  }, [options])

  return <div>Loading...</div>
}
```

---

### useCallback 的必要性

#### 场景 1：优化 React.memo 组件

```jsx
// ❌ 问题代码
function Parent() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    // 每次都是新函数
    console.log('clicked')
  }

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoButton onClick={handleClick} /> {/* 总是重渲染 */}
    </>
  )
}

const MemoButton = React.memo(({ onClick }) => {
  console.log('Button render')
  return <button onClick={onClick}>Click me</button>
})

// 问题：
// - 每次 Parent 渲染，handleClick 都是新函数
// - MemoButton 的 props.onClick 引用变化
// - React.memo 失效

// ✅ 解决方案
function Parent() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    console.log('clicked')
  }, []) // 稳定引用

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoButton onClick={handleClick} /> {/* 不重渲染 ✅ */}
    </>
  )
}
```

#### 场景 2：避免 useEffect 重复执行

```jsx
// ❌ 问题代码
function Component({ id }) {
  const fetchData = () => {
    // 每次都是新函数
    fetch(`/api/${id}`).then((res) => res.json())
  }

  useEffect(() => {
    fetchData() // 每次渲染都执行
  }, [fetchData]) // fetchData 每次都不同

  return <div>Data for {id}</div>
}

// ✅ 解决方案
function Component({ id }) {
  const fetchData = useCallback(() => {
    fetch(`/api/${id}`).then((res) => res.json())
  }, [id]) // 只在 id 变化时创建新函数

  useEffect(() => {
    fetchData() // 只在 id 变化时执行
  }, [fetchData])

  return <div>Data for {id}</div>
}
```

#### 场景 3：自定义 Hook 返回稳定函数

```jsx
// ❌ 问题代码
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)

  // 每次都是新函数，使用此 Hook 的组件会有问题
  const updateDebounced = (newValue) => {
    setTimeout(() => setDebounced(newValue), delay)
  }

  return [debounced, updateDebounced]
}

function Component() {
  const [debounced, update] = useDebounce('', 500)

  useEffect(() => {
    // update 每次都不同，这里会有问题
    doSomething(update)
  }, [update])
}

// ✅ 解决方案
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)

  const updateDebounced = useCallback(
    (newValue) => {
      setTimeout(() => setDebounced(newValue), delay)
    },
    [delay]
  ) // 稳定的函数引用

  return [debounced, updateDebounced]
}
```

---

### 何时不需要 useMemo/useCallback

#### 1. 简单值和原始类型

```jsx
// ❌ 不需要（浪费性能）
const count = useMemo(() => 1 + 1, [])
const name = useMemo(() => 'John', [])
const isActive = useMemo(() => true, [])

// ✅ 直接使用
const count = 1 + 1
const name = 'John'
const isActive = true

// 原因：原始类型按值比较，不存在引用问题
```

#### 2. 函数仅在当前组件使用

```jsx
// ❌ 不需要
function Component() {
  const handleClick = useCallback(() => {
    console.log('click')
  }, [])

  // 直接在本组件使用，不传递给子组件
  return <button onClick={handleClick}>Click</button>
}

// ✅ 直接定义
function Component() {
  const handleClick = () => {
    console.log('click')
  }

  return <button onClick={handleClick}>Click</button>
}
```

#### 3. 子组件没有使用 React.memo

```jsx
// ❌ 不需要
function Parent() {
  const config = useMemo(() => ({ theme: 'dark' }), [])
  return <Child config={config} /> // Child 没有 memo
}

function Child({ config }) {
  return <div>{config.theme}</div>
}

// ✅ 不需要优化
function Parent() {
  const config = { theme: 'dark' }
  return <Child config={config} />
}

// 原因：Child 没有 memo，每次都会渲染，缓存 config 无意义
```

---

### 性能成本对比

```javascript
// 原始值比较（极快）
1 === 1 // 直接比较值

// 对象引用比较（快）
obj1 === obj2 // 比较内存地址

// useMemo 的成本
// 1. 调用 useMemo 函数
// 2. 对比依赖数组（浅比较每个依赖）
// 3. 决定是返回缓存还是重新计算

// 如果计算本身很简单，useMemo 的成本反而更高！
```

---

### React 19 的改变

```jsx
// React 18（需要手动优化）
function Component({ data }) {
  const processed = useMemo(() => processData(data), [data])
  const handler = useCallback(() => handleClick(), [])

  return <Child data={processed} onClick={handler} />
}

// React 19 + Compiler（自动优化）
function Component({ data }) {
  const processed = processData(data) // 编译器自动缓存
  const handler = () => handleClick() // 编译器自动稳定引用

  return <Child data={processed} onClick={handler} />
}

// 优势：
// ✅ 代码更简洁
// ✅ 无需考虑依赖数组
// ✅ 更少的 bug
// ✅ 编译器比手动优化更智能
```

---

### 总结

**为什么需要 useMemo/useCallback？**

1. **JavaScript 特性**：引用类型每次创建都是新引用
2. **React 特性**：通过引用比较（`===`）判断 props 是否变化
3. **性能问题**：新引用导致不必要的重渲染或副作用执行

**何时使用？**

- ✅ 传递给 `React.memo` 组件的 props
- ✅ 作为 Hook 的依赖项（`useEffect`、`useMemo` 等）
- ✅ 昂贵的计算（循环、递归、复杂运算）
- ✅ 自定义 Hook 返回的值/函数

**何时不用？**

- ❌ 简单计算（加减乘除、字符串拼接）
- ❌ 仅内部使用的函数
- ❌ 非 `React.memo` 组件的 props
- ❌ 原始类型值（number、string、boolean）

**未来趋势（React 19+）**

→ 编译器自动优化，开发者无需手动处理！

**决策树：**

```
需要优化吗？
  ├─ 有性能问题吗？
  │   ├─ 否 → 不要优化 ✋
  │   └─ 是 → 继续
  ├─ 是引用类型吗？
  │   ├─ 否（原始类型）→ 不需要 useMemo ✋
  │   └─ 是 → 继续
  ├─ 传递给 memo 组件或作为依赖项吗？
  │   ├─ 否 → 不需要优化 ✋
  │   └─ 是 → 继续
  ├─ 计算昂贵吗（对象/数组）？
  │   ├─ 是 → 使用 useMemo ✅
  │   └─ 否（函数）→ 使用 useCallback ✅
  └─ 等待 React 19 → 编译器自动处理 🎉
```
