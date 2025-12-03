import { Day } from './tools/day.ts'

type TInput = string[]
export class Day7 extends Day<TInput> {
  constructor() {
    super(7)
  }

  loadInput(): TInput {
    const data = this.readDataFile()
    return data
  }

  part1(_: TInput): number {
    return 0
  }

  part2(_: TInput): number {
    return 0
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day7().execute()
}
