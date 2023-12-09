import io from '#lib/io.js'

type Registry = {t: number; x: number}

const ADD = 'addx '

function tick(reg: Registry) {
  const dist = reg.t - reg.x
  const on = -1 <= dist && dist <= 1
  io.write(on ? '█' : ' ')
  reg.t = (reg.t + 1) % 40
  if (!reg.t) io.write('\n')
}

const reg: Registry = {t: 0, x: 1}
for await (const line of io.readLines()) {
  tick(reg)
  if (line.startsWith(ADD)) {
    tick(reg)
    reg.x += Number(line.slice(ADD.length))
  }
}
