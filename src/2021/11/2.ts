import io from 'lib/io.js'
import {squareNeighbors, Uint8Matrix} from 'lib/matrix.js'

function tick(wales: Uint8Matrix) {
  for (const w in wales) wales[w]++
  let f: number
  while ((f = wales.findIndex((w) => w > 9)) >= 0) {
    wales[f] = 0
    for (const n of squareNeighbors(wales, f)) {
      if (wales[n]! > 0 && wales[n]! <= 9) wales[n]++
    }
  }
}

let wales = new Uint8Matrix()
for await (const line of io.readLines()) {
  wales = wales.concatRow([...line].map(Number))
}

let steps = 0
let inSync = false
while (!inSync) {
  tick(wales)
  inSync = wales.every((w) => w === 0)
  steps++
}

io.write(steps.toString())
