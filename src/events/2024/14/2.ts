import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import vec, {type Vec2} from '#lib/vec.js'

const WIDTH = Number((await io.readCfgLine('__width')) ?? 101)
const HEIGHT = Number((await io.readCfgLine('__height')) ?? 103)

const guards: {p: Vec2; v: Vec2}[] = []
{
  const numsRe = /-?\d+/g
  for await (const line of io.readLines()) {
    const [pX, pY, vX, vY] = line.matchAll(numsRe).map(([m]) => Number(m))
    const p = vec([pX!, pY!])
    const v = vec([vX!, vY!])
    guards.push({p, v})
  }
}

// Find time when the most guards are in the same column.
const xLen = WIDTH
let xMaxT = 0
{
  let allTimeMax = 0
  const counts = new Uint32Array(WIDTH)
  for (const {p} of guards) counts[p[0]]!++
  for (let t = 0; t < WIDTH; t++) {
    const max = Math.max(...counts)
    if (max > allTimeMax) {
      allTimeMax = max
      xMaxT = t
    }
    for (const {p, v} of guards) {
      counts[p[0]]!--
      p[0] = posMod(p[0] + v[0], WIDTH)
      counts[p[0]]!++
    }
  }
}

// Find time when the most guards are in the same row.
const yLen = HEIGHT
let yMaxT = 0
{
  let allTimeMax = 0
  const counts = new Uint32Array(HEIGHT)
  for (const {p} of guards) counts[p[1]]!++
  for (let t = 0; t < HEIGHT; t++) {
    const max = Math.max(...counts)
    if (max > allTimeMax) {
      allTimeMax = max
      yMaxT = t
    }
    for (const {p, v} of guards) {
      counts[p[1]]!--
      p[1] = posMod(p[1] + v[1], HEIGHT)
      counts[p[1]]!++
    }
  }
}

// Figure out when these two cycles overlap.
// xMaxT + (xLen * xCycles) = yMaxT + (yLen * yCycles)
let result = xMaxT
while ((result - yMaxT) % yLen) result += xLen

// // Print the map.
// {
//   const map = new Uint8Matrix(SIZE)
//   for (const guard of guards) {
//     const p = guard.p.add(guard.v.scale(result)).mod(SIZE)
//     map.setCell(p, 1)
//   }
//   io.log(map.fmt((c) => c === '#'))
// }

io.write(result)
