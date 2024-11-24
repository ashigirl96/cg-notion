import { env } from '../../../lib/env'
import { type EmojiRequest, notion } from '../../../lib/notion'
import type { Body } from './schema'

export async function save({ emoji, name, type, example, def, pronunciation }: Body) {
  return await notion.pages.create({
    parent: { database_id: env.WORD_DATABASE_ID },
    icon: {
      type: 'emoji',
      emoji: emoji as EmojiRequest,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      pronunciation: {
        rich_text: [
          {
            text: {
              content: pronunciation,
            },
          },
        ],
      },
      def: {
        rich_text: [
          {
            text: {
              content: def,
            },
          },
        ],
      },
      example: {
        rich_text: [
          {
            text: {
              content: example,
            },
          },
        ],
      },
      type: {
        select: {
          name: type,
        },
      },
    },
  })
}
