import {pushIfNew} from '#lib/array.js'
import io from '#lib/io.js'
import {fifo, reversed, sum} from '#lib/iterable.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {strRec} from '#lib/types.js'

const FREE = 0
const WALL = 1 << 1
const BOX = 1 << 2
const BOX_LEFT = BOX | 0
const BOX_RIGHT = BOX | 1

let map = new Uint8Matrix()
let robot = 0
{
  const TILES = strRec({
    FREE: [FREE, FREE],
    '#': [WALL, WALL],
    O: [BOX_LEFT, BOX_RIGHT],
  } as const)
  for await (const line of io.readLines()) {
    if (!line) break
    const row = [...line]
    const robotY = row.findIndex((c) => c === '@')
    if (robotY >= 0) robot = robotY * 2 + map.length
    map.pushRow(row.flatMap((c) => TILES[c] ?? TILES.FREE))
  }
}

const MOVES = strRec({
  '<': [-1, [-1 + 0]],
  '>': [1, [1 + 1]],
  '^': [-map.width, [-map.width + 0, -map.width + 1]],
  v: [map.width, [map.width + 0, map.width + 1]],
} as const)

let blockedMove = 0
move: for await (const char of io.readChar()) {
  const [move, lookups] = MOVES[char]!
  if (move === blockedMove) continue

  // Check collisions and collect boxes to move.
  const boxes: number[] = []
  const checks = [robot + move]
  for (let p of fifo(checks)) {
    const obj = map.$[p]
    if (obj === FREE) continue
    if (obj === WALL) {
      blockedMove = move
      continue move
    }
    if (obj === BOX_RIGHT) p--
    pushIfNew(boxes, p)
    for (const look of lookups) pushIfNew(checks, p + look)
  }

  blockedMove = 0
  robot = robot + move

  // Move boxes.
  for (const p of reversed(boxes)) {
    map.$.fill(FREE, p, p + 2)
    map.$[p + move] = BOX_LEFT
    map.$[p + move + 1] = BOX_RIGHT
  }
}

const result = sum(
  map.$.values().map((obj, i) => {
    if (obj !== BOX_LEFT) return 0
    const [x, y] = map.iToVec(i)
    return 100 * y + x
  }),
)
io.write(result)
