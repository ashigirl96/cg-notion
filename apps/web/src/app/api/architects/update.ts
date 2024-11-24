import { type EmojiRequest, notion, toNotionURL } from '@/lib/notion'
import {
  bulletedListItem,
  heading2,
  numberedListItem,
  paragraph,
} from '@sota1235/notion-sdk-js-helper/dist/blockObjects'
import { richText } from '@sota1235/notion-sdk-js-helper/dist/richTextObject'
import type { Body } from './schema'

export async function update(pageId: string, body: Body) {
  return await updatePageProperties(pageId, body)
    .then(() => updatePageBlocks(pageId, body))
    .then(() => ({ url: toNotionURL(pageId) }))
}

async function updatePageProperties(pageId: string, { emoji, name }: Pick<Body, 'emoji' | 'name'>) {
  return await notion.pages.update({
    page_id: pageId,
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
  })
}

async function updatePageBlocks(
  pageId: string,
  { overview, philosophy, works, externalLinks }: Omit<Body, 'emoji' | 'name'>,
) {
  // 既存のブロックを取得
  const existingBlocks = await notion.blocks.children.list({ block_id: pageId })

  // 既に概要がある場合は何もしない
  if (
    existingBlocks.results.length > 0 &&
    'heading_2' in existingBlocks.results[0] &&
    existingBlocks.results[0].heading_2.rich_text[0].plain_text === '概要'
  ) {
    return
  }

  // 新しいブロックを追加
  return await notion.blocks.children.append({
    block_id: pageId,
    children: [
      heading2('概要'),
      paragraph(overview.description),
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
      paragraph(philosophy),
      heading2('外部リンク'),
      ...externalLinks.map((link) => numberedListItem(richText(link.title, {}, link.url))),
    ],
  })
}
