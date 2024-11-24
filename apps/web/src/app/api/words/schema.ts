import z from 'zod'

const typeSchema = z.union([
  z.literal('建築'),
  z.literal('慣用句'),
  z.literal('ビジネス'),
  z.literal('技術'),
  z.literal('哲学'),
  z.literal('その他'),
  z.literal('食べ物'),
  z.literal('科学'),
  z.literal('心理学'),
  z.literal('仮想通貨'),
  z.literal('金融工学'),
  z.literal('芸術'),
  z.literal('旅'),
])

export const BodySchema = z.object({
  emoji: z.string().describe('文字のイメージに合う絵文字'),
  name: z.string().describe('日本語表記名'),
  pronunciation: z.string().describe('読み方'),
  def: z.string().describe('定義'),
  example: z.string().describe('例文'),
  type: typeSchema,
})
export type Body = z.output<typeof BodySchema>
