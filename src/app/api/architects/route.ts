import { findByName } from '@/app/api/architects/find-by-name'
import { save } from '@/app/api/architects/save'
import { BodySchema } from '@/app/api/architects/schema'
import { BadRequest, InternalServerError, Ok } from '@/lib/api'
import { Logger } from '@/lib/logger'
import { parseRequest } from '@/lib/utils'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')
  if (name === null) {
    return NextResponse.json({ message: 'Invalid query, requires `name`' }, { status: 400 })
  }
  const results = await findByName(name)
  return NextResponse.json(results, { status: 200 })
}

export async function POST(req: Request) {
  const logger = new Logger('POST /api/architects')
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return BadRequest(data.error.format(), logger)
  }
  return await save(data.data)
    .then((response) => {
      if ('url' in response) {
        return Ok({ url: response.url }, logger)
      }
    })
    .catch((error) => {
      InternalServerError({ message: `Failed to create a page ${error}` }, logger)
    })
}
