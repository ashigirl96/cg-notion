import { InternalServerError, Ok } from '@/lib/api'
import { Logger } from '@/lib/logger'
import '@/lib/globals'
import { databases } from 'generated'

async function job(logger: Logger) {
  // NEW
  await databases.input.chain({
    where: {
      and: [databases.input.category.isEmpty(), databases.input.outputs.isNotEmpty()],
    },
    from: databases.input.outputs,
    middle: databases.output.category,
    to: databases.input.category,
  })
  await databases.input.chain({
    where: {
      and: [databases.input.outputs.isNotEmpty(), databases.input.PBI.isEmpty()],
    },
    from: databases.input.outputs,
    middle: databases.output.PBI,
    to: databases.input.PBI,
  })
}

export async function GET() {
  const logger = new Logger('GET /api/cron')
  return await job(logger)
    .then(() => Ok({ message: 'OK' }, logger))
    .catch((error) => InternalServerError({ message: error }, logger))
}
