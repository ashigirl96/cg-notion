import { toNotionURL } from '@/lib/notion'
import { databases } from 'generated'

export type FindByName = {
  id: string
  url: string
  name: string
}[]
export async function findByName(name: string): Promise<FindByName> {
  const pages = await databases.architect.findPagesBy({
    where: databases.architect.Name.contains(name),
  })
  if (pages.isOk()) {
    return pages.value
      .map((result) => ({
        id: result.id,
        url: toNotionURL(result.id),
        name: result.properties.Name,
      }))
      .filter((result) => result !== undefined)
  }
  return []
}
