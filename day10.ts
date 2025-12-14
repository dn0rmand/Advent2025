import { Day } from './tools/day.ts'
import { Console } from './tools/console.ts'

type TEquation = {
  id: number
  variables: number[]
  unknown: number
  value: number
}

type TMachine = {
  startState: number
  buttons: number[]
  buttonIndexes: number[][]
  jolts: number[]
}

class TEquations {
  private currentMachine: TMachine
  private equations: TEquation[]
  private pushedCounts: number[]

  invalid: boolean

  constructor(machine: TMachine, equations: TEquation[] | undefined = undefined, variables: number[] | undefined = undefined) {
    this.currentMachine = machine
    this.equations = equations ?? []
    this.pushedCounts = variables ?? new Array(this.currentMachine.buttonIndexes.length)
    this.invalid = false

    if (equations === undefined) {
      this.generate()
    }
    if (!this.quickSolve()) {
      this.invalid = true
    }
  }

  validateResult(): boolean {
    const jolts: number[] = new Array(this.currentMachine.jolts.length).fill(0)
    for (let i = 0; i < this.currentMachine.buttonIndexes.length; i++) {
      const p = this.pushedCounts[i]
      for (const j of this.currentMachine.buttonIndexes[i]) {
        jolts[j] += p
      }
    }

    const ok = jolts.every((j, k) => j === this.currentMachine.jolts[k])
    return ok
  }

  get first(): TEquation {
    return this.equations[0]
  }

  get presses(): number {
    return this.pushedCounts.reduce((a, v) => a + v, 0)
  }

  get solved(): boolean {
    this.equations = this.equations.filter(e => e.unknown > 0)
    return this.equations.length === 0
  }

  sort(): void {
    this.equations.sort((a, b) => {
      if (a.value === 0 && b.value !== 0) {
        return -1
      }
      return a.unknown - b.unknown || a.value - b.value
    })
  }

  clone(): TEquations {
    const newEquations = this.equations.map(e => ({
      id: e.id,
      variables: e.variables.slice(),
      unknown: e.unknown,
      value: e.value,
    }))

    return new TEquations(this.currentMachine, newEquations, this.pushedCounts.slice())
  }

  match(equation1: TEquation, equation2: TEquation): boolean {
    return equation1.id !== equation2.id && equation1.variables.every((v, k) => v === 0 || equation2.variables[k] === v)
  }

  reduce(): boolean {
    while (true) {
      const equation1 = this.equations.find(eq1 => this.equations.some(eq2 => this.match(eq1, eq2)))

      if (equation1 === undefined) {
        break
      }

      const matching = this.equations.filter(equation2 => this.match(equation1, equation2))

      // Check before applying
      if (matching.some(equation2 => equation1.value > equation2.value)) {
        return false
      }

      // apply
      matching.forEach(equation2 => {
        equation1.variables.forEach((v, k) => (equation2.variables[k] -= v))
        equation2.value -= equation1.value
        equation2.unknown -= equation1.unknown
      })

      this.equations = this.equations.filter(e => e.unknown > 0)
      this.sort()
      if (!this.quickSolve()) {
        return false
      }
    }

    return true
  }

  generate(): void {
    let id = 0
    this.equations = this.currentMachine.jolts.map((jolt, index) => ({
      id: ++id,
      variables: this.currentMachine.buttonIndexes.map(b => (b.includes(index) ? 1 : 0)),
      unknown: this.currentMachine.buttonIndexes.filter(b => b.includes(index)).length,
      value: jolt,
    }))

    this.sort()
    this.reduce()
  }

  applyVariable(button: number, value: number): boolean {
    this.pushedCounts[button] = value
    let bad = false
    this.equations
      .filter(eq => eq.variables[button] === 1)
      .forEach(eq => {
        eq.variables[button] = 0
        eq.value -= value
        eq.unknown -= 1
        if (eq.value < 0) {
          bad = true
        }
      })
    if (bad) {
      return false
    }
    this.sort()
    return true
  }

  quickSolve(): boolean {
    while (this.equations.length > 0 && (this.equations[0].unknown <= 1 || this.equations[0].value === 0)) {
      const eq = this.equations.shift()!
      if (eq.unknown === 0) {
        if (eq.value !== 0) {
          return false
        }
        continue
      } else if (eq.unknown > 1 && eq.value === 0) {
        const btns = eq.variables.reduce((a: number[], b, i) => (b === 1 ? [...a, i] : a), [])
        for (const btn of btns) {
          this.applyVariable(btn, 0)
        }
        continue
      }
      const btn = eq.variables.findIndex(b => b === 1)
      if (!this.applyVariable(btn, eq.value)) {
        return false
      }
    }
    return true
  }

  resolve(): number {
    if (this.solved) {
      if (!this.validateResult()) {
        return Number.MAX_SAFE_INTEGER
      }
      return this.presses
    }

    const equation = this.first
    const btn = equation.variables.findIndex(b => b === 1)

    if (equation.unknown === 1) {
      const newEquations = this.clone()

      if (newEquations.invalid) {
        return Number.MAX_SAFE_INTEGER
      }

      if (!newEquations.reduce()) {
        return Number.MAX_SAFE_INTEGER
      }

      if (newEquations.solved && !newEquations.validateResult()) {
        this.clone().reduce()
      }

      return newEquations.resolve()
    }

    let bestValue = Number.MAX_SAFE_INTEGER

    for (let v = 0; v <= equation.value; v++) {
      const newEquations = this.clone()

      if (newEquations.invalid) {
        break
      }

      if (!newEquations.applyVariable(btn, v)) {
        break
      }

      const count = newEquations.resolve()

      if (count < bestValue) {
        bestValue = count
      }
    }

    return bestValue
  }
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

  solve(machine: TMachine): number {
    const equations = new TEquations(machine)
    return equations.resolve()
  }

  powerMachine(index: number, machine: TMachine): number {
    Console.writeSync(`\rProcessing machine ${index}`)

    const total = this.solve(machine)
    return total
  }

  part1(input: TInput): number {
    const total = input.reduce((a, machine) => a + this.startMachine(machine), 0)
    return total
  }

  part2(input: TInput): number {
    const total = input.reduce((a, machine, i) => a + this.powerMachine(i + 1, machine), 0)
    Console.writeSync('\n')
    return total
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day10().execute()
}
