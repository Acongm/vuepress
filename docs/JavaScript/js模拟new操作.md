# 能否模拟实现 JS 的 new 操作符

## js 模拟 new 操作

```js
/**
 * 模拟实现 new 操作符
 * @param  {Function} ctor [构造函数]
 * @return {Object|Function|Regex|Date|Error}      [返回结果]
 */
function newOperator(ctor) {
  if (typeof ctor !== 'function') {
    throw 'newOperator function the first param must be a function'
  }
  // ES6 new.target 是指向构造函数
  newOperator.target = ctor
  // 1.创建一个全新的对象，
  // 2.并且执行[[Prototype]]链接
  // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
  var newObj = Object.create(ctor.prototype)
  // ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
  // 除去ctor构造函数的其余参数
  var argsArr = [].slice.call(arguments, 1)
  // 3.生成的新对象会绑定到函数调用的`this`。
  // 获取到ctor函数返回结果
  var ctorReturnResult = ctor.apply(newObj, argsArr)
  // 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
  var isObject =
    typeof ctorReturnResult === 'object' && ctorReturnResult !== null
  var isFunction = typeof ctorReturnResult === 'function'
  if (isObject || isFunction) {
    return ctorReturnResult
  }
  // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
  return newObj
}
```

    Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的**proto**。

## 对于不支持 ES5 的浏览器，MDN 上提供了 ployfill 方案。

```js
if (typeof Object.create !== 'function') {
  Object.create = function (proto, propertiesObject) {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
      throw new TypeError('Object prototype may only be an Object: ' + proto)
    } else if (proto === null) {
      throw new Error(
        "This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument."
      )
    }

    if (typeof propertiesObject != 'undefined')
      throw new Error(
        "This browser's implementation of Object.create is a shim and doesn't support a second argument."
      )

    function F() {}
    F.prototype = proto
    return new F()
  }
}
```

## 总结， new 做了什么：

    1、创建了一个全新的对象。
    2、这个对象会被执行[[Prototype]]（也就是__proto__）链接。
    3、生成的新对象会绑定到函数调用的this。
    4、通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
    5、如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用会自动返回这个新的对象。
