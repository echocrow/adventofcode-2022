import io from 'lib/io.js'
import {neighbors, Uint8Matrix} from 'lib/matrix.js'
import {MemoQueue} from 'lib/queue.js'

// Parse.
let map = new Uint8Matrix()
let starts: number[] = []
let end = -1
let p = -1
const base = 'a'.charCodeAt(0)
for await (let line of io.readLines()) {
  line = line.replace('S', 'a')
  if (end < 0 && (p = line.indexOf('E')) >= 0) {
    end = map.length + p
    line = line.replace('E', 'z')
  }
  const row = [...line].map((c) => c.charCodeAt(0) - base)
  for (let x = 0; x < row.length; x++) if (!row[x]) starts.push(map.length + x)
  map = map.concatRow(row)
}

// Dijkstra search.
const queue = new MemoQueue<number>().enqueue(0, ...starts)
search: for (const {cost, item: i} of queue) {
  const h = map[i]!
  for (const n of neighbors(map, i)) {
    if (map[n]! - h > 1) continue
    queue.enqueue(cost + 1, n)
    if (n === end) break search
  }
}

io.write(queue.getCost(end) ?? -1)
