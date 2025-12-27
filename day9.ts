import { Day } from './tools/day.ts'
import { TPoint, Polygon } from './tools/geometric/polygonInPolygon.ts'

type TInput = {
  points: TPoint[]
  xConnect: Map<number, TPoint[]>
  yConnect: Map<number, TPoint[]>
}

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

    let maxX = 1
    let maxY = 1

    const points = data.map(line => {
      const [x, y] = line.split(',').map(v => +v)
      const pt: TPoint = { x, y }

      maxX = Math.max(x, maxX)
      maxY = Math.max(y, maxY)
      add(xConnect, x, pt)
      add(yConnect, y, pt)
      return { x, y }
    })

    return { points, xConnect, yConnect }
  }

  part1(input: TInput): number {
    let maxArea = 0
    const points = input.points
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i]
      for (let j = 0; j < i; j++) {
        const p2 = points[j]
        const area = (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1)
        if (area > maxArea) {
          maxArea = area
        }
      }
    }
    return maxArea
  }

  isValid(p1: TPoint, p2: TPoint, polygon: Polygon): boolean {
    const minX = Math.min(p1.x, p2.x)
    const maxX = Math.max(p1.x, p2.x)
    const minY = Math.min(p1.y, p2.y)
    const maxY = Math.max(p1.y, p2.y)

    const outerPolygon = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
      { x: minX, y: minY },
    ]

    const innerPolygon = [
      { x: minX + 1, y: minY + 1 },
      { x: maxX - 1, y: minY + 1 },
      { x: maxX - 1, y: maxY - 1 },
      { x: minX + 1, y: maxY - 1 },
      { x: minX + 1, y: minY + 1 },
    ]

    const res = polygon.containsPolygon(innerPolygon, outerPolygon)

    return res
  }

  part2(input: TInput): number {
    const polygon = new Polygon(input.points, input.xConnect, input.yConnect)

    let maxArea = 0
    const points = input.points
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i]
      for (let j = 0; j < i; j++) {
        const p2 = points[j]
        const area = (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1)
        if (area <= maxArea || !this.isValid(p1, p2, polygon)) {
          continue
        }
        if (area > maxArea) {
          maxArea = area
        }
      }
    }
    return maxArea
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day9().execute()
}
