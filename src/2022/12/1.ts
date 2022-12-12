import IO from 'lib/io.js'
import {neighbors, Uint8Matrix} from 'lib/matrix.js'

const io = new IO()

// Parse.
let map = new Uint8Matrix()
let start = -1
let end = -1
let p = -1
const base = 'a'.charCodeAt(0)
for await (let line of io.readLines()) {
  if (start < 0 && (p = line.indexOf('S')) >= 0) {
    start = map.length + p
    line = line.replace('S', 'a')
  }
  if (end < 0 && (p = line.indexOf('E')) >= 0) {
    end = map.length + p
    line = line.replace('E', 'z')
  }
  map = map.concatRow([...line].map((c) => c.charCodeAt(0) - base))
}

// Brute-force.
const minSteps = new Uint16Array(map.length)
type Option = {pos: number; steps: number}
const queue: Option[] = [{pos: start, steps: 1}]
let curr: Option | undefined
while ((curr = queue.pop())) {
  minSteps[curr.pos] = curr.steps
  const h = map[curr.pos]!
  const steps = curr.steps + 1
  if (curr.pos === end) continue
  for (const n of neighbors(map, curr.pos)) {
    const nh = map[n]!
    const prevSteps = minSteps[n]!
    if (nh - h <= 1 && (!prevSteps || prevSteps > steps)) {
      queue.push({pos: n, steps})
    }
  }
}

io.write((minSteps[end] ?? 0) - 1)
