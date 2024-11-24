import { BadRequest, InternalServerError, Ok } from '../../../lib/api'
import { Logger } from '../../../lib/logger'
import { parseRequest } from '../../../lib/utils'
import { save } from './save'
import { BodySchema } from './schema'

export async function POST(req: Request) {
  const logger = new Logger('POST /api/words')
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return BadRequest(data.error.format(), logger)
  }
  return await save(data.data)
    .then((response) => {
      // @ts-expect-error
      return Ok({ url: response.url }, logger)
    })
    .catch((error) => {
      return InternalServerError({ message: `Failed to create a page ${error}` }, logger)
    })
}
