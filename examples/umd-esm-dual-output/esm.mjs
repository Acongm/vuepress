export function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('add(a,b) expects numbers')
  }
  return a + b
}


