import {pairs} from '#lib/array.js'
import io from '#lib/io.js'
import {map, sum} from '#lib/iterable.js'
import {subtractVec2, type mutVec2, taxiLenVec2} from '#lib/vec2.v1.js'

const cols = await io.peekLineLen()

// Parse galaxies & expand vertically.
const galaxies: mutVec2[] = []
const filledCols = new Uint16Array(cols)
let y = 0
for await (const line of io.readLines()) {
  let x = -1
  let rowHasGalaxy = false
  for (const char of line) {
    x++
    if (char !== '#') continue
    rowHasGalaxy = true
    filledCols[x] = 1
    galaxies.push([x, y])
  }
  y++
  if (!rowHasGalaxy) y++
}

// Expand horizontally.
{
  let growXAcc = 0
  const growX = new Uint32Array(filledCols.length)
  for (let i = 0; i < filledCols.length; i++) {
    growXAcc += 1 - filledCols[i]!
    growX[i] = growXAcc
  }
  for (const g of galaxies) g[0] += growX[g[0]]!
}

// Sum distances.
const result = sum(
  map(pairs(galaxies), ([a, b]) => taxiLenVec2(subtractVec2(a, b))),
)
io.write(result)
