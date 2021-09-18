# call、apply 与 bind

## call()

    通过 call 方法，你可以在一个对象上借用另一个对象上的方法，
    比如Object.prototype.toString.call([])，
    就是一个Array对象借用了Object对象上的方法。

## apply()

      语法与 call() 方法的语法几乎完全相同，
      唯一的区别在于，apply 的第二个参数必须是一个包含多个参数的数组（或类数组对象）。

## bind

    bind() 函数会创建一个新函数（称为绑定函数）

    bind是ES5新增的一个方法
    传参和call或apply类似
    不会执行对应的函数，call或apply会自动执行对应的函数
    返回对函数的引用
