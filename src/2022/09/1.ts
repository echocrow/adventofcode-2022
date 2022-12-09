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
function setToV2d(v: V2d, s: Readonly<V2d>) {
  v[0] = s[0]
  v[1] = s[1]
}
function multiV2d(v: Readonly<V2d>, qt: number): V2d {
  return v.map((p) => p * qt) as V2d
}
function distV2d(a: Readonly<V2d>, b: Readonly<V2d>): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}
function fmtV2d(v: Readonly<V2d>): string {
  return `${v[0]}.${v[1]}`
}

const h: V2d = [0, 0]
const t: V2d = [0, 0]
const tPos = new Set([fmtV2d(t)])
for await (const line of io.readLines()) {
  const [dirStr = '', stepStr] = line.split(' ')
  const dir = DIRS[dirStr as Dir]
  const antiDir = multiV2d(dir, -1)
  const steps = Number(stepStr)
  for (let s = 0; s < steps; s++) {
    addToV2d(h, dir)
    if (distV2d(h, t) > 1.5) {
      setToV2d(t, h)
      addToV2d(t, antiDir)
      tPos.add(fmtV2d(t))
    }
  }
}

io.write(tPos.size)
