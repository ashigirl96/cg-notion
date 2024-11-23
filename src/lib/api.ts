import type { Logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

export const ApiStatus = {
  OK: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
} as const
export type ApiStatus = (typeof ApiStatus)[keyof typeof ApiStatus]

export function Ok<JsonBody>(
  body: JsonBody,
  logger: Logger,
  init?: ResponseInit,
): NextResponse<JsonBody> {
  logger.info(JSON.stringify(body, null, 2), { status: ApiStatus.OK })
  return NextResponse.json(body, {
    ...init,
    status: ApiStatus.OK,
  })
}

export function InternalServerError<JsonBody>(
  body: JsonBody,
  logger: Logger,
  init?: ResponseInit,
): NextResponse<JsonBody> {
  logger.info(JSON.stringify(body, null, 2), { status: ApiStatus.InternalServerError })
  return NextResponse.json(body, {
    ...init,
    status: ApiStatus.InternalServerError,
  })
}

export function BadRequest<JsonBody>(
  body: JsonBody,
  logger: Logger,
  init?: ResponseInit,
): NextResponse<JsonBody> {
  logger.info(JSON.stringify(body, null, 2), { status: ApiStatus.BadRequest })
  return NextResponse.json(body, {
    ...init,
    status: ApiStatus.BadGateway,
  })
}
