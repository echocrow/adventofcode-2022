import io from '#lib/io.js'
import {product} from '#lib/iterable.js'
import {posMod} from '#lib/math.js'
import vec, {type Vec2} from '#lib/vec2.js'

const WIDTH = Number((await io.readCfgLine('__width')) ?? 101)
const HEIGHT = Number((await io.readCfgLine('__height')) ?? 103)

const STEPS = 100

const MID_X = (WIDTH - 1) / 2
const MID_Y = (HEIGHT - 1) / 2
const quadrants: [Vec2, Vec2][] = [
  [vec(), vec(MID_X, MID_Y)],
  [vec(MID_X + 1, 0), vec(WIDTH, MID_Y)],
  [vec(0, MID_Y + 1), vec(MID_X, HEIGHT)],
  [vec(MID_X + 1, MID_Y + 1), vec(WIDTH, HEIGHT)],
]

const quadCounts = new Uint32Array(4)
const numsRe = /-?\d+/g
for await (const line of io.readLines()) {
  const [pX, pY, vX, vY] = line.matchAll(numsRe).map(([m]) => Number(m))
  const startP = vec(pX, pY)
  const v = vec(vX, vY)

  const p = startP.add(v.scale(STEPS))
  p[0] = posMod(p[0], WIDTH)
  p[1] = posMod(p[1], HEIGHT)

  const quad = quadrants.findIndex(([min, max]) => p.inArea(min, max))
  if (quad >= 0) quadCounts[quad]!++
}

const result = product(quadCounts)
io.write(result)
