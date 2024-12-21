import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {PriorityQueue} from '#lib/queue.js'

enum Dir {
  R,
  D,
  L,
  U,
}

const ROT_DIRS: Record<Dir, readonly Dir[]> = {
  [Dir.R]: [Dir.R, Dir.U, Dir.D],
  [Dir.D]: [Dir.D, Dir.R, Dir.L],
  [Dir.L]: [Dir.L, Dir.D, Dir.U],
  [Dir.U]: [Dir.U, Dir.L, Dir.R],
}

let start = 0
let end = 0
const maze = new Uint8Matrix()
for await (const line of io.readLines()) {
  const row = [...line]
  const s = row.indexOf('S')
  if (s >= 0) start = maze.length + s
  const e = row.indexOf('E')
  if (e >= 0) end = maze.length + e
  maze.pushRow(row.map((c) => (c === '#' ? 1 : 0)))
}

const MOVES = {
  [Dir.R]: 1,
  [Dir.L]: -1,
  [Dir.D]: maze.width,
  [Dir.U]: -maze.width,
} as const

let shortestCost = 0
let shortestPaths: number[][] = []
const costs = new Uint32Array(maze.length * 4)
const queue = new PriorityQueue(0, {p: start, dir: Dir.R, path: [start]})
for (const {
  cost,
  item: {p, dir, path},
} of queue) {
  if (shortestCost && cost > shortestCost) break
  if (p === end) {
    shortestCost = cost
    shortestPaths.push(path)
  }
  for (const toDir of ROT_DIRS[dir]) {
    const toP = p + MOVES[toDir]
    if (maze.$[toP]) continue
    const toCost = cost + 1 + (toDir === dir ? 0 : 1000)
    const costIdx = toP * 4 + toDir
    if (costs[costIdx] && costs[costIdx] < toCost) continue
    costs[costIdx] = toCost
    queue.enqueue(toCost, {p: toP, dir: toDir, path: [...path, toP]})
  }
}

const result = shortestPaths.reduce(
  (acc, path) => acc.union(new Set(path)),
  new Set(),
).size
io.write(result)
