import io from '#lib/io.js'
import {map, sum} from '#lib/iterable.js'
import {Uint8Matrix, neighbors} from '#lib/matrix.js'

const STEPS = Number((await io.readCfgLine('__steps')) ?? 26501365)

const garden = new Uint8Matrix()
for await (const line of io.readLines())
  garden.pushRow([...line].map((c) => +(c === '#')))

function countStepsFrom(x: number, y: number) {
  const counts: number[] = []

  const startI = garden.vecToI(x, y)
  const visited = new Uint8Matrix(garden)

  let queue = [startI]
  let isOdd = false
  let evens = 1
  let odds = 0
  visited.$[startI] = 1
  counts.push(isOdd ? odds : evens)
  while (queue.length) {
    isOdd = !isOdd
    let nextQueue: typeof queue = []
    for (const currI of queue) {
      for (const i of neighbors(visited, currI)) {
        if (visited.$[i]) continue
        isOdd ? odds++ : evens++
        visited.$[i] = 1
        nextQueue.push(i)
      }
    }
    queue = nextQueue
    counts.push(isOdd ? odds : evens)
  }
  return counts
}

// We assume the garden is square and odd-sized.
// Additionally, we assume the start is at the center of the garden.
// Lastly, we assume that we have a clean in the center lanes.
if (garden.width !== garden.height) throw new Error('Square-gardens only!')
if (garden.width % 2 === 0) throw new Error('Odd-sized gardens only!')

const length = garden.width
const start = 0
const center = Math.floor(length / 2)
const end = length - 1

const startCounts = countStepsFrom(center, center)

function floorOdd(num: number) {
  return num - (1 - (num % 2))
}
function floorEven(num: number) {
  return num - (num % 2)
}
function floorParity(num: number, toOdd: boolean | number) {
  return toOdd ? floorOdd(num) : floorEven(num)
}

const cornersStepCounts = [
  countStepsFrom(center, start),
  countStepsFrom(center, end),
  countStepsFrom(start, center),
  countStepsFrom(end, center),
]
const diagsStepCounts = [
  countStepsFrom(start, start),
  countStepsFrom(end, start),
  countStepsFrom(start, end),
  countStepsFrom(end, end),
]
function getStepCount(stepCounts: number[][], steps: number) {
  return steps > 0 ? sum(map(stepCounts, (counts) => counts[steps - 1]!)) : 0
}

const PARITY = STEPS % 2

// Full tiles.
const fullDiamondLen = Math.floor(STEPS / length)
const evenFullTiles = floorOdd(fullDiamondLen) ** 2
const oddFullTiles = floorEven(fullDiamondLen) ** 2
const evenFullStepCount =
  startCounts[Math.min(floorParity(startCounts.length - 1, PARITY), STEPS)]!
const oddFullStepCount =
  startCounts[floorParity(startCounts.length - 1, 1 - PARITY)]!

// Corners.
const innerCornerTileSteps = STEPS > length ? (STEPS % length) + center + 1 : 0
const outerCornerTileSteps = (STEPS % length) - center

// Diagonals.
const evenDiagTileSteps = (STEPS - length) % (length * 2)
const oddDiagTileSteps = (STEPS - length * 2) % (length * 2)
const evenDiagTiles = Math.ceil((STEPS - length) / (length * 2)) * 2 - 1
const oddDiagTiles = Math.ceil((STEPS - length * 2) / (length * 2)) * 2

const result = sum([
  evenFullStepCount * evenFullTiles,
  oddFullStepCount * oddFullTiles,
  getStepCount(cornersStepCounts, innerCornerTileSteps),
  getStepCount(cornersStepCounts, outerCornerTileSteps),
  getStepCount(diagsStepCounts, evenDiagTileSteps) * evenDiagTiles,
  getStepCount(diagsStepCounts, oddDiagTileSteps) * oddDiagTiles,
])
io.write(result)
