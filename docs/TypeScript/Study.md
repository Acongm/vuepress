# 每天学一点 TS

## Parameters`<T>`获取构造函数的参数类型

```js
interface AConstructor {
  new(a: number): string[];
}

type A1 = ConstructorParameters<AConstructor> // [number]
```

## extends(条件类型)

```js
T extends U ? X : Y
```

## Partial `<T>`,让属性都变成可选的

```js
type A = { a: number, b: string }

type A1 = Partial<A> // { a?: number; b?: string;}
```

## Required`<T>`,让属性都变成必选

```js
type A = { a?: number, b?: string }

type A1 = Required<A> // { a: number; b: string;}
```

## Pick<T,K>,只保留自己选择的属性,U 代表属性集合

```js
type A = { a: number, b: string }

type A1 = Pick<A, 'a'> // {a:number}
```

## Omit<T,K>实现排除已选的属性

```js
type A = { a: number, b: string }

type A1 = Omit<A, 'a'> // {b:string}
```

## Record<K,T>, 创建一个类型,T 代表键值的类型, U 代表值的类型

```js
type A1 = Record<string, string> // 等价{[k:string]:string}
```

## Record<K,T>, 创建一个类型,T 代表键值的类型, U 代表值的类型

```js
type A1 = Record<string, string> // 等价{[k:string]:string}
```

## Exclude<T,U>, 过滤 T 中和 U 相同(或兼容)的类型

```js
type A = { a: number, b: string }

type A1 = Exclude<number | string, string | number[]> // number

// 兼容

type A2 = Exclude<number | string, any | number[]> // never , 因为any兼容number, 所以number被过滤掉
```

## Extract<T,U>, 提取 T 中和 U 相同(或兼容)的类型

```js
type A = { a: number, b: string }

type A1 = Extract<number | string, string | number[]> // string
```

## NonNullable `<T>`, 剔除 T 中的 undefined 和 null

```js
type A1 = NonNullable<number | string | null | undefined> // number|string
```

## ReturnType`<T>`, 获取 T 的返回值的类型

```js
type A1 = ReturnType<() => number> // number
```

## InstanceType`<T>`, 返回 T 的实例类型 ????

```js
interface A {
  a: HTMLElement;
}

interface AConstructor {
  new(): A;
}

function create(AClass: AConstructor): InstanceType<AConstructor> {
  return new AClass()
}
```

## Parameters`<T>` 获取函数参数类型

```js
interface A {
  (a: number, b: string): string[];
}

type A1 = Parameters<A> // [number, string]
```

## ConstructorParameters `<T>` 获取构造函数的参数类型

```js
// 和Parameters类似, 只是T这里是构造函数类型.

interface AConstructor {
  new(a: number): string[];
}

type A1 = ConstructorParameters<AConstructor> // [number]
```

## extends(条件类型)

```js

T extends U ? X : Y

type A = string extends '123' ? string :'123' // '123'

type B = '123' extends string ? string :123 // string

```

## infer(类型推断) ???

```js

export type Tail<Tuple extends any[]> = ((...args: Tuple) => void)

extends ((a: any, ...args: infer T) => void) ? T : never;

```
