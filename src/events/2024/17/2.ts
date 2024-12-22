import io from '#lib/io.js'

const program = [
  ...(await io.readFile())
    .matchAll(/\d+/g)
    .drop(3)
    .map(([val]) => Number(val)),
]

let regA = 0
let regB = 0
let regC = 0
let pointer = 0

const comboOperands = [
  () => 0,
  () => 1,
  () => 2,
  () => 3,
  () => regA,
  () => regB,
  () => regC,
  () => (pointer = program.length),
]
function operand() {
  return program[pointer + 1]!
}
function comboOperand() {
  return comboOperands[program[pointer + 1]!]!()
}

const ops = [
  /* adv */ () => void (regA = regA >>> comboOperand()),
  /* bxl */ () => void (regB = regB ^ operand()),
  /* bst */ () => void (regB = comboOperand() & 7),
  /* jnz */ () => void (regA && (pointer = operand())),
  /* bxc */ () => void (regB = regB ^ regC),
  /* out */ () => comboOperand() & 7,
  /* bdv */ () => void (regB = (regA >>> comboOperand()) | 0),
  /* cdv */ () => void (regC = (regA >>> comboOperand()) | 0),
]

function run(a: number) {
  regA = a
  regB = regC = pointer = 0
  while (pointer < program.length) {
    let oldPointer = pointer
    const out = ops[program[pointer]!]!()
    if (out !== undefined) return out
    pointer += 2 * +!(pointer - oldPointer)
  }
}

// Given the nature of the program, the three most-significant bits of `A`
// determine the last output octal. The next three most-significant bits
// determine the second-last output octal, and so on.
// To find the minimum `A` value that produces the the program itself, we run
// the program for `A` from 0 to 7, checking which input produces the last
// program octal. Given a match, we repeat the process for `A * 8 + i` for `i`
// from 0 to 7, checking which input produces the second-last program octal.
// This process continues until we reproduced the original program, backtracking
// whenever necessary, in case multiple inputs produce the same output octal.
function findMinA(p = program.length - 1, acc = 0): number | undefined {
  if (p < 0) return acc
  const target = program[p]!
  const max = (acc *= 8) + 8
  for (let a = acc; a < max; a++) {
    if (run(a) !== target) continue
    const res = findMinA(p - 1, a)
    if (res !== undefined) return res
  }
  return undefined
}

const result = findMinA()
io.write(result)
