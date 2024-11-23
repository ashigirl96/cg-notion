import { save } from '@/app/api/words/save'
import { BodySchema } from '@/app/api/words/schema'
import { BadRequest, InternalServerError, Ok } from '@/lib/api'
import { Logger } from '@/lib/logger'
import { parseRequest } from '@/lib/utils'

export async function POST(req: Request) {
  const logger = new Logger('POST /api/words')
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return BadRequest(data.error.format(), logger)
  }
  return await save(data.data)
    .then((response) => {
      if ('url' in response) {
        return Ok({ url: response.url }, logger)
      }
      return Ok({ message: 'success' }, logger)
    })
    .catch((error) => {
      return InternalServerError({ message: `Failed to create a page ${error}` }, logger)
    })
}
