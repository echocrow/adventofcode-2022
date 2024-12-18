import io from '#lib/io.js'
import {fifo} from '#lib/iterable.js'
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

const queue = [start]
const minDist = new Uint32Array(map.length)
minDist[start] = 1
for (const pos of fifo(queue)) {
  if (pos === end) break
  const steps = minDist[pos]! + 1
  for (const next of neighbors(map, pos)) {
    if (map.$[next]) continue
    if (minDist[next]! && minDist[next]! <= steps) continue
    minDist[next] = steps
    queue.push(next)
  }
}

const result = minDist[end]! - 1
io.write(result)
