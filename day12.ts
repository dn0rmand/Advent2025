import { Day } from './tools/day.ts'

type TBits = (0 | 1)[][]

type TShape = {
  id: number
  area: number
  bits: TBits
}

type TRegion = {
  width: number
  height: number
  counts: number[]
}

type TInput = {
  shapes: TShape[]
  regions: TRegion[]
}

export class Day12 extends Day<TInput> {
  constructor() {
    super(12)
  }

  loadInput(): TInput {
    const data = this.readDataFile()
    const input: TInput = {
      shapes: [],
      regions: [],
    }

    let i = 0

    while (i < data.length) {
      if (data[i].length < 2) {
        i++
        continue
      }
      if (data[i][1] === ':') {
        const id = +data[i][0]
        if (id > 5) {
          throw 'Only 0 to 5 supported'
        }
        const shape: TShape = {
          id,
          area: 0,
          bits: [],
        }
        input.shapes[id] = shape
        const bits: TBits = []
        for (let j = 1; j <= 3; j++) {
          const l = data[i + j]
          if (l.length !== 3) {
            throw 'Bad shape'
          }
          const r = l.split('').map(c => (c === '#' ? 1 : 0))
          bits.push(r)
        }
        if (bits.length !== 3) {
          throw 'Bad shape'
        }
        shape.area = bits.reduce((a, b) => b.reduce((a, b) => a + b, a), 0)
        shape.bits = bits
        i += 4
      } else {
        const line = data[i++]
        const [size, countStrings] = line.split(': ', 2)
        const [width, height] = size.split('x').map(v => +v)
        const counts = countStrings.split(' ').map(c => +c)

        if (counts.length > 6) {
          throw 'Shape id can only be 0..5'
        }
        input.regions.push({
          width,
          height,
          counts,
        })
      }
    }

    return input
  }

  checkArea(region: TRegion, shapes: TShape[]): boolean {
    let needed = 0
    let boxMaxArea = 0
    const available = region.width * region.height
    for (let i = 0; i < shapes.length; i++) {
      const c = region.counts[i] ?? 0
      needed += c * shapes[i].area
      boxMaxArea += c * 3 * 3
    }
    if (needed > available) {
      return false
    } else if (boxMaxArea <= available) {
      return true
    } else {
      throw 'Error'
    }
  }

  part1(input: TInput): number {
    let count = 0
    for (const region of input.regions) {
      if (this.checkArea(region, input.shapes)) {
        count++
      }
    }
    return count
  }

  part2(_: TInput): string {
    return 'N/A'
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day12().execute()
}
