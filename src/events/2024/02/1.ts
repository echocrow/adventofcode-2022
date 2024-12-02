import io from '#lib/io.js'

const MAX_DELTA = 3

let result = 0
for await (const line of io.readLines()) {
  const levels = line.split(' ').map(Number)
  let isSafe = true
  let growth = 0
  for (let i = 1; i < levels.length; i++) {
    const prev = levels[i - 1]!
    const curr = levels[i]!
    const delta = curr - prev
    const sign = Math.sign(delta)
    growth ||= sign
    if (!sign || sign !== growth || Math.abs(delta) > MAX_DELTA) {
      isSafe = false
      break
    }
  }
  if (isSafe) result++
}

io.write(result)
