import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {PriorityQueue} from '#lib/queue.js'
import type {vec2} from '#lib/vec2.v1.js'

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

const minSpeed = 4
const maxSpeed = 10
const speedOpts = maxSpeed - minSpeed + 1
function* nextTurns(dir: Dir, speed: number) {
  if (!speed || speed >= minSpeed) yield rotateDir(dir, -1)
  if (!speed || speed < maxSpeed) yield dir
  if (!speed || speed >= minSpeed) yield rotateDir(dir, 1)
}

let minLoss = 0
const targetI = city.length - 1
const queue = new PriorityQueue<readonly [i: number, dir: Dir, speed: number]>()
queue.enqueue(1, [0, Dir.right, 0])
// Keep track of minimum visited cost per tile, direction and speed.
const visited = new Uint32Array(city.length * 4 * speedOpts)
visited.fill(1, 0, 4 * speedOpts)
// Run queue.
for (const {cost: currCost, item} of queue) {
  const [currI, currDir, currSpeed] = item
  minLoss = currCost
  if (currI === targetI) break
  for (const dir of nextTurns(currDir, currSpeed)) {
    const dirVec = DIR_VEC[dir]
    // Update speed (and speed up if need be).
    let speed = dir === currDir ? currSpeed : 0
    let i: number | undefined = currI
    let cost = currCost
    do {
      i = city.moveBy(i, dirVec)
      if (i === undefined) break
      cost += city.$[i]!
    } while (++speed < minSpeed)
    if (i === undefined) continue
    // Check for previous scores and only keep new/better cases.
    const vi = (i * 4 + dir) * speedOpts + speed - minSpeed
    if (visited[vi] && visited[vi]! <= cost) continue
    visited[vi] = cost
    queue.enqueue(cost, [i, dir, speed])
  }
}

io.write(minLoss - 1)
