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
import * as v from 'valibot'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')
  if (name === null) {
    return NextResponse.json({ message: 'Invalid query, requires `name`' }, { status: 400 })
  }
  const results = await findByName(name)
  return NextResponse.json(results, { status: 200 })
}

const BodySchema = v.object({
  name: v.object({
    jp: v.string(), // 日本語表記名
    en: v.string(), // 英語表記名
  }),
  overview: v.object({
    description: v.string(), // 概要
    imageUrl: v.string(), // 画像URL
  }),
  works: v.array(
    v.object({
      title: v.string(), // 建築名
      createdAt: v.number(), // 施工年月
      location: v.string(), // 所在地
      description: v.string(), // 説明
      imageUrl: v.string(), // 画像URL
    }),
  ),
  philosophy: v.string(), // 建築哲学や特徴
  externalLinks: v.array(v.object({ title: v.string(), url: v.string() })),
})
export async function POST(req: Request) {
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return NextResponse.json(data.output, { status: 400 })
  }
  const { name, overview, works, philosophy, externalLinks } = data.output
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
