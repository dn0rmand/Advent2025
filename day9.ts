import { Day } from './tools/day.ts'

type TPoint = {
  x: number
  y: number
}
type TInput = TPoint[]

export class Day9 extends Day<TInput> {
  constructor() {
    super(9)
  }

  loadInput(): TInput {
    const data = this.readDataFile()
    const xConnect: Map<number, TPoint[]> = new Map()
    const yConnect: Map<number, TPoint[]> = new Map()

    const add = (m: Map<number, TPoint[]>, k: number, pt: TPoint) => {
      let a = m.get(k)
      if (a === undefined) {
        a = []
        m.set(k, a)
      }
      a.push(pt)
      if (a.length > 2) {
        throw 'Error'
      }
    }

    const input = data.map(line => {
      const [x, y] = line.split(',').map(v => +v)
      const pt: TPoint = { x, y }
      const ax = xConnect.get(x)

      add(xConnect, x, pt)
      add(yConnect, y, pt)
      return { x, y }
    })
    return input
  }

  part1(input: TInput): number {
    let maxArea = 0
    for (let i = 1; i < input.length; i++) {
      const p1 = input[i]
      for (let j = 0; j < i; j++) {
        const p2 = input[j]
        const area = (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1)
        if (area > maxArea) {
          maxArea = area
        }
      }
    }
    return maxArea
  }

  part2(_: TInput): number {
    return 0
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day9().execute()
}
