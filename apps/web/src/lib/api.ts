import { NextResponse } from 'next/server'
import type { Logger } from './logger'

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

export function Ok<JsonBody extends object>(
  body: JsonBody,
  logger: Logger,
  init?: ResponseInit,
): NextResponse<JsonBody> {
  logger.info(body, { status: ApiStatus.OK })
  return NextResponse.json(body, {
    ...init,
    status: ApiStatus.OK,
  })
}

export function InternalServerError<JsonBody extends object>(
  body: JsonBody,
  logger: Logger,
  init?: ResponseInit,
): NextResponse<JsonBody> {
  logger.error(body, { status: ApiStatus.InternalServerError })
  return NextResponse.json(body, {
    ...init,
    status: ApiStatus.InternalServerError,
  })
}

export function BadRequest<JsonBody extends object>(
  body: JsonBody,
  logger: Logger,
  init?: ResponseInit,
): NextResponse<JsonBody> {
  logger.error(body, { status: ApiStatus.BadRequest })
  return NextResponse.json(body, {
    ...init,
    status: ApiStatus.BadGateway,
  })
}
