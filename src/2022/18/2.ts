import IO from 'lib/io.js'
import {
  addVec3,
  iToVec3,
  maxVec3,
  validNeighborsVec3,
  vec3,
  vec3ToI,
  xColsMatrix3,
  yColsMatrix3,
  zColsMatrix3,
  zeroVec3,
} from 'lib/vec3.js'

const io = new IO()

// Helper to bucket-fill
function bucketFill(at: vec3, to: number) {
  const atI = vec3ToI(at, dims)
  const from = bits[atI]
  if (from === to) return
  bits[atI] = to
  const queue = [atI]
  let i: number | undefined
  while ((i = queue.pop()) !== undefined) {
    const p = iToVec3(i, dims)
    for (const np of validNeighborsVec3(p, dims)) {
      const ni = vec3ToI(np, dims)
      if (bits[ni] !== from) continue
      bits[ni] = to
      queue.push(ni)
    }
  }
}

// Parse.
const rocks: vec3[] = []
let dims = zeroVec3
for await (const line of io.readLines()) {
  const [x = 0, y = 0, z = 0] = line.split(',').map(Number)
  const p: vec3 = [x + 1, y + 1, z + 1] /* Add padding. */
  rocks.push(p)
  dims = maxVec3(dims, p)
}
dims = addVec3(dims, [1, 1, 1])
dims = addVec3(dims, [1, 1, 1]) /* Add padding. */

const TBD = 0
const ROCK = 1
const AIR = 2

// Store rocks as 1D matrix.
const bits = new Uint8Array(dims[0] * dims[1] * dims[2]).fill(TBD)
for (const [x, y, z] of rocks) {
  const i = x + y * dims[0] + z * dims[0] * dims[1]
  bits[i] = ROCK
}

// Fill surrounding air.
// (First cell is guaranteed air due to added padding).
bucketFill(zeroVec3, AIR)

// Count changes between outside air (aka exposed surfaces).
const exposedSides = [
  xColsMatrix3(dims),
  yColsMatrix3(dims),
  zColsMatrix3(dims),
].reduce((exposed, cols) => {
  for (const col of cols) {
    let isInside = false
    for (const i of col) {
      const toInside = bits[i] !== AIR
      if (isInside !== toInside) exposed++
      isInside = toInside
    }
    if (isInside) exposed++
  }
  return exposed
}, 0)

io.write(exposedSides)
