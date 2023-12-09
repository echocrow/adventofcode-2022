import io from '#lib/io.js'
import {
  addVec2,
  fmtVec2,
  inAreaVec2,
  maxVec2,
  minVec2,
  rangeVec2,
  type vec2,
} from '#lib/vec2.js'

const SAND_SRC: vec2 = [500, 0]
const SAND_MOVES: vec2[] = [
  [0, 1],
  [-1, 1],
  [1, 1],
]

// Parse.
const wall = new Map<string, boolean>()
let minV = SAND_SRC
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
  for (const corner of corners) {
    minV = minVec2(minV, corner)
    maxV = maxVec2(maxV, corner)
  }
}
maxV = addVec2(maxV, [1, 1])

// Pour.
let grains = 0
pour: while (true) {
  let sand: vec2 = [...SAND_SRC]
  fall: while (true) {
    const next = SAND_MOVES.map((move) => addVec2(move, sand)).find(
      (next) => !wall.has(fmtVec2(next)),
    )
    if (!next) break fall
    if (!inAreaVec2(minV, maxV, next)) break pour
    sand = next
  }
  wall.set(fmtVec2(sand), true)
  grains++
}

io.write(grains)
