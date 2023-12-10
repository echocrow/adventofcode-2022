import io from '#lib/io.js'

const ADD = 'addx '

let t = 0
let x = 1
let y = 0

function tick() {
  if (!t && y) io.write('\n')
  const dist = t - x
  const on = -1 <= dist && dist <= 1
  io.write(on ? '█' : ' ')
  t = (t + 1) % 40
  if (!t) y++
}

for await (const line of io.readLines()) {
  tick()
  if (line.startsWith(ADD)) {
    tick()
    x += Number(line.slice(ADD.length))
  }
}
