import { save } from '@/app/api/architects/save'
import { BadRequest, InternalServerError, Ok } from '@/lib/api'
import { Logger } from '@/lib/logger'
import { toNotionURL } from '@/lib/notion'
import { parseRequest } from '@/lib/utils'
import { databases } from 'generated'
import type { NextRequest } from 'next/server'
import { BodySchema } from './schema'

export async function GET(req: NextRequest) {
  const logger = new Logger('GET /api/architects')
  const name = req.nextUrl.searchParams.get('name')
  if (name === null) {
    return BadRequest({ message: 'Invalid query, requires `name`' }, logger)
  }
  const pages = await databases.architect.findPagesBy({
    where: databases.architect.Name.contains(name),
  })
  const results = pages.match(
    (pages) => {
      return pages
        .map((result) => ({
          id: result.id,
          url: toNotionURL(result.id),
          name: result.properties.Name,
        }))
        .filter((result) => result !== undefined)
    },
    (error) => {
      logger.error({ message: error }, { status: 500 })
      return []
    },
  )
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
      return Ok({ url: response.map((x) => x.url) }, logger)
    })
    .catch((error) => {
      return InternalServerError({ message: `Failed to create a page ${error}` }, logger)
    })
}
