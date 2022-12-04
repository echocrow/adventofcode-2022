import IO from 'lib/io.js'

const io = new IO()

let total = 0
let prev = 0
let queue: number[] = []
for await (const line of io.readLines()) {
  const num = parseInt(line, 10)
  queue = queue.map((n) => n + num)
  queue.push(num)
  if (queue.length >= 3) {
    const head = queue.shift() ?? 0
    if (prev && head > prev) total++
    prev = head
  }
}

io.write(total)
