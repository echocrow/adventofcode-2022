import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'
import range from '#lib/range.js'

function findV(rows: Iterable<Uint8Array>, ignoreIdx = 0): number {
  const ids = [...rows].map((row) => row.reduce((p, v) => p * 2 + v))
  let i = 1
  for (; i < ids.length; i++) {
    if (i === ignoreIdx) continue
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
let map = new Uint8Matrix()
for await (const line of io.readLines({flush: true})) {
  if (line) {
    map = map.concatRow(line.split('').map((c) => +(c === '#')))
    continue
  }

  const orgY = findV(map.rows())
  const orgX = findV(map.cols())

  let corRef = 0
  for (let i = 0; i < map.length; i++) {
    if (i > 0) map[i - 1] = 1 - map[i - 1]!
    map[i] = 1 - map[i]!
    corRef = findV(map.rows(), orgY) * 100 || findV(map.cols(), orgX)
    if (corRef) break
  }

  result += corRef
  map = new Uint8Matrix()
}

io.write(result)
