import io from '#lib/io.js'
import vec2 from '#lib/vec2.js'

const SAND_SRC = vec2(500, 0)
const SAND_MOVES = [vec2(0, 1), vec2(-1, 1), vec2(1, 1)]

// Parse.
const wall = new Map<string, boolean>()
let minV = SAND_SRC
let maxV = SAND_SRC
for await (const line of io.readLines()) {
  const corners = line.split(' -> ').map(vec2.parse)
  for (let c = 0; c < corners.length - 1; c++) {
    const from = corners[c]!
    const to = corners[c + 1]!
    for (const coord of from.range(to, true)) {
      wall.set(coord.fmt(), false)
    }
  }
  for (const corner of corners) {
    minV = minV.min(corner)
    maxV = maxV.max(corner)
  }
}
maxV = maxV.add(vec2(1, 1))

// Pour.
let grains = 0
pour: while (true) {
  let sand = vec2.from(SAND_SRC)
  fall: while (true) {
    const next = SAND_MOVES.map((move) => move.add(sand)).find(
      (next) => !wall.has(next.fmt()),
    )
    if (!next) break fall
    if (!next.inArea(minV, maxV)) break pour
    sand = next
  }
  wall.set(sand.fmt(), true)
  grains++
}

io.write(grains)
