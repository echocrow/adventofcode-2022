import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'
import vec, {type Vec2} from '#lib/vec.legacy.js'

const WALL = 1 << 0
const UP_BIT = 1 << 1
const DOWN_BIT = 1 << 2
const LEFT_BIT = 1 << 3
const RIGHT_BIT = 1 << 4

interface Move {
  dir: Vec2
  bit: number
  next: Move
}
const MOVES = {
  up: {
    dir: vec(0, -1),
    bit: UP_BIT,
    get next(): Move {
      return MOVES.right
    },
  },
  right: {
    dir: vec(1, 0),
    bit: RIGHT_BIT,
    get next(): Move {
      return MOVES.down
    },
  },
  down: {
    dir: vec(0, 1),
    bit: DOWN_BIT,
    get next(): Move {
      return MOVES.left
    },
  },
  left: {
    dir: vec(-1, 0),
    bit: LEFT_BIT,
    get next(): Move {
      return MOVES.up
    },
  },
} as const satisfies Record<string, Move>

// Parse map.
let pos = vec()
const map = new Uint8Matrix()
for await (const line of io.readLines()) {
  const x = line.indexOf('^')
  if (x >= 0) pos = vec(x, map.height)
  map.pushRow([...line].map((c) => +(c === '#')))
}

// Walk map and try to block.
function walkAndBlock(
  map: Uint8Matrix,
  pos: Vec2,
  move: Move,
  remainWalls: number,
): number {
  let result = 0
  let cell = map.cell(pos)!

  map.setCell(pos, cell | move.bit)

  while (true) {
    const toPos = pos.add(move.dir)
    const toCell = map.cell(toPos)

    // End of map.
    if (toCell === undefined) break

    // Wall hit.
    if (toCell === WALL) {
      move = move.next
      if (cell & move.bit) {
        result++
        break
      }
      continue
    }

    // Loop check.
    if (toCell & move.bit) {
      result++
      break
    }

    // Check potential wall insert.
    if (remainWalls && !toCell) {
      const altMap = new Uint8Matrix(map)
      altMap.setCell(toPos, WALL)
      result += walkAndBlock(altMap, pos, move.next, remainWalls - 1)
    }

    // Move forward.
    pos = toPos
    cell = toCell
    map.setCell(pos, cell | move.bit)
  }

  return result
}

const result = walkAndBlock(map, pos, MOVES.up, 1)
io.write(result)
