import { Client } from '@notionhq/client'
import type {
  CreatePageParameters,
  CreatePageResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { type Result, ResultAsync } from 'neverthrow'
import { env } from './env'

type WithAuth<P> = P & {
  auth?: string
}

export const notion = new Client({
  auth: env.NOTION_TOKEN,
})

export async function createPage(
  params: Parameters<typeof notion.pages.create>[0],
): Promise<Result<CreatePageResponse, unknown>> {
  return ResultAsync.fromPromise(
    notion.pages.create(params as WithAuth<CreatePageParameters>),
    (error) => error,
  )
}

export function toNotionURL(pageId: string) {
  return `https://www.notion.so/${pageId.replace(/-/g, '')}`
}

export type EmojiRequest = Extract<
  Parameters<typeof notion.pages.create>[0]['icon'],
  { type?: 'emoji' }
>['emoji']
