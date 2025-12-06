import { Day } from './tools/day.ts'

type TRange = {
  from: number
  to: number
}

type TInput = {
  ranges: TRange[]
  ingredients: number[]
}

export class Day5 extends Day<TInput> {
  constructor() {
    super(5)
  }

  loadInput(): TInput {
    const data = this.readDataFile()
    const ranges: TRange[] = []
    const ingredients: number[] = []

    let index = 0
    // Load ranges
    while (index < data.length) {
      const line = data[index++]
      if (line.length === 0) {
        break
      }
      const [from, to] = line.split('-').map(v => +v)
      ranges.push({ from, to })
    }

    ranges.sort((a, b) => {
      const d = a.from - b.from
      return d ? d : a.to - b.to
    })

    // Load ingredients
    while (index < data.length) {
      ingredients.push(+data[index++])
    }

    return { ranges, ingredients }
  }

  part1(input: TInput): number {
    const good = input.ingredients.filter(ingredient => input.ranges.some(({ from, to }) => from <= ingredient && ingredient <= to))

    return good.length
  }

  part2(input: TInput): number {
    let lastTo = 0
    let total = 0

    for (let i = 0; i < input.ranges.length; i++) {
      let { from, to } = input.ranges[i]

      if (lastTo >= to) {
        continue
      }

      if (from <= lastTo) {
        from = lastTo + 1
      }

      total += to - from + 1
      lastTo = to
    }

    return total
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day5().execute()
}
