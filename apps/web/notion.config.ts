import { env } from '@/lib/env'
import type { NotionConfig } from '@ashigirl96/happy-notion'

export const config: NotionConfig = {
  databases: {
    daily: env.DAILY_DATABASE_ID,
    architect: env.ARCHITECT_DATABASE_ID,
    word: env.WORD_DATABASE_ID,
    input: env.INPUT_DATABASE_ID,
    output: env.OUTPUT_DATABASE_ID,
    pbi: env.PBI_DATABASE_ID,
  },
  apiKey: env.NOTION_TOKEN,
}
