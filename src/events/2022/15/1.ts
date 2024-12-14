import io from '#lib/io.js'
import {Vec2} from '#lib/vec2.js'
import vec from '#lib/vec.js'

const GET_TARGET_Y = (sensorsLen: number) => (sensorsLen < 15 ? 10 : 2000000)

type Beacon = Vec2

// todo: use Vec3 instead
class Sensor extends Vec2 {
  [2]: number
  constructor(x: number, y: number, r: number) {
    super(x, y, 3)
    this[2] = r
  }
}

// Parse.
const beacons = new Map<string, Beacon>()
const sensors: Sensor[] = []
const re = /-?\d+/g
for await (const line of io.readLines()) {
  const [sx = 0, sy = 0, bx = 0, by = 0] = [...line.matchAll(re)].map(Number)
  const pos = vec(sx, sy)
  const beacon = vec(bx, by)
  beacons.set(beacon.fmt(), beacon)
  sensors.push(new Sensor(pos[0], pos[1], pos.subtract(beacon).taxiLen))
}
const allX = sensors.flatMap(([x = 0, _, r = 0]) => [x - r, x + r])
const minX = Math.min(...allX)
const maxX = Math.max(...allX)
const TARGET_Y = GET_TARGET_Y(sensors.length)

// Scan.
let covered = 0
for (let x = minX; x < maxX; x++) {
  let p = vec(x, TARGET_Y)
  for (const s of sensors) {
    if (p.subtract(s).taxiLen <= s[2]) {
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
