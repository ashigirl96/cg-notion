import { kv } from '@vercel/kv'

console.log(await kv.set('setExample', '123abc', { ex: 100, nx: true }))
console.log(await kv.get('setExample'))
console.log(await kv.getdel('setExample'))
