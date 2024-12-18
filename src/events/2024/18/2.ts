import {binSearch} from '#lib/array.js'
import io from '#lib/io.js'
import {neighbors, Uint8Matrix} from '#lib/matrix.js'
import {PriorityQueue} from '#lib/queue.js'

const mapSize = Number((await io.readLineIfMatch(/^size=(\d+)$/))?.[1] ?? 70)
void (await io.readLineIfMatch(/^bytes=(\d+)$/))

const map = new Uint8Matrix((mapSize + 1) ** 2, mapSize + 1)
const start = 0
const end = map.length - 1

const bytes: number[] = []
for await (const line of io.readLines()) {
  const [x = 0, y = 0] = line.split(',').map(Number)
  bytes.push(map.vecToI(x, y))
}

function checkIsReachable(map: Uint8Matrix) {
  const visited = new Uint8Array(map.length)
  const queue = new PriorityQueue(end - start, start)
  for (const {item: pos} of queue) {
    for (const next of neighbors(map, pos)) {
      if (pos === end) return true
      if (map.$[next] || visited[next]!) continue
      visited[next] = 1
      queue.enqueue(end - next, next)
    }
  }
  return false
}

let [minMapBytes, minMap] = [0, map]
const maxByteIdx = binSearch(0, bytes.length - 1, (i) => {
  const map = new Uint8Matrix(minMap)
  for (let b = minMapBytes; b <= i; b++) map.$[bytes[b]!] = 1
  const isOk = checkIsReachable(map)
  if (isOk) [minMapBytes, minMap] = [i, map]
  return isOk ? -1 : 1
})

const result = map.iToVec(bytes[maxByteIdx]!)
io.write(result)
