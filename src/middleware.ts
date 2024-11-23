import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = ['https://chatgpt.com']

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
  return new NextResponse('CORS policy does not allow access from your origin.', { status: 403 })
}

export const config = {
  matcher: '/api/:path*',
}
