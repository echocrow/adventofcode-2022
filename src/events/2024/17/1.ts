import io from '#lib/io.js'

let [regA = 0, regB = 0, regC = 0, ...program] = (
  await Array.fromAsync(io.readRegExp(/\d+/))
).map(([m]) => Number(m))

let pointer = 0

let result = ''

const comboOps = [
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
  return comboOps[program[pointer + 1]!]!()
}

const ops: (() => void)[] = [
  /* adv */ () => (regA = regA >> comboOperand()),
  /* bxl */ () => (regB = regB ^ operand()),
  /* bst */ () => (regB = comboOperand() & 7),
  /* jnz */ () => regA && (pointer = operand()),
  /* bxc */ () => (regB = regB ^ regC),
  /* out */ () => (result += ',' + (comboOperand() & 7)),
  /* bdv */ () => (regB = (regA / (1 << comboOperand())) | 0),
  /* cdv */ () => (regC = (regA / (1 << comboOperand())) | 0),
]

// Run program.
let prevPointer = pointer
while (pointer < program.length) {
  ops[program[pointer]!]!()
  if (pointer === prevPointer) pointer += 2
  prevPointer = pointer
}

io.write(result.slice(1))
