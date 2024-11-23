import { findByName } from '@/app/api/architects/find-by-name'
import { env } from '@/lib/env'
import { loggerError, loggerInfo } from '@/lib/logger'
import { notion } from '@/lib/notion'
import { parseRequest } from '@/lib/utils'
import {
  bulletedListItem,
  heading2,
  image,
  numberedListItem,
  paragraph,
} from '@sota1235/notion-sdk-js-helper/dist/blockObjects'
import { richText } from '@sota1235/notion-sdk-js-helper/dist/richTextObject'
import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')
  if (name === null) {
    return NextResponse.json({ message: 'Invalid query, requires `name`' }, { status: 400 })
  }
  const results = await findByName(name)
  return NextResponse.json(results, { status: 200 })
}

const BodySchema = z.object({
  name: z.object({
    jp: z.string().describe('日本語表記名'),
    en: z.string().describe('英語表記名'),
  }),
  overview: z.object({
    description: z.string().describe('500文字程度の概要'),
    imageUrl: z.string().describe('建築家画像のURL'),
  }),
  works: z.array(
    z.object({
      title: z.string().describe('建築名'),
      createdAt: z.number().describe('施工年月'),
      location: z.string().describe('所在地'),
      description: z.string().describe('建築物の説明'),
      imageUrl: z.string().describe('建築物画像のURL'),
    }),
  ),
  philosophy: z.string().describe('建築哲学や特徴'),
  externalLinks: z.array(
    z.object({ title: z.string().describe('リンク名'), url: z.string().describe('リンクURL') }),
  ),
})
export async function POST(req: Request) {
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return NextResponse.json(data.error.format(), { status: 400 })
  }
  const { name, overview, works, philosophy, externalLinks } = data.data
  return await notion.pages
    .create({
      parent: { database_id: env.ARCHITECT_DATABASE_ID },
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
        image(overview.imageUrl),
        paragraph(overview.description),
        heading2('代表作'),
        ...works.map((_work) =>
          numberedListItem(_work.title, {
            children: [
              image(_work.imageUrl),
              bulletedListItem(_work.description),
              bulletedListItem(`施工年月: ${_work.createdAt}`),
              bulletedListItem(`所在地: ${_work.location}`),
            ],
          }),
        ),
        heading2('建築哲学や特徴'),
        paragraph(philosophy),
        heading2('外部リンク'),
        ...externalLinks.map((link, _index) =>
          numberedListItem(richText(link.title, {}, link.url)),
        ),
      ],
    })
    .then((response) => {
      loggerInfo(`Created a page: ${JSON.stringify(response)}`, {
        status: 200,
        caller: 'POST /api/daily',
      })
      if ('url' in response) {
        return NextResponse.json({ url: response.url }, { status: 200 })
      }
      return NextResponse.json({ message: 'success' }, { status: 200 })
    })
    .catch((error) => {
      loggerError(`Failed to create a page: ${error}`, {
        status: 500,
        caller: 'POST /api/daily',
      })
      return NextResponse.json({ message: `Failed to create a page ${error}` }, { status: 500 })
    })
}
