import io from '#lib/io.js'
import vec2, {type Vec2} from '#lib/vec2.js'

const GET_TARGET_Y = (sensorsLen: number) => (sensorsLen < 15 ? 10 : 2000000)

type Sensor = [x: number, y: number, r: number]

// Parse.
const beacons = new Map<string, Vec2>()
const sensors: Sensor[] = []
const re = /-?\d+/g
for await (const line of io.readLines()) {
  const [sx = 0, sy = 0, bx = 0, by = 0] = [...line.matchAll(re)].map(Number)
  const pos = vec2(sx, sy)
  const beacon = vec2(bx, by)
  beacons.set(beacon.fmt(), beacon)
  sensors.push([pos[0], pos[1], pos.subtract(beacon).taxiLen])
}
const allX = sensors.flatMap(([x = 0, _, r = 0]) => [x - r, x + r])
const minX = Math.min(...allX)
const maxX = Math.max(...allX)
const TARGET_Y = GET_TARGET_Y(sensors.length)

// Scan.
let covered = 0
for (let x = minX; x < maxX; x++) {
  let p = vec2(x, TARGET_Y)
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
