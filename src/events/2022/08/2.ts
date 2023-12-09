import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'

let forest = new Uint8Matrix()
for await (const line of io.readLines()) {
  forest = forest.concatRow([...line].map(Number))
}

const seenCounts = new Uint32Array(forest.length).fill(1)
for (let r = 0; r < 4; r++) {
  const scene = forest.rotate(r)
  let w = scene.width
  let i = 0
  for (const t of forest.rotatedKeys(r)) {
    const tree = forest[t]!
    const y = i % w
    const rightTrees = scene.slice(i + 1, i + w - y)
    const blockingIdx = rightTrees.findIndex((t) => t >= tree)
    const visibleCount = blockingIdx >= 0 ? blockingIdx + 1 : rightTrees.length
    seenCounts[t] *= visibleCount
    i++
  }
}

io.write(Math.max(...seenCounts))
