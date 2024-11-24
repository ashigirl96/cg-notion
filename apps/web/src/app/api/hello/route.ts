import { NextResponse } from 'next/server'

const _allowedOrigins = ['https://chatgpt.com']

export const runtime = 'edge'

export async function GET(_request: Request) {
  return NextResponse.json({ message: 'Hello, world!' })
}

export async function POST(req: Request) {
  const data = await req.json()
  return NextResponse.json({ message: 'POST method called', data })
}
