import { YoutubeTranscript } from 'youtube-transcript'
import z from 'zod'

export const transcriptSchema = z
  .string()
  .url()
  .describe('A URL to a YouTube video.')
  .refine(
    (url) => {
      try {
        const parsedUrl = new URL(url)

        // ホストが "youtube" を含むことをチェック
        if (!parsedUrl.hostname.includes('youtube')) {
          return false
        }

        // クエリパラメータに "v" が存在することをチェック
        const params = new URLSearchParams(parsedUrl.search)
        return params.has('v')
      } catch {
        return false // URLが無効な場合もエラーにする
      }
    },
    {
      message: "The URL must have a host containing 'youtube' and a query parameter 'v'.",
    },
  )
  .transform(async (url) => {
    const parsedUrl = new URL(url)
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const videoId = new URLSearchParams(parsedUrl.search).get('v')!
    const results = await YoutubeTranscript.fetchTranscript(videoId)
    const result = results.map((r) => r.text).join('')

    return `
以下は、${videoId} の字幕の内容です。
要約して、日本語でレスポンスしてください。

----
${result}
----
`
  })
