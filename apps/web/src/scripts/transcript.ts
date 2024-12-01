import { exit } from 'node:process'
import { transcriptSchema } from '@/lib/youtube'

const url = 'https://www.youtube.com/watch?v=VKt4P1SmCTs'
const _response = await transcriptSchema.safeParseAsync(url)
if (!_response.success) {
  console.error(_response.error)
  exit(1)
}
console.log(_response.data)
