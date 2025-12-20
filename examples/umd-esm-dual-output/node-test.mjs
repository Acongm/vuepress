import { add as esmAdd } from './esm.mjs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const umd = require('./umd.js')

console.log('[esm] add(1,2)=', esmAdd(1, 2))
console.log('[umd] add(1,2)=', umd.add(1, 2))


