import io from '#lib/io.js'
import vec, {VecSet} from '#lib/vec.js'

const DIRS = {
  U: vec(0, 1),
  D: vec(0, -1),
  L: vec(-1, 0),
  R: vec(1, 0),
} as const
type Dir = keyof typeof DIRS

let h = vec()
let t = vec()
const tPos = new VecSet([t])
for await (const line of io.readLines()) {
  const [dirStr = '', stepStr] = line.split(' ')
  const dir = DIRS[dirStr as Dir]
  const antiDir = dir.invert()
  const steps = Number(stepStr)
  for (let s = 0; s < steps; s++) {
    h = h.add(dir)
    if (h.subtract(t).len > 1.5) {
      t = h
      t = t.add(antiDir)
      tPos.add(t)
    }
  }
}

io.write(tPos.size)
