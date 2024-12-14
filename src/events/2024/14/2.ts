import io from '#lib/io.js'
import {posMod} from '#lib/math.js'
import vec, {type Vec2} from '#lib/vec.js'

const header = await io.readLineIfMatch(/^(\d+),(\d+)$/)
const SIZE = header ? vec.parse2(header[0]) : vec(101, 103)

const guards: {p: Vec2; v: Vec2}[] = []
{
  const numsRe = /-?\d+/g
  for await (const line of io.readLines()) {
    const [pX, pY, vX, vY] = line.matchAll(numsRe).map(([m]) => Number(m))
    const p = vec(pX, pY)
    const v = vec(vX, vY)
    guards.push({p, v})
  }
}

// Find time when the most guards are in the same column.
const xLen = SIZE[0]
let xMaxT = 0
{
  let allTimeMax = 0
  const counts = new Uint32Array(SIZE[0])
  for (const {p} of guards) counts[p[0]]!++
  for (let t = 0; t < SIZE[0]; t++) {
    const max = Math.max(...counts)
    if (max > allTimeMax) {
      allTimeMax = max
      xMaxT = t
    }
    for (const {p, v} of guards) {
      counts[p[0]]!--
      p[0] = posMod(p[0] + v[0], SIZE[0])
      counts[p[0]]!++
    }
  }
}

// Find time when the most guards are in the same row.
const yLen = SIZE[1]
let yMaxT = 0
{
  let allTimeMax = 0
  const counts = new Uint32Array(SIZE[1])
  for (const {p} of guards) counts[p[1]]!++
  for (let t = 0; t < SIZE[1]; t++) {
    const max = Math.max(...counts)
    if (max > allTimeMax) {
      allTimeMax = max
      yMaxT = t
    }
    for (const {p, v} of guards) {
      counts[p[1]]!--
      p[1] = posMod(p[1] + v[1], SIZE[1])
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
//     map.setCell(p[0], p[1], 1)
//   }
//   console.log(map.fmt((c) => (c ? '#' : ' ')))
// }

io.write(result)
