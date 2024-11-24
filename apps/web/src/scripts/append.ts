import { env } from '@/lib/env'
import { notion } from '@/lib/notion'
import { image } from '@sota1235/notion-sdk-js-helper/dist/blockObjects'
import { put } from '@vercel/blob'

const pageId = '5c3d2c89a28e4527938f59fc28c94337'
const someurl = 'https://tse2.mm.bing.net/th?id=OIP.Ns63Qv1_f2H_pdR6hyvbnAHaIk&pid=Api'
const response = await fetch(someurl)
const contentType = response.headers.get('content-type') || 'application/octet-stream'
const imageBuffer = await response.arrayBuffer()
const _blob = await put('uploaded_image', Buffer.from(imageBuffer), {
  access: 'public',
  contentType,
  token: env.ARCHITECT_READ_WRITE_TOKEN,
})
console.dir(_blob)

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
    image(_blob.url),
    // embed(someurl, {}),
    // columnList([column([embed(someurl, {})]), column([embed(someurl, {})])]),
  ],
})
