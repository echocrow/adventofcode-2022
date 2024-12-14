import {createInterface} from 'node:readline/promises'
import io from '#lib/io.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'
import vec from '#lib/vec.js'

// Config.
const MAX_STEPS = Number((await io.readCfgLine('__steps')) ?? Infinity)
const SCALE_RADIUS = Number((await io.readCfgLine('__scale')) ?? 5)
const INTERACTIVE = !!(await io.readCfgLine('__interactive'))
const SHOW_REACH_EDGE_ONLY = !!(await io.readCfgLine('__edgesOnly'))
const SEPARATE = true

// Parse input.
const srcGarden = new Uint8Matrix()
let srcStartI = 0
for await (const line of io.readLines()) {
  const startCol = line.indexOf('S')
  if (startCol >= 0) srcStartI = srcGarden.length + startCol
  srcGarden.pushRow(line.split('').map((c) => +(c === '#')))
}

// Scale garden.
const scale = SCALE_RADIUS * 2 + 1
const garden = new Uint8Matrix(
  srcGarden.length * scale ** 2,
  srcGarden.width * scale,
)
const startI = garden.vecToI(
  ...srcGarden
    .iToVec(srcStartI)
    .add(vec(srcGarden.width, srcGarden.height).scale(SCALE_RADIUS)),
)
for (let y = 0; y < srcGarden.height; y++) {
  const row = new Uint8Array(srcGarden.row(y))
  for (let cy = 0; cy < scale; cy++) {
    for (let cx = 0; cx < scale; cx++) {
      let i = garden.vecToI(srcGarden.width * cx, srcGarden.height * cy + y)
      garden.$.set(row, i)
    }
  }
}

const visChars = [' ', '#', 'O']
const ySeparator =
  ('-'.repeat(srcGarden.width) + '+').repeat(scale - 1) +
  '-'.repeat(srcGarden.width)
function fmtGarden(garden: Uint8Matrix) {
  return garden.fmt((v, i) => {
    let sep = ''
    const [x, y] = garden.iToVec(i)
    if (SEPARATE && !x && y && !(y % srcGarden.height)) sep += ySeparator + '\n'
    if (SEPARATE && x && !(x % srcGarden.width)) sep += '|'
    return sep + visChars[v]!
  })
}

const rl =
  INTERACTIVE ?
    createInterface({input: process.stdin, output: process.stdout})
  : undefined

const visited = new Uint8Matrix(garden)
const visitedEven = new Uint8Matrix(garden)
const visitedOdd = new Uint8Matrix(garden)

let queue = [startI]
let evens = 0
let odds = 0
let step = 0
{
  visited.$[startI] = visitedEven.$[startI] = 2
  evens++
}
let isOdd = false
while (queue.length && step < MAX_STEPS) {
  step++
  isOdd = !isOdd
  let nextQueue: typeof queue = []
  const newReachGarden = new Uint8Matrix(garden)
  for (const currI of queue) {
    for (const i of neighbors(visited, currI)) {
      if (visited.$[i]) continue
      visited.$[i] = 2
      isOdd ? odds++ : evens++
      ;(isOdd ? visitedOdd : visitedEven).$[i] = 2
      newReachGarden.$[i] = 2
      nextQueue.push(i)
    }
  }
  queue = nextQueue
  if (INTERACTIVE) {
    const reached = isOdd ? odds : evens
    const reachedGarden = isOdd ? visitedOdd : visitedEven
    io.log(fmtGarden(SHOW_REACH_EDGE_ONLY ? newReachGarden : reachedGarden))
    io.log({step, reached})
    const res = (await rl?.question('continue? [Y/n] ')) ?? 'n'
    if (res === 'n') break
  }
}

rl?.close()
io.write(fmtGarden(isOdd ? visitedOdd : visitedEven))
