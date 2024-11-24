import { notion } from '@/lib/notion'
import { column, columnList, embed } from '@sota1235/notion-sdk-js-helper/dist/blockObjects'

const pageId = '5c3d2c89a28e4527938f59fc28c94337'
const someurl = 'https://tse2.mm.bing.net/th?id=OIP.Ns63Qv1_f2H_pdR6hyvbnAHaIk&pid=Api'
const response = await fetch(someurl, { method: 'HEAD', redirect: 'follow' })
const contentType = response.headers.get('content-type')

console.dir(response)
console.log(contentType)

await notion.blocks.children.append({
  block_id: pageId,
  children: [
    // {
    //   object: 'block',
    //   type: 'image',
    //   image: {
    //     type: 'external',
    //     external: {
    //       url: someurl,
    //     },
    //   },
    // },
    embed(someurl, {}),
    columnList([column([embed(someurl, {})]), column([embed(someurl, {})])]),
  ],
})
