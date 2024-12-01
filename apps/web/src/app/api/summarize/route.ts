import { BadRequest, Ok } from '@/lib/api'
import { Logger } from '@/lib/logger'
import { transcriptSchema } from '@/lib/youtube'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const logger = new Logger('POST /api/summarize')
  const url = req.nextUrl.searchParams.get('url')
  if (url === null) {
    return BadRequest({ message: 'Invalid query, requires `url`' }, logger)
  }
  const result = await transcriptSchema.safeParseAsync(url)
  if (!result.success) {
    return BadRequest(result.error.format(), logger)
  }
  return Ok({ prompt: result.data }, logger)
}
