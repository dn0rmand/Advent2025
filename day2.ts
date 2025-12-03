import { Day } from './tools/day.ts'

type TRange = {
  min: number
  max: number
}

type TInput = {
  ranges: TRange[]
  min: number
  max: number
}

export class Day2 extends Day<TInput> {
  constructor() {
    super(2)
  }

  loadInput(): TInput {
    const data = this.readDataFile()

    const ranges: TRange[] = []

    let $min = Number.MAX_SAFE_INTEGER
    let $max = 0

    for (const line of data) {
      for (const r of line.split(',')) {
        const [min, max] = r.split('-')
        const range = { min: +min, max: +max }
        $min = Math.min(range.min, $min)
        $max = Math.max(range.max, $max)

        ranges.push(range)
      }
    }

    ranges.sort((a, b) => b.max - a.max)
    return { ranges: ranges, min: $min, max: $max }
  }

  sumInvalid(min: number, max: number): number {
    let minLength = min.toString().length
    let maxLength = max.toString().length
    let sum = 0
    for (let length = minLength; length <= maxLength; length++) {
      if (length & 1) {
        continue
      }
      const end = Math.min(10 ** length, max)
      const factor = 10 ** (length / 2)
      let start = factor / 10
      if (length === minLength) {
        start = (min - (min % factor)) / factor
      }
      while (true) {
        let value = start * factor + start
        if (value > end) {
          break
        }
        if (value >= min) {
          sum += value
        }
        start++
      }
    }
    return sum
  }

  part1(input: TInput): number {
    let total = 0
    for (const range of input.ranges) {
      total += this.sumInvalid(range.min, range.max)
    }
    return total
  }

  isInRange(value: number, ranges: TRange[]): boolean {
    for (const range of ranges) {
      if (value > range.max) {
        return false
      }
      if (value >= range.min) {
        return true
      }
    }
    return false
  }

  part2(input: TInput): number {
    const invalid = new Set<number>()
    let sum = 0

    let factor = 10
    for (let pattern = 1; ; pattern++) {
      if (pattern % factor === 0) {
        factor *= 10
      }
      let value = pattern * factor + pattern
      if (value > input.max) {
        break
      }
      while (value <= input.max) {
        if (value >= input.min) {
          if (!invalid.has(value) && this.isInRange(value, input.ranges)) {
            invalid.add(value)
            sum += value
          }
        }
        value = value * factor + pattern
      }
    }

    return sum
  }
}
if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day2().execute()
}
