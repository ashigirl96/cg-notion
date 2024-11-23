import { env } from '@/lib/env'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const notionToken = request.headers.get('X-NOTION-TOKEN')
  if (notionToken === null || notionToken !== env.NOTION_TOKEN) {
    return new NextResponse('Unauthorized: Invalid API Key', { status: 401 })
  }
  // TODO: いずれCORSの設定を追加する
  // const origin = request.headers.get('origin')
  // if (origin && allowedOrigins.includes(origin)) {
  //   const response = NextResponse.next()
  //   response.headers.set('Access-Control-Allow-Origin', origin)
  //   response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  //   response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  //   return response
  // }
  // return new NextResponse(`CORS policy does not allow access from ${origin}.`, { status: 403 })
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
