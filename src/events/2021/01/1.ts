import io from '#lib/io.js'

let total = 0
let prev = 0
for await (const line of io.readLines()) {
  const num = parseInt(line, 10)
  if (prev && num > prev) total++
  prev = num
}

io.write(total)
