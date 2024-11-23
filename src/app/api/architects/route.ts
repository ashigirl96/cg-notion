import { env } from '@/lib/env'
import { loggerError, loggerInfo } from '@/lib/logger'
import { notion } from '@/lib/notion'
import { parseRequest } from '@/lib/utils'
import { type NextRequest, NextResponse } from 'next/server'
import * as v from 'valibot'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')
  if (name === null) {
    return NextResponse.json({ message: 'Invalid query, requires `name`' }, { status: 400 })
  }
  const _response = await notion.databases.query({
    database_id: env.ARCHITECT_DATABASE_ID,
    filter: {
      property: 'Name',
      title: {
        contains: name,
      },
    },
  })
  const results = _response.results
    .map((result) => {
      return {
        id: result.id,
        name: result.properties.Name.title[0].text.content,
      }
    })
    .filter((result): result is { id: string; name: string } => result !== undefined)
  return NextResponse.json(results, { status: 200 })
}

const BodySchema = v.object({
  name: v.string(),
})
export async function POST(req: Request) {
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 })
  }
  const { name } = data.output
  return await notion.pages
    .create({
      parent: { database_id: env.DAILY_DATABASE_ID },
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
        Categories: {
          select: {
            name: '一言',
          },
        },
      },
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
