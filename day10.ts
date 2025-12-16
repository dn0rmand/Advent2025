import { Day } from './tools/day.ts'
import { Matrix } from './tools/matrix.ts'
import { Evaluator } from './tools/solver.ts'

type TMachine = {
  startState: number
  buttons: number[]
  buttonIndexes: number[][]
  jolts: number[]
}

type TInput = TMachine[]

export class Day10 extends Day<TInput> {
  constructor() {
    super(10)
  }

  loadInput(): TInput {
    const data = this.readDataFile()
    const input = data.map(line => {
      const info = line.split(' ')
      const startState = info[0]
        .slice(1, -1)
        .split('')
        .reverse()
        .reduce((a, v) => a * 2 + (v === '#' ? 1 : 0), 0)
      const buttonIndexes = info.slice(1, -1).map(b =>
        b
          .slice(1, -1)
          .split(',')
          .map(v => +v)
      )
      const buttons = buttonIndexes.map(b => b.reduce((a, v) => a | (2 ** +v), 0))
      const jolts = info
        .at(-1)!
        .slice(1, -1)
        .split(',')
        .map(v => +v)

      return {
        startState,
        buttons,
        buttonIndexes,
        jolts,
      }
    })

    return input
  }

  startMachine(machine: TMachine): number {
    const visited = [1]

    let states = [0]
    let presses = 0

    while (states.length > 0) {
      presses++
      const newStates = []
      for (const state of states) {
        for (const button of machine.buttons) {
          const newState = state ^ button
          if (visited[newState]) {
            continue
          }
          visited[newState] = 1
          if (newState === machine.startState) {
            return presses
          }
          newStates.push(newState)
        }
      }
      states = newStates
    }

    return Number.MAX_SAFE_INTEGER
  }

  powerMachine(machine: TMachine): number {
    const m = new Matrix(machine.jolts.length, machine.buttonIndexes.length + 1)
    const jColumn = machine.buttonIndexes.length

    for (let row = 0; row < machine.jolts.length; row++) {
      m.set(jColumn, row, machine.jolts[row])
      for (const col of machine.buttonIndexes.map((b, i) => (b.includes(row) ? i : -1)).filter(i => i >= 0)) {
        m.set(col, row, 1)
      }
    }

    m.gaussianElimination()

    const evaluator = new Evaluator(m)

    return evaluator.solve()
  }

  part1(input: TInput): number {
    const total = input.reduce((a, machine) => a + this.startMachine(machine), 0)
    return total
  }

  part2(input: TInput): number {
    const total = input.reduce((a, machine) => a + this.powerMachine(machine), 0)
    return total
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day10().execute()
}
