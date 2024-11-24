import type { NextRequest } from 'next/server'
import { BadRequest, InternalServerError, Ok } from '../../../lib/api'
import { Logger } from '../../../lib/logger'
import { parseRequest } from '../../../lib/utils'
import { create } from './create'
import { findByName } from './find-by-name'
import { type Body, BodySchema } from './schema'
import { update } from './update'

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

  async function save(data: Body) {
    const architects = await findByName(data.name.jp)
    if (architects.length === 0) {
      return await create(data)
    }
    if (architects.length === 1) {
      return await update(architects[0].id, data)
    }
    throw new Error(`Multiple architects found; ${JSON.stringify(architects, null, 2)}`)
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
