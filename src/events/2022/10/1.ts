import io from '#lib/io.js'

const ADD = 'addx '

let t = -20
let x = 1

function tick(): number {
  t++
  return !(t % 40) ? (t + 20) * x : 0
}

let result = 0
for await (const line of io.readLines()) {
  result += tick()
  if (line.startsWith(ADD)) {
    result += tick()
    x += Number(line.slice(ADD.length))
  }
}

io.write(result)
