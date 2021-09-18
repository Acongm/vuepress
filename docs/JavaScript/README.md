# js 基础知识

## 数据类型

> 原始类型存储的都是值，没有函数可以调用

### 原始类型

- 1、boolean
- 2、null
- 3、undefined
- 4、number
- 5、string
- 6、symbol

### 复杂类型

- 7？、Object
- 8？、bigInt

## 对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？

- 当我们将变量赋值给另外一个变量时，复制的是原本变量的地址（指针），也就是说当前变量 b 存放的地址（指针）也是 #001，当我们进行数据修改的时候，就会修改存放在地址（指针） #001 上的值，也就导致了两个变量的值都发生了改变。

* 总结， 正常变量赋值中（在“=” 情况下），都是复制原本变量地址,

## typeof 是否能正确判断类型？instanceof 能正确判断对象的原理是什么？

- 1、typeof 只能判读一些原始类型， 对于数组、对象、函数等，不能准确的判断
- 2、如果我们想判断一个对象的正确类型，这时候可以考虑使用 instanceof，因为内部机制是通过原型链来判断的。
- 3、Symbol.hasInstance 可自定义对象的 instanceof 值

## 类型转换

- 1、转换为布尔值
  - 在条件判断时，除了 undefined， null， false， NaN， ''， 0， -0，其他所有值都转为 true，包括所有对象。
- 2、转换为数字
- 3、转换为字符串

### 对象转原始类型

对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数，对于该函数来说，算法逻辑一般来说如下：

- 如果已经是原始类型了，那就不需要转换了
- 如果需要转字符串类型就调用 x.toString()，转换为基础类型的话就返回转换的值。不是字符串类型的话就先调用 valueOf，结果不是基础类型的话再调用 toString
- 调用 x.valueOf()，如果转换为基础类型，就返回转换的值
- 如果都没有返回原始类型，就会报错

### 四则运算符

加法运算符不同于其他几个运算符，它有以下几个特点：

- 运算中其中一方为字符串，那么就会把另一方也转换为字符串
- 如果一方不是字符串或者数字，那么会将它转换为数字或者字符串
- 那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字

### 比较运算符

- 如果是对象，就通过 toPrimitive 转换对象
- 如果是字符串，就通过 unicode 字符索引来比较

## 如何正确判断 this？箭头函数的 this 是什么？

## == 和 === 有什么区别？

- 对于 === 来说就简单多了，就是判断两者类型和值是否相同。
- 对于 == 来说，就要:判断类型->判断 null==undefined->string==number->boolean==number->object==(string||number||symbol)->结果

## 什么是闭包？

- 闭包的定义其实很简单：函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包。
- 类似一个背包
- 闭包存在的意义就是让我们可以间接访问函数内部的变量。

## 什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？

### 什么是浅拷贝

- 对象类型在赋值的过程中其实是复制了地址，从而会导致改变了一方其他也都被改变的情况。通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个情况。
- Object.assign 就是用来浅拷贝所有属性到新对象中。如果是属性值对象的话，拷贝的是自己
- 另外我们还可以通过展开运算符 ... 来实现浅拷贝
- 浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，就需要深拷贝

### 什么是深拷贝

- JSON.parse(JSON.stringify(object)) 实现深拷贝
  - 会忽略 undefined
  - 会忽略 symbol
  - 不能序列化函数
  - 不能解决循环引用的对象

### 如何理解原型？如何理解原型链？

- 原型的 constructor 属性指向构造函数，构造函数又通过 prototype 属性指回原型，
- 但是并不是所有函数都具有这个属性，Function.prototype.bind() 就没有这个属性。

- 其实原型链就是多个对象通过 **proto** 的方式连接了起来。
- 为什么 obj 可以访问到 valueOf 函数，就是因为 obj 通过原型链找到了 valueOf 函数。

- 对于这一小节的知识点，总结起来就是以下几点：

- Object 是所有对象的爸爸，所有对象都可以通过 **proto** 找到它
- Function 是所有函数的爸爸，所有函数都可以通过 **proto** 找到它
- 函数的 prototype 是一个对象
- 对象的 **proto** 属性指向原型， **proto** 将对象和原型连接起来组成了原型链

## ES6 知识点及常考面试题

### 原型如何实现继承？Class 如何实现继承？Class 本质是什么？

#### 组合继承

```js
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function () {
  console.log(this.val)
}
function Child(value) {
  Parent.call(this, value)
}
Child.prototype = new Parent()
const child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```

#### 寄生组合继承

```js
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function () {
  console.log(this.val)
}
function Child(value) {
  Parent.call(this, value)
}
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true
  }
})
const child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```

#### Class 继承

```js
class Parent {
  constructor(value) {
    this.val = value
  }
  getValue() {
    console.log(this.val)
  }
}
class Child extends Parent {
  constructor(value) {
    super(value)
  }
}
let child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```

### 为什么要使用模块化？

- 解决命名冲突
- 提供复用性
- 提高代码可维护性

### 都有哪几种方式可以实现模块化，各有什么特点？

- 立即执行函数
- AMD 和 CMD
- CommonJS
- ES Module

### Proxy 可以实现什么功能？

> Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      // 这句判断代码是新增的
      if (typeof target[property] === 'object' && target[property] !== null) {
        return new Proxy(target[property], handler)
      } else {
        return Reflect.get(target, property)
      }
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2 // 监听到属性a改变
p.a // 'a' = 2
```

## JS 异步编程及常考面试题

### 你理解的 Generator 是什么？
