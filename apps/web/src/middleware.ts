import { env } from '@/lib/env'
import { type MiddlewareConfig, NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (
    pathname === '/api/cron' &&
    request.headers.get('Authorization') === `Bearer ${env.CRON_SECRET}`
  ) {
    return NextResponse.next() // 通過せず、次の処理へ進む
  }
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

export const config: MiddlewareConfig = {
  matcher: '/api/:path*',
}
