import { env } from '@/lib/env'
import { Client } from '@notionhq/client'
import type {
  CreatePageParameters,
  CreatePageResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { type Result, ResultAsync } from 'neverthrow'

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