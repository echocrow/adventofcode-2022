import IO from 'lib/io.js'

const io = new IO()

type V2d = [number, number]

const DIRS = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
} as const
type Dir = keyof typeof DIRS

function addToV2d(v: V2d, a: Readonly<V2d>) {
  v[0] += a[0]
  v[1] += a[1]
}
function fmtV2d(v: Readonly<V2d>): string {
  return `${v[0]}.${v[1]}`
}

function updateTail(h: V2d, t: V2d): boolean {
  const dx = h[0] - t[0]
  const dy = h[1] - t[1]
  const dxa = Math.abs(dx)
  const dya = Math.abs(dy)
  const f = Math.max(dxa, dya) - 1
  addToV2d(t, [(dx / (dxa || 1)) * f, (dy / (dya || 1)) * f])
  return !!f
}

const ROPE_LEN = 10

const rope: V2d[] = Array(ROPE_LEN)
  .fill(0)
  .map(() => [0, 0])
const LAST_HEAD = rope.length - 2
const tail: V2d = rope[rope.length - 1]!
const tailPos = new Set([fmtV2d(tail)])
for await (const line of io.readLines()) {
  const [dirStr = '', stepStr] = line.split(' ')
  const dir = DIRS[dirStr as Dir]
  const steps = Number(stepStr)
  for (let s = 0; s < steps; s++) {
    addToV2d(rope[0]!, dir)
    let r = 0
    while (r <= LAST_HEAD && updateTail(rope[r]!, rope[++r]!)) {}
    tailPos.add(fmtV2d(tail))
  }
}

io.write(tailPos.size)
