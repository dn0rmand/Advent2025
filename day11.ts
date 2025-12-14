import { Day } from './tools/day.ts'

type TNode = {
  id: number
  to: TNode[]
}

type TInput = TNode[]

const OUT = 0
const YOU = 1
const DAC = 2
const TTF = 4
const SVR = 3

export class Day11 extends Day<TInput> {
  constructor() {
    super(11)
  }

  loadInput(): TInput {
    const data = this.readDataFile()

    const nodes: TNode[] = []
    const map: { [id: string]: TNode } = {}

    const getNode = (id: string): TNode => {
      let node = map[id]
      if (node === undefined) {
        node = { id: nodes.length, to: [] }
        nodes.push(node)
        map[id] = node
      }
      return node
    }

    getNode('out') // id = 0
    getNode('you') // id = 1
    getNode('dac') // id = 2
    getNode('svr') // id = 3
    getNode('fft') // id = 4

    for (const line of data) {
      const info = line.split(': ')
      const from = info[0]
      const fromNode = getNode(from)

      for (const to of info[1].split(' ')) {
        const node = getNode(to)
        fromNode.to.push(node)
      }
    }

    return nodes
  }

  getPaths(current: TNode, tag: number, visited: number[]): number {
    if (current.id === OUT) {
      return tag === (DAC | TTF) ? 1 : 0
    }
    const key = current.id * 10 + tag
    if (visited[key] !== undefined) {
      return visited[key]
    }
    visited[key] = 0 // prevent going in there again
    let total = 0
    if (current.id === TTF || current.id === DAC) {
      tag |= current.id
    }
    for (const to of current.to) {
      total += this.getPaths(to, tag, visited)
    }
    visited[key] = total
    return total
  }

  part1(nodes: TInput): number {
    return this.getPaths(nodes[YOU], 6, [])
  }

  part2(nodes: TInput): number {
    return this.getPaths(nodes[SVR], 0, [])
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day11().execute()
}
