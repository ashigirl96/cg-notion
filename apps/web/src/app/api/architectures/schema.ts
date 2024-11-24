import z from 'zod'

const category = z.union([
  z.literal('美術館'),
  z.literal('旅館'),
  z.literal('自然史博物館'),
  z.literal('アートギャラリー'),
  z.literal('迎賓館'),
  z.literal('タワー'),
  z.literal('寺・神社'),
  z.literal('団地'),
  z.literal('博物館'),
  z.literal('複合文化施設'),
  z.literal('多目的ホール'),
  z.literal('図書館'),
  z.literal('教会'),
  z.literal('イベント'),
  z.literal('キャンプ'),
  z.literal('文学館'),
  z.literal('広場'),
  z.literal('競技場'),
  z.literal('飲食店'),
  z.literal('事務所'),
  z.literal('ホテル'),
  z.literal('海'),
  z.literal('水族館'),
  z.literal('橋'),
  z.literal('工場'),
  z.literal('市役所・民会館'),
  z.literal('劇場'),
])

export const BodySchema = z.object({
  emoji: z.string().describe('建築のイメージに合う絵文字'),
  location: z.string().describe('場所'),
  categories: z.array(category).describe('カテゴリ'),
  name: z.object({
    jp: z.string().describe('建築の日本語表記名'),
    en: z.string().describe('建築の英語表記名'),
  }),
  createdAt: z.number().describe('施工年月'),
  description: z.array(z.string().describe('それぞれ1000文字程度の概要の文')),
  features: z.array(z.string()).describe('それぞれ1000文字程度の特徴の文'),
  externalLinks: z.array(
    z.object({ title: z.string().describe('リンク名'), url: z.string().describe('リンクURL') }),
  ),
})
