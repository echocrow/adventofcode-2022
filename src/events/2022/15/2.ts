import io from '#lib/io.js'
import {Vec2} from '#lib/vec2.legacy.js'
import vec from '#lib/vec.legacy.js'

const GET_MAX_DIST = (sensorsLen: number) => (sensorsLen < 15 ? 20 : 4000000)

const TUNE_FACTOR = 4000000

// todo: use Vec3 instead
class Sensor extends Vec2 {
  [2]: number
  constructor(x: number, y: number, r: number) {
    super(x, y, 3)
    this[2] = r
  }
}

// Parse.
const sensors: Sensor[] = []
const re = /-?\d+/g
for await (const line of io.readLines()) {
  const [sx = 0, sy = 0, bx = 0, by = 0] = [...line.matchAll(re)].map(Number)
  const pos = vec(sx, sy)
  const beacon = vec(bx, by)
  sensors.push(new Sensor(pos[0], pos[1], pos.subtract(beacon).taxiLen))
}
const MAX_DIST = GET_MAX_DIST(sensors.length)

// Scan.
let frequency = 0
const PROG_PC = Math.round(MAX_DIST / 100)
for (let x = 0; x < MAX_DIST; x++) {
  if (x % PROG_PC === 0) io.log(Math.round((x / MAX_DIST) * 100), '%')
  let ranges = [vec(0, MAX_DIST)]
  for (const [sx, sy, sr] of sensors) {
    const xRad = sr - Math.abs(x - sx)
    if (xRad <= 0) continue
    const min = Math.min(Math.max(sy - xRad, 0), MAX_DIST) - 1
    const max = Math.min(Math.max(sy + xRad, 0), MAX_DIST) + 1
    ranges = ranges.flatMap(([l = 0, r = 0]) => {
      if (min < l && max > r) return []
      if (min < l) return [vec(Math.max(max, l), r)]
      if (max > r) return [vec(l, Math.min(min, r))]
      return [vec(l, min), vec(max, r)]
    })
    if (!ranges.length) break
  }
  if (ranges.length) {
    frequency += ranges[0]![0]
    break
  }
  frequency += TUNE_FACTOR
}

io.write(frequency)
