import io from '#lib/io.js'
import {range} from '#lib/iterable.js'
import {posMod} from '#lib/math.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {PriorityQueue} from '#lib/queue.js'
import {scaleVec2, subtractVec2, taxiLenVec2, type vec2} from '#lib/vec2.js'

const perf = io.perf()

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

const [minSpeed, maxSpeed] = [4, 10]
const speedOpts = maxSpeed - minSpeed + 1
function* nextTurns(dir: Dir) {
  yield rotateDir(dir, -1)
  yield rotateDir(dir, 1)
}

// TODO: speed up.
let minLoss = 0
const targetI = city.length - 1
const targetPos = city.iToVec(targetI)
const queue = new PriorityQueue<readonly [i: number, dir: Dir, loss: number]>()
queue.enqueue(0, [0, Dir.right, 1])
queue.enqueue(0, [0, Dir.down, 1])
// Keep track of minimum visited cost per tile, direction and speed.
const visited = new Uint32Array(city.length * 4 * speedOpts)
for (const i of range(0, 4 * speedOpts)) visited[i] = 1
for (const {item} of queue) {
  const [currI, dir, currLoss] = item
  if (currI === targetI) {
    minLoss = currLoss - 1
    break
  }
  let loss = currLoss
  let i: number | undefined = currI
  const dirVec = DIR_VEC[dir]
  for (let speed = 1; speed <= maxSpeed; speed++) {
    i = city.moveBy(i!, dirVec)
    if (i === undefined) break
    loss += city.$[i]!
    if (speed < minSpeed) continue
    const vi = (i * 4 + dir) * speedOpts + speed - 1
    if (visited[vi] && visited[vi]! <= loss) break
    visited[vi] = loss
    const pos = city.iToVec(i)
    const taxiDist = taxiLenVec2(subtractVec2(pos, targetPos))
    for (const nextDir of nextTurns(dir)) {
      queue.enqueue(loss + taxiDist, [i, nextDir, loss])
    }
  }
}

io.write(minLoss)

perf()
