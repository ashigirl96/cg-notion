import { findByName } from '@/app/api/architects/find-by-name'
import type { Body } from '@/app/api/architects/schema'
import type { EmojiRequest } from '@/lib/notion'
import {
  bulletedListItem,
  column,
  columnList,
  embed,
  heading2,
  numberedListItem,
} from '@sota1235/notion-sdk-js-helper/dist/blockObjects'
import { richText } from '@sota1235/notion-sdk-js-helper/dist/richTextObject'
import { databases } from 'generated'

export async function save(data: Body) {
  const architects = await findByName(data.name.jp)
  const { emoji, properties } = formatProperties(data)
  return await databases.architect.savePage({
    where: databases.architect.Name.contains(data.name.jp),
    emoji,
    properties,
    children: formatChildren(data),
    options: {
      isAppendChildren: async (client) => {
        if (architects.length === 0) {
          return false
        }
        const pageId = architects[0].id
        const existingBlocks = await client.blocks.children.list({ block_id: pageId })
        return !(
          existingBlocks.results.length > 0 &&
          'heading_2' in existingBlocks.results[0] &&
          existingBlocks.results[0].heading_2.rich_text[0].plain_text === '概要'
        )
      },
    },
  })
}

function formatProperties({ emoji, name }: Pick<Body, 'emoji' | 'name'>): {
  emoji: EmojiRequest
  properties: { Name: { title: { text: { content: string } }[] } }
} {
  return {
    emoji: emoji as EmojiRequest,
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
    images.length >= 2 ? columnList(images) : null,
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
  ].filter((item) => item !== null)
}
