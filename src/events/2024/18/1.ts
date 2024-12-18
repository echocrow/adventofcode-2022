import io from '#lib/io.js'
import {neighbors, Uint8Matrix} from '#lib/matrix.js'

const mapSize = Number((await io.readLineIfMatch(/^size=(\d+)$/))?.[1] ?? 70)
const maxBytes = Number(
  (await io.readLineIfMatch(/^bytes=(\d+)$/))?.[1] ?? 1024,
)

const map = new Uint8Matrix((mapSize + 1) ** 2, mapSize + 1)
const start = 0
const end = map.length - 1

let bytesPassed = 0
for await (const line of io.readLines()) {
  if (bytesPassed >= maxBytes) break
  const [x = 0, y = 0] = line.split(',').map(Number)
  map.setCell(x, y, 1)
  bytesPassed++
}

map.$[start] = 2
let steps = 0
let queue = [start]
search: while (queue.length) {
  const newQueue: typeof queue = []
  for (const pos of queue) {
    if (pos === end) break search
    for (const next of neighbors(map, pos)) {
      if (map.$[next]) continue
      map.$[next] = 2
      newQueue.push(next)
    }
  }
  steps++
  queue = newQueue
}

io.write(steps)
