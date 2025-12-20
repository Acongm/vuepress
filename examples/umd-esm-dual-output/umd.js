;(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory()
    return
  }
  root.UMD_LIB = factory()
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('add(a,b) expects numbers')
    }
    return a + b
  }
  return { add }
})
