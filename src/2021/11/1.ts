import IO from 'lib/io.js'

const io = new IO()

function merge(a: Uint8Array, b: Uint8Array): Uint8Array {
  const ab = new Uint8Array(a.length + b.length)
  ab.set(a)
  ab.set(b, a.length)
  return ab
}

function neighborIdx(arr: Uint8Array, w: number, i: number): number[] {
  const h = arr.length / w
  const x = i % w
  const y = (i - x) / w
  const left = x ? -1 : 0
  const right = x < w - 1 ? +1 : 0
  const above = y ? -w : 0
  const below = y < h - 1 ? w : 0
  return [
    left,
    right,
    above,
    below,
    left && above ? left + above : 0,
    left && below ? left + below : 0,
    right && above ? right + above : 0,
    right && below ? right + below : 0,
  ]
    .filter(Boolean)
    .map((d) => d + i)
}

function tick(wales: Uint8Array, width: number): bigint {
  let flashes = BigInt(0)
  for (const w in wales) wales[w]++
  let f: number
  while ((f = wales.findIndex((w) => w > 9)) >= 0) {
    wales[f] = 0
    flashes++
    for (const n of neighborIdx(wales, width, f)) {
      if (wales[n]! > 0 && wales[n]! <= 9) wales[n]++
    }
  }
  return flashes
}

let wales = new Uint8Array()
let w = 0
for await (const line of io.readLines()) {
  wales = merge(wales, new Uint8Array([...line].map(Number)))
  w = line.length
}

let flashes = BigInt(0)
for (let s = 0; s < 100; s++) {
  flashes += tick(wales, w)
}

io.write(flashes.toString())
