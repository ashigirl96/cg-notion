import { exit } from 'node:process'
import { transcriptSchema } from '@/lib/youtube'

const url = 'https://www.youtube.com/watch?v=YblC5sywKt8'
const _response = await transcriptSchema.safeParseAsync(url)
if (!_response.success) {
  console.error(_response.error)
  exit(1)
}
console.log(_response.data)
