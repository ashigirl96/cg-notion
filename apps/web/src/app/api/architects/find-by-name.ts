import { toNotionURL } from '@/lib/notion'
import { databases } from 'generated'

export type FindByName = {
  id: string
  url: string
  name: string
}[]
export async function findByName(name: string): Promise<FindByName> {
  const response = await databases.architect.findBy({
    where: databases.architect.Name.contains(name),
  })
  return response
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
