import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
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
      logger.info(`Created a page: ${JSON.stringify(response)}`)
      return NextResponse.json({ message: 'POST method called', data })
    })
    .catch((error) => {
      logger.error(`Failed to create a page: ${error}`)
      return NextResponse.json({ message: `Failed to create a page ${error}` }, { status: 500 })
    })
}
