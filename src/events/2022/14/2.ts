import {
  addVec2,
  equalsVec,
  fmtVec2,
  maxVec2,
  rangeVec2,
  type vec2,
} from 'lib/vec2.js'
import io from 'lib/io.js'

const SAND_SRC: vec2 = [500, 0]
const SAND_MOVES: vec2[] = [
  [0, 1],
  [-1, 1],
  [1, 1],
]

// Parse.
const wall = new Map<string, boolean>()
let maxV = SAND_SRC
for await (const line of io.readLines()) {
  const corners = line
    .split(' -> ')
    .map((xy) => xy.split(',').map(Number) as [number, number])
  for (let c = 0; c < corners.length - 1; c++) {
    const from = corners[c]!
    const to = corners[c + 1]!
    for (const coord of rangeVec2(from, to, true)) {
      wall.set(fmtVec2(coord), false)
    }
  }
  for (const corner of corners) maxV = maxVec2(maxV, corner)
}
let floorY = maxV[1] + 2

// Pour.
let grains = 0
pour: while (true) {
  let sand: vec2 = [...SAND_SRC]
  grains++
  fall: while (true) {
    const next = SAND_MOVES.map((move) => addVec2(move, sand)).find(
      (next) => !wall.has(fmtVec2(next)),
    )
    if (!next || next[1] >= floorY) break fall
    sand = next
  }
  if (equalsVec(sand, SAND_SRC)) break pour
  wall.set(fmtVec2(sand), true)
}

io.write(grains)
