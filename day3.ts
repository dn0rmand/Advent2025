import { Day } from './tools/day.ts'

type TBattery = { jolt: number; index: number }
type TBank = TBattery[]
type TInput = TBank[]

export class Day3 extends Day<TInput> {
  constructor() {
    super(3)
  }

  loadInput(): TInput {
    const data = this.readDataFile()
    const input: TInput = []

    for (const line of data) {
      const r = line.split('').map((v, i) => ({ jolt: +v, index: i }))
      r.sort((a, b) => b.jolt - a.jolt)
      input.push(r)
    }
    return input
  }

  getJoltage(bank: TBank, digits: number): number {
    let joltage = 0
    let minIndex = -1
    let maxIndex = bank.length - digits
    while (digits--) {
      maxIndex++
      const j1 = bank.find(({ jolt: _, index }) => index < maxIndex && index > minIndex)
      joltage = joltage * 10 + j1!.jolt
      minIndex = j1!.index
    }
    return joltage
  }

  part1(input: TInput): number {
    let joltage = 0
    for (const bank of input) {
      joltage += this.getJoltage(bank, 2)
    }
    return joltage
  }

  part2(input: TInput): number {
    let joltage = 0
    for (const bank of input) {
      joltage += this.getJoltage(bank, 12)
    }
    return joltage
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day3().execute()
}
