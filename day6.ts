import { Day } from './tools/day.ts'

type TOperator = '+' | '*'
type TProblem = {
  operator: TOperator
  values: number[]
}

type TInput = string[]

export class Day6 extends Day<TInput> {
  constructor() {
    super(6)
  }

  loadInput(): TInput {
    return this.readDataFile()
  }

  parsePart1Input(input: TInput): TProblem[] {
    const data = input
    const operators: TOperator[] = data[data.length - 1].split(' ').filter(c => c === '+' || c === '*')
    const problems: TProblem[] = new Array(operators.length)

    for (let i = 0; i < problems.length; i++) {
      problems[i] = {
        operator: operators[i],
        values: [],
      }
    }
    for (let i = 0; i < data.length - 1; i++) {
      const values = data[i]
        .split(' ')
        .filter(s => s !== '')
        .map(v => +v)
      if (values.length !== problems.length) {
        throw 'Syntax error'
      }
      for (let j = 0; j < problems.length; j++) {
        problems[j].values.push(values[j])
      }
    }

    return problems
  }

  parsePart2Input(input: TInput): TProblem[] {
    const data = input
    const problems: TProblem[] = []
    const ops = data[data.length - 1] + ' '

    let i = 0

    while (i < ops.length) {
      const op = ops[i]
      if (op !== '+' && op !== '*') {
        throw 'Syntax error'
      }
      const problem: TProblem = {
        operator: op,
        values: [],
      }
      while (ops[i + 1] === ' ') {
        let value = 0
        for (let k = 0; k < data.length - 1; k++) {
          const c = data[k][i]
          if (c === ' ' && value !== 0) {
            break
          } else {
            value = value * 10 + (c === ' ' ? 0 : +c)
          }
        }
        problem.values.push(value)
        i++
      }
      problems.push(problem)
      i++
    }

    return problems
  }

  part1(input: TInput): number {
    const problems = this.parsePart1Input(input)

    const total = problems.reduce((total, problem) => {
      if (problem.operator === '+') {
        return total + problem.values.reduce((a, v) => a + v, 0)
      } else {
        return total + problem.values.reduce((a, v) => a * v, 1)
      }
    }, 0)

    return total
  }

  part2(input: TInput): number {
    const problems = this.parsePart2Input(input)

    const total = problems.reduce((total, problem) => {
      if (problem.operator === '+') {
        return total + problem.values.reduce((a, v) => a + v, 0)
      } else {
        return total + problem.values.reduce((a, v) => a * v, 1)
      }
    }, 0)

    return total
  }
}

if (!Deno.mainModule.endsWith('/main.ts')) {
  new Day6().execute()
}
