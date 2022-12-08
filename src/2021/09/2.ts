import IO from 'lib/io.js'
import product from 'lib/product.js'
import sort from 'lib/sort.js'

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
  return [
    x ? i - 1 : NaN,
    x < w - 1 ? i + 1 : NaN,
    y ? i - w : NaN,
    y < h - 1 ? i + w : NaN,
  ].filter((n) => !isNaN(n))
}

let cave = new Uint8Array()
let w = 0
let h = 0
for await (const line of io.readLines()) {
  cave = merge(cave, new Uint8Array([...line].map(Number)))
  w = line.length
  h++
}

const TOP = 9

const basins = []
let i, j
while ((i = cave.findIndex((h) => h !== TOP)) >= 0) {
  let basin = 0
  const next = [i]
  while ((j = next.pop()) !== undefined) {
    if (cave[j] !== TOP) {
      basin++
      cave[j] = TOP
      next.push(...neighborIdx(cave, w, j))
    }
  }
  basins.push(basin)
}

const topBasins = sort(basins).reverse().slice(0, 3)

io.write(product(topBasins))
