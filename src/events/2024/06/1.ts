import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'
import {addVec2, zeroVec2, type vec2} from '#lib/vec2.js'

const WALL = 1
const VISITED = 2

const MOVE_DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const satisfies vec2[]

// Parse map.
let pos = zeroVec2
const map = new Uint8Matrix()
for await (const line of io.readLines()) {
  const x = line.indexOf('^')
  if (x >= 0) pos = [x, map.height]
  map.pushRow(line.split('').map((c) => +(c === '#')))
}

let visited = 1
map.setCell(...pos, VISITED)

// Walk map.
let dirI: keyof typeof MOVE_DIRS = 0
while (true) {
  const toPos = addVec2(pos, MOVE_DIRS[dirI]!)
  const toCell = map.cell(...toPos)

  // End of map.
  if (toCell === undefined) break

  // Wall hit.
  if (toCell === WALL) {
    dirI = (dirI + 1) % MOVE_DIRS.length
    continue
  }

  // Move forward.
  pos = toPos
  if (!toCell) {
    visited++
    map.setCell(...pos, VISITED)
  }
}

io.write(visited)
