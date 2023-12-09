import io from '#lib/io.js'

const batches = []
let acc = 0

for await (const line of io.readLines()) {
  if (line) {
    acc += parseInt(line, 10)
  } else if (acc) {
    batches.push(acc)
    acc = 0
  }
}

io.write(Math.max(...batches))
