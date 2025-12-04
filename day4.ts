import { Day } from './tools/day.ts'

type TInput = {
  width: number
  length: number
  data: Uint8Array
}

export class Day4 extends Day<TInput> {
  offsetsLeft: number[] = []
  offsetsRight: number[] = []
  offsetsMiddle: number[] = []

  constructor() {
    super(4)
  }

  loadInput(): TInput {
    const input = this.readDataFile()
    const width = input[0].length
    const height = input.length
    const length = width * height
    const data = new Uint8Array(length)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (input[y][x] === '@') {
          data[x + y * width] = 1
        }
      }
    }

    this.offsetsLeft = [1, -width, width, 1 - width, 1 + width]
    this.offsetsMiddle = [-1, 1, -width, width, -1 - width, 1 - width, width - 1, 1 + width]
    this.offsetsRight = [-1, -width, width, -1 - width, width - 1]

    return {
      width,
      length,
      data,
    }
  }

  isAccessible(input: TInput, index: number): boolean {
    let count = 0
    const x = index % input.width
    const offsets = x === 0 ? this.offsetsLeft : x === input.width - 1 ? this.offsetsRight : this.offsetsMiddle

    for (let offset of offsets) {
      const idx = index + offset
      if (input.data[idx] === 1) {
        count++
        if (count >= 4) {
          return false
        }
      }
    }
    return true
  }

  getNeighbors(input: TInput, index: number): number[] {
    const x = index % input.width
    const offsets = x === 0 ? this.offsetsLeft : x === input.width - 1 ? this.offsetsRight : this.offsetsMiddle
    const neighbors = []
    for (let offset of offsets) {
      const idx = index + offset
      if (input.data[idx] === 1) {
        neighbors.push(idx)
        if (neighbors.length >= 4) {
          break
        }
      }
    }
    return neighbors
  }

  removeBox(input: TInput, index: number): number {
    if (input.data[index] === 0) {
      return 0
    }
    const neighbors = this.getNeighbors(input, index)
    if (neighbors.length < 4) {
      let count = 1
      input.data[index] = 0
      for (const neighbor of neighbors) {
        count += this.removeBox(input, neighbor)
      }
      return count
    } else {
      return 0
    }
  }

  part1(input: TInput): number {
    let total = 0
    for (let index = 0; index < input.length; index++) {
      if (input.data[index] === 1 && this.isAccessible(input, index)) {
        total++
      }
    }
    return total
  }

  part2(input: TInput): number {
    let total = 0

    for (let index = 0; index < input.length; index++) {
      total += this.removeBox(input, index)
    }
    return total
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day4().execute()
}
