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

const ops = [
  /* adv */ () => (regA = regA >>> comboOperand()),
  /* bxl */ () => (regB = regB ^ operand()),
  /* bst */ () => (regB = comboOperand() & 7),
  /* jnz */ () => regA && (pointer = operand()),
  /* bxc */ () => (regB = regB ^ regC),
  /* out */ () => (result += ',' + (comboOperand() & 7)),
  /* bdv */ () => (regB = (regA >>> comboOperand()) | 0),
  /* cdv */ () => (regC = (regA >>> comboOperand()) | 0),
]

// Run program.
while (pointer < program.length) {
  let oldPointer = pointer
  ops[program[pointer]!]!()
  pointer += 2 * +!(pointer - oldPointer)
}

io.write(result.slice(1))
