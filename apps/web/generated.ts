import { env } from '@/lib/env'
import * as n from '@ashigirl96/happy-notion'
import { Client } from '@notionhq/client'

export class daily extends n.AbstractDatabase<daily> {
  id = env.DAILY_DATABASE_ID
  Categories = new n.MultiSelectField('Categories')
  URL = new n.UrlField('URL')
  Name = new n.TextField('Name')

  /** biome-ignore lint/complexity/noUselessConstructor: <explanation> */
  constructor(client: Client) {
    super(client)
  }
}

export class architect extends n.AbstractDatabase<architect> {
  id = env.ARCHITECT_DATABASE_ID
  architecture = new n.RelationField('architecture')
  Name = new n.TextField('Name')

  /** biome-ignore lint/complexity/noUselessConstructor: <explanation> */
  constructor(client: Client) {
    super(client)
  }
}

export class word extends n.AbstractDatabase<word> {
  id = env.WORD_DATABASE_ID
  ref = new n.UrlField('ref')
  type = new n.SelectField('type')
  example = new n.RichTextField('example')
  pronunciation = new n.RichTextField('pronunciation')
  def = new n.RichTextField('def')
  Name = new n.TextField('Name')
  関連記事 = new n.RichTextField('関連記事')

  /** biome-ignore lint/complexity/noUselessConstructor: <explanation> */
  constructor(client: Client) {
    super(client)
  }
}

export class input extends n.AbstractDatabase<input> {
  id = env.INPUT_DATABASE_ID
  comment = new n.RichTextField('comment')
  outputs = new n.RelationField('outputs')
  authors = new n.MultiSelectField('authors')
  URL = new n.UrlField('URL')
  mediaType = new n.SelectField('mediaType')
  category = new n.RelationField('category')
  Name = new n.TextField('Name')

  /** biome-ignore lint/complexity/noUselessConstructor: <explanation> */
  constructor(client: Client) {
    super(client)
  }
}

const client = new Client({ auth: env.NOTION_TOKEN })
export const databases = {
  daily: new daily(client),
  architect: new architect(client),
  word: new word(client),
  input: new input(client),
}
