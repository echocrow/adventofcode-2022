import io from '#lib/io.js'
import {
  addVec2,
  lenVec2,
  scaleVec2,
  subtractVec2,
  Vec2Set,
  zeroVec2,
} from '#lib/vec2.v1.js'

const DIRS = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
} as const
type Dir = keyof typeof DIRS

let h = zeroVec2
let t = zeroVec2
const tPos = new Vec2Set([t])
for await (const line of io.readLines()) {
  const [dirStr = '', stepStr] = line.split(' ')
  const dir = DIRS[dirStr as Dir]
  const antiDir = scaleVec2(dir, -1)
  const steps = Number(stepStr)
  for (let s = 0; s < steps; s++) {
    h = addVec2(h, dir)
    if (lenVec2(subtractVec2(h, t)) > 1.5) {
      t = h
      t = addVec2(t, antiDir)
      tPos.add(t)
    }
  }
}

io.write(tPos.size)
