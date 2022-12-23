import IO from 'lib/io.js'

const io = new IO()

type OpFn = (a: number, b: number) => number
const ops = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
} satisfies Record<string, OpFn>
type OpSign = keyof typeof ops

type SolveFn = (n: number) => number
type SolverFn = (val: number, fn: SolveFn) => SolveFn
const lhsSolvers: Record<OpSign, SolverFn> = {
  '+': (rhs, fn) => (want) => fn(want - rhs),
  '-': (rhs, fn) => (want) => fn(want + rhs),
  '*': (rhs, fn) => (want) => fn(want / rhs),
  '/': (rhs, fn) => (want) => fn(want * rhs),
}
const rhsSolvers: Record<OpSign, SolverFn> = {
  '+': (lhs, fn) => (want) => fn(want - lhs),
  '-': (lhs, fn) => (want) => fn(lhs - want),
  '*': (lhs, fn) => (want) => fn(want / lhs),
  '/': (lhs, fn) => (want) => fn(lhs / want),
}

// Parse.
type MathMonkey = readonly [a: string, b: string, op: OpSign]
const mathMonkeys = new Map<string, MathMonkey>()
const nums = new Map<string, number>()
for await (const line of io.readLines()) {
  const [name = '', rightHand = ''] = line.split(': ')
  const num = Number(rightHand)
  if (isNaN(num)) {
    const [a = '', opSign = '', b = ''] = rightHand.split(' ')
    mathMonkeys.set(name, [a, b, opSign as OpSign])
  } else {
    nums.set(name, num)
  }
}

// Patch (root) monkey.
// Set to subtraction, so we can later solve for "0".
const ROOT = 'root'
const [rootA, rootB] = mathMonkeys.get(ROOT)!
const root: MathMonkey = [rootA, rootB, '-']
mathMonkeys.set(ROOT, root)

const HUMN = 'humn'

function parseMonkey(root: string): number | SolveFn {
  // Handle human.
  if (root === HUMN) return (n) => n

  // Handle known number.
  const num = nums.get(root)
  if (num !== undefined) return num

  // Handle math monkey.
  const math = mathMonkeys.get(root)
  if (!math) throw new Error('404 Monkey not found')

  // Handle math monkey.
  const [aName, bName, opSign] = math
  const a = parseMonkey(aName)
  const b = parseMonkey(bName)
  if (typeof a === 'number' && typeof b === 'number') {
    return ops[opSign](a, b)
  }
  if (typeof a === 'function' && typeof b === 'number') {
    return lhsSolvers[opSign](b, a)
  }
  if (typeof a === 'number' && typeof b === 'function') {
    return rhsSolvers[opSign](a, b)
  }
  throw new Error('405 Method Not Allowed')
}

// Parse and solve root.
const parsedRoot = parseMonkey(ROOT)
const result = typeof parsedRoot === 'function' ? parsedRoot(0) : parsedRoot

io.write(result)
