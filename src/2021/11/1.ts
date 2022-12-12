import IO from 'lib/io.js'
import {squareNeighbors, Uint8Matrix} from 'lib/matrix.js'

const io = new IO()

function tick(wales: Uint8Matrix): bigint {
  let flashes = BigInt(0)
  for (const w in wales) wales[w]++
  let f: number
  while ((f = wales.findIndex((w) => w > 9)) >= 0) {
    wales[f] = 0
    flashes++
    for (const n of squareNeighbors(wales, f)) {
      if (wales[n]! > 0 && wales[n]! <= 9) wales[n]++
    }
  }
  return flashes
}

let wales = new Uint8Matrix()
for await (const line of io.readLines()) {
  wales = wales.concatRow([...line].map(Number))
}

let flashes = BigInt(0)
for (let s = 0; s < 100; s++) {
  flashes += tick(wales)
}

io.write(flashes.toString())
