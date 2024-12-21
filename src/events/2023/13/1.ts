import io from '#lib/io.js'
import {range} from '#lib/iterable.js'
import {Uint8Matrix} from '#lib/matrix.js'

function findV(rows: Iterable<Uint8Array>): number {
  const ids = [...rows].map((row) => row.reduce((p, v) => p * 2 + v))
  let i = 1
  for (; i < ids.length; i++) {
    const len = Math.min(i, ids.length - i)
    let isMir = true
    for (const dy of range(0, len)) {
      isMir = ids[i - 1 - dy] === ids[i + dy]
      if (!isMir) break
    }
    if (isMir) break
  }
  return i === ids.length ? 0 : i
}

let result = 0
const map = new Uint8Matrix()
for await (const line of io.readLines({flush: true})) {
  if (line) {
    map.pushRow([...line].map((c) => +(c === '#')))
    continue
  }
  result += findV(map.rows()) * 100 || findV(map.cols())
  map.clear()
}

io.write(result)
