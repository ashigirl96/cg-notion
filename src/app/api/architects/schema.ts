import z from 'zod'

export const BodySchema = z.object({
  emoji: z.string().describe('建築家のイメージに合う絵文字'),
  name: z.object({
    jp: z.string().describe('日本語表記名'),
    en: z.string().describe('英語表記名'),
  }),
  overview: z.object({
    description: z.array(z.string().describe('500文字程度の概要')),
  }),
  works: z.array(
    z.object({
      title: z.string().describe('建築名'),
      createdAt: z.number().describe('施工年月'),
      location: z.string().describe('所在地'),
      description: z.string().describe('建築物の説明'),
      url: z.string().describe('建築物画像のURL'),
    }),
  ),
  philosophy: z.array(z.string()).describe('建築哲学や特徴'),
  externalLinks: z.array(
    z.object({ title: z.string().describe('リンク名'), url: z.string().describe('リンクURL') }),
  ),
})
export type Body = z.output<typeof BodySchema>
