import io from '#lib/io.js'
import vec, {type Vec2} from '#lib/vec.js'

const header = await io.readLineIfMatch(/^(\d+),(\d+)$/)
const SIZE = vec(Number(header?.[1] ?? 101), Number(header?.[2] ?? 103))

const MAX_STEPS = SIZE[0] * SIZE[1]

const MID_X = Math.ceil(SIZE[0] / 2)
const MID_Y = Math.ceil(SIZE[1] / 2)
const quadrants: [Vec2, Vec2][] = [
  [vec(), vec(MID_X, MID_Y)],
  [vec(MID_X, 0), vec(SIZE[0], MID_Y)],
  [vec(0, MID_Y), vec(MID_X, SIZE[1])],
  [vec(MID_X, MID_Y), vec(SIZE[0], SIZE[1])],
]
function findQuadrant(p: Vec2) {
  return quadrants.findIndex(([min, max]) => p.inArea(min, max))
}

const numsRe = /-?\d+/g

const guards: {p: Vec2; v: Vec2}[] = []
for await (const line of io.readLines()) {
  const [pX, pY, vX, vY] = line.matchAll(numsRe).map(([m]) => Number(m))
  const p = vec(pX, pY)
  const v = vec(vX, vY)
  guards.push({p, v})
}

const quadCounts = new Uint32Array(4)
const guardsQuad = new Int8Array(guards.length)
for (const [g, {p}] of guards.entries()) {
  const quad = findQuadrant(p)
  guardsQuad[g] = quad
  quadCounts[quad]!++
}

let result = 0
const threshold = guards.length / 2
for (let s = 1; s < MAX_STEPS; s++) {
  for (const [g, guard] of guards.entries()) {
    let {p} = guard
    p = guard.p.add(guard.v).mod(SIZE)
    const oldQuad = guardsQuad[g]!
    const newQuad = findQuadrant(p)
    if (oldQuad !== newQuad) {
      guardsQuad[g] = newQuad
      quadCounts[oldQuad]!--
      quadCounts[newQuad]!++
    }
    guard.p = p
  }
  const maxQuad = Math.max(...quadCounts)
  if (maxQuad >= threshold) {
    result = s
    break
  }
}

io.write(result)
