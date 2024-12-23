import io from '#lib/io.js'
import vec from '#lib/vec.legacy.js'

const SAND_SRC = vec(500, 0)
const SAND_MOVES = [vec(0, 1), vec(-1, 1), vec(1, 1)]

// Parse.
const wall = new Map<string, boolean>()
let maxV = SAND_SRC
for await (const line of io.readLines()) {
  const corners = line.split(' -> ').map(vec.parse2)
  for (let c = 0; c < corners.length - 1; c++) {
    const from = corners[c]!
    const to = corners[c + 1]!
    for (const coord of from.range(to, true)) {
      wall.set(coord.fmt(), false)
    }
  }
  for (const corner of corners) maxV = maxV.max(corner)
}
let floorY = maxV[1] + 2

// Pour.
let grains = 0
pour: while (true) {
  let sand = vec(...SAND_SRC)
  grains++
  fall: while (true) {
    const next = SAND_MOVES.map((move) => move.add(sand)).find(
      (next) => !wall.has(next.fmt()),
    )
    if (!next || next[1] >= floorY) break fall
    sand = next
  }
  if (sand.equals(SAND_SRC)) break pour
  wall.set(sand.fmt(), true)
}

io.write(grains)
