import { Day } from './tools/day.ts'

type TPoint = {
  x: number
  y: number
}

type TMap = {
  splitters: number[]
  start: TPoint
  width: number
  height: number
}

export class Day7 extends Day<TMap> {
  constructor() {
    super(7)
  }

  loadInput(): TMap {
    const data = this.readDataFile()
    const map: TMap = {
      splitters: [],
      start: { x: 0, y: 0 },
      width: data[0].length,
      height: data.length,
    }

    for (let y = 0; y < map.height; y++) {
      let row = data[y]
      for (let x = 0; x < map.width; x++) {
        const c = row[x]
        if (c === 'S') {
          map.start.x = x
          map.start.y = y
        } else if (c === '^') {
          const pt = x + y * map.width
          map.splitters[pt] = 1
        }
      }
    }
    return map
  }

  getTimelines(map: TMap, position: TPoint, timelines: number[]): number {
    let { x, y } = position

    const key = x + y * map.width
    if (timelines[key] !== undefined) {
      return timelines[key]
    }

    while (y < map.height) {
      if (y === map.height - 1) {
        return 1
      }
      if (map.splitters[x + y * map.width]) {
        break
      } else {
        y = y + 1
      }
    }

    const left = this.getTimelines(map, { x: x - 1, y }, timelines)
    const right = this.getTimelines(map, { x: x + 1, y }, timelines)
    const count = left + right
    timelines[key] = count
    return count
  }

  part1(map: TMap): number {
    const positions: TPoint[] = [map.start]
    const visited: number[] = []

    let count = 0
    while (positions.length > 0) {
      const p = positions.pop()
      if (!p) {
        throw 'Error'
      }
      if (p.x < 0 || p.x >= map.width || p.y < 0 || p.y >= map.height) {
        continue
      }
      const k = p.x + p.y * map.width
      if (visited[k]) {
        continue
      }
      visited[k] = 1
      if (map.splitters[k]) {
        count++
        const l: TPoint = { x: p.x - 1, y: p.y }
        const r: TPoint = { x: p.x + 1, y: p.y }
        positions.push(l)
        positions.push(r)
      } else {
        positions.push({ x: p.x, y: p.y + 1 })
      }
    }
    return count
  }

  part2(map: TMap): number {
    return this.getTimelines(map, map.start, [])
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day7().execute()
}
