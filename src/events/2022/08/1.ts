import io from '#lib/io.js'
import {Uint8Matrix} from '#lib/matrix.js'

let forest = new Uint8Matrix()
for await (const line of io.readLines()) {
  forest = forest.concatRow([...line].map(Number))
}

const visibleIds = new Set<number>()
for (let r = 0; r < 4; r++) {
  let tallest = -1
  let i = 0
  for (const t of forest.rotatedKeys(r)) {
    if (i % forest.width === 0) tallest = -1
    const tree = forest[t]!
    if (tree > tallest) {
      visibleIds.add(t)
      tallest = tree
    }
    i++
  }
}
io.write(visibleIds.size)
