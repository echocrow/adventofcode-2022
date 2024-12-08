import io from '#lib/io.js'
import type {vec2} from '#lib/vec2.v1.js'

const GET_MAX_DIST = (sensorsLen: number) => (sensorsLen < 15 ? 20 : 4000000)

const TUNE_FACTOR = 4000000

type Sensor = readonly [...vec2, number]

function manhatDist(a: vec2, b: vec2): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

// Parse.
const sensors: Sensor[] = []
const re = /-?\d+/g
for await (const line of io.readLines()) {
  const [sx = 0, sy = 0, bx = 0, by = 0] = [...line.matchAll(re)].map(Number)
  const pos = [sx, sy] as const
  sensors.push([...pos, manhatDist(pos, [bx, by])])
}
const MAX_DIST = GET_MAX_DIST(sensors.length)

// Scan.
let frequency = 0
const PROG_PC = Math.round(MAX_DIST / 100)
for (let x = 0; x < MAX_DIST; x++) {
  if (x % PROG_PC === 0) io.log(Math.round((x / MAX_DIST) * 100), '%')
  let ranges: vec2[] = [[0, MAX_DIST]]
  for (const [sx, sy, sr] of sensors) {
    const xRad = sr - Math.abs(x - sx)
    if (xRad <= 0) continue
    const min = Math.min(Math.max(sy - xRad, 0), MAX_DIST) - 1
    const max = Math.min(Math.max(sy + xRad, 0), MAX_DIST) + 1
    ranges = ranges.flatMap(([l, r]) => {
      if (min < l && max > r) return []
      if (min < l) return [[Math.max(max, l), r]]
      if (max > r) return [[l, Math.min(min, r)]]
      return [
        [l, min],
        [max, r],
      ]
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
