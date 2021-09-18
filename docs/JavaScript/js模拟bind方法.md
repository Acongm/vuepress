# js 模拟 bind 方法

## 1：能否模拟实现 JS 的 bind 方法

```js
// 第一版 修改this指向，合并参数
Function.prototype.bindFn = function bind(thisArg) {
  if (typeof this !== 'function') {
    throw new TypeError(this + 'must be a function')
  }
  // 存储函数本身
  var self = this
  // 去除thisArg的其他参数 转成数组
  var args = [].slice.call(arguments, 1)
  var bound = function () {
    // bind返回的函数 的参数转成数组
    var boundArgs = [].slice.call(arguments)
    // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
    return self.apply(thisArg, args.concat(boundArgs))
  }
  return bound
}
// 测试
var obj = {
  name: '若川'
}
function original(a, b) {
  console.log(this.name)
  console.log([a, b])
}
var bound = original.bindFn(obj, 1)
bound(2) // '若川', [1, 2]
```

```js
// 第三版 实现new调用
Function.prototype.bindFn = function bind(thisArg) {
  if (typeof this !== 'function') {
    throw new TypeError(this + ' must be a function')
  }
  // 存储调用bind的函数本身
  var self = this
  // 去除thisArg的其他参数 转成数组
  var args = [].slice.call(arguments, 1)
  var bound = function () {
    // bind返回的函数 的参数转成数组
    var boundArgs = [].slice.call(arguments)
    var finalArgs = args.concat(boundArgs)
    // new 调用时，其实this instanceof bound判断也不是很准确。es6 new.target就是解决这一问题的。
    if (this instanceof bound) {
      // 这里是实现上文描述的 new 的第 1, 2, 4 步
      // 1.创建一个全新的对象
      // 2.并且执行[[Prototype]]链接
      // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
      // self可能是ES6的箭头函数，没有prototype，所以就没必要再指向做prototype操作。
      if (self.prototype) {
        // ES5 提供的方案 Object.create()
        // bound.prototype = Object.create(self.prototype);
        // 但 既然是模拟ES5的bind，那浏览器也基本没有实现Object.create()
        // 所以采用 MDN ployfill方案 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
        function Empty() {}
        Empty.prototype = self.prototype
        bound.prototype = new Empty()
      }
      // 这里是实现上文描述的 new 的第 3 步
      // 3.生成的新对象会绑定到函数调用的`this`。
      var result = self.apply(this, finalArgs)
      // 这里是实现上文描述的 new 的第 5 步
      // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，
      // 那么`new`表达式中的函数调用会自动返回这个新的对象。
      var isObject = typeof result === 'object' && result !== null
      var isFunction = typeof result === 'function'
      if (isObject || isFunction) {
        return result
      }
      return this
    } else {
      // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
      return self.apply(thisArg, finalArgs)
    }
  }
  return bound
}
```

### 总结

    1、bind 是 Function 原型链中的 Function.prototype 的一个属性，它是一个函数，修改 this 指向，合并参数传递给原函数，返回值是一个新的函数。
    2、bind 返回的函数可以通过 new 调用，这时提供的 this 的参数被忽略，指向了 new 生成的全新对象。内部模拟实现了 new 操作符。
    3、es5-shim 源码模拟实现 bind 时用 Function 实现了 length。
    事实上，平时其实很少需要使用自己实现的投入到生成环境中。但面试官通过这个面试题能考察很多知识。比如 this 指向，原型链，闭包，函数等知识，可以扩展很多。
