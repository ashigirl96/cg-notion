import { env } from '@/lib/env'
import { notion, toNotionURL } from '@/lib/notion'

export type FindByName = {
  id: string
  url: string
  name: string
}[]
export async function findByName(name: string): Promise<FindByName> {
  const _response = await notion.databases.query({
    database_id: env.ARCHITECT_DATABASE_ID,
    filter: {
      property: 'Name',
      title: {
        contains: name,
      },
    },
  })
  return _response.results
    .map((result) => {
      return {
        id: result.id,
        url: toNotionURL(result.id),
        // @ts-ignore
        name: result.properties.Name.title[0].text.content,
      }
    })
    .filter((result): result is { id: string; url: string; name: string } => result !== undefined)
}
