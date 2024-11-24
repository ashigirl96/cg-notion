import { z } from 'zod'

export const envSchema = z.object({
  NOTION_TOKEN: z.string(),
  DAILY_DATABASE_ID: z.string(),
  ARCHITECT_DATABASE_ID: z.string(),
  WORD_DATABASE_ID: z.string(),
})

export type Env = z.output<typeof envSchema>
export const env = envSchema.parse(process.env)
