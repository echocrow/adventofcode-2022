import io from 'lib/io.js'

type Registry = [cycle: number, x: number]

const ADD = 'addx '

function tick(reg: Registry): number {
  reg[0]++
  return !(reg[0] % 40) ? (reg[0] + 20) * reg[1] : 0
}

let result = 0
const reg: Registry = [-20, 1]
for await (const line of io.readLines()) {
  result += tick(reg)
  if (line.startsWith(ADD)) {
    result += tick(reg)
    reg[1] += Number(line.slice(ADD.length))
  }
}

io.write(result)
