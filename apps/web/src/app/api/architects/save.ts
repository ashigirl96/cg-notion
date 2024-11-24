import { findByName } from '@/app/api/architects/find-by-name'
import type { Body } from '@/app/api/architects/schema'
import { env } from '@/lib/env'
import { type EmojiRequest, notion, toNotionURL } from '@/lib/notion'
import {
  bulletedListItem,
  column,
  columnList,
  embed,
  heading2,
  numberedListItem,
} from '@sota1235/notion-sdk-js-helper/dist/blockObjects'
import { richText } from '@sota1235/notion-sdk-js-helper/dist/richTextObject'

export async function save(data: Body) {
  const architects = await findByName(data.name.jp)
  if (architects.length === 0) {
    return await create(data)
  }
  if (architects.length === 1) {
    return await update(architects[0].id, data)
  }
  throw new Error(`Multiple architects found; ${JSON.stringify(architects, null, 2)}`)
}

async function create({ emoji, name, overview, philosophy, works, externalLinks }: Body) {
  return await notion.pages.create({
    parent: { database_id: env.ARCHITECT_DATABASE_ID },
    ...formatProperties({ emoji, name }),
    children: formatChildren({ overview, philosophy, works, externalLinks }),
  })
}

async function update(pageId: string, body: Body) {
  await notion.pages.update({
    page_id: pageId,
    ...formatProperties(body),
  })
  // 既存のブロックを取得
  const existingBlocks = await notion.blocks.children.list({ block_id: pageId })
  // 既に概要がある場合は何もしない
  if (
    existingBlocks.results.length > 0 &&
    'heading_2' in existingBlocks.results[0] &&
    existingBlocks.results[0].heading_2.rich_text[0].plain_text === '概要'
  ) {
    return { url: toNotionURL(pageId) }
  }
  await notion.blocks.children.append({
    block_id: pageId,
    children: formatChildren(body),
  })
  return { url: toNotionURL(pageId) }
}

function formatProperties({ emoji, name }: Pick<Body, 'emoji' | 'name'>): {
  icon: { type: 'emoji'; emoji: EmojiRequest }
  properties: { Name: { title: { text: { content: string } }[] } }
} {
  return {
    icon: {
      type: 'emoji',
      emoji: emoji as EmojiRequest,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: `${name.jp}(${name.en})`,
            },
          },
        ],
      },
    },
  }
}

function formatChildren(body: Pick<Body, 'overview' | 'philosophy' | 'works' | 'externalLinks'>) {
  const { overview, philosophy, works, externalLinks } = body
  const images = overview.imageUrls.map((url) => column([embed(url, {})]))
  return [
    heading2('概要'),
    columnList(images),
    ...overview.description.map((description) => bulletedListItem(description)),
    heading2('代表作'),
    ...works.map((_work) =>
      numberedListItem(richText(_work.title, {}, _work.url), {
        children: [
          bulletedListItem(_work.description),
          bulletedListItem(`施工年月: ${_work.createdAt}`),
          bulletedListItem(`所在地: ${_work.location}`),
        ],
      }),
    ),
    heading2('建築哲学や特徴'),
    ...philosophy.map((item) => bulletedListItem(item)),
    heading2('外部リンク'),
    ...externalLinks.map((link, _index) => numberedListItem(richText(link.title, {}, link.url))),
  ]
}
