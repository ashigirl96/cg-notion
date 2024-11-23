import { create } from '@/app/api/architects/create'
import { findByName } from '@/app/api/architects/find-by-name'
import { BodySchema } from '@/app/api/architects/schema'
import { BadRequest, InternalServerError, Ok } from '@/lib/api'
import { Logger } from '@/lib/logger'
import { parseRequest } from '@/lib/utils'
import type { NextRequest } from 'next/server'

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
  return await create(data.data)
    .then((response) => {
      // @ts-expect-error
      return Ok({ url: response.url }, logger)
    })
    .catch((error) => {
      InternalServerError({ message: `Failed to create a page ${error}` }, logger)
    })
}
