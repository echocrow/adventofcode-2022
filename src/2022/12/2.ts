import IO from 'lib/io.js'
import {neighbors, Uint8Matrix} from 'lib/matrix.js'
import {enqueue} from 'lib/queue.js'

const io = new IO()

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
const queue: number[] = [...starts]
const best = new Uint16Array(map.length)
for (const i of queue) best[i] = 1
let i: number | undefined
search: while ((i = queue.shift()) !== undefined) {
  const h = map[i]!
  for (const n of neighbors(map, i)) {
    if (best[n]) continue
    const nh = map[n]!
    if (nh - h > 1) continue
    best[n] = best[i]! + 1
    enqueue(queue, (i) => best[i]! > best[n]!, n)
    if (n === end) break search
  }
}

io.write(best[end]! - 1)
