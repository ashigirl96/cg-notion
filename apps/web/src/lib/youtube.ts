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
Based on the provided YouTube transcript, create a summary in the style of a scientific paper. Please include the following sections:

Introduction: Provide the background and context of the video, highlighting key themes.
Objective: State the main purpose or research question addressed in the video.
Methodology: Summarize the approach, techniques, or logical progression presented in the video.
Results: Outline the main findings or conclusions derived from the video.
Discussion: Discuss the implications, limitations, or potential applications of the content presented.
Ensure the summary is concise and clear, with each section corresponding to the structure of a scientific paper. Use appropriate terminology, and keep each paragraph between 100-150 words.

----
< YouTube Transcript >
----

please reply in Japanese
`,
      transcript: result,
    }
  })
