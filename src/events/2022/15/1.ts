import io from 'lib/io.js'
import {fmtVec2, type vec2} from 'lib/vec2.js'

// const TARGET_Y = 10
const TARGET_Y = 2000000

type Beacon = vec2
type Sensor = readonly [...vec2, number]

function manhatDist(a: vec2, b: vec2 | Sensor): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

// Parse.
const beacons = new Map<string, Beacon>()
const sensors: Sensor[] = []
const re = /-?\d+/g
for await (const line of io.readLines()) {
  const [sx = 0, sy = 0, bx = 0, by = 0] = [...line.matchAll(re)].map(Number)
  const pos = [sx, sy] as const
  const beacon = [bx, by] as const
  beacons.set(fmtVec2(beacon), beacon)
  sensors.push([...pos, manhatDist(pos, beacon)])
}
const allX = sensors.flatMap(([x, _, r]) => [x - r, x + r])
const minX = Math.min(...allX)
const maxX = Math.max(...allX)

// Scan.
let covered = 0
for (let x = minX; x < maxX; x++) {
  let p: vec2 = [x, TARGET_Y]
  for (const s of sensors) {
    if (manhatDist(p, s) <= s[2]) {
      covered++
      break
    }
  }
}

// Remove known sensors/beacons.
const emptyCovered =
  covered -
  [...beacons.values()].filter((b) => b[1] === TARGET_Y).length -
  sensors.filter((s) => s[1] === TARGET_Y).length

io.write(emptyCovered)
