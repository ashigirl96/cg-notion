import z from 'zod'

import { Innertube } from 'youtubei.js/web'

const youtube = await Innertube.create({
  lang: 'ja',
  location: 'JP',
  retrieve_player: false,
})

const _fetchTranscript = async (url: string): Promise<string[]> => {
  try {
    const info = await youtube.getInfo(url)
    const transcriptData = await info.getTranscript()
    if (transcriptData?.transcript?.content?.body == null) {
      throw new Error('Transcript not available')
    }
    return transcriptData.transcript.content.body.initial_segments.map(
      (segment) => segment.snippet.text ?? '',
    )
  } catch (error) {
    console.error('Error fetching transcript:', error)
    throw error
  }
}

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
    const result = (await _fetchTranscript(videoId)).join('')

    return {
      prompt: `
以下のトランスクリプトを要約し、読者に役立つ記事を作成してください。
記事には魅力的なタイトルを付け、導入、本論、結論の構成で書き、見出しや箇条書きを用いて情報を整理してください。必ず日本語で返しなさい。

----
[YouTube Transcript]
----
`,
      transcript: result,
    }
  })
