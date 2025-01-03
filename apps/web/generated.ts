import { env } from '@/lib/env'
import * as n from '@ashigirl96/happy-notion'
import { Client } from '@notionhq/client'

export class daily extends n.AbstractDatabase<daily> {
  id = env.DAILY_DATABASE_ID
  Categories = new n.MultiSelectField('Categories')
  Date = new n.DateField('Date')
  Epic = new n.RelationField('Epic')
  URL = new n.UrlField('URL')
  Name = new n.TitleField('Name')

  /** biome-ignore lint/complexity/noUselessConstructor: <explanation> */
  constructor(client: Client) {
    super(client)
  }
}

export class architect extends n.AbstractDatabase<architect> {
  id = env.ARCHITECT_DATABASE_ID
  architecture = new n.RelationField('architecture')
  Name = new n.TitleField('Name')

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
  Name = new n.TitleField('Name')

  /** biome-ignore lint/complexity/noUselessConstructor: <explanation> */
  constructor(client: Client) {
    super(client)
  }
}

export class input extends n.AbstractDatabase<input> {
  id = env.INPUT_DATABASE_ID
  outputs = new n.RelationField('outputs')
  PBI = new n.RelationField('PBI')
  URL = new n.UrlField('URL')
  Status = new n.StatusField('Status')
  category = new n.RelationField('category')
  Name = new n.TitleField('Name')
  Date = new n.DateField('Date')

  /** biome-ignore lint/complexity/noUselessConstructor: <explanation> */
  constructor(client: Client) {
    super(client)
  }
}

export class output extends n.AbstractDatabase<output> {
  id = env.OUTPUT_DATABASE_ID
  Date = new n.DateField('Date')
  PBI = new n.RelationField('PBI')
  SubItem = new n.RelationField('SubItem')
  category = new n.RelationField('category')
  inputs = new n.RelationField('inputs')
  Name = new n.TitleField('Name')
  mediaType = new n.SelectField('mediaType')
  URL = new n.UrlField('URL')

  /** biome-ignore lint/complexity/noUselessConstructor: <explanation> */
  constructor(client: Client) {
    super(client)
  }
}

export class pbi extends n.AbstractDatabase<pbi> {
  id = env.PBI_DATABASE_ID
  DB_OUTPUT = new n.RelationField('DB_OUTPUT')
  zettelkansenEpic = new n.RelationField('zettelkansenEpic')
  Epic = new n.RelationField('Epic')
  DB_INPUT = new n.RelationField('DB_INPUT')
  Owner = new n.PeopleField('Owner')
  Status = new n.StatusField('Status')
  Dates = new n.DateField('Dates')
  Summary = new n.RichTextField('Summary')

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
  output: new output(client),
  pbi: new pbi(client),
}
