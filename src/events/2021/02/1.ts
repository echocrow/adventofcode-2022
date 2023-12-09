import io from '#lib/io.js'

const dirs = {
  x: {
    forward: 1,
  } as Record<string, number>,
  y: {
    down: 1,
    up: -1,
  } as Record<string, number>,
}

let x = 0
let y = 0
for await (const line of io.readLines()) {
  const [inst, num] = line.split(' ') as [string, number]
  x += num * (dirs.x[inst] ?? 0)
  y += num * (dirs.y[inst] ?? 0)
}

io.write(x * y)
