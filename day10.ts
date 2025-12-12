import { Day } from './tools/day.ts'
import { Console } from './tools/console.ts'

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

  getBestIndexesToUsed(jolts: number[], buttonIndexes: number[][]): { target: number; buttons: number[][] } {
    // Remove the dead indexes
    buttonIndexes = buttonIndexes.filter(b => !b.some(i => jolts[i] < 1))

    // Get the number of times indexes are
    const counts = buttonIndexes.reduce(
      (a: number[], b: number[]) =>
        b.reduce((z: number[], v: number) => {
          z[v] = (z[v] || 0) + 1
          return z
        }, a),
      []
    )
    let bestButton = -1
    let min = Number.MAX_SAFE_INTEGER
    for (let i = 0; i < counts.length; i++) {
      if (counts[i] < min) {
        min = counts[i]
        bestButton = i
      } else if (counts[i] === min) {
        if (jolts[i] > jolts[bestButton]) {
          bestButton = i
        }
      }
    }

    return { target: bestButton, buttons: buttonIndexes.filter(b => b.includes(bestButton)) }
  }

  doPowerOn(jolts: number[], buttonIndexes: number[][], maxPresses: number): number {
    if (!jolts.some(j => j > 0)) {
      return 0 // no press necessary
    }

    if (jolts.some(j => j >= maxPresses)) {
      return Number.MAX_SAFE_INTEGER
    }
    const { target, buttons } = this.getBestIndexesToUsed(jolts, buttonIndexes)
    if (target < 0) {
      return Number.MAX_SAFE_INTEGER
    }

    const makeKey = (state: number[]) => state.reduce((a, j) => a * 1000n + BigInt(j), 0n)

    let states: Map<bigint, number[]> = new Map()
    let newStates: Map<bigint, number[]> = new Map()
    let readyStates: { presses: number; jolts: number[] }[] = []

    states.set(0n, jolts)

    let presses = 0

    while (states.size > 0) {
      presses++
      if (presses >= maxPresses) {
        break
      }
      newStates.clear()

      for (const state of states.values()) {
        if (state[target] === 0) {
          readyStates.push({ presses: presses - 1, jolts: state })
          continue
        }

        for (const button of buttons) {
          const newState = [...state]
          let dead = false
          for (var j of button) {
            if (newState[j] === 0) {
              dead = true
              break
            }
            newState[j]--
          }
          if (dead) {
            continue
          }
          const key = makeKey(newState)
          if (key === 0n) {
            return presses
          }
          newStates.set(key, newState)
        }
      }
      const tmp = states
      states = newStates
      newStates = tmp
    }

    let min = maxPresses
    for (const { presses, jolts } of readyStates) {
      const buttons = buttonIndexes.filter(b => !b.some(i => jolts[i] < 1))
      const max = min === Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : min - presses
      const count = presses + this.doPowerOn(jolts, buttons, max)
      if (count < min) {
        min = count
      }
    }

    return min
  }

  powerMachine(index: number, machine: TMachine): number {
    Console.writeSync(`\rProcessing machine ${index + 1}`)
    const min = this.doPowerOn(machine.jolts, machine.buttonIndexes, 300)
    return min
  }

  part1(input: TInput): number {
    const total = input.reduce((a, machine) => a + this.startMachine(machine), 0)
    return total
  }

  part2(input: TInput): number {
    const total = input.reduce((a, machine, i) => a + this.powerMachine(i, machine), 0)
    Console.writeSync('\n')
    return total
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day10().execute()
}
