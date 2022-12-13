import IO from 'lib/io.js'
import {neighbors, Uint8Matrix} from 'lib/matrix.js'
import {enqueue} from 'lib/queue.js'

const io = new IO()

// Parse.
let map = new Uint8Matrix()
for await (let line of io.readLines()) {
  map = map.concatRow([...line].map(Number))
}
let start = 0
let end = map.length - 1

// Dijkstra search.
const best = new Uint16Array(map.length)
const queue: number[] = [start]
let s: number | undefined
while ((s = queue.shift()) !== undefined) {
  for (const i of neighbors(map, s)) {
    if (best[i]) continue
    best[i] = best[s]! + map[i]!
    enqueue(queue, (j) => best[j]! > best[i]!, i)
  }
}

io.write(best[end]!)
