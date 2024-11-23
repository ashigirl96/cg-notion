import { save } from '@/app/api/words/save'
import { BodySchema } from '@/app/api/words/schema'
import { loggerError, loggerInfo } from '@/lib/logger'
import { parseRequest } from '@/lib/utils'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const data = await parseRequest(req, BodySchema)
  if (!data.success) {
    return NextResponse.json(data.error.format(), { status: 400 })
  }
  return await save(data.data)
    .then((response) => {
      loggerInfo(`Created a page: ${JSON.stringify(response)}`, {
        status: 200,
        caller: 'POST /api/words',
      })
      if ('url' in response) {
        return NextResponse.json({ url: response.url }, { status: 200 })
      }
      return NextResponse.json({ message: 'success' }, { status: 200 })
    })
    .catch((error) => {
      loggerError(`Failed to create a page: ${error}`, {
        status: 500,
        caller: 'POST /api/words',
      })
      return NextResponse.json({ message: `Failed to create a page ${error}` }, { status: 500 })
    })
}
