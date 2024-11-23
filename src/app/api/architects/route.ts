import { findByName } from '@/app/api/architects/find-by-name'
import { save } from '@/app/api/architects/save'
import { BodySchema } from '@/app/api/architects/schema'
import { loggerError, loggerInfo } from '@/lib/logger'
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
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return NextResponse.json(data.error.format(), { status: 400 })
  }
  return await save(data.data)
    .then((response) => {
      loggerInfo(`Created a page: ${JSON.stringify(response)}`, {
        status: 200,
        caller: 'POST /api/daily',
      })
      if ('url' in response) {
        return NextResponse.json({ url: response.url }, { status: 200 })
      }
      return NextResponse.json({ message: 'success' }, { status: 200 })
    })
    .catch((error) => {
      loggerError(`Failed to create a page: ${error}`, {
        status: 500,
        caller: 'POST /api/daily',
      })
      return NextResponse.json({ message: `Failed to create a page ${error}` }, { status: 500 })
    })
}
