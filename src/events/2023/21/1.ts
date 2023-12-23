import io from '#lib/io.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'

const STEPS = Number((await io.readCfgLine('__steps')) ?? 64)

const garden = new Uint8Matrix()
let startI = 0
for await (const line of io.readLines()) {
  const startCol = line.indexOf('S')
  if (startCol >= 0) startI = garden.length + startCol
  garden.pushRow(line.split('').map((c) => +(c === '#')))
}

let queue = [startI]
let parityOk = STEPS % 2 === 0
let result = +parityOk
garden.$[startI] = 1
for (let s = 1; s <= STEPS; s++) {
  parityOk = !parityOk
  let nextQueue: typeof queue = []
  for (const currI of queue) {
    for (const i of neighbors(garden, currI)) {
      if (garden.$[i]) continue
      if (parityOk) result++
      garden.$[i] = 1
      nextQueue.push(i)
    }
  }
  queue = nextQueue
}

io.write(result)
