import IO from 'lib/io.js'
import range from 'lib/range.js'
import rotate from 'lib/rotate.js'

const io = new IO()

class Tree {
  constructor(public id: number, public height: number) {}
}

let size = 0
let r = 0
const trees: Tree[] = []
for await (const line of io.readLines()) {
  const row = [...line].map((h, i) => new Tree(i + size * r, Number(h)))
  trees.push(...row)
  size = row.length
  r++
}

const visibleIds = new Set<number>()
let forest = trees
for (let t = 0; t < 4; t++) {
  if (t) forest = rotate(forest, size)
  let tallest = -1
  for (const [i, tree] of forest.entries()) {
    if (i % size === 0) tallest = -1
    if (tree.height > tallest) {
      visibleIds.add(tree.id)
      tallest = tree.height
    }
  }
}

io.write(visibleIds.size)
