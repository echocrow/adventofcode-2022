import io from '#lib/io.js'
import {reversed, sum} from '#lib/iterable.js'
import {Uint8Matrix} from '#lib/matrix.js'

const FREE = 0
const WALL = 1 << 1
const BOX = 1 << 2

const BOX_LEFT = BOX | 0
const BOX_RIGHT = BOX | 1

let map = new Uint8Matrix()
let robot = 0
{
  for await (const line of io.readLines()) {
    if (!line) break
    map.pushRow(
      line.split('').flatMap((c, i) => {
        if (c === '@') robot = i * 2 + map.length
        return (
          c === '#' ? [WALL, WALL]
          : c === 'O' ? [BOX_LEFT, BOX_RIGHT]
          : [FREE, FREE]
        )
      }),
    )
  }
}

const MOVES: Record<string, number> = {
  '<': -1,
  '>': 1,
  '^': -map.width,
  v: map.width,
}

let blockedMove = 0
for await (const char of io.readChar()) {
  const move = MOVES[char]!

  if (move === blockedMove) continue

  const target = robot + move
  // Horizontal movement.
  if (move === 1 || move === -1) {
    let p = target
    let freeP = -1
    let hasBox = false
    while (true) {
      const obj = map.$[p]
      if (obj === WALL) break
      if (obj === FREE) {
        freeP = p
        break
      }
      hasBox = true
      p += move * 2
    }
    blockedMove = freeP >= 0 ? 0 : move
    if (!blockedMove) {
      if (hasBox) {
        const copyTarget = move === -1 ? freeP : target
        const from = move === -1 ? freeP + 1 : robot
        const to = move === -1 ? robot + 1 : freeP
        map.$.copyWithin(copyTarget, from, to)
      }
      robot = target
    }
  }
  // Vertical movement.
  else {
    let slots = new Set([target])
    let slots2: typeof slots = new Set()
    const boxes: number[] = []
    blockedMove = 0
    lookAhead: while (slots.size) {
      slots2.clear()
      for (let p of slots) {
        const obj = map.$[p]
        if (obj === FREE) continue
        if (obj === WALL) {
          blockedMove = move
          break lookAhead
        }
        if (obj === BOX_RIGHT) p--
        if (!boxes.includes(p)) boxes.push(p)
        slots2.add(p + move)
        slots2.add(p + 1 + move)
      }
      ;[slots, slots2] = [slots2, slots]
    }
    if (!blockedMove) {
      robot = target
      for (const p of reversed(boxes)) {
        map.$.copyWithin(p + move, p, p + 2)
        map.$.fill(FREE, p, p + 2)
      }
    }
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
