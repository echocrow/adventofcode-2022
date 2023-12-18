import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {PriorityQueue} from '#lib/queue.js'
import type {vec2} from '#lib/vec2.js'

enum Dir {
  left,
  down,
  right,
  up,
}
function rotateDir(dir: Dir, turns: number): Dir {
  return posMod(dir + turns, 4)
}
const DIR_VEC: Record<Dir, vec2> = [
  /* left: */ [-1, 0],
  /* down: */ [0, 1],
  /* right: */ [1, 0],
  /* up: */ [0, -1],
]

const city = new Uint8Matrix()
for await (const row of io.readLines()) city.pushRow(row.split('').map(Number))

function* nextTurns(dir: Dir, speed: number) {
  yield rotateDir(dir, -1)
  if (speed < 3) yield dir
  yield rotateDir(dir, 1)
}

let minLoss = 0
const targetI = city.length - 1
const queue = new PriorityQueue<readonly [i: number, dir: Dir, speed: number]>()
queue.enqueue(1, [0, Dir.right, 0])
// Keep track of minimum visited cost per tile, direction and speed.
const visited = new Uint32Array(city.length * 4 * 3).fill(1, 0, 4 * 3)
for (const {cost: currCost, item} of queue) {
  const [currI, currDir, currSpeed] = item
  if (currI === targetI) {
    minLoss = currCost - 1
    break
  }
  for (const dir of nextTurns(currDir, currSpeed)) {
    const dirVec = DIR_VEC[dir]
    const i = city.moveBy(currI, dirVec)
    if (i === undefined) continue
    const speed = (dir === currDir ? currSpeed : 0) + 1
    const vi = (i * 4 + dir) * 3 + speed - 1
    const cost = currCost + city.$[i]!
    if (visited[vi] && visited[vi]! <= cost) continue
    visited[vi] = cost
    queue.enqueue(cost, [i, dir, speed])
  }
}

io.write(minLoss)
