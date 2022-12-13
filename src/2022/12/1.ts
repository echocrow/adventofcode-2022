import IO from 'lib/io.js'
import {neighbors, Uint8Matrix} from 'lib/matrix.js'
import {MemoQueue} from 'lib/queue.js'

const io = new IO()

// Parse.
let map = new Uint8Matrix()
let start = -1
let end = -1
let p = -1
const base = 'a'.charCodeAt(0)
for await (let line of io.readLines()) {
  if (start < 0 && (p = line.indexOf('S')) >= 0) {
    start = map.length + p
    line = line.replace('S', 'a')
  }
  if (end < 0 && (p = line.indexOf('E')) >= 0) {
    end = map.length + p
    line = line.replace('E', 'z')
  }
  map = map.concatRow([...line].map((c) => c.charCodeAt(0) - base))
}

// Dijkstra search.
const queue = new MemoQueue<number>().enqueue(0, start)
search: for (const {cost, item: i} of queue) {
  const h = map[i]!
  for (const n of neighbors(map, i)) {
    if (map[n]! - h > 1) continue
    queue.enqueue(cost + 1, n)
    if (n === end) break search
  }
}

io.write(queue.getCost(end) ?? -1)
