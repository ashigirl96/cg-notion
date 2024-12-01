import { ApiStatus, InternalServerError, Ok } from '@/lib/api'
import { env } from '@/lib/env'
import { Logger } from '@/lib/logger'
import { notion } from '@/lib/notion'
import '@/lib/globals'

async function job(logger: Logger) {
  const inputResponse = await notion.databases.query({
    database_id: env.INPUT_DATABASE_ID,
    filter: {
      and: [
        {
          property: 'category',
          relation: {
            is_empty: true,
          },
        },
        {
          property: 'outputs',
          relation: {
            is_not_empty: true,
          },
        },
      ],
    },
  })
  if (inputResponse.results.length === 0) {
    logger.info({ message: 'No items to process!' }, { status: ApiStatus.OK })
    return
  }

  // 取得したアイテムの処理
  for (const inputResult of inputResponse.results) {
    const inputId = inputResult.id
    // @ts-expect-error
    const outputId = inputResult.properties.outputs.relation.last().id

    const outputResponse = await notion.pages.retrieve({
      page_id: outputId,
    })
    // @ts-expect-error
    const categoryId = outputResponse.properties.category.relation.last().id
    logger.info(categoryId, { status: ApiStatus.OK })

    await notion.pages.update({
      page_id: inputId,
      properties: {
        category: {
          relation: [{ id: categoryId }],
        },
      },
    })
  }
}

export async function GET() {
  const logger = new Logger('GET /api/cron')
  return await job(logger)
    .then(() => Ok({ message: 'OK' }, logger))
    .catch((error) => InternalServerError({ message: error }, logger))
}
