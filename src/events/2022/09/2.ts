import io from '#lib/io.js'
import {addVec2, type vec2, Vec2Set, zeroVec2} from '#lib/vec2.v1.js'

const DIRS = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
} as const
type Dir = keyof typeof DIRS

function updateTail(h: vec2, t: vec2): vec2 {
  const dx = h[0] - t[0]
  const dy = h[1] - t[1]
  const dxa = Math.abs(dx)
  const dya = Math.abs(dy)
  const f = Math.max(dxa, dya) - 1
  return f ? addVec2(t, [(dx / (dxa || 1)) * f, (dy / (dya || 1)) * f]) : t
}

const ROPE_LEN = 10

const rope: vec2[] = Array(ROPE_LEN)
  .fill(0)
  .map(() => zeroVec2)
const LAST_TAIL = rope.length - 1
const tail = rope[LAST_TAIL]!
const tailPos = new Vec2Set()
for await (const line of io.readLines()) {
  const [dirStr = '', stepStr] = line.split(' ')
  const dir = DIRS[dirStr as Dir]
  const steps = Number(stepStr)
  for (let s = 0; s < steps; s++) {
    rope[0] = addVec2(rope[0]!, dir)
    for (let r = 1; r <= LAST_TAIL; r++) {
      const tail = rope[r]!
      const newTail = updateTail(rope[r - 1]!, tail)
      if (newTail === tail) break
      rope[r] = newTail
    }
    tailPos.add(rope[LAST_TAIL]!)
  }
}

io.write(tailPos.size)
