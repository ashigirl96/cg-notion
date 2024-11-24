import z from 'zod'
import { BadRequest, InternalServerError, Ok } from '../../../lib/api'
import { env } from '../../../lib/env'
import { Logger } from '../../../lib/logger'
import { notion } from '../../../lib/notion'
import { parseRequest } from '../../../lib/utils'

const BodySchema = z.object({
  name: z.string(),
})
export async function POST(req: Request) {
  const logger = new Logger('POST /api/daily')
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return BadRequest(data.error.format(), logger)
  }
  const { name } = data.data
  const isGoodDay = name.includes('良')
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
          multi_select: [
            {
              name: '一言',
            },
            isGoodDay
              ? {
                  name: 'Good Day',
                }
              : null,
          ].filter((item): item is { name: string } => item !== null),
        },
      },
    })
    .then((response) => {
      if ('url' in response) {
        return Ok({ url: response.url }, logger)
      }
    })
    .catch((error) => {
      return InternalServerError({ message: `Failed to create a page ${error}` }, logger)
    })
}
