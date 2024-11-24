import {
  bulletedListItem,
  heading2,
  numberedListItem,
  paragraph,
} from '@sota1235/notion-sdk-js-helper/dist/blockObjects'
import { richText } from '@sota1235/notion-sdk-js-helper/dist/richTextObject'
import { env } from '../../../lib/env'
import { type EmojiRequest, notion } from '../../../lib/notion'
import type { Body } from './schema'

export async function create({ emoji, name, overview, philosophy, works, externalLinks }: Body) {
  return await notion.pages.create({
    parent: { database_id: env.ARCHITECT_DATABASE_ID },
    icon: {
      // type: 'external',
      // external: {
      //   url: '',
      // }
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
      ...externalLinks.map((link, _index) => numberedListItem(richText(link.title, {}, link.url))),
    ],
  })
}
