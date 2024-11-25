import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type z from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function parseRequest<T extends z.ZodObject<any>>(req: Request, schema: T) {
  const body = await req.json()
  return schema.safeParse(body) as z.SafeParseReturnType<z.output<T>, z.output<T>>
}

export const urlPattern =
  /\b(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]/g
export function parseURL(value: string) {
  return value.match(urlPattern)?.map((url) => url) ?? []
}
