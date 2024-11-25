import { describe, expect, test } from 'bun:test'
import { parseURL } from '@/lib/utils'

describe('parseURL', () => {
  test('URLをパースする', () => {
    const url = `const text = 
  こちらはサンプルのテキストです。
  詳細はhttps://example.comをご覧ください。
  また、http://test.comやftp://fileserver.comも参照してください。
`
    expect(parseURL(url)).toEqual(
      expect.arrayContaining(['https://example.com', 'http://test.com', 'ftp://fileserver.com']),
    )
  })
})
