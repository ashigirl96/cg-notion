import { save } from '@/app/api/architects/save'
import { BadRequest, InternalServerError, Ok } from '@/lib/api'
import { Logger } from '@/lib/logger'
import { parseRequest } from '@/lib/utils'
import type { NextRequest } from 'next/server'
import { findByName } from './find-by-name'
import { BodySchema } from './schema'

export async function GET(req: NextRequest) {
  const logger = new Logger('GET /api/architects')
  const name = req.nextUrl.searchParams.get('name')
  if (name === null) {
    return BadRequest({ message: 'Invalid query, requires `name`' }, logger)
  }
  const results = await findByName(name)
  return Ok(results, logger)
}

export async function POST(req: Request) {
  const logger = new Logger('POST /api/architects')
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
