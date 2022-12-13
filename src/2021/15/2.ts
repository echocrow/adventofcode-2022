import IO from 'lib/io.js'
import {neighbors, Uint8Matrix} from 'lib/matrix.js'
import {enqueue} from 'lib/queue.js'

const io = new IO()

const SCALE = 5
const MIN = 1
const MAX = 9

function* expand(nums: Iterable<number>) {
  for (let i = 0; i < SCALE; i++) {
    for (const num of nums) yield ((num + i - MIN) % MAX) + MIN
  }
}

// Parse.
let map = new Uint8Matrix()
for await (let line of io.readLines()) {
  map = map.concatRow(new Uint8Array(expand([...line].map(Number))))
}
map = new Uint8Matrix(expand(map), map.width)
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
