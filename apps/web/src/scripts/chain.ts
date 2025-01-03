import { databases } from 'generated'

async function main() {
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

void main()
