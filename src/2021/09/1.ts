import IO from 'lib/io.js'
import sum from 'lib/sum.js'

const io = new IO()

function merge(a: Uint8Array, b: Uint8Array): Uint8Array {
  const ab = new Uint8Array(a.length + b.length)
  ab.set(a)
  ab.set(b, a.length)
  return ab
}

function* neighbors(arr: Uint8Array, w: number, i: number) {
  const h = arr.length / w
  const x = i % w
  const y = (i - x) / w
  const ns = [
    x ? i - 1 : NaN,
    x < w - 1 ? i + 1 : NaN,
    y ? i - w : NaN,
    y < h - 1 ? i + w : NaN,
  ]
  for (const n of ns) {
    if (!isNaN(n)) yield arr[n]!
  }
}

let cave = new Uint8Array()
let w = 0
for await (const line of io.readLines()) {
  cave = merge(cave, new Uint8Array([...line].map(Number)))
  w = line.length
}

const lows = cave.filter((h, i) =>
  [...neighbors(cave, w, i)].every((nh) => h < nh),
)

const result = sum(lows) + lows.length
io.write(result)
