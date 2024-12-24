import {pairs} from '#lib/array.js'
import io from '#lib/io.js'
import {map, sum} from '#lib/iterable.js'
import vec2, {type Vec2} from '#lib/vec2.js'

const growth = Number((await io.readCfgLine('__growth')) ?? 1000000)
const cols = await io.peekLineLen()

// Parse galaxies & expand vertically.
const galaxies: Vec2[] = []
const filledCols = new Uint32Array(cols)
let y = 0
for await (const line of io.readLines()) {
  let x = -1
  let rowHasGalaxy = false
  for (const char of line) {
    x++
    if (char !== '#') continue
    rowHasGalaxy = true
    filledCols[x] = 1
    galaxies.push(vec2(x, y))
  }
  y += !rowHasGalaxy ? growth : 1
}

// Expand horizontally.
{
  let growXAcc = 0
  const growX = new Uint32Array(filledCols.length)
  for (let i = 0; i < growX.length; i++) {
    growXAcc += 1 - filledCols[i]!
    growX[i] = growXAcc * (growth - 1)
  }
  for (const g of galaxies) g[0] += growX[g[0]]!
}

// Sum distances.
const result = sum(map(pairs(galaxies), ([a, b]) => a.subtract(b).taxiLen))
io.write(result)
