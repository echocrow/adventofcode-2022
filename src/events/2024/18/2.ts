import io from '#lib/io.js'
import {neighbors, Uint8Matrix} from '#lib/matrix.js'

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
  let queue = [start]
  const visited = new Uint8Array(map.length)
  while (queue.length) {
    const newQueue: typeof queue = []
    for (const pos of queue) {
      for (const next of neighbors(map, pos)) {
        if (pos === end) return true
        if (map.$[next]) continue
        if (visited[next]) continue
        visited[next] = 1
        newQueue.push(next)
      }
    }
    queue = newQueue
  }
  return false
}

function binSearch(
  min: number,
  max: number,
  checkHigh: (i: number) => number,
): number {
  let l = min
  let r = max
  while (l <= r) {
    const q = Math.floor((l + r) / 2)
    const res = checkHigh(q)
    if (res === 0) return q
    else if (res > 0) r = q - 1
    else l = q + 1
  }
  return l
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
