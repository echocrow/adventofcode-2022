import io from '#lib/io.js'

const program = [
  ...(await io.readFile())
    .matchAll(/\d+/g)
    .drop(3)
    .map(([val]) => Number(val)),
]
let opCodes: number[] = []
let operands: bigint[] = []
for (let i = 0; i < program.length; i += 2) {
  opCodes.push(program[i]!)
  operands.push(BigInt(program[i + 1]!))
}

let regA = 0n
let regB = 0n
let regC = 0n
let pointer = 0

const comboOperands = [
  () => 0n,
  () => 1n,
  () => 2n,
  () => 3n,
  () => regA,
  () => regB,
  () => regC,
  () => BigInt((pointer = opCodes.length)),
]
function operand() {
  return operands[pointer]!
}
function comboOperand() {
  return comboOperands[operands[pointer]! as unknown as number]!()
}

const ops = [
  /* adv */ () => void (regA = regA >> comboOperand()),
  /* bxl */ () => void (regB = regB ^ operand()),
  /* bst */ () => void (regB = comboOperand() & 7n),
  /* jnz */ () => void (regA && (pointer = Number(operand()) >> 1)),
  /* bxc */ () => void (regB = regB ^ regC),
  /* out */ () => Number(comboOperand() & 7n),
  /* bdv */ () => void (regB = (regA / (1n << comboOperand())) | 0n),
  /* cdv */ () => void (regC = (regA / (1n << comboOperand())) | 0n),
]

function run(a: bigint) {
  regA = a
  regB = 0n
  regC = 0n
  pointer = 0
  let out: number | void = undefined
  let prevPointer = pointer
  while (pointer < opCodes.length && out === undefined) {
    out = ops[opCodes[pointer]!]!()
    if (pointer === prevPointer) pointer += 1
    prevPointer = pointer
  }
  return out
}

// Given the nature of the program, the three most-significant bits of `A`
// determine the last output octal. The next three most-significant bits
// determine the second-last output octal, and so on.
// To find the minimum `A` value that produces the the program itself, we run
// the program for `A` from 0 to 7, checking which input produces the last
// program octal. Given a match, we repeat the process for `A << 3 + i` for `i`
// from 0 to 7, checking which input produces the second-last program octal.
// This process continues until we reproduced the original program, backtracking
// whenever necessary, in case multiple inputs produce the same output octal.
function findMinA(p = program.length - 1, acc = 0n): bigint | null {
  if (p < 0) return acc
  const target = program[p]!
  acc <<= 3n
  const max = acc + 8n
  for (let a = acc; a < max; a++) {
    if (run(a) !== target) continue
    const res = findMinA(p - 1, a)
    if (res !== null) return res
  }
  return null
}

const result = findMinA()
io.write(result)
