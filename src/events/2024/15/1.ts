import io from '#lib/io.js'
import {sum} from '#lib/iterable.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {strRec} from '#lib/types.js'

const FREE = 0
const WALL = 1
const BOX = 2

let map = new Uint8Matrix()
let robot = 0
{
  for await (const line of io.readLines()) {
    if (!line) break
    map.pushRow(
      [...line].map((c, i) => {
        if (c === '@') robot = i + map.length
        return (
          c === '#' ? WALL
          : c === 'O' ? BOX
          : FREE
        )
      }),
    )
  }
}

const MOVES = strRec({
  '<': -1,
  '>': 1,
  '^': -map.width,
  v: map.width,
})

let blockedMove = 0
for await (const char of io.readChar()) {
  const move = MOVES[char]!
  if (move === blockedMove) continue

  const target = robot + move
  let p = target
  let freeP = -1
  let boxP = -1
  while (true) {
    const obj = map.$[p]
    if (obj === WALL) break
    if (obj === FREE) {
      freeP = p
      break
    }
    if (boxP === -1) boxP = p
    p += move
  }
  blockedMove = freeP >= 0 ? 0 : move
  if (!blockedMove) {
    robot = target
    if (boxP >= 0) {
      map.$[boxP] = FREE
      map.$[freeP] = BOX
    }
  }
}

const result = sum(
  map.$.values().map((obj, i) => {
    if (obj !== BOX) return 0
    const [x, y] = map.iToVec(i)
    return 100 * y + x
  }),
)
io.write(result)
