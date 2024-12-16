import io from '#lib/io.js'
import {neighbors, Uint8Matrix} from '#lib/matrix.js'
import {MemoQueue} from '#lib/queue.js'

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
  map.pushRow(new Uint8Array(expand([...line].map(Number))))
}
map = new Uint8Matrix(expand(map), map.width)
let start = 0
let end = map.length - 1

// Dijkstra search.
const queue = new MemoQueue(0, start)
for (const {cost, item: i} of queue) {
  for (const n of neighbors(map, i)) {
    queue.enqueue(cost + map.$[n]!, n)
  }
}

io.write(queue.getCost(end) ?? -1)
