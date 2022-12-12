import IO from 'lib/io.js'
import {neighbors, Uint8Matrix} from 'lib/matrix.js'

const io = new IO()

// Parse.
let map = new Uint8Matrix()
let starts: number[] = []
let end = -1
let p = -1
const base = 'a'.charCodeAt(0)
for await (let line of io.readLines()) {
  line = line.replace('S', 'a')
  if (end < 0 && (p = line.indexOf('E')) >= 0) {
    end = map.length + p
    line = line.replace('E', 'z')
  }
  const row = [...line].map((c) => c.charCodeAt(0) - base)
  for (let x = 0; x < row.length; x++) if (!row[x]) starts.push(map.length + x)
  map = map.concatRow(row)
}

// Brute-force.
const minSteps = new Uint16Array(map.length)
type Option = {pos: number; steps: number}
const queue: Option[] = starts.map((i) => ({pos: i, steps: 1}))
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
