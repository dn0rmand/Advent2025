import { Day } from './tools/day.ts'

type TInput = number[]

export class Day1 extends Day<TInput> {
  constructor() {
    super(1)
  }

  loadInput(): TInput {
    const data = this.readDataFile()
    const input: TInput = []

    for (const line of data) {
      switch (line[0]) {
        case 'L': {
          const entry: number = +line.slice(1)
          input.push(-entry)
          break
        }
        case 'R': {
          const entry: number = +line.slice(1)
          input.push(entry)
          break
        }
        default:
          throw 'syntax error'
      }
    }

    return input
  }

  part1(input: TInput): number {
    let dial = 50
    let count = 0

    for (const entry of input) {
      dial = (dial + 100 + entry) % 100
      if (dial === 0) {
        count++
      }
    }
    return count
  }

  part2(input: TInput): number {
    let dial = 50
    let count = 0

    for (const entry of input) {
      const old = dial
      const v = entry % 100
      count += Math.abs((entry - v) / 100)
      dial = dial + v

      if (dial <= 0 || dial >= 100) {
        if (old !== 0) {
          count++
        }
        dial = (dial + 100) % 100
      }
    }
    return count
  }
}

new Day1().execute()
