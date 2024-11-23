import { findByName } from '@/app/api/architects/find-by-name'
import { env } from '@/lib/env'
import { loggerError, loggerInfo } from '@/lib/logger'
import { notion } from '@/lib/notion'
import { parseRequest } from '@/lib/utils'
import {
  heading2,
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
  name: v.string(),
  overview: v.string(),
  works: v.array(v.string()),
  philosophy: v.string(),
  externalLinks: v.array(v.object({ title: v.string(), url: v.string() })),
})
export async function POST(req: Request) {
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return NextResponse.json(data.issues, { status: 400 })
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
                content: name,
              },
            },
          ],
        },
      },
      children: [
        heading2('概要'),
        paragraph(overview),
        heading2('代表作'),
        ...works.map((work) => numberedListItem(work)),
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
