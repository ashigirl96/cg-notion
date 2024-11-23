import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as v from 'valibot'
import type { ObjectSchema } from 'valibot'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function parseRequest<T extends ObjectSchema<any, any>>(req: Request, schema: T) {
  const body = await req.json()
  return v.safeParse(schema, body) as v.SafeParseResult<T>
}
