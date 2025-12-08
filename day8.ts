import { Day } from './tools/day.ts'

type TPoint = {
  groupId: number
  x: number
  y: number
  z: number
}

type TDistance = {
  pt1: TPoint
  pt2: TPoint
  distance: number
}

type TInput = {
  points: TPoint[]
  distances: TDistance[]
  lastPair?: TDistance
}

export class Day8 extends Day<TInput> {
  constructor() {
    super(8)
  }

  loadInput(): TInput {
    const data = this.readDataFile()
    const points: TPoint[] = []
    for (const line of data) {
      const [x, y, z] = line.split(',').map(v => +v)
      points.push({ groupId: -1, x, y, z })
    }

    const distances: TDistance[] = []

    for (let i = 1; i < points.length; i++) {
      const pi = points[i]
      for (let j = 0; j < i; j++) {
        const pj = points[j]
        const dx = pj.x - pi.x
        const dy = pj.y - pi.y
        const dz = pj.z - pi.z
        const d = dx * dx + dy * dy + dz * dz

        distances.push({
          pt1: pj,
          pt2: pi,
          distance: d,
        })
      }
    }

    distances.sort((a, b) => a.distance - b.distance)

    return { points, distances, lastPair: undefined }
  }

  generateGroups(input: TInput, count: number): TPoint[][] {
    const groups: TPoint[][] = []

    const distances = input.distances

    // Reset
    for (const p of input.points) {
      p.groupId = -1
    }

    input.lastPair = undefined

    for (let i = 0; i < count; i++) {
      const d = distances[i]
      if (d === undefined) {
        throw 'Error'
      }
      if (d.pt1.groupId === -1 && d.pt2.groupId === -1) {
        input.lastPair = d
        const id = groups.length
        groups.push([d.pt1, d.pt2])
        d.pt1.groupId = id
        d.pt2.groupId = id
      } else if (d.pt1.groupId === -1) {
        input.lastPair = d
        const id = d.pt2.groupId
        d.pt1.groupId = id
        groups[id].push(d.pt1)
        if (groups[id].length === input.points.length) {
          break
        }
      } else if (d.pt2.groupId === -1) {
        input.lastPair = d
        const id = d.pt1.groupId
        d.pt2.groupId = id
        groups[id].push(d.pt2)
        if (groups[id].length === input.points.length) {
          break
        }
      } else if (d.pt1.groupId !== d.pt2.groupId) {
        input.lastPair = d
        const id1 = d.pt1.groupId
        const id2 = d.pt2.groupId
        for (const p of groups[id2]) {
          p.groupId = id1
          groups[id1].push(p)
        }
        groups[id2] = []
        if (groups[id1].length === input.points.length) {
          break
        }
      }
    }

    return groups
  }

  part1(input: TInput): number {
    const groups = this.generateGroups(input, 1000)
    groups.sort((a, b) => b.length - a.length)

    const total = groups[0].length * groups[1].length * groups[2].length
    return total
  }

  part2(input: TInput): number {
    this.generateGroups(input, input.distances.length)
    const { pt1, pt2 } = input.lastPair!
    return pt1.x * pt2.x
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day8().execute()
}
