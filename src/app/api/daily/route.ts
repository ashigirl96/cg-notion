import { env } from '@/lib/env'
import { loggerError, loggerInfo } from '@/lib/logger'
import { notion } from '@/lib/notion'
import { parseRequest } from '@/lib/utils'
import { NextResponse } from 'next/server'
import * as v from 'valibot'

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
      },
    })
    .then((response) => {
      loggerInfo(`Created a page: ${JSON.stringify(response)}`, {
        status: 200,
        caller: 'POST /api/daily',
      })
      return NextResponse.json({ message: 'POST method called', data })
    })
    .catch((error) => {
      loggerError(`Failed to create a page: ${error}`, {
        status: 500,
        caller: 'POST /api/daily',
      })
      return NextResponse.json({ message: `Failed to create a page ${error}` }, { status: 500 })
    })
}
