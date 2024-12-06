import io from '#lib/io.js'
import {subtractVec2, type mutVec2, taxiLenVec2} from '#lib/vec2.js'

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
let result = 0
for (let i = 0; i < galaxies.length; i++)
  for (let j = i + 1; j < galaxies.length; j++)
    result += taxiLenVec2(subtractVec2(galaxies[i]!, galaxies[j]!))
io.write(result)
